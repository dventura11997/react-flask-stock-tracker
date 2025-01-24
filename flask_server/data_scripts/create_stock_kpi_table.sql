USE dev;
GO

IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'p2t_raw'
    AND TABLE_NAME = 'stock_kpis'
	AND TABLE_CATALOG = 'dev'
)

BEGIN
    CREATE TABLE p2t_raw.stock_kpis (
        stock_kpi_id INT IDENTITY(1,1) PRIMARY KEY
		,ticker NVARCHAR(10) 
        ,highest_price DECIMAL(10,2)
		,last_close DECIMAL(10,2)
		,peak_to_current DECIMAL(5,2)
    );
END