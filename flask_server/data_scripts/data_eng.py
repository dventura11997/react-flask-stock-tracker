import requests
import pandas as pd
from bs4 import BeautifulSoup
from sqlalchemy import create_engine, text
import sqlalchemy as sa
from io import StringIO
from datetime import datetime
import yfinance as yf


def connect_db():
    # Replace with your actual server and driver details
    Server = 'MSI'
    Database = 'dev'
    Driver = 'ODBC+Driver+17+for+SQL+Server'

    connection_string = f'mssql://@{Server}/{Database}?driver={Driver}'

    try:
        # Create the engine and test the connection
        engine = create_engine(connection_string)
        with engine.connect() as con:
            result = pd.read_sql_query("SELECT * FROM INFORMATION_SCHEMA.TABLES", con)
            print(result)
        return engine
    except Exception as e:
        print(f"Error: {e}")
    
def get_tickers():
    urls = ['https://en.wikipedia.org/wiki/List_of_S%26P_500_companies','https://en.wikipedia.org/wiki/S%26P/ASX_200']
    #Better URL for ASX tickers: https://www.marketindex.com.au/asx-listed-companies
    for url in urls:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        if 'ASX' in url:
            table = soup.find("table", {"class": "wikitable sortable"}) #Handler for ASX URL parsing html
        else:
            table = soup.find("table", {"id": "constituents"})
        table_str = str(table)
        df = pd.read_html(StringIO(table_str))[0]
        if 'ASX' in url:
            df['exchange'] = 'ASX200'
            df_asx = df
        else:
            df['exchange'] = 'SNP500'
            df_snp = df
    #Drop unnecessary columns for union
    df_snp.drop(['GICS Sub-Industry', 'Date added', 'CIK', 'Founded'], axis=1, inplace=True)
    df_asx.drop(['Market Capitalisation', 'Chairperson'], axis=1, inplace=True)
    #Re-name columns for union
    df_snp.rename(columns={
        'Symbol': 'ticker',
        'Security': 'stock_name',
        'GICS Sector': 'sector',
        'Headquarters Location': 'location'
    }, inplace=True)
    df_asx.rename(columns={
        'Code': 'ticker',
        'Company': 'stock_name',
        'HQ': 'location',
        'Sector': 'sector'
    }, inplace=True)
    df = pd.concat([df_snp, df_asx], ignore_index=True)
    # Return the DataFrame
    return df

def ingest_ticker_data():
    df = get_tickers()
    engine = connect_db()

    # Explicitly define data types for SQL compatibility
    dtype_mapping = {
        'ticker': sa.types.NVARCHAR(10),
        'stock_name': sa.types.NVARCHAR(255),
        'sector': sa.types.NVARCHAR(255),
        'location': sa.types.NVARCHAR(255),
        'exchange': sa.types.NVARCHAR(10),
    }
    
    df.fillna('', inplace=True)

    try:
        df.to_sql('tickers_table', con = engine, if_exists = 'replace', schema='p2t_raw', chunksize = 1000, index=False, dtype=dtype_mapping)
        sql_check = pd.read_sql_query("Select * From p2t_raw.tickers_table", con = engine)
        print(sql_check)

    except Exception as e:
        print(f"Error ingesting ticker table: {e}")

#ingest_ticker_data()

#Function to get kpi data
def get_kpis(ticker):
    # Create an empty DataFrame to store the closing prices
    closing_prices_df = pd.DataFrame()

    start_date = "2000-01-01"
    end_date = datetime.today().strftime('%Y-%m-%d') #always todays date

    # Fetch historical data for the current stock
    data = yf.download(ticker, start=start_date, end=end_date)
    
    # Extract the closing prices for the current stock and add them to the DataFrame
    closing_prices_df[ticker] = data['Close']

    highest_price = "${:.2f}".format(closing_prices_df[ticker].max())
    last_close = "${:.2f}".format(closing_prices_df[ticker].iloc[-1])
    percentage_difference = "{:.2f}%".format((closing_prices_df[ticker].iloc[-1] / closing_prices_df[ticker].max() - 1) * 100)
    print(f"{ticker}: {highest_price}, {last_close}, {percentage_difference}")
    # print(f"")
    return ticker, highest_price, last_close, percentage_difference

#Function to loop through kpi data
def get_kpis_loop():
    kpi_results = []
    ticker_errors = []

    #Connect to database
    engine = connect_db()

    #Get list of tickers from get_tickers() function
    df_tickers = get_tickers()
    tickers = df_tickers['ticker']
    exchanges = df_tickers['exchange']

    for idx, ticker in enumerate(tickers, start=0):
        print(f"Ticker: {ticker}, Index: {idx}")

        #Accesses the exchanges list at the position indicated by the value of idx, retrieves and stores this value. Uses idx to ensure the correct exchange is paired with the correct ticker, based on their shared index.
        exchange = exchanges[idx]
        # Check if ticker is from ASX200 and add ".AX" if needed
        if exchange == 'ASX200':
            ticker = ticker + '.AX'

        try:
            ticker, highest_price, last_close, percentage_difference = get_kpis(ticker)
            if highest_price is not None and last_close is not None and percentage_difference is not None:
                kpi_results.append([ticker, highest_price, last_close, percentage_difference])
            else:
                print(f"Skipping {ticker} due to null values")
                #Collect the erroneus tickers
                ticker_errors.append([ticker, "Skipping due to null values"])
                continue
        except Exception as e:
            print(f"Error in the for loop for {ticker}: {e}")
            #Collect the erroneus tickers
            ticker_errors.append([ticker, str(e)])
            continue
    try:
        kpi_results_df = pd.DataFrame(kpi_results, columns=['ticker', 'highest_price', 'last_close', 'peak_to_current'])
        kpi_results_df.to_sql('stock_kpis', con = engine, if_exists = 'replace', schema='p2t_raw', chunksize = 1000, index=False)
        #print(kpi_results_df)
        ticker_errors_df = pd.DataFrame(ticker_errors, columns=['ticker', 'error'])
        ticker_errors_df.to_sql('missing_stock_tickers', con = engine, if_exists = 'replace', schema='p2t_dq', chunksize = 1000, index=False)
        #print(ticker_errors_df)
    except Exception as e:
        print(f"Error creating dataframe {e}")

#get_kpis_loop()

def get_ts(ticker):
    start_date = "2000-01-01"
    end_date = datetime.today().strftime('%Y-%m-%d') #always todays date

    # Fetch historical data for the current stock
    data = yf.download(ticker, start=start_date, end=end_date)
    
    # Extract the closing prices for the current stock and add them to the DataFrame
    monthly_data = data['Close'].resample('MS').first()

    return monthly_data

def get_ts_loop():
    ts_results = []
    ticker_errors = []

    #Connect to database
    engine = connect_db()

    #Get list of tickers from get_tickers() function
    df_tickers = get_tickers()
    tickers = df_tickers['ticker']
    exchanges = df_tickers['exchange']

    for idx, ticker in enumerate(tickers, start=0):
        print(f"Ticker: {ticker}, Index: {idx}")

        #Accesses the exchanges list at the position indicated by the value of idx, retrieves and stores this value. Uses idx to ensure the correct exchange is paired with the correct ticker, based on their shared index.
        exchange = exchanges[idx]
        #Check if ticker is from ASX200 and add ".AX" if needed
        if exchange == 'ASX200':
            ticker = ticker + '.AX'

        try:
            df = get_ts(ticker)
            df = df.reset_index()
            df.columns = ['Date', 'Close']
            if len(df) > 0:
                df['Ticker'] = ticker  # Add the ticker column to the DataFrame
                ts_results.append(df)
                print(df.head())  # Check the structure of the DataFrame

            else:
                print(f"Skipping {ticker} due to null values")
                #Collect the erroneus tickers
                ticker_errors.append([ticker, "Skipping due to null values"])
                continue
        except Exception as e:
            print(f"Error in the for loop for {ticker}: {e}")
            #Collect the erroneus tickers
            ticker_errors.append([ticker, str(e)])
            continue
    try:
        kpi_results_df = pd.concat(ts_results, ignore_index=True)
        kpi_results_df.to_sql('stock_ts', con = engine, if_exists = 'replace', schema='p2t_raw', chunksize = 1000, index=False)
        print(kpi_results_df)
        ticker_errors_df = pd.DataFrame(ticker_errors, columns=['ticker', 'error'])
        ticker_errors_df.to_sql('missing_stock_tickers', con = engine, if_exists = 'replace', schema='p2t_dq', chunksize = 1000, index=False)
        print(ticker_errors_df)
    except Exception as e:
        print(f"Error creating dataframe {e}")
    
get_ts_loop()

