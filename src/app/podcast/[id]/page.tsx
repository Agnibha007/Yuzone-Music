import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveSiteUrl } from "@/lib/site-url";
import PodcastPageClient from "./PodcastPageClient";

interface PodcastPageProps {
    params: Promise<{ id: string }>;
}

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PodcastPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const id = typeof resolvedParams?.id === "string" ? resolvedParams.id.trim() : "";
    const requestHeaders = await headers();
    const requestOrigin = requestHeaders.get("origin") ?? (() => {
        const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
        const proto = requestHeaders.get("x-forwarded-proto") ?? "https";
        return host ? `${proto}://${host}` : null;
    })();
    const siteUrl = resolveSiteUrl(requestOrigin);
    
    if (!id) {
        return {
            title: "Podcast not found | Yuzone Music",
            robots: { index: false, follow: false },
        };
    }

    // Parse feedId and episodeId from the id parameter
    const parts = id.split("-");
    if (parts.length < 2) {
        return {
            title: "Podcast Episode | Yuzone Music",
            description: "Listen to podcasts on Yuzone Music.",
            alternates: { canonical: new URL(`/podcast/${id}`, siteUrl).toString() },
            robots: { index: false, follow: false },
        };
    }

    const podcastUrl = new URL(`/podcast/${id}`, siteUrl).toString();
    const title = "Podcast Episode | Yuzone Music";
    const description = "Listen to this podcast episode on Yuzone Music.";

    return {
        title,
        description,
        alternates: { canonical: podcastUrl },
        openGraph: {
            title,
            description,
            url: podcastUrl,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export default async function PodcastPage({ params }: PodcastPageProps) {
    const resolvedParams = await params;
    const id = typeof resolvedParams?.id === "string" ? resolvedParams.id.trim() : "";
    const siteUrl = resolveSiteUrl();

    // Parse feedId and episodeId from the id parameter (format: feedId-episodeId)
    const parts = id.split("-");
    const feedId = parts.length >= 2 ? parts[0] : "";
    const episodeId = parts.length >= 2 ? parts.slice(1).join("-") : "";

    const podcastUrl = new URL(`/podcast/${id}`, siteUrl).toString();
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "PodcastEpisode",
        url: podcastUrl,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PodcastPageClient id={id} feedId={feedId} episodeId={episodeId} />
        </>
    );
}
