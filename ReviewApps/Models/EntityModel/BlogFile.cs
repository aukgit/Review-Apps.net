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
    
    public partial class BlogFile
    {
        public System.Guid BlogFilesID { get; set; }
        public long BlogID { get; set; }
        public Nullable<System.Guid> GalleryID { get; set; }
        public bool IsLink { get; set; }
        public string Link { get; set; }
    
        public virtual Blog Blog { get; set; }
    }
}