DECLARE @SearchText VARCHAR(200)  = 'Hello World How are you doing? at this moment';
DECLARE @UrlString VARCHAR(200) = 'Hello-World';
DECLARE @v VARCHAR(200) = 'Hello-World';
DECLARE @cacheTable TABLE ( value VARCHAR(200) );
DECLARE @dynamicSQL VARCHAR(500) = NULL;
DECLARE @index INT = 0;

SELECT [dbo].[slugify](@SearchText);

SELECT  *
FROM    App
WHERE   AppName = @SearchText
        OR Url = @UrlString;
		
INSERT  INTO @cacheTable
SELECT  *
FROM    dbo.SplitString(@SearchText, ' ');

			
-- generate sql where from splitted text
-- Hello AND World or ...
DECLARE c1 CURSOR READ_ONLY
FOR
    SELECT  value
    FROM    @cacheTable;

OPEN c1;
FETCH NEXT FROM c1 INTO @v;
WHILE @@FETCH_STATUS = 0
    BEGIN 
        IF @dynamicSQL IS NOT NULL
            SET @dynamicSQL = @dynamicSQL + ' AND ';
		ELSE 
			SET @dynamicSQL = ''

        SET @dynamicSQL = @dynamicSQL + 'AppName like ''* ' + @v + ' *';
        PRINT @dynamicSQL;
        PRINT @v;
        FETCH NEXT FROM c1 INTO @v;
    END;
CLOSE c1;
DEALLOCATE c1;