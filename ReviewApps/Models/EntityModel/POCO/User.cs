using System.Collections.Generic;
using ReviewApps.Models.DesignPattern.Interfaces;
using ReviewApps.Helpers;

namespace ReviewApps.Models.EntityModel {
    public class User : IDevUser {
        public User()
        {
            this.AdvComments = new HashSet<AdvComment>();
            this.Apps = new HashSet<App>();
            this.Blogs = new HashSet<Blog>();
            this.CellPhones = new HashSet<CellPhone>();
            this.Chats = new HashSet<Chat>();
            this.FeaturedImages = new HashSet<FeaturedImage>();
            this.Messages = new HashSet<Message>();
            this.Messages1 = new HashSet<Message>();
            this.MessageSeens = new HashSet<MessageSeen>();
            this.MessageSeens1 = new HashSet<MessageSeen>();
            this.NotificationLatests = new HashSet<NotificationLatest>();
            this.Reviews = new HashSet<Review>();
            this.ReviewLikeDislikes = new HashSet<ReviewLikeDislike>();
            this.UserLatestUpdates = new HashSet<UserLatestUpdate>();
            this.UserPoints = new HashSet<UserPoint>();
        }

        public long UserID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string UserName { get; set; }

        public long TotalEarnedPoints { get; set; }
        public bool IsProfileSet { get; set; }
        public virtual ICollection<AdvComment> AdvComments { get; set; }
        public virtual ICollection<App> Apps { get; set; }
        public virtual ICollection<Blog> Blogs { get; set; }
        public virtual ICollection<CellPhone> CellPhones { get; set; }
        public virtual ICollection<Chat> Chats { get; set; }
        public virtual ICollection<FeaturedImage> FeaturedImages { get; set; }

        public virtual ICollection<Message> Messages { get; set; }
        public virtual ICollection<Message> Messages1 { get; set; }
        public virtual ICollection<MessageSeen> MessageSeens { get; set; }
        public virtual ICollection<MessageSeen> MessageSeens1 { get; set; }
        public virtual ICollection<NotificationLatest> NotificationLatests { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<ReviewLikeDislike> ReviewLikeDislikes { get; set; }
        public virtual ICollection<UserLatestUpdate> UserLatestUpdates { get; set; }
        public virtual ICollection<UserPoint> UserPoints { get; set; }


        #region Virtual Fields : no relation with database

        private string _displayName;

        public string DisplayName {
            get {
                if (_displayName == null) {
                    _displayName = FirstName + " " + LastName;
                }
                return _displayName;
            }
        }
        /// <summary>
        /// Return full name with truncated dots (if necessary).
        /// </summary>
        /// <param name="truncateLength"></param>
        /// <returns></returns>
        public string DisplayNameTruncated(int truncateLength = 15) {
            return DisplayName.Truncate(truncateLength);
        }

        #endregion
    }
}
