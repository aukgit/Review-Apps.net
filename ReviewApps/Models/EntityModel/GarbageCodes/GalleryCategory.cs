//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WereViewApp.Models.EntityModel
{
    using System;
    using System.Collections.Generic;
    
    public partial class GalleryCategory
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public GalleryCategory()
        {
            this.Galleries = new HashSet<Gallery>();
        }
    
        public int GalleryCategoryID { get; set; }
        public string CategoryName { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public bool IsAdvertise { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Gallery> Galleries { get; set; }
    }
}
