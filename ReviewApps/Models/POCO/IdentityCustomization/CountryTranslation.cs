﻿using System.ComponentModel.DataAnnotations;

namespace ReviewApps.Models.POCO.IdentityCustomization {
    public class CountryTranslation {
        public int CountryTranslationID { get; set; }
        public int CountryLanguageID { get; set; }
        [StringLength(50)]
        [Required]
        public string Translation { get; set; }

        public int CountryID { get; set; }
    }
}
