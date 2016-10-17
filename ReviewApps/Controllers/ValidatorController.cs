﻿#region using block

using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Mvc;
using System.Web.UI;
using ReviewApps.Common;
using ReviewApps.Models.EntityModel;
using ReviewApps.Modules.DevUser;
using ReviewApps.Modules.Session;
using ReviewApps.Modules.Validations;

#endregion

namespace ReviewApps.Controllers {
    [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
    public class ValidatorController : Controller {
        #region WereView Validators

        #region App URL Post

        [HttpPost]
        [ValidateAntiForgeryToken]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult GetValidUrl(App app) {
            var max = 60;
            var min = 3;
            var maxTry = 3;

            var id = app.AppName;

            try {
                if (id == null || id.Length < 5) {
                    goto ReturnInvalid;
                }
                if (!AppVar.Setting.IsInTestingEnvironment) {
                    if (SessionNames.IsValidationExceed("GetValidUrl", maxTry)) {
                        return Json(Validator.GetErrorValidationExceedMessage(), JsonRequestBehavior.AllowGet);
                    }
                }

                if (id.Length >= min && id.Length <= max) {
                    var url = GetFriendlyURLFromString(id);
                    using (var db = new ReviewAppsEntities()) {
                        var exist =
                            db.Apps.Any(
                                n =>
                                    n.PlatformID == app.PlatformID && n.CategoryID == app.CategoryID && n.Url == url &&
                                    n.PlatformVersion == app.PlatformVersion);
                        if (!exist) {
                            goto ReturnValid;
                        }
                        goto ReturnInvalid;
                    }
                }
            } catch (Exception ex) {
                AppVar.Mailer.HandleError(ex, "Validate GetValidUrl App Posting");
            }
            //found e false
            ReturnValid:
            return Json(Validator.GetSuccessMessage("App name is valid."), JsonRequestBehavior.AllowGet);
            ReturnInvalid:
            return Json(Validator.GetErrorMessage("App name is already exist or not valid."),
                JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region App URL Edit

        [HttpPost]
        [ValidateAntiForgeryToken]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult GetValidUrlEditing(App app) {
            var max = 60;
            var min = 3;
            var id = app.AppName;
            var message = "Username is valid for registration.";

            try {
                if (id == null || id.Length < 5) {
                    goto ReturnInvalid;
                }
                if (!AppVar.Setting.IsInTestingEnvironment) {
                    if (SessionNames.IsValidationExceed("GetValidUrl")) {
                        return Json(Validator.GetErrorValidationExceedMessage(), JsonRequestBehavior.AllowGet);
                    }
                }

                if (id.Length >= min && id.Length <= max) {
                    var url = GetFriendlyURLFromString(id);
                    if (app.Url != null && app.Url.Equals(url)) {
                        goto ReturnValid;
                    }
                    using (var db = new ReviewAppsEntities()) {
                        var exist =
                            db.Apps.Any(
                                n =>
                                    n.AppID != app.AppID && n.PlatformID == app.PlatformID &&
                                    n.CategoryID == app.CategoryID && n.Url == url &&
                                    n.PlatformVersion == app.PlatformVersion);
                        if (!exist) {
                            goto ReturnValid;
                        }
                        goto ReturnInvalid;
                    }
                }
            } catch (Exception ex) {
                AppVar.Mailer.HandleError(ex, "Validate GetValidUrl App-Editing");
            }
            //found e false
            ReturnValid:
            return Json(Validator.GetSuccessMessage("App name is already exist or not valid."),
                JsonRequestBehavior.AllowGet); // return true;

            ReturnInvalid:
            return Json(Validator.GetErrorMessage("App name is not valid."), JsonRequestBehavior.AllowGet);
        }

        #endregion

        private string GetFriendlyURLFromString(string title) {
            if (!string.IsNullOrEmpty(title)) {
                title = title.Trim();
                title = Regex.Replace(title, Variables.FriendlyUrlRegex, "-");
                return title;
            }
            return title;
        }

        #endregion

        #region Base Validators

        [HttpPost]
        //[OutputCache(CacheProfile = "Long", VaryByParam = "UserName", VaryByCustom = "byuser")]
        [ValidateAntiForgeryToken]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult GetUsername(string UserName) {
            const int max = 30;
            const int min = 3;
            var message = "Username is valid for registration.";
            try {
                if (UserName == null || UserName.Length < 3) {
                    goto ReturnInvalid;
                }
                if (!AppVar.Setting.IsInTestingEnvironment) {
                    if (SessionNames.IsValidationExceed("username")) {
                        return Json(Validator.GetErrorValidationExceedMessage(), JsonRequestBehavior.AllowGet);
                    }
                }
                const string userPattern = "^([A-Za-z]|[A-Za-z0-9_.]+)$";
                if (Regex.IsMatch(UserName, userPattern, RegexOptions.Compiled) && UserName.Length >= min &&
                    UserName.Length <= max) {
                    if (!UserManager.IsUserNameExist(UserName)) {
                        return Json(Validator.GetSuccessMessage(message), JsonRequestBehavior.AllowGet);
                    }
                }
            } catch (Exception ex) {
                AppVar.Mailer.HandleError(ex, "Validate Username");
            }
            ReturnInvalid:
            message = "Username already exist or not valid.";
            return Json(Validator.GetErrorMessage(message), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        //[OutputCache(CacheProfile = "Long", VaryByParam = "Email", VaryByCustom = "byuser")]
        [ValidateAntiForgeryToken]
        [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
        public ActionResult GetEmail(string Email) {
            const string errorMessage = "Email already exist or not valid.";
            if (!AppVar.Setting.IsInTestingEnvironment) {
                if (SessionNames.IsValidationExceed("Email")) {
                    return Json(Validator.GetErrorValidationExceedMessage(), JsonRequestBehavior.AllowGet);
                }
            }
            try {
                if (Email == null || Email.Length < 5) {
                    goto ReturnInvalid;
                }
                var email = Email;

                var emailPattern = @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$";
                if (Regex.IsMatch(email, emailPattern)) {
                    if (!UserManager.IsEmailExist(email)) {
                        return Json(Validator.GetSuccessMessage("Valid email."), JsonRequestBehavior.AllowGet);
                    }
                }
            } catch (Exception ex) {
                AppVar.Mailer.HandleError(ex, "Validate Email");
            }
            ReturnInvalid:
            return Json(Validator.GetErrorMessage(errorMessage), JsonRequestBehavior.AllowGet);
        }

        #endregion
    }
}