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
    
    public partial class BlogCategory
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public BlogCategory()
        {
            this.Blogs = new HashSet<Blog>();
        }
    
        public int BlogCategoryID { get; set; }
        public string BlogCategoryName { get; set; }
        public string Slug { get; set; }
        public bool IsCore { get; set; }
        public bool IsFileType { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Blog> Blogs { get; set; }
    }
}