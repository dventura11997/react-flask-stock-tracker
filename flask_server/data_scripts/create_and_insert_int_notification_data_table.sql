USE dev;
GO

--drop table [dev].[p2t_int].[notification_data];

IF NOT EXISTS (
    SELECT 1
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = 'p2t_int'
    AND TABLE_NAME = 'notification_data'
	AND TABLE_CATALOG = 'dev'
)

-- Create the table explicitly

BEGIN
    CREATE TABLE [dev].[p2t_int].[notification_data] (
		email NVARCHAR(100),
		ticker NVARCHAR(10),
		alert_type NVARCHAR(50),
		alert_threshold DECIMAL(10,2),
		last_close DECIMAL(10,2),
		preferred_broker NVARCHAR(50),
		notification_flag INT
	);
END




--Populate the table

TRUNCATE TABLE [dev].[p2t_int].[notification_data];

WITH cte as (
SELECT 
	al.email
	,al.ticker
	,al.alert_type
	,al.alert_threshold
	,kpi.last_close
	,usr.preferred_broker
FROM [dev].[dbo].[users_alert] al
	LEFT JOIN [dev].[p2t_trn].[stock_kpis] kpi 
		ON al.ticker = kpi.ticker
	LEFT JOIN [dev].[dbo].[users] usr
		ON al.email = usr.email
)
INSERT INTO [dev].[p2t_int].[notification_data]
Select 
	cte.* 
	,CASE WHEN
		cte.last_close < alert_threshold THEN 1
		ELSE 0
	END AS notification_flag
FROM cte;