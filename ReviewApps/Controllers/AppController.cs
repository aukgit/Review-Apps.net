﻿#region using block

using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using DevMvcComponent;
using ReviewApps.BusinessLogics;
using ReviewApps.Common;
using ReviewApps.Filter;
using ReviewApps.Models.EntityModel;
using ReviewApps.Models.EntityModel.Derivables;
using ReviewApps.Models.EntityModel.Structs;
using ReviewApps.Models.ViewModels;
using ReviewApps.Modules.DevUser;
using ReviewApps.Modules.Session;
using ReviewApps.Modules.Uploads;
using ReviewApps.Models.EntityModel.ExtenededWithCustomMethods;
using ReviewApps.Modules.Extensions.IdentityExtension;
using ReviewApps.Modules.Mail;
using FileSys = System.IO.File;

#endregion

namespace ReviewApps.Controllers {
    /// <summary>
    /// App edit/modify, add related controller + single app display logic.
    /// </summary>
    [Authorize]
    [ValidateRegistrationComplete]
    [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
    public class AppController : AdvanceController {
        #region Declaration

        private readonly Logics _logics = new Logics();
        #endregion

        #region Constructors

        public AppController()
            : base(true) {
            ViewBag.controller = ControllerName;
        }

        #endregion

        #region Single App Display Page : site.com/Apps/Apple-8/Games/plant-vs-zombies

        /// <summary>
        /// </summary>
        /// <param name="platform"></param>
        /// <param name="platformVersion"></param>
        /// <param name="category">Category slug</param>
        /// <param name="url"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [OutputCache(CacheProfile = "Short", VaryByParam = "platform;platformVersion;category;url")]
        public async Task<ActionResult> SingleAppDisplay(string platform, float? platformVersion, string category,
            string url) {
            var app = _logics.GetSingleAppForDisplay(platform, platformVersion, category, url, 30, db);
            if (app != null) {
                _logics.IncreaseViewCount(app, db);
                ViewBag.breadcrumbs = _logics.GetBredcrumbsBasedOnCurrentUrl("single-app");
                ViewBag.view = "SingleAppDisplay"; // js action
                return View(app);
            }
            return View("_AppNotFound");
        }

        #endregion

        #region App Not Found

        public ActionResult AppNotFound() {
            return View("_AppNotFound");
        }

        #endregion

        #region Delete Gallery Image

        //[ValidateAntiForgeryToken]
        [HttpGet]
        public JsonResult DeleteGalleryImage(Guid uploadGuid, byte sequence, string requestVerificationToken) {
            var gallery = db.Galleries.FirstOrDefault(n => n.UploadGuid == uploadGuid && n.Sequence == sequence);
            if (gallery != null) {
                var fileName = Statics.UProcessorGallery.GetOrganizeName(gallery, true);
                var absPath =
                    Statics.UProcessorGallery.VirtualPathtoAbsoluteServerPath(
                        Statics.UProcessorGallery.GetCombinePathWithAdditionalRoots() + fileName);
                if (FileSys.Exists(absPath)) {
                    FileSys.Delete(absPath);
                }

                absPath =
                    Statics.UProcessorGallery.VirtualPathtoAbsoluteServerPath(
                        Statics.UProcessorGallery.GetCombinePathWithAdditionalRoots() + fileName);
                if (FileSys.Exists(absPath)) {
                    FileSys.Delete(absPath);
                }

                ResetSessionForUploadSequence(uploadGuid);

                //find  the temp
                var temp = db.TempUploads.FirstOrDefault(n => n.GalleryID == gallery.GalleryID);
                if (temp != null) {
                    db.TempUploads.Remove(temp);
                }
                db.Galleries.Remove(gallery);
                db.SaveChanges();
                Session[uploadGuid.ToString()] = null;

                return Json(true, JsonRequestBehavior.AllowGet);
            }
            return Json(false, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region Upload Edit Btn

        [ValidateAntiForgeryToken]
        public ActionResult EditGalleryUploads(App app) {
            var token = Request["__RequestVerificationToken"];
            var path = AppVar.Url + Statics.UProcessorGallery.RootPath.Replace("~/", "/") +
                       Statics.UProcessorGallery.AdditionalRoots;

            var uploadedImages = db.Galleries
                                   .Where(
                                       n =>
                                           n.GalleryCategoryID == GalleryCategoryIDs.AppPageGallery &&
                                           n.UploadGuid == app.UploadGuid)
                                   .OrderBy(n => n.Sequence)
                                   .AsEnumerable()
                                   .Select(n => new UploadedGalleryImageEditViewModel {
                                       Tile = n.Title,
                                       Subtitle = n.Subtitle,
                                       Sequence = n.Sequence,
                                       UploadGuid = n.UploadGuid,
                                       Id = app.AppID,
                                       ImageURL = path + UploadProcessor.GetOrganizeNameStatic(n, true, false, ""),
                                       DeleteURL = "/" + ControllerName +
                                                   "/DeleteGalleryImage?uploadGuid=" + n.UploadGuid +
                                                   "&sequence=" + n.Sequence +
                                                   "&__RequestVerificationToken=" + token
                                       //ReUploadURL = "/" + _controllerName +
                                       //"/ReuploadGalleryImage?uploadGuid=" + n.UploadGuid +
                                       //"&sequence=" + n.Sequence +
                                       //"&__RequestVerificationToken=" + token
                                   }).ToList();

            return View(uploadedImages);
        }

        #endregion

        #region Count of Gallery Images

        private int GetAppGalleryImageCountValueStatic(Guid uploadGuid) {
            if (uploadGuid == null) {
                return 0;
            }
            var sessionName = uploadGuid + "-staticCount";

            var sessionCount = Session[sessionName];
            if (sessionCount != null) {
                var b = byte.Parse(sessionCount.ToString());
                return b;
            }
            //try to get from the database.
            var count =
                db.Galleries.Count(
                    n => n.UploadGuid == uploadGuid && n.GalleryCategoryID == GalleryCategoryIDs.AppPageGallery);
            Session[sessionName] = count;
            return count;
        }

        #endregion

        #region View tapping

        /// <summary>
        ///     Always tap once before going into the view.
        /// </summary>
        /// <param name="ViewStates">Say the view state, where it is calling from.</param>
        /// <param name="App">Gives the model if it is a editing state or creating posting state or when deleting.</param>
        /// <returns>If successfully saved returns true or else false.</returns>
        private bool ViewTapping(ViewStates view, App app = null) {
            switch (view) {
                case ViewStates.Index:
                    break;
                case ViewStates.Create:
                    ViewBag.ShowAllDivs = "false";
                    break;
                case ViewStates.CreatePost: // before saving it
                    ViewBag.ShowAllDivs = "true";
                    break;
                case ViewStates.Edit:
                    ViewBag.ShowAllDivs = "true";
                    ViewBag.preexistGallery = GetAppGalleryImageCountValueStatic(app.UploadGuid);
                    break;
                case ViewStates.Details:
                    break;
                case ViewStates.EditPost: // before saving it
                    ViewBag.preexistGallery = GetAppGalleryImageCountValueStatic(app.UploadGuid);
                    ViewBag.ShowAllDivs = "true";
                    break;
                case ViewStates.SavingAppDraftBeforePost: // before saving it

                    break;
                case ViewStates.SavingAppDraftAfterPost: // before saving it
                    break;

                case ViewStates.DraftsIndex:
                    break;

                case ViewStates.DraftsToApp:
                    ViewBag.preexistGallery = GetAppGalleryImageCountValueStatic(app.UploadGuid);
                    if (ViewBag.preexistGallery > 0) {
                        ViewBag.ShowAllDivs = "true";
                    }
                    break;
                case ViewStates.Delete:
                    break;
            }
            return true;
        }

        #endregion

        #region Save database common method

        /// <summary>
        ///     Better approach to save things into database(than db.SaveChanges()) for this controller.
        /// </summary>
        /// <param name="ViewStates">Say the view state, where it is calling from.</param>
        /// <param name="App">Your model information to send in email to developer when failed to save.</param>
        /// <returns>If successfully saved returns true or else false.</returns>
        private bool SaveDatabase(ViewStates view, IApp app = null) {
            // working those at HttpPost time.
            switch (view) {
                case ViewStates.Create:
                    break;
                case ViewStates.Edit:
                    break;
                case ViewStates.Delete:
                    break;
            }
            if (app != null) {
                app.AppName = Logics.GetAllUpperCaseTitle(app.AppName);
            }
            var changes = db.SaveChanges(app);
            if (changes > 0) {
                return true;
            }
            return false;
        }

        #endregion

        #region Saving App as Draft

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> SaveDraft(App app) {
            var userId = UserManager.GetLoggedUserId();
            if (app.AppID != 0) {
                // app id exist that means 
                // app is already saved in the database.
                return Json(false, "text/html");
                ;
            }
            if (app.UploadGuid != null) {
                //if (db.AppDrafts.Any(n => n.PostedByUserID == userId)) {
                ViewTapping(ViewStates.SavingAppDraftBeforePost, app);
                var count = db.AppDrafts.Count(n => n.PostedByUserID == userId);

                if (count > AppVar.Setting.MaxDraftPostByUsers) {
                    // buffer limit over.
                    return null;
                }
                //}

                var appDraft = await db.AppDrafts.FirstOrDefaultAsync(n => n.UploadGuid == app.UploadGuid);
                AddingNeccessaryWhilePosting(app);
                if (appDraft == null) {
                    // create one
                    appDraft = GetDraft(app);
                    db.AppDrafts.Add(appDraft);
                } else {
                    // modify existing one
                    GetDraft(app, appDraft);
                    //db.Entry(appDraft).State = EntityState.Modified;
                }

                ViewTapping(ViewStates.SavingAppDraftBeforePost, app);
                await db.SaveChangesAsync();
                return Json(true, "text/html");
            }
            return Json(false, "text/html");
        }

        #endregion

        #region Draft Index

        public ActionResult Drafts() {
            var user = UserManager.GetCurrentUser();
            long userId = -1;
            if (user != null) {
                userId = user.UserID;
            }
            var apps = db.AppDrafts.Where(n => n.PostedByUserID == userId);
            ViewTapping(ViewStates.DraftsIndex);

            return View(apps.ToList());
        }

        #endregion

        #region Draft->App

        public ActionResult Draft(Guid id) {
            var userId = UserManager.GetLoggedUserId();
            var draft = db.AppDrafts.FirstOrDefault(n => n.UploadGuid == id & n.PostedByUserID == userId);
            if (draft != null) {
                var app = GetAppfromDraft(draft);

                ViewTapping(ViewStates.DraftsToApp, app);

                GetDropDowns(app);
                return View("Post", app);
            }
            return HttpNotFound();
        }

        #endregion

        #region Draft Delete

        public ActionResult DeleteDraft(Guid id) {
            RemoveTempUploadAndDraftFromRelatedApp(id);
            return RedirectToAction("Drafts");
        }

        #endregion

        #region Manage : Tags

        /// <summary>
        ///     Called specifically from Post save or edit save
        ///     not from AdditionNeccessaryFields
        /// </summary>
        /// <param name="appId"></param>
        /// <param name="uploadGuid"></param>
        /// <param name="tagString">Given tag list as comma separated value.</param>
        private void ManageTagsInDatabase(long appId, Guid uploadGuid, string tagString) {
            new Thread(() => {
                if (!string.IsNullOrWhiteSpace(tagString)) {
                    using (var db2 = new ReviewAppsEntities()) {
                        // remove any previous tag relation with this app.
                        // remove all previous tag relation-ship with this app.
                        db2.Database.ExecuteSqlCommand("DELETE FROM TagAppRelation WHERE AppID=@p0", appId);
                        var tagsList = tagString.Split(";,".ToCharArray());
                        foreach (var tag in tagsList) {
                            string tagDisplay = Logics.GetAllUpperCaseTitle(tag);
                            var tagFromDatabase = db2.Tags.FirstOrDefault(n => n.TagDisplay == tagDisplay);
                            if (tagFromDatabase == null) {
                                // creating tag
                                // if tag not exist in the database then create one.
                                tagFromDatabase = new Tag {
                                    TagDisplay = Logics.GetAllUpperCaseTitle(tagDisplay)
                                };
                                db2.Tags.Add(tagFromDatabase);
                            }

                            //db2.SaveChanges(); //remove this for testing if works

                            // add tag relation with this app
                            var newTagRel = new TagAppRelation();
                            //newTagRel.TagID = tagFromDatabase.TagID; // may not need to bind the tags id because it will be done by EF
                            newTagRel.AppID = appId;
                            tagFromDatabase.TagAppRelations.Add(newTagRel);
                            db2.SaveChanges();
                        }
                    }
                }
            }).Start();
        }

        #endregion

        #region Index

        public ActionResult Index() {
            var userId = UserManager.GetLoggedUserId();

            var apps = db.Apps.Include(a => a.Category).Include(a => a.Platform).Where(n => n.PostedByUserID == userId);
            var viewOf = ViewTapping(ViewStates.Index);
            return View(apps.ToList());
        }

        #endregion

        #region Details

        public ActionResult Details(long id) {
            if (id == null) {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var app = db.Apps.Find(id);
            if (app == null) {
                return HttpNotFound();
            }
            var viewOf = ViewTapping(ViewStates.Details, app);
            return View(app);
        }

        #endregion

        #region Removing output cache

        public void RemoveOutputCache(string url) {
            HttpResponse.RemoveOutputCacheItem(url);
        }

        #endregion

        #region Delete or remove record

        //public ActionResult Delete(long id) {

        //    var app = db.Apps.Find(id);
        //    bool viewOf = ViewTapping(ViewStates.Delete, app);
        //    return View(app);
        //}

        public ActionResult Delete(Guid id) {
            var app = db.Apps.FirstOrDefault(n => n.UploadGuid == id);
            if (app != null) {
                app.Tags = "Hello";
                var tagRelations = db.TagAppRelations.Where(n => n.AppID == app.AppID);
                foreach (var tagRelation in tagRelations) {
                    db.TagAppRelations.Remove(tagRelation);
                }
                SaveDatabase(ViewStates.Delete, app);
                var viewOf = ViewTapping(ViewStates.DeletePost, app);
                db.Apps.Remove(app);
                SaveDatabase(ViewStates.Delete, app);
            }
            return RedirectToAction("Index");
        }

        #endregion

        #region Enums

        internal enum ViewStates {
            DisplayApp,
            Index,
            Create,
            CreatePost,
            Edit,
            EditPost,
            Details,
            Delete,
            DeletePost,
            SavingAppDraftBeforePost,
            SavingAppDraftAfterPost,
            DraftsIndex,
            DraftsToApp
        }

        #endregion

        #region Developer Comments - Alim Ul karim

        // Generated by Alim Ul Karim on behalf of Developers Organism.
        // Find us developers-organism.com
        // https://www.facebook.com/DevelopersOrganism
        // mailto:alim@developers-organism.com		

        #endregion

        #region Constants

        private const string DeletedError =
            "Sorry for the inconvenience, last record is not removed. Please be in touch with admin.";

        private const string DeletedSaved = "Removed successfully.";
        private const string EditedSaved = "Modified successfully.";

        private const string EditedError =
            "Sorry for the inconvenience, transaction is failed to save into the database. Please be in touch with admin.";

        private const string CreatedError = "Sorry for the inconvenience, couldn't create the last transaction record.";
        private const string CreatedSaved = "Transaction is successfully added to the database.";
        private const string ControllerName = "App";

        /// Constant value for where the controller is actually visible.
        private const string ControllerVisibleUrl = "";

        #endregion

        #region App Saved Messages

        private string PostedSuccessFully(string title, bool published) {
            if (!published) {
                return "Your new app '" + title +
                       "' has been saved successfully but not published. You can also save a new one right away.";
            }
            return "Your new app '" + title +
                   "' has been successfully saved and published. You can also save a new one right away.";
        }

        private string EditSuccessFully(string title, bool published) {
            if (!published) {
                return "Your app '" + title + "' has been modified successfully but not published.";
            }
            return "Your app '" + title + "' has been successfully modified and published.";
        }

        private string EditFailed(string title) {
            return "Your app '" + title + "' has been failed to modify.";
        }

        private string PostedFailed(string title) {
            return "Your new app '" + title + "' has been failed to save.";
        }

        #endregion

        #region App Draft Related Methods

        /// <summary>
        ///     returns draft if it is related to current user.
        /// </summary>
        /// <param name="draftId"></param>
        /// <param name="appDraft">App draft</param>
        /// <returns></returns>
        private App GetAppfromDraft(AppDraft appDraft) {
            if (appDraft == null) {
                return null;
            }
            var rApp = new App();

            rApp.AppName = appDraft.AppName;
            rApp.CategoryID = appDraft.CategoryID;
            rApp.PlatformID = appDraft.PlatformID;
            rApp.PlatformVersion = (double) appDraft.PlatformVersion;
            rApp.Description = appDraft.Description;
            rApp.PostedByUserID = appDraft.PostedByUserID;
            rApp.IsVideoExist = appDraft.IsVideoExist == true;
            rApp.YoutubeEmbedLink = appDraft.YoutubeEmbedLink;
            rApp.WebsiteUrl = appDraft.WebsiteUrl;
            rApp.StoreUrl = appDraft.StoreUrl;
            rApp.IsBlocked = appDraft.IsBlocked == true;
            rApp.IsPublished = appDraft.IsPublished == true;
            rApp.UploadGuid = appDraft.UploadGuid;
            rApp.Url = appDraft.Url;
            if (appDraft.ReleaseDate.HasValue) {
                rApp.ReleaseDate = appDraft.ReleaseDate.Value;
            }
            return rApp;
        }

        private AppDraft GetDraft(App app, AppDraft appDraft = null) {
            if (appDraft == null) {
                appDraft = new AppDraft();
            }
            appDraft.AppName = app.AppName;
            appDraft.CategoryID = app.CategoryID;
            appDraft.PlatformID = app.PlatformID;
            appDraft.PlatformVersion = app.PlatformVersion;
            appDraft.Description = app.Description;
            appDraft.PostedByUserID = app.PostedByUserID;
            appDraft.IsVideoExist = app.IsVideoExist;
            appDraft.YoutubeEmbedLink = app.YoutubeEmbedLink;
            appDraft.WebsiteUrl = app.WebsiteUrl;
            appDraft.StoreUrl = app.StoreUrl;
            appDraft.IsBlocked = app.IsBlocked;
            appDraft.IsPublished = app.IsPublished;
            appDraft.UploadGuid = app.UploadGuid;
            appDraft.Url = app.Url;
            appDraft.ReleaseDate = app.ReleaseDate;
            return appDraft;
        }

        #endregion

        #region Manage Virtual Fields : In File (Idea, Tags, Developers..)

        #region Saving

        /// <summary>
        ///     Async saving into files as binary
        /// </summary>
        /// <param name="app"></param>
        private void SaveVirtualFields(App app) {
            _logics.SaveVirtualFields(app);
        }

        #endregion

        #region Read

        /// <summary>
        ///     Reading from binary
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        private bool ReadVirtualFields(App app) {
            return _logics.ReadVirtualFields(ref app);
        }

        #endregion

        #endregion

        #region Adding Necessary Fields to record

        private string FixScriptTag(string str) {
            if (!string.IsNullOrWhiteSpace(str)) {
                //|embed|object|frameset|frame|iframe|
                var regEx = @"</?(?i:script|meta|link|style)(.|\n|\s)*?>";
                return Regex.Replace(str, regEx, string.Empty, RegexOptions.Singleline | RegexOptions.IgnoreCase);
            }
            return str;
        }

        /// <summary>
        ///     Fix youtube link
        ///     add user
        ///     defaults
        ///     fix script tag
        ///     fix url friendly name
        ///     save virtual fields to text as async.
        ///     Don't manage tags ... it should be managed after saving to database.
        /// </summary>
        /// <param name="app"></param>
        private void AddingNeccessaryWhilePosting(App app) {
            app.ReviewsCount = 0;
            app.IsBlocked = false;
            app.TotalViewed = 0;
            app.WebsiteClicked = 0;
            app.StoreClicked = 0;
            app.CreatedDate = DateTime.Now;

            // Set userid, last mod, save virtual fields, fix iframe, URL
            AddNecessaryBothOnPostingNEditing(app);
        }

        /// <summary>
        ///     Set userid
        ///     save virtual fields
        ///     Last modified set
        ///     fix iframe
        ///     URL
        /// </summary>
        private void AddNecessaryWhenModified(App app) {
            // Set userid, last mod, save virtual fields, fix iframe, URL
            AddNecessaryBothOnPostingNEditing(app);
            _logics.RemoveSingleAppFromCacheOfStatic(app.AppID);
        }

        /// <summary>
        ///     Set userid
        ///     save virtual fields
        ///     Last modified set
        ///     fix iframe
        ///     URL
        /// </summary>
        /// <param name="app"></param>
        private void AddNecessaryBothOnPostingNEditing(App app) {
            app.Url = _logics.GenerateHyphenUrlStringValid(app.PlatformVersion, app.CategoryID, app.AppName,
                app.PlatformID, db,
                app.AppID);
            app.UrlWithoutEscapseSequence = _logics.GetUrlStringExceptEscapeSequence(app.Url);
            app.PostedByUserID = UserManager.GetLoggedUserId();
            SaveVirtualFields(app);
            app.LastModifiedDate = DateTime.Now;
            app.AbsUrl = null;
        }

        #endregion

        #region DropDowns Generate

        public void GetDropDowns(App app = null) {
            if (app != null) {
                ViewBag.CategoryID = new SelectList(db.Categories.ToList(), "CategoryID", "CategoryName", app.CategoryID);
                ViewBag.PlatformID = new SelectList(db.Platforms.ToList(), "PlatformID", "PlatformName", app.PlatformID);
            } else {
                ViewBag.CategoryID = new SelectList(db.Categories.ToList(), "CategoryID", "CategoryName");
                ViewBag.PlatformID = new SelectList(db.Platforms.ToList(), "PlatformID", "PlatformName");
            }
        }

        public void GetDropDowns(long id) {
            ViewBag.CategoryID = new SelectList(db.Categories.ToList(), "CategoryID", "CategoryName");
            ViewBag.PlatformID = new SelectList(db.Platforms.ToList(), "PlatformID", "PlatformName");
        }

        #endregion

        #region Remove Temporary and Draft from database when posting an app

        public void RemoveDraftRelatedtoApp(Guid uploadGuid) {
            new Thread(() => {
                using (var db2 = new ReviewAppsEntities()) {
                    db2.Database.ExecuteSqlCommand("DELETE FROM AppDraft WHERE UploadGuid = @p0", uploadGuid);
                }
            }).Start();
        }

        public void RemoveTempUploadRelatedtoApp(Guid uploadGuid) {
            new Thread(() => {
                using (var db2 = new ReviewAppsEntities()) {
                    db2.Database.ExecuteSqlCommand("DELETE FROM TempUpload WHERE RelatingUploadGuidForDelete = @p0",
                        uploadGuid);
                }
            }).Start();
        }

        public void RemoveTempUploadAndDraftFromRelatedApp(Guid uploadGuid) {
            //new Thread(() => {
            //    using (var db2 = new ReviewAppsEntities()) {
            db.Database.ExecuteSqlCommand("DELETE FROM AppDraft WHERE UploadGuid = @p0", uploadGuid);
            db.Database.ExecuteSqlCommand("DELETE FROM TempUpload WHERE RelatingUploadGuidForDelete = @p0", uploadGuid);
            //    }
            //}).Start();
        }

        #endregion

        #region Post new app

        [OutputCache(Location = OutputCacheLocation.None, NoStore = true)]
        public ActionResult Post() {
            GetDropDowns();
            var app = new App {
                UploadGuid = Guid.NewGuid(),
                ReleaseDate = DateTime.Now
            };
            var viewOf = ViewTapping(ViewStates.Create);
            return View(app);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [OutputCache(Location = OutputCacheLocation.None, NoStore = true)]
        public async Task<ActionResult> Post(App app) {
            var viewOf = ViewTapping(ViewStates.CreatePost, app);
            var currentApp = db.Apps.FirstOrDefault(n => n.UploadGuid == app.UploadGuid);
            GetDropDowns(app);
            if (currentApp != null) {
                // already saved.. 
                // then don't save it anymore.
                app.UploadGuid = Guid.NewGuid(); // new post can be made
                ModelState.Clear();
                return View(app);
            }

            AddingNeccessaryWhilePosting(app);
            if (ModelState.IsValid) {
                db.Apps.Add(app);
                var state = SaveDatabase(ViewStates.Create, app);
                if (state) {
                    ManageTagsInDatabase(app.AppID, app.UploadGuid, app.Tags);
                    RemoveTempUploadAndDraftFromRelatedApp(app.UploadGuid);
                    AppVar.SetSavedStatus(ViewBag, PostedSuccessFully(app.AppName, app.IsPublished));
                    // Saved Successfully.
                    app.UploadGuid = Guid.NewGuid(); // new post can be made
                    //app.AppName = app.AppName + " 2";
                    var userEmail = User.GetUser().Email;
                    var title = "'" + app.AppName + "' is created successfully. ";
                    var body = "'" + app.AppName + "' is created successfully. Available at : " + app.GetAbsoluteUrl()  + " <br> <br> Your app will be on home after 1 day. <br> Thank you.";
                    if (!app.IsPublished) {
                        title = "[Unpublished] " + title;
                        body = "Your app is created successfully. However still not published. Please check the policies when you post the app or edit the app.";
                    }
                    AppVar.Mailer.Send(userEmail, title, body);
                    ModelState.Clear();
                    return View(app);
                }
            }
            // if you are here that means you have done the uploads
            // no need to give upload options anymore.
            ViewBag.UploadDontNeed = true;
            var errorMessage = PostedFailed(app.AppName);
            AppVar.SetErrorStatus(ViewBag, errorMessage); // Failed to Save
           // ModelState.FirstOrDefault().Value.Errors.
            AppVar.Mailer.NotifyDeveloper(errorMessage, "Following error : ", entityObject: app, modelStateDictionary: ModelState);
            return View(app);
        }

        #endregion

        #region Uploading files

        /// <summary>
        ///     starts with 1, get optimized sequence number.
        ///     Keep next sequence in session.
        /// </summary>
        /// <param name="uploadGuid"></param>
        /// <returns>Returns next sequence number. No need to do ++</returns>
        private byte GetSequenceNumber(Guid uploadGuid) {
            if (uploadGuid == null) {
                return 0;
            }
            var sessionCount = Session[uploadGuid.ToString()];
            Session[uploadGuid + "-staticCount"] = null;
            if (sessionCount != null) {
                var b = byte.Parse(sessionCount.ToString());
                Session[uploadGuid.ToString()] = b + 1;
                return b;
            }
            //try to get from the database.
            var max = 0;
            if (
                db.Galleries.Any(
                    n => n.UploadGuid == uploadGuid && n.GalleryCategoryID == GalleryCategoryIDs.AppPageGallery)) {
                max =
                    db.Galleries.Where(
                        n => n.UploadGuid == uploadGuid && n.GalleryCategoryID == GalleryCategoryIDs.AppPageGallery)
                      .Max(n => n.Sequence);
            }

            max += 2;
            Session[uploadGuid.ToString()] = max;
            max -= 1;
            return (byte) max;
        }

        private int GetHowManyGalleryImageExist(Guid uploadGuid) {
            if (uploadGuid == null) {
                return 0;
            }
            var sessionName = uploadGuid + "-count";
            Session[uploadGuid + "-staticCount"] = null;
            var sessionCount = Session[sessionName];
            if (sessionCount != null) {
                var b = byte.Parse(sessionCount.ToString());
                Session[sessionName] = b + 1;
                return b;
            }
            //try to get from the database.
            var max = 0;

            max =
                db.Galleries.Count(
                    n => n.UploadGuid == uploadGuid && n.GalleryCategoryID == GalleryCategoryIDs.AppPageGallery);

            max += 2;
            Session[sessionName] = max;
            max -= 1;
            return max;
        }

        private void ResetSessionForUploadSequence(Guid uploadGuid) {
            var id = uploadGuid.ToString();
            var keysArr = new[] { id, id + "-count", id + "-staticCount" };
            SessionNames.RemoveKeys(keysArr);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [OutputCache(Location = OutputCacheLocation.None, NoStore = true)]
        public async Task<JsonResult> UploadGallery(App app, IEnumerable<HttpPostedFileBase> galleries) {
            if (galleries != null && app.UploadGuid != null) {
                //look for cache if sequence exist before
                var nextSequence = GetSequenceNumber(app.UploadGuid);
                var nextCount = GetHowManyGalleryImageExist(app.UploadGuid);

                if (nextCount > AppVar.Setting.GalleryMaxPictures) {
                    ResetSessionForUploadSequence(app.UploadGuid);
                    return Json(new { isUploaded = false, uploadedFiles = 0, message = "You are out of your limit." },
                        "text/html");
                }
                var fileName = app.UploadGuid.ToString();
                var firstTime = true;
                var countDone = 0;
                foreach (var file in galleries) {
                    if (file.ContentLength > 0) {
                        // first save gallery and temp record.

                        if (!firstTime) {
                            nextSequence = GetSequenceNumber(app.UploadGuid);
                            nextCount = GetHowManyGalleryImageExist(app.UploadGuid);
                            if (nextCount > AppVar.Setting.GalleryMaxPictures) {
                                ResetSessionForUploadSequence(app.UploadGuid);
                                return
                                    Json(
                                        new {
                                            isUploaded = true,
                                            uploadedFiles = countDone,
                                            message = "You are out of your limit."
                                        }, "text/html");
                            }
                        } else {
                            firstTime = false;
                        }

                        //upload app-details page gallery image
                        Statics.UProcessorGallery.UploadFile(file, fileName, nextSequence, true, true);

                        //successfully uploaded now save a gallery info
                        var galleryCategory = await db.GalleryCategories.FindAsync(GalleryCategoryIDs.AppPageGallery);
                        //var thumbsCategory = await db.GalleryCategories.FindAsync(GalleryCategoryIDs.GalleryIcon);
                        var gallery =
                            await
                                db.Galleries.FirstOrDefaultAsync(
                                    n =>
                                        n.UploadGuid == app.UploadGuid &&
                                        n.GalleryCategoryID == galleryCategory.GalleryCategoryID &&
                                        n.Sequence == nextSequence);

                        // saving in the database
                        if (gallery == null) {
                            // we didn't get the error
                            // image sequence and guid is correct.
                            gallery = new Gallery();
                            gallery.GalleryID = Guid.NewGuid();
                            gallery.UploadGuid = app.UploadGuid;
                            if (!string.IsNullOrEmpty(app.AppName)) {
                                gallery.Title = app.AppName + "-" + nextSequence;
                            }
                            gallery.Extension = UploadProcessor.GetExtension(file);
                            gallery.GalleryCategoryID = galleryCategory.GalleryCategoryID;
                            gallery.Sequence = nextSequence;
                            db.Galleries.Add(gallery);
                            // try to add a temp record as well.
                            var tempUpload = new TempUpload();
                            tempUpload.TempUploadID = Guid.NewGuid();
                            tempUpload.UserID = UserManager.GetLoggedUserId();
                            tempUpload.GalleryID = gallery.GalleryID;
                            tempUpload.RelatingUploadGuidForDelete = app.UploadGuid;
                            db.TempUploads.Add(tempUpload);
                            await db.SaveChangesAsync();
                        }

                        // resize
                        //new Thread(() => {

                        // resize app-details page gallery image

                        Statics.UProcessorGallery.ResizeImageAndProcessImage(gallery, galleryCategory);
                        //var source = "~/Uploads/Images/" + Variables.ADDITIONAL_ROOT_GALLERY_LOCATION +
                        //             UploadProcessor.GetOrganizeNameStatic(gallery, true, true);
                        //var target = "~/Uploads/Images/" + Variables.ADDITIONAL_ROOT_GALLERY_ICON_LOCATION +
                        //             UploadProcessor.GetOrganizeNameStatic(gallery, true);

                        // #apps detail page gallery thumbs generate
                        //Statics.uProcessorGallery.ResizeImageAndProcessImage(source, target, thumbsCategory.Width,
                        //    thumbsCategory.Height, gallery.Extension);

                        var source = "~/Uploads/Images/" + Variables.AdditionalRootGalleryLocation +
                                     UploadProcessor.GetOrganizeNameStatic(gallery, true, true);
                        //removing temp image what was exact uploaded after resizing it.
                        if (FileSys.Exists(Statics.UProcessorGallery.VirtualPathtoAbsoluteServerPath(source))) {
                            // if processed image exist then remove  the temp.
                            Statics.UProcessorGallery.RemoveTempImage(gallery);
                        }
                        countDone++;
                        //}).Start();
                    }
                }
                var countUploaded = galleries.Count();
                return
                    Json(
                        new {
                            isUploaded = true,
                            uploadedFiles = countUploaded,
                            message = "+" + countUploaded + " files successfully done."
                        }, "text/html");
            }
            return Json(new { isUploaded = false, uploadedFiles = 0, message = "No file send." }, "text/html");
        }

        #region Process Similar Uploads

        public JsonResult ProcessSingleUploads(App app, HttpPostedFileBase file, int galleryId,
            UploadProcessor uploadProcessorSepecific) {
            if (file != null && app.UploadGuid != null) {
                //look for cache if sequence exist before
                var fileName = app.UploadGuid.ToString();
                if (file.ContentLength > 0) {
                    // first save gallery and temp record.
                    //upload the image
                    uploadProcessorSepecific.UploadFile(file, fileName, 0, true, true);
                    //successfully uploaded now save a gallery info
                    var galleryCategory = db.GalleryCategories.Find(galleryId);
                    var gallery =
                        db.Galleries.FirstOrDefault(
                            n =>
                                n.UploadGuid == app.UploadGuid &&
                                n.GalleryCategoryID == galleryCategory.GalleryCategoryID);
                    if (gallery == null) {
                        gallery = new Gallery();
                        gallery.GalleryID = Guid.NewGuid();
                        gallery.UploadGuid = app.UploadGuid;
                        gallery.Title = app.AppName;
                        gallery.Extension = UploadProcessor.GetExtension(file);
                        gallery.GalleryCategoryID = galleryCategory.GalleryCategoryID;
                        gallery.Sequence = 0;
                        db.Galleries.Add(gallery);
                        // try to add a temp record as well.
                        var tempUpload = new TempUpload();
                        tempUpload.TempUploadID = Guid.NewGuid();
                        tempUpload.UserID = UserManager.GetLoggedUserId();
                        tempUpload.GalleryID = gallery.GalleryID;
                        tempUpload.RelatingUploadGuidForDelete = app.UploadGuid;
                        db.TempUploads.Add(tempUpload);
                        db.SaveChanges();
                    }
                    // resize
                    //new Thread(() => {

                    uploadProcessorSepecific.ResizeImageAndProcessImage(gallery, galleryCategory);
                    uploadProcessorSepecific.RemoveTempImage(gallery);
                    //}).Start();
                }
                return Json(new { isUploaded = true, message = "successfully done" }, "text/html");
            }
            return Json(new { isUploaded = false, message = "No file send." }, "text/html");
        }

        #endregion

        #region Home Featured Upload

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult UploadHomeFeatured(App app, HttpPostedFileBase homePageFeatured) {
            return ProcessSingleUploads(app, homePageFeatured, GalleryCategoryIDs.HomePageFeatured,
                Statics.UProcessorHomeFeatured);
        }

        #endregion

        #region Home Page Icon Upload

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult UploadHomePageIcon(App app, HttpPostedFileBase homePageIcon) {
            return ProcessSingleUploads(app, homePageIcon, GalleryCategoryIDs.HomePageIcon,
                Statics.UProcessorHomeIcons);
        }

        #endregion

        #region Search Icon Upload

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult UploadSearchIcon(App app, HttpPostedFileBase searchIcon) {
            return ProcessSingleUploads(app, searchIcon, GalleryCategoryIDs.SearchIcon,
                Statics.UProcessorSearchIcons);
        }

        #endregion

        #region Suggestion Icon Upload

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult UploadSuggestionIcon(App app, HttpPostedFileBase suggestionIcon) {
            return ProcessSingleUploads(app, suggestionIcon, GalleryCategoryIDs.SuggestionIcon,
                Statics.UProcessorSuggestionIcons);
        }

        #endregion

        #region Youtube Cover Upload

        [HttpPost]
        [ValidateAntiForgeryToken]
        public JsonResult YoutubeCoverUpload(App app, HttpPostedFileBase YoutubeCoverImage) {
            return ProcessSingleUploads(app, YoutubeCoverImage, GalleryCategoryIDs.YoutubeCoverImage,
                Statics.UProcessorYoutubeCover);
        }

        #endregion

        #endregion

        #region Edit or modify record

        public ActionResult Edit(long id) {
            var app = _logics.GetEditingApp(id, db);

            if (app == null) {
                return HttpNotFound();
            }
            var viewOf = ViewTapping(ViewStates.Edit, app);

            GetDropDowns(app); // Generating drop downs
            ReadVirtualFields(app);
            return View(app);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(App app) {
            var viewOf = ViewTapping(ViewStates.EditPost, app);
            var oldApp = _logics.GetEditingApp(app.AppID, db);
            app.CreatedDate = oldApp.CreatedDate;
            app.Url = oldApp.Url;

            if (ModelState.IsValid) {
                AddNecessaryWhenModified(app);
                db.Entry(app).State = EntityState.Modified;
                var state = SaveDatabase(ViewStates.Edit, app);
                if (state) {
                    ManageTagsInDatabase(app.AppID, app.UploadGuid, app.Tags);
                    _logics.RemoveCachingApp(app.AppID);
                    AppVar.SetSavedStatus(ViewBag, EditSuccessFully(app.AppName, app.IsPublished));
                    // Saved Successfully.
                    return Redirect(app.GetAbsoluteUrl());
                }
            }

            GetDropDowns(app);
            AppVar.SetErrorStatus(ViewBag, EditedError); // Failed to save
            return View(app);
        }

        #endregion
    }
}