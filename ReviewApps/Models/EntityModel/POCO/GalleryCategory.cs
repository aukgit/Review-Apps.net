//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using ReviewApps.Modules.Uploads;

namespace ReviewApps.Models.EntityModel
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using ReviewApps.Modules.Uploads;

    public partial class GalleryCategory : IImageCategory
    {
        public GalleryCategory()
        {
            this.Galleries = new HashSet<Gallery>();
        }
    
        public int GalleryCategoryID { get; set; }
        [Display(Name = "Category")]
        public string CategoryName { get; set; }
        [Display( Description = "1024x768, here 768 is height.")]
        public double Height { get; set; }
        [Display(Description = "1024x768, here 1024 is width.")]
        public double Width { get; set; }
        [Display(Name="Related to advertise module")]
        public bool IsAdvertise { get; set; }
    
        public virtual ICollection<Gallery> Galleries { get; set; }
    }
}
