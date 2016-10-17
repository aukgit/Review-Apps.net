﻿#region using block

using DevMvcComponent.Error;
using ReviewApps.Models.Context;
using ReviewApps.Models.EntityModel;

#endregion

namespace ReviewApps.BusinessLogics.Component {
    public class BaseLogicComponent<TContext> where TContext : class, new() {
        #region Propertise

        private readonly bool _identityDbInitialize;
        private readonly bool _initializeErrorCollector;
        private readonly bool _weReviewDbInitialize;
        protected TContext db;
        internal ErrorCollector ErrorCollector;
        protected ApplicationDbContext IdentityDb { get; set; }
        protected ReviewAppsEntities WeReviewDb { get; set; }

        #endregion

        #region Constructors

        protected BaseLogicComponent() : this(false) {}
        protected BaseLogicComponent(bool initializeErrorCollector) : this(null, null, initializeErrorCollector) {}

        protected BaseLogicComponent(ReviewAppsEntities weReviewDb,
            bool initializeErrorCollector)
            : this(null, weReviewDb, initializeErrorCollector) {}

        protected BaseLogicComponent(ApplicationDbContext identityDb,
            bool initializeErrorCollector)
            : this(identityDb, null, initializeErrorCollector) {}

        protected BaseLogicComponent(ApplicationDbContext identityDb)
            : this(identityDb, null, false) {}

        protected BaseLogicComponent(bool identityDbInitialize, bool weReviewDbInitialize, bool logicInitialize,
            bool initializeErrorCollector) {}

        protected BaseLogicComponent(bool identityDbInitialize, bool weReviewDbInitialize,
            bool initializeErrorCollector) {
            _identityDbInitialize = identityDbInitialize;
            _weReviewDbInitialize = weReviewDbInitialize;
            _initializeErrorCollector = initializeErrorCollector;

            if (_identityDbInitialize) {
                IdentityDb = new ApplicationDbContext();
            }

            if (_weReviewDbInitialize) {
                WeReviewDb = new ReviewAppsEntities();
            }
            if (_initializeErrorCollector) {
                ErrorCollector = new ErrorCollector();
            }
        }

        protected BaseLogicComponent(ApplicationDbContext identityDb, ReviewAppsEntities weReviewDb,
            bool initializeErrorCollector) {
            _initializeErrorCollector = initializeErrorCollector;

            if (identityDb != null) {
                IdentityDb = identityDb;
            }

            if (weReviewDb != null) {
                WeReviewDb = weReviewDb;
            }

            var dbType = typeof(TContext);
            if (dbType == typeof(ReviewAppsEntities)) {
                db = weReviewDb as TContext;
            } else if (dbType == typeof(ApplicationDbContext)) {
                db = identityDb as TContext;
            }

            if (_initializeErrorCollector) {
                ErrorCollector = new ErrorCollector();
            }
        }

        #endregion
    }
}