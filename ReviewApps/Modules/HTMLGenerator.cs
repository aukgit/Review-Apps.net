﻿using System.Web.Mvc;

namespace ReviewApps.Modules {
    public static class HtmlGenerator {
        public static MvcHtmlString GetHidden(this Controller ctn, string name, string value = null) {
            return new MvcHtmlString(string.Format("<input type='hidden' name='{0}' id='{0}' value='{1}'", name, value));
        }
    }
}