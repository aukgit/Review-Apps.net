using System.Data.Entity.Core.Objects;
using ReviewApps.Modules.Extensions.Context;

namespace ReviewApps.Models.EntityModel {
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using ReviewApps.Modules.Extensions.Context;

    public partial class ReviewAppsEntities : DevDbContext {
        public ReviewAppsEntities()
            : base("name=ReviewAppsEntities") {
            this.Configuration.LazyLoadingEnabled = false;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder) {
            throw new UnintentionalCodeFirstException();
        }
        public virtual DbSet<AdvComment> AdvComments { get; set; }
        public virtual DbSet<Advertise> Advertises { get; set; }
        public virtual DbSet<AdvertiseCategory> AdvertiseCategories { get; set; }
        public virtual DbSet<App> Apps { get; set; }
        public virtual DbSet<AppDetail> AppDetails { get; set; }
        public virtual DbSet<AppDraft> AppDrafts { get; set; }
        public virtual DbSet<AppPricingCategory> AppPricingCategories { get; set; }
        public virtual DbSet<Blog> Blogs { get; set; }
        public virtual DbSet<BlogAppRelation> BlogAppRelations { get; set; }
        public virtual DbSet<BlogCategory> BlogCategories { get; set; }
        public virtual DbSet<BlogDetail> BlogDetails { get; set; }
        public virtual DbSet<BlogFile> BlogFiles { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<CellPhone> CellPhones { get; set; }
        public virtual DbSet<Chat> Chats { get; set; }
        public virtual DbSet<ChatConversation> ChatConversations { get; set; }
        public virtual DbSet<ChatType> ChatTypes { get; set; }
        public virtual DbSet<CssStyle> CssStyles { get; set; }
        public virtual DbSet<FeaturedImage> FeaturedImages { get; set; }
        public virtual DbSet<FileType> FileTypes { get; set; }
        public virtual DbSet<Gallery> Galleries { get; set; }
        public virtual DbSet<GalleryCategory> GalleryCategories { get; set; }
        public virtual DbSet<GenericSetting> GenericSettings { get; set; }
        public virtual DbSet<GenericSettingItem> GenericSettingItems { get; set; }
        public virtual DbSet<Language> Languages { get; set; }
        public virtual DbSet<Message> Messages { get; set; }
		public virtual DbSet<MessageSeen> MessageSeens { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<NotificationLatest> NotificationLatests { get; set; }
        public virtual DbSet<NotificationType> NotificationTypes { get; set; }
        public virtual DbSet<Payment> Payments { get; set; }
        public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }
        public virtual DbSet<PaymentType> PaymentTypes { get; set; }
        public virtual DbSet<Platform> Platforms { get; set; }
        public virtual DbSet<RelatedApp> RelatedApps { get; set; }
        public virtual DbSet<RelatedIDType> RelatedIDTypes { get; set; }
        public virtual DbSet<Review> Reviews { get; set; }
        public virtual DbSet<ReviewLikeDislike> ReviewLikeDislikes { get; set; }
        public virtual DbSet<SearchedAppsFound> SearchedAppsFounds { get; set; }
        public virtual DbSet<SearchedBlogArticleFound> SearchedBlogArticleFounds { get; set; }
        public virtual DbSet<SearchIndex> SearchIndexes { get; set; }
        public virtual DbSet<Subscribe> Subscribes { get; set; }
        public virtual DbSet<Tag> Tags { get; set; }
        public virtual DbSet<TagAppRelation> TagAppRelations { get; set; }
        public virtual DbSet<TagBlogRelation> TagBlogRelations { get; set; }
        public virtual DbSet<TempUpload> TempUploads { get; set; }
        public virtual DbSet<UploadFileDraft> UploadFileDrafts { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserLatestUpdate> UserLatestUpdates { get; set; }
        public virtual DbSet<UserPoint> UserPoints { get; set; }
        public virtual DbSet<UserPointSetting> UserPointSettings { get; set; }
    
        public virtual int ResetAppDrafts()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("ResetAppDrafts");
        }
    
        public virtual int ResetApps()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("ResetApps");
        }
    
        public virtual int ResetAppsAndUsers()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("ResetAppsAndUsers");
        }
    
        public virtual int ResetReviews()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("ResetReviews");
        }
    
        public virtual int ResetWholeSystem()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("ResetWholeSystem");
        }
    
        public virtual int ResetWholeSystemX()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("ResetWholeSystemX");
        }
    
        [DbFunction("ReviewAppsEntities", "GetSha2561")]
        public virtual IQueryable<byte[]> GetSha2561(string str)
        {
            var strParameter = str != null ?
                new ObjectParameter("str", str) :
                new ObjectParameter("str", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.CreateQuery<byte[]>("[ReviewAppsEntities].[GetSha2561](@str)", strParameter);
        }
    }
}
