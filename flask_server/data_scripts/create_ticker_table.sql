USE dev;
GO

IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'p2t_raw'
    AND TABLE_NAME = 'tickers_table'
	AND TABLE_CATALOG = 'dev'
)

BEGIN
    CREATE TABLE p2t_raw.tickers_table (
        ticker_id INT IDENTITY(1,1) PRIMARY KEY
		,ticker NVARCHAR(10) 
        ,stock_name NVARCHAR(255)
		,sector NVARCHAR(255)
		,location NVARCHAR(255)
		,exchange NVARCHAR(10)
    );
END