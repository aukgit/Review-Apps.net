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
    
    public partial class UserLatestUpdate
    {
        public long UserLatestUpdatesID { get; set; }
        public Nullable<long> BlogID { get; set; }
        public Nullable<long> AppID { get; set; }
        public bool IsSendToSubscriber { get; set; }
        public Nullable<System.DateTime> AddedAt { get; set; }
        public long ByUserID { get; set; }
    
        public virtual App App { get; set; }
        public virtual User User { get; set; }
    }
}
