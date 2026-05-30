import type { MetadataRoute } from "next";
import { getPrimarySiteUrl } from "@/lib/site-url";

const siteUrl = getPrimarySiteUrl();

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
