
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alim Ul Karim
-- Create date: 
-- Description:	Search for apps
-- =============================================
ALTER PROCEDURE [dbo].[AppsSearch] 
	-- Add the parameters for the stored procedure here
    @SearchText VARCHAR(200) ,
    @UrlString VARCHAR(200) ,
    @pageSize INT ,
    @currentPage INT
AS
    BEGIN
	
        SET NOCOUNT ON;

        DECLARE @cacheTable TABLE ( value VARCHAR(200) );
		DECLARE @index INT = 0;

        SELECT  *
        FROM    App
        WHERE   AppName = @SearchText
                OR Url = @UrlString;
		
        INSERT  INTO @cacheTable
                SELECT  *
                FROM    dbo.SplitString(@SearchText, ' ');


		-- generate sql where from splitted text
		-- Hello AND World or ...

    END
