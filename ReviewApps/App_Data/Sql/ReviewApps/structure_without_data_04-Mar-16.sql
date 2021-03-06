USE WeReviewApp;

GO
/****** Object:  StoredProcedure [dbo].[AppsSearch]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alim Ul Karim
-- Create date: 
-- Description:	Search for apps
-- =============================================
CREATE PROCEDURE [dbo].[AppsSearch] 
	-- Add the parameters for the stored procedure here
      @SearchText VARCHAR(200) = 0
AS 
      BEGIN
	
            SET NOCOUNT ON;
            SELECT  *
            FROM    SplitString('Querying SQL Server', ' ');
      END

GO
/****** Object:  StoredProcedure [dbo].[ResetAppDrafts]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ResetAppDrafts]
AS 
      DELETE    FROM AppDraft;
      DBCC checkident ('AppDraft', reseed, 0);
      RETURN 0
GO
/****** Object:  StoredProcedure [dbo].[ResetApps]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ResetApps]
AS 
      DELETE    FROM ReviewLikeDislike;
      DELETE    FROM Review;

      DBCC checkident ('Review', reseed, 0);
      DBCC checkident ('ReviewLikeDislike', reseed, 0);

      DELETE    FROM TagAppRelation;
      DELETE    FROM FeaturedImage;
      DELETE    FROM Tag;
      DELETE    FROM TempUpload;
      DELETE    FROM Review;
      DELETE    FROM Gallery;
      DELETE    FROM AppDraft;
      DELETE    FROM App;
      DELETE    FROM [User];
      DBCC checkident ('App', reseed, 0);
      DBCC checkident ('AppDraft', reseed, 0);
      DBCC checkident ('Tag', reseed, 0);
      DBCC checkident ('TagAppRelation', reseed, 0);
      DBCC checkident ('TempUpload', reseed, 0);
      DBCC checkident ('Review', reseed, 0);
      DBCC checkident ('Gallery', reseed, 0);
      DBCC checkident ('[User]', reseed, 0);
      DBCC checkident ('FeaturedImage', reseed, 0);

	
      RETURN 0
GO
/****** Object:  StoredProcedure [dbo].[ResetAppsAndUsers]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ResetAppsAndUsers]
AS 
      DELETE    FROM App;	
      DELETE    FROM [User];	
		
      DBCC checkident('App', reseed, 0);
      DBCC checkident('[User]', reseed, 0);
      RETURN 0
GO
/****** Object:  StoredProcedure [dbo].[ResetReviews]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ResetReviews]
AS 
      DELETE    FROM ReviewLikeDislike;
      DELETE    FROM Review;

      DBCC checkident ('Review', reseed, 0);
      DBCC checkident ('ReviewLikeDislike', reseed, 0);
      RETURN 0
GO
/****** Object:  StoredProcedure [dbo].[ResetWholeSystem]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ResetWholeSystem]
AS 
      BEGIN

            TRUNCATE TABLE dbo.MessageSeen;
            TRUNCATE TABLE LatestSeenNotification;
            TRUNCATE TABLE dbo.[Message];
            TRUNCATE TABLE dbo.UserPoint;

            DBCC checkident ('[MessageSeen]', reseed, 0);
            DBCC checkident ('[LatestSeenNotification]', reseed, 0);
            DBCC checkident ('[Message]', reseed, 0);
            DBCC checkident ('[UserPoint]', reseed, 0);

            EXEC dbo.ResetApps; -- removes reviews, apps, Tag,TagAppRelation,TempUpload,Gallery,User,FeaturedImage

      END
GO
/****** Object:  UserDefinedFunction [dbo].[SplitString]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alim Ul Karim
-- Create date: 20 Sep 2014
-- Description:	
-- =============================================
CREATE FUNCTION [dbo].[SplitString]( @stringToSplit VARCHAR(200),@splitChar VARCHAR(1) )
RETURNS
 @returnList TABLE (ID int,[Name] [nvarchar] (500))
AS
BEGIN

 DECLARE @name NVARCHAR(255)
 DECLARE @pos INT
 DECLARE @i INT
 SELECT  @i = 0
 WHILE CHARINDEX(@splitChar, @stringToSplit) > 0
 BEGIN
 
  SELECT @pos  = CHARINDEX(@splitChar, @stringToSplit)  ;
  SELECT @name = SUBSTRING(@stringToSplit, 1, @pos-1);
  
  

  INSERT INTO @returnList 
  SELECT  @i,@name;
  
  SELECT @i =@i + 1;

  SELECT @stringToSplit = SUBSTRING(@stringToSplit, @pos+1, LEN(@stringToSplit)-@pos)
 END

 INSERT INTO @returnList
 SELECT @i,@stringToSplit

 RETURN
END

GO
/****** Object:  Table [dbo].[App]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[App](
	[AppID] [bigint] IDENTITY(1,1) NOT NULL,
	[AppName] [varchar](60) NOT NULL,
	[PlatformID] [tinyint] NOT NULL,
	[PlatformVersion] [float] NOT NULL,
	[CategoryID] [smallint] NOT NULL,
	[Url] [varchar](70) NOT NULL,
	[Description] [nvarchar](2000) NOT NULL,
	[PostedByUserID] [bigint] NOT NULL,
	[ReviewsCount] [smallint] NOT NULL,
	[IsVideoExist] [bit] NOT NULL,
	[YoutubeEmbedLink] [varchar](255) NULL,
	[WebsiteUrl] [nvarchar](255) NULL,
	[StoreUrl] [nvarchar](255) NULL,
	[IsBlocked] [bit] NOT NULL,
	[IsPublished] [bit] NOT NULL,
	[UploadGuid] [uniqueidentifier] NOT NULL,
	[TotalViewed] [bigint] NOT NULL,
	[WebsiteClicked] [bigint] NOT NULL,
	[StoreClicked] [bigint] NOT NULL,
	[AvgRating] [float] NOT NULL,
	[ReleaseDate] [date] NOT NULL,
	[CreatedDate] [date] NOT NULL,
	[LastModifiedDate] [date] NULL,
	[UrlWithoutEscapseSequence] [varchar](70) NOT NULL,
 CONSTRAINT [PK_App] PRIMARY KEY CLUSTERED 
(
	[AppID] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [URLUnique] UNIQUE NONCLUSTERED 
(
	[PlatformID] ASC,
	[PlatformVersion] ASC,
	[Url] ASC,
	[CategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[AppDraft]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[AppDraft](
	[AppDraftID] [bigint] IDENTITY(1,1) NOT NULL,
	[AppName] [varchar](60) NULL,
	[PlatformID] [tinyint] NOT NULL,
	[CategoryID] [smallint] NOT NULL,
	[Description] [nvarchar](2000) NULL,
	[PostedByUserID] [bigint] NOT NULL,
	[ReviewsCount] [smallint] NULL,
	[IsVideoExist] [bit] NULL,
	[YoutubeEmbedLink] [varchar](255) NULL,
	[WebsiteUrl] [nvarchar](255) NULL,
	[StoreUrl] [nvarchar](255) NULL,
	[IsBlocked] [bit] NULL,
	[IsPublished] [bit] NULL,
	[PlatformVersion] [float] NULL,
	[UploadGuid] [uniqueidentifier] NOT NULL,
	[TotalViewed] [bigint] NULL,
	[Url] [varchar](65) NULL,
	[ReleaseDate] [date] NULL,
 CONSTRAINT [PK_AppDraft] PRIMARY KEY CLUSTERED 
(
	[AppDraftID] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Category]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Category](
	[CategoryID] [smallint] IDENTITY(1,1) NOT NULL,
	[CategoryName] [varchar](40) NOT NULL,
	[Slug] [varchar](40) NOT NULL,
 CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED 
(
	[CategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[CellPhone]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CellPhone](
	[CellPhoneID] [bigint] IDENTITY(1,1) NOT NULL,
	[UserID] [bigint] NOT NULL,
	[PlatformID] [tinyint] NOT NULL,
	[PlatformVersion] [float] NOT NULL,
 CONSTRAINT [PK_CellPhone] PRIMARY KEY CLUSTERED 
(
	[CellPhoneID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[FeaturedImage]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FeaturedImage](
	[FeaturedImageID] [bigint] IDENTITY(1,1) NOT NULL,
	[AppID] [bigint] NOT NULL,
	[IsFeatured] [bit] NOT NULL,
	[UserID] [bigint] NOT NULL,
 CONSTRAINT [PK_FeaturedImage] PRIMARY KEY CLUSTERED 
(
	[FeaturedImageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Gallery]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Gallery](
	[GalleryID] [uniqueidentifier] NOT NULL,
	[UploadGuid] [uniqueidentifier] NOT NULL,
	[GalleryCategoryID] [int] NOT NULL,
	[Sequence] [tinyint] NOT NULL,
	[Title] [varchar](50) NULL,
	[Subtitle] [varchar](150) NULL,
	[Extension] [varchar](5) NOT NULL,
 CONSTRAINT [PK_Gallery] PRIMARY KEY CLUSTERED 
(
	[GalleryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[GalleryCategory]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[GalleryCategory](
	[GalleryCategoryID] [int] IDENTITY(1,1) NOT NULL,
	[CategoryName] [varchar](50) NOT NULL,
	[Width] [float] NOT NULL,
	[Height] [float] NOT NULL,
	[IsAdvertise] [bit] NOT NULL,
 CONSTRAINT [PK_GalleryCategory] PRIMARY KEY CLUSTERED 
(
	[GalleryCategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[LatestSeenNotification]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[LatestSeenNotification](
	[LatestSeenNotificationID] [bigint] IDENTITY(1,1) NOT NULL,
	[UserID] [bigint] NOT NULL,
	[NotificationTypeID] [tinyint] NOT NULL,
	[Message] [varchar](50) NULL,
	[Dated] [smalldatetime] NOT NULL,
 CONSTRAINT [PK_LatestSeenNotification] PRIMARY KEY CLUSTERED 
(
	[LatestSeenNotificationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Message]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Message](
	[MessageID] [bigint] IDENTITY(1,1) NOT NULL,
	[Msg1] [varchar](300) NOT NULL,
	[Msg2] [varchar](300) NULL,
	[Msg3] [varchar](300) NULL,
	[Msg4] [varchar](300) NULL,
	[MessageDisplay]  AS (concat([Msg1],[Msg2],[Msg3],[Msg4])),
	[SenderUserID] [bigint] NOT NULL,
	[ReceiverUserID] [bigint] NOT NULL,
	[IsDraft] [bit] NOT NULL,
	[LastModified] [smalldatetime] NOT NULL,
	[SentDate] [smalldatetime] NOT NULL,
	[ReceivedDate] [smalldatetime] NULL,
	[IsReceived] [bit] NOT NULL,
 CONSTRAINT [PK_Message] PRIMARY KEY CLUSTERED 
(
	[MessageID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[MessageSeen]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[MessageSeen](
	[MessageSeenID] [bigint] IDENTITY(1,1) NOT NULL,
	[Msg1] [varchar](300) NOT NULL,
	[Msg2] [varchar](300) NULL,
	[Msg3] [varchar](300) NULL,
	[Msg4] [varchar](300) NULL,
	[MessageDisplay]  AS (concat([Msg1],[Msg2],[Msg3],[Msg4])),
	[SenderUserID] [bigint] NOT NULL,
	[ReceiverUserID] [bigint] NOT NULL,
	[IsDraft] [bit] NOT NULL,
	[LastModified] [smalldatetime] NOT NULL,
	[SentDate] [smalldatetime] NOT NULL,
	[ReceivedDate] [smalldatetime] NOT NULL,
 CONSTRAINT [PK_MessageSeen] PRIMARY KEY CLUSTERED 
(
	[MessageSeenID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Notification]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Notification](
	[NotificationID] [bigint] IDENTITY(1,1) NOT NULL,
	[UserID] [bigint] NOT NULL,
	[NotificationTypeID] [tinyint] NOT NULL,
	[Message] [varchar](50) NULL,
	[Dated] [smalldatetime] NOT NULL,
 CONSTRAINT [PK_Notification] PRIMARY KEY CLUSTERED 
(
	[NotificationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[NotificationType]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[NotificationType](
	[NotificationTypeID] [tinyint] IDENTITY(1,1) NOT NULL,
	[TypeName] [varchar](50) NOT NULL,
	[IsGood] [bit] NOT NULL,
	[DefaultMessage] [varchar](30) NOT NULL,
 CONSTRAINT [PK_NotificationType] PRIMARY KEY CLUSTERED 
(
	[NotificationTypeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Platform]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Platform](
	[PlatformID] [tinyint] IDENTITY(1,1) NOT NULL,
	[PlatformName] [varchar](40) NOT NULL,
	[Icon] [varchar](50) NULL,
 CONSTRAINT [PK_Platform] PRIMARY KEY CLUSTERED 
(
	[PlatformID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Review]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Review](
	[ReviewID] [bigint] IDENTITY(1,1) NOT NULL,
	[Title] [varchar](30) NOT NULL,
	[Pros] [varchar](300) NULL,
	[Cons] [varchar](300) NULL,
	[IsSuggest] [bit] NOT NULL,
	[Comment1] [varchar](100) NOT NULL,
	[Comment2] [varchar](500) NULL,
	[AppID] [bigint] NOT NULL,
	[UserID] [bigint] NOT NULL,
	[Comments]  AS (concat([Comment1],[Comment2])),
	[LikedCount] [int] NOT NULL,
	[DisLikeCount] [int] NOT NULL,
	[Rating] [tinyint] NOT NULL,
	[CreatedDate] [date] NOT NULL,
 CONSTRAINT [PK_Review] PRIMARY KEY CLUSTERED 
(
	[ReviewID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[ReviewLikeDislike]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReviewLikeDislike](
	[ReviewLikeDislikeID] [bigint] IDENTITY(1,1) NOT NULL,
	[ReviewID] [bigint] NOT NULL,
	[UserID] [bigint] NOT NULL,
	[IsLiked] [bit] NOT NULL,
	[IsDisliked] [bit] NOT NULL,
	[IsNone] [bit] NOT NULL,
 CONSTRAINT [PK_ReviewLikeDislike] PRIMARY KEY CLUSTERED 
(
	[ReviewLikeDislikeID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Tag]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tag](
	[TagID] [bigint] IDENTITY(1,1) NOT NULL,
	[TagDisplay] [nvarchar](40) NOT NULL,
 CONSTRAINT [PK_Tag] PRIMARY KEY CLUSTERED 
(
	[TagID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[TagAppRelation]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TagAppRelation](
	[TagAppRelationID] [bigint] IDENTITY(1,1) NOT NULL,
	[TagID] [bigint] NOT NULL,
	[AppID] [bigint] NOT NULL,
 CONSTRAINT [PK_TagAppRelation] PRIMARY KEY CLUSTERED 
(
	[TagAppRelationID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[TempUpload]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TempUpload](
	[TempUploadID] [uniqueidentifier] NOT NULL,
	[UserID] [bigint] NOT NULL,
	[AppID] [bigint] NULL,
	[GalleryID] [uniqueidentifier] NOT NULL,
	[RelatingUploadGuidForDelete] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[TempUploadID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[User]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[User](
	[UserID] [bigint] NOT NULL,
	[FirstName] [varchar](30) NOT NULL,
	[LastName] [varchar](30) NOT NULL,
	[Phone] [varchar](18) NULL,
	[UserName] [varchar](30) NOT NULL,
	[TotalEarnedPoints] [bigint] NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[UserID] DESC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[UserPoint]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserPoint](
	[UserPointID] [bigint] IDENTITY(1,1) NOT NULL,
	[UserID] [bigint] NOT NULL,
	[Point] [int] NOT NULL,
	[UserPointSettingID] [tinyint] NOT NULL,
	[Dated] [smalldatetime] NOT NULL,
 CONSTRAINT [PK_UserPoint] PRIMARY KEY CLUSTERED 
(
	[UserPointID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[UserPointSetting]    Script Date: 04-Mar-16 11:27:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[UserPointSetting](
	[UserPointSettingID] [tinyint] IDENTITY(1,1) NOT NULL,
	[TaskName] [varchar](50) NOT NULL,
	[Point] [int] NOT NULL,
 CONSTRAINT [PK_UserPointSetting] PRIMARY KEY CLUSTERED 
(
	[UserPointSettingID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Index [IX_App_1]    Script Date: 04-Mar-16 11:27:20 AM ******/
CREATE UNIQUE NONCLUSTERED INDEX [IX_App_1] ON [dbo].[App]
(
	[UploadGuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_App_TotalViewCount]    Script Date: 04-Mar-16 11:27:20 AM ******/
CREATE NONCLUSTERED INDEX [IX_App_TotalViewCount] ON [dbo].[App]
(
	[TotalViewed] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Gallery]    Script Date: 04-Mar-16 11:27:20 AM ******/
CREATE NONCLUSTERED INDEX [IX_Gallery] ON [dbo].[Gallery]
(
	[UploadGuid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_GalleryCategory]    Script Date: 04-Mar-16 11:27:20 AM ******/
CREATE NONCLUSTERED INDEX [IX_GalleryCategory] ON [dbo].[GalleryCategory]
(
	[GalleryCategoryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[App] ADD  CONSTRAINT [DF_App_IsBlocked]  DEFAULT ((0)) FOR [IsBlocked]
GO
ALTER TABLE [dbo].[App] ADD  CONSTRAINT [DF_App_IsPublished]  DEFAULT ((0)) FOR [IsPublished]
GO
ALTER TABLE [dbo].[App] ADD  CONSTRAINT [DF__tmp_ms_xx__Websi__420DC656]  DEFAULT ((0)) FOR [WebsiteClicked]
GO
ALTER TABLE [dbo].[App] ADD  CONSTRAINT [DF__tmp_ms_xx__Store__4301EA8F]  DEFAULT ((0)) FOR [StoreClicked]
GO
ALTER TABLE [dbo].[App] ADD  CONSTRAINT [DF__tmp_ms_xx__AvgRa__43F60EC8]  DEFAULT ((0)) FOR [AvgRating]
GO
ALTER TABLE [dbo].[AppDraft] ADD  DEFAULT ((0)) FOR [IsBlocked]
GO
ALTER TABLE [dbo].[AppDraft] ADD  DEFAULT ((0)) FOR [IsPublished]
GO
ALTER TABLE [dbo].[Category] ADD  DEFAULT ('None') FOR [Slug]
GO
ALTER TABLE [dbo].[GalleryCategory] ADD  DEFAULT ((0)) FOR [IsAdvertise]
GO
ALTER TABLE [dbo].[Message] ADD  CONSTRAINT [DF_Message_LastModified]  DEFAULT (getdate()) FOR [LastModified]
GO
ALTER TABLE [dbo].[Message] ADD  CONSTRAINT [DF_Message_SentDate]  DEFAULT (getdate()) FOR [SentDate]
GO
ALTER TABLE [dbo].[MessageSeen] ADD  CONSTRAINT [DF_MessageSeen_LastModified]  DEFAULT (getdate()) FOR [LastModified]
GO
ALTER TABLE [dbo].[MessageSeen] ADD  CONSTRAINT [DF_MessageSeen_SentDate]  DEFAULT (getdate()) FOR [SentDate]
GO
ALTER TABLE [dbo].[NotificationType] ADD  DEFAULT ((0)) FOR [IsGood]
GO
ALTER TABLE [dbo].[Review] ADD  DEFAULT ((0)) FOR [LikedCount]
GO
ALTER TABLE [dbo].[Review] ADD  DEFAULT ((0)) FOR [DisLikeCount]
GO
ALTER TABLE [dbo].[Review] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[User] ADD  DEFAULT ((0)) FOR [TotalEarnedPoints]
GO
ALTER TABLE [dbo].[UserPoint] ADD  CONSTRAINT [DF_UserPoint_Point]  DEFAULT ((0)) FOR [Point]
GO
ALTER TABLE [dbo].[App]  WITH CHECK ADD  CONSTRAINT [FK_App_Category] FOREIGN KEY([CategoryID])
REFERENCES [dbo].[Category] ([CategoryID])
GO
ALTER TABLE [dbo].[App] CHECK CONSTRAINT [FK_App_Category]
GO
ALTER TABLE [dbo].[App]  WITH CHECK ADD  CONSTRAINT [FK_App_Platform] FOREIGN KEY([PlatformID])
REFERENCES [dbo].[Platform] ([PlatformID])
GO
ALTER TABLE [dbo].[App] CHECK CONSTRAINT [FK_App_Platform]
GO
ALTER TABLE [dbo].[App]  WITH CHECK ADD  CONSTRAINT [FK_App_User] FOREIGN KEY([PostedByUserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[App] CHECK CONSTRAINT [FK_App_User]
GO
ALTER TABLE [dbo].[CellPhone]  WITH CHECK ADD  CONSTRAINT [FK_CellPhone_Platform] FOREIGN KEY([PlatformID])
REFERENCES [dbo].[Platform] ([PlatformID])
GO
ALTER TABLE [dbo].[CellPhone] CHECK CONSTRAINT [FK_CellPhone_Platform]
GO
ALTER TABLE [dbo].[CellPhone]  WITH CHECK ADD  CONSTRAINT [FK_CellPhone_User] FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[CellPhone] CHECK CONSTRAINT [FK_CellPhone_User]
GO
ALTER TABLE [dbo].[FeaturedImage]  WITH CHECK ADD  CONSTRAINT [FK_FeaturedImage_App] FOREIGN KEY([AppID])
REFERENCES [dbo].[App] ([AppID])
GO
ALTER TABLE [dbo].[FeaturedImage] CHECK CONSTRAINT [FK_FeaturedImage_App]
GO
ALTER TABLE [dbo].[FeaturedImage]  WITH CHECK ADD  CONSTRAINT [FK_FeaturedImage_User] FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[FeaturedImage] CHECK CONSTRAINT [FK_FeaturedImage_User]
GO
ALTER TABLE [dbo].[Gallery]  WITH CHECK ADD  CONSTRAINT [FK_Gallery_GalleryCategory] FOREIGN KEY([GalleryCategoryID])
REFERENCES [dbo].[GalleryCategory] ([GalleryCategoryID])
GO
ALTER TABLE [dbo].[Gallery] CHECK CONSTRAINT [FK_Gallery_GalleryCategory]
GO
ALTER TABLE [dbo].[LatestSeenNotification]  WITH CHECK ADD  CONSTRAINT [FK_LatestSeenNotification_User] FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[LatestSeenNotification] CHECK CONSTRAINT [FK_LatestSeenNotification_User]
GO
ALTER TABLE [dbo].[Message]  WITH CHECK ADD  CONSTRAINT [FK_Message_User] FOREIGN KEY([SenderUserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[Message] CHECK CONSTRAINT [FK_Message_User]
GO
ALTER TABLE [dbo].[Message]  WITH CHECK ADD  CONSTRAINT [FK_Message_User1] FOREIGN KEY([ReceiverUserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[Message] CHECK CONSTRAINT [FK_Message_User1]
GO
ALTER TABLE [dbo].[MessageSeen]  WITH CHECK ADD  CONSTRAINT [FK_MessageSeen_User] FOREIGN KEY([SenderUserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[MessageSeen] CHECK CONSTRAINT [FK_MessageSeen_User]
GO
ALTER TABLE [dbo].[MessageSeen]  WITH CHECK ADD  CONSTRAINT [FK_MessageSeen_User1] FOREIGN KEY([ReceiverUserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[MessageSeen] CHECK CONSTRAINT [FK_MessageSeen_User1]
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD  CONSTRAINT [FK_Notification_NotificationType] FOREIGN KEY([NotificationTypeID])
REFERENCES [dbo].[NotificationType] ([NotificationTypeID])
GO
ALTER TABLE [dbo].[Notification] CHECK CONSTRAINT [FK_Notification_NotificationType]
GO
ALTER TABLE [dbo].[Review]  WITH CHECK ADD  CONSTRAINT [FK_Review_App] FOREIGN KEY([AppID])
REFERENCES [dbo].[App] ([AppID])
GO
ALTER TABLE [dbo].[Review] CHECK CONSTRAINT [FK_Review_App]
GO
ALTER TABLE [dbo].[Review]  WITH CHECK ADD  CONSTRAINT [FK_Review_User] FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[Review] CHECK CONSTRAINT [FK_Review_User]
GO
ALTER TABLE [dbo].[ReviewLikeDislike]  WITH CHECK ADD  CONSTRAINT [FK_ReviewLikeDislike_Review] FOREIGN KEY([ReviewID])
REFERENCES [dbo].[Review] ([ReviewID])
GO
ALTER TABLE [dbo].[ReviewLikeDislike] CHECK CONSTRAINT [FK_ReviewLikeDislike_Review]
GO
ALTER TABLE [dbo].[ReviewLikeDislike]  WITH CHECK ADD  CONSTRAINT [FK_ReviewLikeDislike_User] FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[ReviewLikeDislike] CHECK CONSTRAINT [FK_ReviewLikeDislike_User]
GO
ALTER TABLE [dbo].[TagAppRelation]  WITH CHECK ADD  CONSTRAINT [FK_TagAppRelation_App] FOREIGN KEY([AppID])
REFERENCES [dbo].[App] ([AppID])
GO
ALTER TABLE [dbo].[TagAppRelation] CHECK CONSTRAINT [FK_TagAppRelation_App]
GO
ALTER TABLE [dbo].[TagAppRelation]  WITH CHECK ADD  CONSTRAINT [FK_TagAppRelation_Tag] FOREIGN KEY([TagID])
REFERENCES [dbo].[Tag] ([TagID])
GO
ALTER TABLE [dbo].[TagAppRelation] CHECK CONSTRAINT [FK_TagAppRelation_Tag]
GO
ALTER TABLE [dbo].[UserPoint]  WITH CHECK ADD  CONSTRAINT [FK_UserPoint_User] FOREIGN KEY([UserID])
REFERENCES [dbo].[User] ([UserID])
GO
ALTER TABLE [dbo].[UserPoint] CHECK CONSTRAINT [FK_UserPoint_User]
GO
ALTER TABLE [dbo].[UserPoint]  WITH CHECK ADD  CONSTRAINT [FK_UserPoint_UserPointSetting] FOREIGN KEY([UserPointSettingID])
REFERENCES [dbo].[UserPointSetting] ([UserPointSettingID])
GO
ALTER TABLE [dbo].[UserPoint] CHECK CONSTRAINT [FK_UserPoint_UserPointSetting]
GO
USE [master]
GO

