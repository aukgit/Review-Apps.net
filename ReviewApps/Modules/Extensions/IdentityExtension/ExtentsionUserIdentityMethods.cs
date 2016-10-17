﻿using System;
using System.Security.Principal;
using System.Web;
using Microsoft.AspNet.Identity;
using ReviewApps.Models.POCO.Identity;
using ReviewApps.Modules.DevUser;
using ReviewApps.Modules.Session;

namespace ReviewApps.Modules.Extensions.IdentityExtension {
    public static class ExtentsionUserIdentityMethods {
        public static long GetUserID(this IIdentity identity) {
            return long.Parse(identity.GetUserId());
        }

        /// <summary>
        ///     Get logged Application user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static ApplicationUser GetUser(this IPrincipal user) {
            if (user.Identity.IsAuthenticated) {
                return UserManager.GetCurrentUser();
            }
            return null;
        }

        /// <summary>
        ///     Get logged Application user's full name.
        ///     If no user is logged in then empty quoted string will be send.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="defaultFullName">Send a name when user is not logged in or there is no user object.</param>
        /// <returns>Returns logged Application user's full name. </returns>
        public static string GetUserFullName(this IPrincipal user, string defaultFullName = "") {
            var returnName = defaultFullName;
            var appUser = GetUser(user);
            if (appUser != null) {
                returnName = appUser.DisplayName;
            }
            return returnName;
        }

        /// <summary>
        ///     Get Application user by UserId.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public static ApplicationUser GetUser(this IPrincipal user, long userId) {
            return UserManager.GetUser(userId);
        }

        /// <summary>
        ///     Get Application user by UserId.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="username"></param>
        /// <returns></returns>
        public static ApplicationUser GetUser(this IPrincipal user, string username) {
            return UserManager.GetUser(username);
        }

        /// <summary>
        ///     Get Application user by UserId.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="email"></param>
        /// <returns></returns>
        public static ApplicationUser GetUserbyEmail(this IPrincipal user, string email) {
            return UserManager.GetUserByEmail(email);
        }

        /// <summary>
        ///     Is current logged user's registration is complete.
        ///     If none logged in then returns false.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static bool IsRegistrationComplete(this IPrincipal user) {
            var userObject = UserManager.GetCurrentUser();
            if (userObject != null) {
                return userObject.IsRegistrationComplete;
            }
            return false;
        }

        /// <summary>
        ///     Returns -1 when user is not authenticated.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static long GetUserID(this IPrincipal user) {
            var userObject = GetUser(user);
            if (userObject != null) {
                return userObject.UserID;
            }
            return -1;
        }

        /// <summary>
        ///     Returns a cache if user is authenticated or else null.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static UserCache GetNewOrExistingUserCache(this IPrincipal user) {
            if (user.Identity.IsAuthenticated) {
                return UserCache.GetNewOrExistingUserCache();
            }
            return null;
        }

        /// <summary>
        ///     Returns a cache from session if exist or else returns null.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static UserCache GetCacheFromSession(this IPrincipal user) {
            return UserCache.GetUserCacheSession();
        }

        /// <summary>
        ///     Returns true if session user cache exist in the system.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public static bool IsUserCacheExistInSession(this IPrincipal user) {
            return UserCache.GetUserCacheSession() != null;
        }

        /// <summary>
        ///     Returns true if session user cache exist in the system.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="username"></param>
        /// <returns></returns>
        public static bool IsUserCacheExistInSessionAndValid(this IPrincipal user, string username) {
            var userCache = UserCache.GetUserCacheSession();
            return userCache.IsValidUserCache(username);
        }

        /// <summary>
        ///     Returns true if session user cache exist in the system.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public static bool IsUserCacheExistInSessionAndValid(this IPrincipal user, long userId) {
            var userCache = UserCache.GetUserCacheSession();
            return userCache.IsValidUserCache(userId);
        }

        /// <summary>
        ///     Returns true if session user cache exist in the system.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="userCache"></param>
        /// <returns></returns>
        public static bool IsUserCacheExistInSession(this IPrincipal user, out UserCache userCache) {
            userCache = UserCache.GetUserCacheSession();
            return userCache != null;
        }

        public static void SaveUserInSession(this IPrincipal user, ApplicationUser appUser,
            string sessionName = SessionNames.UserPrincipalUserSession) {
            HttpContext.Current.Session[sessionName] = appUser;
        }

        public static ApplicationUser GetUserFromSession(this IPrincipal user,
            string sessionName = SessionNames.UserPrincipalUserSession) {
            return HttpContext.Current.Session[sessionName] as ApplicationUser;
        }

        public static bool IsAnyUserExistInSession(this IPrincipal user,
            string sessionName = SessionNames.UserPrincipalUserSession) {
            return GetUserFromSession(user, sessionName) != null;
        }

        public static bool IsUserExistInSessionByEmail(this IPrincipal user, string email,
            string sessionName = SessionNames.UserPrincipalUserSession) {
            ApplicationUser appUser;
            return IsUserExistInSessionByEmail(user, email, out appUser, sessionName);
        }
        /// <summary>
        /// Is User exist in the session name given.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="email"></param>
        /// <param name="appUser"></param>
        /// <param name="sessionName"></param>
        /// <returns></returns>
        public static bool IsUserExistInSessionByEmail(this IPrincipal user, string email, out ApplicationUser appUser,
            string sessionName = SessionNames.UserPrincipalUserSession) {
            appUser = GetUserFromSession(user, sessionName);
            if (!string.IsNullOrEmpty(email) && appUser != null) {
                return string.Compare(appUser.Email, email, StringComparison.OrdinalIgnoreCase) == 0;
            }
            return false;
        }
        /// <summary>
        /// Is User exist in the session name given.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="userName"></param>
        /// <param name="sessionName"></param>
        /// <returns></returns>
        public static bool IsUserExistInSession(this IPrincipal user, string userName,
            string sessionName = SessionNames.UserPrincipalUserSession) {
            ApplicationUser appUser;
            return IsUserExistInSession(user, userName, out appUser, sessionName);
        }

        /// <summary>
        ///     if the user exist in the current given named session.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="userName"></param>
        /// <param name="appUser"></param>
        /// <param name="sessionName"></param>
        /// <returns></returns>
        public static bool IsUserExistInSession(this IPrincipal user, string userName, out ApplicationUser appUser,
            string sessionName = SessionNames.UserPrincipalUserSession) {
            appUser = GetUserFromSession(user, sessionName);
            if (!string.IsNullOrEmpty(userName) && appUser != null) {
                return appUser.UserName.Equals(userName, StringComparison.OrdinalIgnoreCase);
            }
            return false;
        }
    }
}