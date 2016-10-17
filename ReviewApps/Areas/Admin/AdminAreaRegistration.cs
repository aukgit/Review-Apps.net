﻿using System.Web.Mvc;

namespace ReviewApps.Areas.Admin {
    public class AdminAreaRegistration : AreaRegistration {
        public override string AreaName {
            get {
                return "Admin";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) {
            context.MapRoute(
                "Admin_default",
                "Admin/{controller}/{action}/{id}",
                new { action = "Index", Controller = "Home", id = UrlParameter.Optional }
            );
            context.MapRoute(
                "Admin_page",
                "Admin/{controller}/{action}/{page}",
                new { action = "Index", Controller = "Home", page = UrlParameter.Optional }
            );

        }
    }
}