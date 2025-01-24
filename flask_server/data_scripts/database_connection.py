from sqlalchemy import create_engine
import pandas as pd

#print(pyodbc.drivers())

# Replace with your actual server and driver details
Server = 'MSI'
Database = 'dev'
Driver = 'SQL Server'

connection_string = f'mssql://@{Server}/{Database}?driver={Driver}'

try:
    # Create the engine and test the connection
    engine = create_engine(connection_string)
    with engine.connect() as con:
        result = pd.read_sql_query("SELECT name FROM sys.databases", con)
        print(result)
except Exception as e:
    print(f"Error: {e}")