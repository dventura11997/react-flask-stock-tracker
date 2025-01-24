USE dev;
GO

--drop table [dev].[p2t_trn].[stock_kpis];

IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'p2t_trn'
    AND TABLE_NAME = 'stock_kpis'
	AND TABLE_CATALOG = 'dev'
)

-- Create the table explicitly

BEGIN
    CREATE TABLE [dev].[p2t_trn].[stock_kpis] (
		ticker NVARCHAR(10) 
		,highest_price DECIMAL(10, 2)
		,last_close DECIMAL(10, 2)
		,peak_to_current DECIMAL(10, 2)
	);
END


--Populate the table

TRUNCATE TABLE [dev].[p2t_trn].[stock_kpis];

INSERT INTO [dev].[p2t_trn].[stock_kpis]
SELECT 
	ticker
	,CAST(REPLACE(highest_price, '$', '') AS DECIMAL(10, 2)) AS highest_price
	,CAST(REPLACE(last_close, '$', '') AS DECIMAL(10, 2)) AS last_close
	,CAST(REPLACE(peak_to_current, '%', '') AS DECIMAL(10, 2)) / 100 AS peak_to_current
FROM 
	[dev].p2t_raw.stock_kpis