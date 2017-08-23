//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class Review
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Review()
        {
            this.ReviewLikeDislikes = new HashSet<ReviewLikeDislike>();
        }
    
        public long ReviewID { get; set; }
        public string Title { get; set; }
        public string Pros { get; set; }
        public string Cons { get; set; }
        public bool IsSuggest { get; set; }
        public string Comment1 { get; set; }
        public string Comment2 { get; set; }
        public long AppID { get; set; }
        public long UserID { get; set; }
        public string Comments { get; set; }
        public int LikedCount { get; set; }
        public int DisLikeCount { get; set; }
        public byte Rating { get; set; }
        public System.DateTime CreatedDate { get; set; }
    
        public virtual App App { get; set; }
        public virtual User User { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ReviewLikeDislike> ReviewLikeDislikes { get; set; }
    }
}
