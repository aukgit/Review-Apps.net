﻿#region using block

using System.Web.Mvc;
using DevMvcComponent.Error;
using ReviewApps.Models.Context;

#endregion

namespace ReviewApps.Controllers {
    //[CompressFilter(Order = 1)]

    public abstract class BasicController : Controller {
        internal readonly ApplicationDbContext db;
        internal ErrorCollector ErrorCollector;

        protected BasicController() {}

        protected BasicController(bool applicationDbContextRequried) {
            if (applicationDbContextRequried) {
                db = new ApplicationDbContext();
            }
        }

        protected BasicController(bool applicationDbContextRequried, bool errorCollectorRequried) {
            if (errorCollectorRequried) {
                ErrorCollector = new ErrorCollector();
            }
            if (applicationDbContextRequried) {
                db = new ApplicationDbContext();
            }
        }

        protected override void Dispose(bool disposing) {
            if (db != null) {
                db.Dispose();
            }
            if (ErrorCollector != null) {
                ErrorCollector.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}