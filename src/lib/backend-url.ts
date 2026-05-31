const DEFAULT_BACKEND_API_URL = "https://yuzone-api.onrender.com";

function normalizeBackendUrl(value: string) {
    return value.trim().replace(/\/+$/, "");
}

export function getBackendApiUrl() {
    const configuredUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL;

    if (configuredUrl) {
        return normalizeBackendUrl(configuredUrl);
    }

    return DEFAULT_BACKEND_API_URL;
}