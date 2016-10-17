﻿using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Xml.Linq;

namespace ReviewApps.Modules.Sitemaps {
    /// <summary>
    ///     Generating sitemaps as http://www.sitemaps.org/protocol.html
    /// </summary>
    public class SitemapGenerator : ISitemapGenerator {
        private static readonly XNamespace Xmlns = "http://www.sitemaps.org/schemas/sitemap/0.9";
        private static readonly XNamespace Xsi = "http://www.w3.org/2001/XMLSchema-instance";

        public virtual XDocument GenerateSiteMap(IEnumerable<ISitemapItem> items) {
            var sitemap = new XDocument(new XDeclaration("1.0", "utf-8", "yes"),
                new XElement(Xmlns + "urlset", new XAttribute("xmlns", Xmlns),
                    new XAttribute(XNamespace.Xmlns + "xsi", Xsi),
                    new XAttribute(Xsi + "schemaLocation", "http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"),
                    from item in items select CreateItemElement(item)));

            return sitemap;
        }

        private XElement CreateItemElement(ISitemapItem item) {
            var itemElement = new XElement(Xmlns + "url", new XElement(Xmlns + "loc", item.Url));

            // all other elements are optional

            if (item.LastModified.HasValue) {
                itemElement.Add(new XElement(Xmlns + "lastmod", item.LastModified.Value.ToString("yyyy-MM-dd")));
            }

            if (item.ChangeFrequency.HasValue) {
                itemElement.Add(new XElement(Xmlns + "changefreq", item.ChangeFrequency.Value));
            }

            if (item.Priority.HasValue) {
                itemElement.Add(new XElement(Xmlns + "priority",
                    item.Priority.Value.ToString("F1", CultureInfo.InvariantCulture)));
            }

            return itemElement;
        }
    }
}