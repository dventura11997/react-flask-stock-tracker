USE dev;
GO

--drop table [dev].[p2t_int].[profile_stock_data];

IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'p2t_int'
    AND TABLE_NAME = 'profile_stock_data'
	AND TABLE_CATALOG = 'dev'
)

-- Create the table explicitly

BEGIN
    CREATE TABLE [dev].[p2t_int].[profile_stock_data] (
		usr_id NVARCHAR(10) 
		,first_name NVARCHAR(50)
		,last_name NVARCHAR(50)
		,email NVARCHAR(100)
		,preferred_broker NVARCHAR(50)
		,ticker NVARCHAR(50)
		,stock_name NVARCHAR(100)
		,sector NVARCHAR(100)
		,[location] NVARCHAR(100)
		,exchange NVARCHAR(50)
		,highest_price NVARCHAR(10)
		,last_close NVARCHAR(10)
		,peak_to_current NVARCHAR(10)
	);
END


--Populate the table

TRUNCATE TABLE [dev].[p2t_int].[profile_stock_data];

INSERT INTO [dev].[p2t_int].[profile_stock_data]
SELECT 
	usr.[id] AS usr_id
    ,usr.[first_name] AS first_name
    ,usr.[last_name] AS last_name
    ,usr.[email] AS email
    ,[preferred_broker] AS preferred_broker
	,ust.ticker
	,std.stock_name
	,std.sector
	,std.[location]
	,std.exchange
	,std.highest_price
	,std.last_close
	,std.peak_to_current
FROM 
	[dev].[dbo].users_stocks ust
	  LEFT JOIN [dev].[dbo].[users] usr ON ust.email = usr.[email]
      LEFT JOIN [dev].[p2t_int].stock_data std ON ust.ticker = std.trn_ticker

