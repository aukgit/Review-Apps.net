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
    
    public partial class Payment
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Payment()
        {
            this.Advertises = new HashSet<Advertise>();
        }
    
        public long PaymentID { get; set; }
        public short PaymentMethodID { get; set; }
        public string PurposeText { get; set; }
        public decimal Amount { get; set; }
        public System.DateTime Dated { get; set; }
        public long ByUserID { get; set; }
        public short PaymentTypeID { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Advertise> Advertises { get; set; }
        public virtual PaymentMethod PaymentMethod { get; set; }
        public virtual PaymentType PaymentType { get; set; }
    }
}