//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ReviewApps.Models.EntityModel {
    using System;
    using System.Collections.Generic;

    public partial class Report {
        public long ReportID { get; set; }
        public long AppID { get; set; }
        public long UserID { get; set; }
        public bool IsFalseReport { get; set; }
        public bool IsChecked { get; set; }
        public string ActionTakenMessageToSender { get; set; }
        public string ActionTakenMessageToHolder { get; set; }

        public virtual App App { get; set; }
        public virtual User User { get; set; }
    }
}
