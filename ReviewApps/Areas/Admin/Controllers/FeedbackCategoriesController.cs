﻿using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web.Mvc;
using System.Web.UI;
using ReviewApps.Controllers;
using ReviewApps.Models.POCO.IdentityCustomization;

namespace ReviewApps.Areas.Admin.Controllers {
    [OutputCache(NoStore = true, Location = OutputCacheLocation.None)]
    public class FeedbackCategoriesController : BasicController {
        // Generated by Alim Ul Karim on behalf of Developers Organism.
        // Find us developers-organism.com
        // https://www.facebook.com/DevelopersOrganism
        // mailto:info@developers-organism.com

        public FeedbackCategoriesController()
            : base(true) {}

        public void GetDropDowns() {}

        public ActionResult Index() {
            return View(db.FeedbackCategories.ToList());
        }

        public ActionResult Details(byte id) {
            if (id == null) {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var feedbackCategory = db.FeedbackCategories.Find(id);
            if (feedbackCategory == null) {
                return HttpNotFound();
            }
            return View(feedbackCategory);
        }

        public ActionResult Create() {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(FeedbackCategory feedbackCategory) {
            GetDropDowns();
            if (ModelState.IsValid) {
                db.FeedbackCategories.Add(feedbackCategory);
                db.SaveChanges();
                AppVar.SetSavedStatus(ViewBag);
                return View(feedbackCategory);
            }

            AppVar.SetErrorStatus(ViewBag);
            return View(feedbackCategory);
        }

        public ActionResult Edit(byte id) {
            if (id == null) {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            var feedbackCategory = db.FeedbackCategories.Find(id);
            if (feedbackCategory == null) {
                return HttpNotFound();
            }
            GetDropDowns();
            return View(feedbackCategory);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(FeedbackCategory feedbackCategory) {
            GetDropDowns();
            if (ModelState.IsValid) {
                db.Entry(feedbackCategory).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            AppVar.SetErrorStatus(ViewBag);
            return View(feedbackCategory);
        }

        public ActionResult Delete(byte id) {
            var feedbackCategory = db.FeedbackCategories.Find(id);
            db.FeedbackCategories.Remove(feedbackCategory);
            db.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}