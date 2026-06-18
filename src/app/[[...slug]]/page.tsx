import LiveTvClient from "@/components/live-tv/LiveTvClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://live.nextqora.com";

// Server-Side Data Fetching (SSR/ISR)
async function getChannels(slug?: string | null) {

  const fifaUrl =
    "https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/fifa.json";

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://server.nextqora.com/api/v1";
  const apiDbUrl = `${baseUrl}/stream/all?limit=150`;

  let fetchedChannels: any[] = [];
  let fifaChannels: any[] = [];

  // 1. Fetch FIFA channels (always merge)
  try {
    const fifaRes = await fetch(fifaUrl, {
      next: { revalidate: 300 }, // Cache FIFA channels for 5 minutes
    });
    if (fifaRes.ok) {
      const data = await fifaRes.json();
      fifaChannels = Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error("Failed to fetch FIFA playlist:", err);
  }

  // 2. Try to load from API Database first
  try {
    const res = await fetch(apiDbUrl, {
      next: { revalidate: 600 }, // Cache API for 10 minutes
    });
    if (!res.ok) throw new Error("Failed to fetch API database channels");
    const json = await res.json();
    const data = json?.data || [];
    if (Array.isArray(data) && data.length > 0) {
      fetchedChannels = data;
    } else {
      throw new Error("API database returned empty or invalid data");
    }
  } catch (apiError) {
    console.error(
      "Failed to fetch channels from API database:",
      apiError,
    );
    fetchedChannels = [];
  }

  // 3. Merge FIFA channels at the beginning, filtering out duplicates
  if (fifaChannels.length > 0) {
    const fifaUrls = new Set(fifaChannels.map((c) => c.url));
    const uniqueFetched = fetchedChannels.filter((c) => !fifaUrls.has(c.url));
    fetchedChannels = [...fifaChannels, ...uniqueFetched];
  }

  // If there is a slug, make sure that channel is fetched and prepended if not already present
  if (slug && fetchedChannels.length > 0) {
    const slugify = (text: string) => {
      return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    const hasSlugChannel = fetchedChannels.some(
      (c: any) => slugify(c.name) === slug,
    );
    if (!hasSlugChannel) {
      try {
        const channelNameQuery = slug.split("-").join(" ");
        const searchUrl = `${baseUrl}/stream/all?searchTerm=${encodeURIComponent(channelNameQuery)}&limit=5`;
        const res = await fetch(searchUrl);
        if (res.ok) {
          const json = await res.json();
          const data = json?.data || [];
          const matchedChannel = data.find(
            (c: any) => slugify(c.name) === slug,
          );
          if (matchedChannel) {
            fetchedChannels = [matchedChannel, ...fetchedChannels];
          }
        }
      } catch (err) {
        console.error("Failed to fetch custom slug channel for SSR:", err);
      }
    }
  }

  return fetchedChannels;
}

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugList = resolvedParams.slug || [];
  const lastSlug = slugList[slugList.length - 1] || null;
  const slug = lastSlug === "live-tv" ? null : lastSlug;

  if (slug) {
    const channelName = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      title: `Watch ${channelName} Live - Free IPTV Online Streaming | LiveTV Portal`,
      description: `Watch ${channelName} live stream online. Enjoy high-quality free IPTV broadcasting, live channels, sports, news, and entertainment.`,
      alternates: {
        canonical: `${appUrl}/${resolvedParams.slug?.join("/")}`,
      },
      keywords: [
        `Watch ${channelName} Live`,
        `${channelName} Live Stream`,
        "Free IPTV online",
        "Live TV streaming",
      ],
    };
  }

  return {
    title:
      "Live TV - Free Online IPTV Channel Streaming (7000+ Channels) | LiveTV Portal",
    description:
      "Watch 7000+ free live TV channels online. Stream sports, news, movies, and entertainment channels from around the world in high quality.",
    alternates: {
      canonical: appUrl,
    },
    keywords: [
      "Live TV online",
      "Free IPTV",
      "Watch live television",
      "IPTV channel playlist",
      "Live TV Portal",
    ],
  };
}

export default async function LiveTvPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugList = resolvedParams.slug || [];
  const lastSlug = slugList[slugList.length - 1] || null;
  const slug = lastSlug === "live-tv" ? null : lastSlug;
  const channels = await getChannels(slug);

  // Helper function to create URL-friendly slug
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  let jsonLd: any = null;

  if (slug) {
    const activeChannel = channels.find((c: any) => slugify(c.name) === slug);
    if (activeChannel) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: `${activeChannel.name} Live Streaming`,
        description: `Watch ${activeChannel.name} live stream online. Free high-quality IPTV streaming.`,
        thumbnailUrl: activeChannel.logo || `${appUrl}/og-image.png`,
        uploadDate: "2026-01-01T00:00:00Z", // Required field for VideoObject schema
        embedUrl: activeChannel.url,
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: { "@type": "WatchAction" },
          userInteractionCount: 1250,
        },
      };
    }
  }

  if (!jsonLd && channels.length > 0) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Live TV Channels",
      description:
        "A collection of 7000+ live television channels available for streaming.",
      itemListElement: channels.slice(0, 50).map((c: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        name: c.name,
        url: `${appUrl}/${slugify(c.name)}`,
      })),
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <LiveTvClient initialChannels={channels} initialSlug={slug} />
    </>
  );
}
