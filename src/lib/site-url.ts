const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string) {
    return value.trim().replace(/\/+$/, "");
}

function parseSiteUrlList(rawValue: string | undefined) {
    if (!rawValue) {
        return [];
    }

    const urls = rawValue
        .split(/[\n,]/)
        .map((value) => normalizeSiteUrl(value))
        .filter((value) => value.length > 0);

    return [...new Set(urls)];
}

function getConfiguredSiteUrls() {
    const envCandidates = [
        process.env.NEXT_PUBLIC_SITE_URLS,
        process.env.NEXT_PUBLIC_SITE_URL,
        process.env.NEXTAUTH_URLS,
        process.env.NEXTAUTH_URL,
    ];

    for (const candidate of envCandidates) {
        const parsed = parseSiteUrlList(candidate);
        if (parsed.length > 0) {
            return parsed;
        }
    }

    return [DEFAULT_SITE_URL];
}

export function getPrimarySiteUrl() {
    return getConfiguredSiteUrls()[0] ?? DEFAULT_SITE_URL;
}

export function resolveSiteUrl(preferredOrigin?: string | null) {
    const configuredUrls = getConfiguredSiteUrls();
    const preferredUrl = preferredOrigin ? normalizeSiteUrl(preferredOrigin) : "";

    if (preferredUrl && configuredUrls.includes(preferredUrl)) {
        return preferredUrl;
    }

    if (preferredUrl) {
        return preferredUrl;
    }

    return configuredUrls[0] ?? DEFAULT_SITE_URL;
}

export function getRuntimeSiteUrl() {
    if (typeof window !== "undefined" && window.location?.origin) {
        return normalizeSiteUrl(window.location.origin);
    }

    return getPrimarySiteUrl();
}