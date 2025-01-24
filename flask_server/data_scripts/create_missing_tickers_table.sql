USE dev;
GO

IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'p2t_dq'
    AND TABLE_NAME = 'missing_stock_tickers'
	AND TABLE_CATALOG = 'dev'
)

BEGIN
    CREATE TABLE p2t_dq.missing_stock_tickers (
        missing_stock_kpi_id INT IDENTITY(1,1) PRIMARY KEY
		,ticker NVARCHAR(10) 
        ,error NVARCHAR(1000)
    );
END