USE dev;
GO

--drop table [dev].[p2t_int].[stock_data];

IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'p2t_int'
    AND TABLE_NAME = 'stock_data'
	AND TABLE_CATALOG = 'dev'
)

-- Create the table explicitly

BEGIN
    CREATE TABLE [dev].[p2t_int].[stock_data] (
		ticker NVARCHAR(50),
		trn_ticker NVARCHAR(50),
		stock_name NVARCHAR(100),
		sector NVARCHAR(100),
		[location] NVARCHAR(100),
		exchange NVARCHAR(50),
		highest_price NVARCHAR(10),
		last_close NVARCHAR(10),
		peak_to_current NVARCHAR(10)
	);
END




--Populate the table

TRUNCATE TABLE [dev].[p2t_int].[stock_data];

INSERT INTO [dev].[p2t_int].[stock_data]
SELECT 
	tck.ticker
	,tck.trn_ticker
	,tck.stock_name
	,tck.sector
	,tck.[location]
	,tck.exchange
	,kpi.highest_price
	,kpi.last_close
	,kpi.peak_to_current
FROM 
	(SELECT 
	ticker,
	CASE 
		WHEN exchange = 'ASX200' THEN ticker + '.AX'
		ELSE ticker
	END AS trn_ticker
	,stock_name
    ,sector
    ,[location]
    ,exchange 
	FROM [dev].[p2t_raw].[tickers_table]) tck
	LEFT JOIN [dev].[p2t_raw].[stock_kpis] kpi
		ON tck.trn_ticker = kpi.ticker
WHERE highest_price is not null;