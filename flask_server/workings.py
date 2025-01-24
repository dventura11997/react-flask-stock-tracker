import requests
import pandas as pd
from bs4 import BeautifulSoup
import yfinance as yf
from datetime import datetime
from io import StringIO
import plotly.express as px

tickers = [
    'AAPL', 'MSFT', 'AMZN', 'NVDA', 'TSLA', 'META', 
    'BRK.B', 
    # 'V', 'JNJ', 'GOOG', 'PEP', 'BAC', 'JPM', 'KO', 'WMT', 
    # 'PG', 'CSCO', 'HD', 'CVX', 'PFE', 'ABBV', 'TMO', 'MCD', 
    'CMCSA', 'ADBE', 'NFLX', 'XOM', 'ORCL', 'UNH', 'LLY'
]

ticker = 'AAPL'

def get_ts(ticker):
    start_date = "2000-01-01"
    end_date = datetime.today().strftime('%Y-%m-%d') #always todays date

    # Fetch historical data for the current stock
    data = yf.download(ticker, start=start_date, end=end_date)
    
    # Extract the closing prices for the current stock and add them to the DataFrame
    monthly_data = data['Close'].resample('MS').first()

    return monthly_data



#Troubleshooting the graph
# df = get_ts(ticker)
# print(len(df))
# df = df.reset_index()
# df.columns = ['Date', 'Close']
# balance_ts = px.line(df, x='Date', y='Close', color_discrete_sequence=['#FF3C68'], title='Share price over time')
# balance_ts.show()


def get_ts_loop():
    ts_results = []
    ticker_errors = []

    #Connect to database
    #engine = connect_db()

    #Get list of tickers from get_tickers() function
    # df_tickers = get_tickers()
    # tickers = df_tickers['ticker']
    # exchanges = df_tickers['exchange']

    for idx, ticker in enumerate(tickers, start=0):
        print(f"Ticker: {ticker}, Index: {idx}")

        #Accesses the exchanges list at the position indicated by the value of idx, retrieves and stores this value. Uses idx to ensure the correct exchange is paired with the correct ticker, based on their shared index.
        # exchange = exchanges[idx]
        # Check if ticker is from ASX200 and add ".AX" if needed
        # if exchange == 'ASX200':
        #     ticker = ticker + '.AX'

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




# get_kpis(ticker)