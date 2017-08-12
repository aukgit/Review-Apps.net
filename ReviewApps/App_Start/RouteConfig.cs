﻿using System.Web.Mvc;
using System.Web.Routing;

namespace ReviewApps {
    public class RouteConfig {
        public static void RegisterRoutes(RouteCollection routes) {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("elmah");


            //AreaRegistration.RegisterAllAreas();


            #region Login, Register, Authentication Additional Routes

            const string reviewappsControllers = "ReviewApps.Controllers";
            const string accountController = "Account";

            routes.MapRoute(
                   name: "RegisterConfig",
                   url: "Register",
                   defaults: new { controller = accountController, action = "Register", id = UrlParameter.Optional },
                   namespaces: new string[] { reviewappsControllers }
            );
            routes.MapRoute(
                name: "SignInConfig",
                url: "SignIn",
                defaults: new { controller = accountController, action = "Login", id = UrlParameter.Optional },
                namespaces: new string[] { reviewappsControllers }
            );
            routes.MapRoute(
                name: "LoginConfig",
                url: "Login",
                defaults: new { controller = accountController, action = "Login", id = UrlParameter.Optional },
                namespaces: new string[] { reviewappsControllers }
            );

            routes.MapRoute(
                name: "SignOut",
                url: "SignOut",
                defaults: new { controller = accountController, action = "SignOut" },
                namespaces: new string[] { reviewappsControllers }
            );

            routes.MapRoute(
                name: "LogOff",
                url: "LogOff",
                defaults: new { controller = accountController, action = "SignOut" },
                namespaces: new string[] { reviewappsControllers }
            );

            routes.MapRoute(
               name: "ExternalSigninConfig",
               url: "ExtSignin",
               defaults: new { controller = accountController, action = "ExternalLogin", id = UrlParameter.Optional },
               namespaces: new string[] { reviewappsControllers }
           );
            #endregion

            #region reviews
            routes.MapRoute(
              name: "reviews_user",
              url: "user/reviews/{username}/{page}",
              defaults: new { controller = "Reviews", action = "User", page = UrlParameter.Optional },
              namespaces: new string[] { reviewappsControllers }
            );
            #endregion

            #region profile
            routes.MapRoute(
              name: "profiles",
              url: "Profiles/{username}/{page}",
              defaults: new { controller = "Profiles", action = "Profile", page = UrlParameter.Optional },
              namespaces: new string[] { reviewappsControllers }
            );
            #endregion

            #region tag
            routes.MapRoute(
               name: "tag_url",
               url: "tags/{id}",
               defaults: new { controller = "Tags", action = "GetTagDetail", url = UrlParameter.Optional },
               namespaces: new string[] { reviewappsControllers }
            );

            #endregion

            #region Search
            //routes.MapRoute(
            //   name: "search_url",
            //   url: "Search/{url}",
            //   defaults: new { controller = "SearchPage", action = "Index", url = UrlParameter.Optional },
            //   namespaces: new string[] { wereviewappControllers }
            //);

            //routes.MapRoute(
            //   name: "searchXS",
            //   url: "SearchX",
            //   defaults: new { controller = "SearchPage", action = "Index" },
            //   namespaces: new string[] { wereviewappControllers }
            //);

            #endregion

            #region App Routes
            routes.MapRoute(
              name: "platform_specific",
              url: "Apps/Mobile/Platforms/{platformName}/{page}",
              defaults: new { controller = "Platforms", action = "Specific", page = UrlParameter.Optional },
              namespaces: new string[] { reviewappsControllers }
            );
            routes.MapRoute(
               name: "platform",
               url: "Apps/Mobile/Platforms",
               defaults: new { controller = "Platforms", action = "Index" },
               namespaces: new string[] { reviewappsControllers }
            );

            routes.MapRoute(
              name: "category_specific",
              url: "Apps/Category/{slug}/{page}",
              defaults: new { controller = "Category", action = "Specific", page = UrlParameter.Optional },
              namespaces: new string[] { reviewappsControllers }
            );
            routes.MapRoute(
               name: "category",
               url: "Apps/Category",
               defaults: new { controller = "Category", action = "Index" },
               namespaces: new string[] { reviewappsControllers }
            );

            routes.MapRoute(
              name: "apps-index",
              url: "Apps",
              defaults: new { controller = "Apps", action = "Index", id = UrlParameter.Optional },
              namespaces: new string[] { reviewappsControllers }
          );

            routes.MapRoute(
                name: "apps-latest",
                url: "Apps/Latest",
                defaults: new { controller = "Apps", action = "Latest", id = UrlParameter.Optional },
                namespaces: new string[] { reviewappsControllers }
            );

            routes.MapRoute(
                name: "apps-top",
                url: "Apps/Top",
                defaults: new { controller = "Apps", action = "Top", id = UrlParameter.Optional },
                namespaces: new string[] { reviewappsControllers }
            );


            routes.MapRoute(
               name: "SingleApp",
               url: "Apps/{platform}-{platformVersion}/{category}/{url}",
               defaults: new { controller = "App", action = "SingleAppDisplay" },
               namespaces: new string[] { reviewappsControllers }
            );

            routes.MapRoute(
               name: "SingleApp-Category",
               url: "Apps/{platform}-{platformVersion}/{category}",
               defaults: new { controller = "Apps", action = "GetByPlatformAndCategory" },
               namespaces: new string[] { reviewappsControllers }
            );
            routes.MapRoute(
                  name: "SingleApp-Platform-Version",
                  url: "Apps/{platform}-{platformVersion}",
                  defaults: new { controller = "Apps", action = "GetByPlatformAndCategory", platformVersion = UrlParameter.Optional, platform = UrlParameter.Optional },
                  namespaces: new string[] { reviewappsControllers }
           );
            routes.MapRoute(
                   name: "SingleApp-Platform",
                   url: "Apps/{platform}",
                   defaults: new { controller = "Apps", action = "GetByPlatformAndCategory", platform = UrlParameter.Optional },
                   namespaces: new string[] { reviewappsControllers }
            );

            #endregion

            #region Default Route
            //routes.MapRoute(
            //       name: "Direct",
            //       url: "{action}",
            //       defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
            //       namespaces: new string[] { wereviewappControllers }
            //);
            routes.MapRoute(
                   name: "ContactUs",
                   url: "ContactUs",
                   defaults: new { controller = "Home", action = "ContactUs", id = UrlParameter.Optional },
                   namespaces: new string[] { reviewappsControllers }
            );

            routes.MapRoute(
                  name: "AboutUs",
                  url: "About",
                  defaults: new { controller = "Home", action = "About", id = UrlParameter.Optional },
                  namespaces: new string[] { reviewappsControllers }
           );

            routes.MapRoute(
                name: "Policy",
                url: "Policy",
                defaults: new { controller = "Home", action = "Policy", id = UrlParameter.Optional },
                namespaces: new string[] { reviewappsControllers }
         );
            routes.MapRoute(
                   name: "Default",
                   url: "{controller}/{action}/{id}",
                   defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                   namespaces: new string[] { reviewappsControllers }
            );

            #endregion



        }
    }
}
