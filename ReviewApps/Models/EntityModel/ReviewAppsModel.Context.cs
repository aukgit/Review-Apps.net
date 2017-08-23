﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ReviewApps.Models.EntityModel
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class ReviewAppsEntities : DbContext
    {
        public ReviewAppsEntities()
            : base("name=ReviewAppsEntities")
        {
            this.Configuration.LazyLoadingEnabled = false;
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Advertise> Advertises { get; set; }
        public virtual DbSet<App> Apps { get; set; }
        public virtual DbSet<AppDetail> AppDetails { get; set; }
        public virtual DbSet<AppDraft> AppDrafts { get; set; }
        public virtual DbSet<Blog> Blogs { get; set; }
        public virtual DbSet<BlogAppRelation> BlogAppRelations { get; set; }
        public virtual DbSet<BlogCategory> BlogCategories { get; set; }
        public virtual DbSet<BlogDetail> BlogDetails { get; set; }
        public virtual DbSet<BlogFile> BlogFiles { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<CellPhone> CellPhones { get; set; }
        public virtual DbSet<CssStyle> CssStyles { get; set; }
        public virtual DbSet<FeaturedImage> FeaturedImages { get; set; }
        public virtual DbSet<FileType> FileTypes { get; set; }
        public virtual DbSet<Gallery> Galleries { get; set; }
        public virtual DbSet<GalleryCategory> GalleryCategories { get; set; }
        public virtual DbSet<GenericSetting> GenericSettings { get; set; }
        public virtual DbSet<GenericSettingItem> GenericSettingItems { get; set; }
        public virtual DbSet<Message> Messages { get; set; }
        public virtual DbSet<MessageSeen> MessageSeens { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<NotificationLatest> NotificationLatests { get; set; }
        public virtual DbSet<NotificationType> NotificationTypes { get; set; }
        public virtual DbSet<Payment> Payments { get; set; }
        public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }
        public virtual DbSet<PaymentType> PaymentTypes { get; set; }
        public virtual DbSet<Platform> Platforms { get; set; }
        public virtual DbSet<Review> Reviews { get; set; }
        public virtual DbSet<ReviewLikeDislike> ReviewLikeDislikes { get; set; }
        public virtual DbSet<Subscribe> Subscribes { get; set; }
        public virtual DbSet<sysdiagram> sysdiagrams { get; set; }
        public virtual DbSet<Tag> Tags { get; set; }
        public virtual DbSet<TagAppRelation> TagAppRelations { get; set; }
        public virtual DbSet<TagBlogRelation> TagBlogRelations { get; set; }
        public virtual DbSet<TempUpload> TempUploads { get; set; }
        public virtual DbSet<UploadFileDraft> UploadFileDrafts { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserLatestUpdate> UserLatestUpdates { get; set; }
        public virtual DbSet<UserPoint> UserPoints { get; set; }
        public virtual DbSet<UserPointSetting> UserPointSettings { get; set; }
    
        public virtual ObjectResult<AppsSearch_Result> AppsSearch(string searchText)
        {
            var searchTextParameter = searchText != null ?
                new ObjectParameter("SearchText", searchText) :
                new ObjectParameter("SearchText", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<AppsSearch_Result>("AppsSearch", searchTextParameter);
        }
    
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
    
        public virtual int sp_alterdiagram(string diagramname, Nullable<int> owner_id, Nullable<int> version, byte[] definition)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            var versionParameter = version.HasValue ?
                new ObjectParameter("version", version) :
                new ObjectParameter("version", typeof(int));
    
            var definitionParameter = definition != null ?
                new ObjectParameter("definition", definition) :
                new ObjectParameter("definition", typeof(byte[]));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_alterdiagram", diagramnameParameter, owner_idParameter, versionParameter, definitionParameter);
        }
    
        public virtual int sp_creatediagram(string diagramname, Nullable<int> owner_id, Nullable<int> version, byte[] definition)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            var versionParameter = version.HasValue ?
                new ObjectParameter("version", version) :
                new ObjectParameter("version", typeof(int));
    
            var definitionParameter = definition != null ?
                new ObjectParameter("definition", definition) :
                new ObjectParameter("definition", typeof(byte[]));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_creatediagram", diagramnameParameter, owner_idParameter, versionParameter, definitionParameter);
        }
    
        public virtual int sp_dropdiagram(string diagramname, Nullable<int> owner_id)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_dropdiagram", diagramnameParameter, owner_idParameter);
        }
    
        public virtual ObjectResult<sp_helpdiagramdefinition_Result> sp_helpdiagramdefinition(string diagramname, Nullable<int> owner_id)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_helpdiagramdefinition_Result>("sp_helpdiagramdefinition", diagramnameParameter, owner_idParameter);
        }
    
        public virtual ObjectResult<sp_helpdiagrams_Result> sp_helpdiagrams(string diagramname, Nullable<int> owner_id)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_helpdiagrams_Result>("sp_helpdiagrams", diagramnameParameter, owner_idParameter);
        }
    
        public virtual int sp_renamediagram(string diagramname, Nullable<int> owner_id, string new_diagramname)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            var new_diagramnameParameter = new_diagramname != null ?
                new ObjectParameter("new_diagramname", new_diagramname) :
                new ObjectParameter("new_diagramname", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_renamediagram", diagramnameParameter, owner_idParameter, new_diagramnameParameter);
        }
    
        public virtual int sp_upgraddiagrams()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_upgraddiagrams");
        }
    
        [DbFunction("ReviewAppsEntities", "SplitString")]
        public virtual IQueryable<SplitString_Result> SplitString(string stringToSplit, string splitChar)
        {
            var stringToSplitParameter = stringToSplit != null ?
                new ObjectParameter("stringToSplit", stringToSplit) :
                new ObjectParameter("stringToSplit", typeof(string));
    
            var splitCharParameter = splitChar != null ?
                new ObjectParameter("splitChar", splitChar) :
                new ObjectParameter("splitChar", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.CreateQuery<SplitString_Result>("[ReviewAppsEntities].[SplitString](@stringToSplit, @splitChar)", stringToSplitParameter, splitCharParameter);
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