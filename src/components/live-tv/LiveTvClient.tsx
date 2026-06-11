"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Tv,
  Share2,
  ChevronLeft,
  ChevronRight,
  Heart,
  List,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Channel } from "./types";
import VideoPlayer from "./VideoPlayer";
import RelatedChannels from "./RelatedChannels";
import ChannelSidebar from "./ChannelSidebar";
import Header from "./Header";
import Footer from "./Footer";
import BackgroundScene from "./BackgroundScene";

interface LiveTvClientProps {
  initialChannels: Channel[];
  initialSlug: string | null;
}

// Convert channel name to URL-friendly slug
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function LiveTvClient({
  initialChannels,
  initialSlug,
}: LiveTvClientProps) {
  const router = useRouter();

  const [channels] = useState<Channel[]>(initialChannels);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [logoError, setLogoError] = useState(false);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  const [sidebarPage, setSidebarPage] = useState(1);
  const channelsPerPage = 30;

  const listContainerRef = useRef<HTMLDivElement>(null);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Sync favorites on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("qoraplay_tv_favorites");
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load favorites from localStorage", e);
        }
      }
    }
  }, []);

  const handleToggleFavorite = (url: string) => {
    let updated;
    if (favorites.includes(url)) {
      updated = favorites.filter((favUrl) => favUrl !== url);
      toast.success("Removed from favorites!");
    } else {
      updated = [...favorites, url];
      toast.success("Added to favorites!");
    }
    setFavorites(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("qoraplay_tv_favorites", JSON.stringify(updated));
    }
  };

  // Sync theme from localStorage on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("qoraplay_tv_theme") as
        | "light"
        | "dark";
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    }
  }, []);

  // Set the .dark class on the root element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("qoraplay_tv_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Smooth scroll to the sidebar on mobile when query/category/favorites filter changes
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const isHomepage =
      selectedCategory === "All" && !searchQuery.trim() && !showFavoritesOnly;

    if (isHomepage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (sidebarContainerRef.current) {
      sidebarContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedCategory, searchQuery, showFavoritesOnly]);

  // Reset page when category or search query changes
  useEffect(() => {
    setSidebarPage(1);
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [selectedCategory, searchQuery, showFavoritesOnly]);

  // Filter channels using useMemo (Optimized)
  const filteredChannels = useMemo(() => {
    let result = channels;

    if (showFavoritesOnly) {
      result = result.filter((c) => favorites.includes(c.url));
    }

    if (selectedCategory && selectedCategory !== "All" && !showFavoritesOnly) {
      result = result.filter((c) => c.group === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.group && c.group.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [selectedCategory, searchQuery, channels, showFavoritesOnly, favorites]);

  const totalPages = Math.ceil(filteredChannels.length / channelsPerPage);
  const paginatedChannels = filteredChannels.slice(
    0,
    sidebarPage * channelsPerPage,
  );

  // Compute categories array using useMemo (Optimized)
  const categories = useMemo(() => {
    if (channels.length === 0) return ["All"];
    const uniqueGroups = Array.from(
      new Set(channels.map((c) => c.group || "Others")),
    );

    const sortedGroups = uniqueGroups.sort((a, b) => {
      const priority = [
        "Sports",
        "Bangla",
        "News",
        "Movies",
        "Entertainment",
      ];
      const idxA = priority.indexOf(a);
      const idxB = priority.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return ["All", ...sortedGroups];
  }, [channels]);

  // Initialize default active channel from props
  useEffect(() => {
    if (channels.length > 0 && !activeChannel) {
      if (initialSlug) {
        const matched = channels.find((c) => slugify(c.name) === initialSlug);
        if (matched) {
          setActiveChannel(matched);
        } else {
          setActiveChannel(channels[0]);
        }
      } else {
        setActiveChannel(channels[0]);
      }
    }
  }, [channels, initialSlug, activeChannel]);

  // Sync state on browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        const parts = path.split("/");
        const slug = parts[parts.length - 1];
        if (slug && slug !== "live-tv") {
          const matched = channels.find((c) => slugify(c.name) === slug);
          if (matched) {
            setActiveChannel(matched);
          }
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [channels]);

  // Sync document title with active channel
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (activeChannel) {
        document.title = `Watch ${activeChannel.name} Live - Free IPTV Online Streaming | LiveTV Portal`;
      } else {
        document.title =
          "Live TV - Free Online IPTV Channel Streaming (7000+ Channels) | LiveTV Portal";
      }
    }
  }, [activeChannel]);

  // Reset logo error when active channel changes
  useEffect(() => {
    setLogoError(false);
  }, [activeChannel]);

  const handleScroll = () => {
    const container = listContainerRef.current;
    if (!container) return;

    if (
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 100
    ) {
      if (sidebarPage < totalPages) {
        setSidebarPage((prev) => prev + 1);
      }
    }
  };

  const handleChannelSelect = (channel: Channel) => {
    setActiveChannel(channel);
    const slug = slugify(channel.name);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/live-tv/${slug}`);
    }
  };

  const handlePrevChannel = () => {
    if (!activeChannel || filteredChannels.length === 0) return;
    const currentIndex = filteredChannels.findIndex(
      (c) => c.url === activeChannel.url,
    );
    if (currentIndex > 0) {
      handleChannelSelect(filteredChannels[currentIndex - 1]);
    } else {
      handleChannelSelect(filteredChannels[filteredChannels.length - 1]);
    }
  };

  const handleNextChannel = () => {
    if (!activeChannel || filteredChannels.length === 0) return;
    const currentIndex = filteredChannels.findIndex(
      (c) => c.url === activeChannel.url,
    );
    if (currentIndex < filteredChannels.length - 1) {
      handleChannelSelect(filteredChannels[currentIndex + 1]);
    } else {
      handleChannelSelect(filteredChannels[0]);
    }
  };

  const handleShare = () => {
    if (!activeChannel) return;
    const slug = slugify(activeChannel.name);
    const shareUrl = `${window.location.origin}/live-tv/${slug}`;

    if (navigator.share) {
      navigator
        .share({
          title: `Watch ${activeChannel.name} Live`,
          text: `Streaming ${activeChannel.name} live on QoraPlay TV. Check it out!`,
          url: shareUrl,
        })
        .catch((err) => {
          console.warn("Share sheet cancelled or failed", err);
        });
    } else {
      navigator.clipboard.writeText(shareUrl).then(
        () => {
          toast.success("Share link copied to clipboard!");
        },
        () => {
          toast.error("Failed to copy link.");
        },
      );
    }
  };

  const trendingChannels = useMemo(() => channels.slice(10, 25), [channels]);
  const sportsChannels = useMemo(
    () => channels.filter((c) => c.group === "Sports").slice(0, 15),
    [channels],
  );
  const banglaChannels = useMemo(
    () => channels.filter((c) => c.group === "Bangla").slice(0, 15),
    [channels],
  );
  const newsChannels = useMemo(
    () => channels.filter((c) => c.group === "News").slice(0, 15),
    [channels],
  );
  const movieChannels = useMemo(
    () =>
      channels
        .filter((c) => c.group === "Movies" || c.group === "Entertainment")
        .slice(0, 15),
    [channels],
  );

  const renderMovieShelf = (
    title: string,
    icon: string,
    shelfChannels: Channel[],
  ) => {
    if (shelfChannels.length === 0) return null;
    return (
      <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-white/10 first:border-0 transition-colors">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-zinc-100 flex items-center gap-2 tracking-tight">
            <span>{icon}</span>
            {title}
          </h3>
          <span className="text-[10px] text-blue-600 dark:text-violet-400 font-bold bg-blue-50 dark:bg-violet-500/5 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-violet-500/20">
            {shelfChannels.length} Streams
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1.5 px-1 no-scrollbar scroll-smooth">
          {shelfChannels.map((c, idx) => (
            <button
              key={idx}
              onClick={() => {
                handleChannelSelect(c);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group shrink-0 w-[185px] sm:w-[225px] h-[72px] sm:h-[84px] bg-white dark:bg-[#13112a]/45 border border-slate-200 dark:border-white/10 rounded-2xl p-2.5 flex items-center gap-3 hover:border-blue-500/40 dark:hover:border-violet-500/40 hover:scale-[1.03] hover:bg-slate-50/50 dark:hover:bg-[#13112a]/70 transition-all duration-300 relative text-left cursor-pointer shadow-xs hover:shadow-md dark:shadow-none overflow-hidden"
            >
              {/* Background gradient glow on hover */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-600/2 to-cyan-500/2 dark:from-violet-600/5 dark:to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Logo Container */}
              <div className="relative h-11 w-11 sm:h-14 sm:w-14 bg-slate-50 dark:bg-white/5 border border-slate-150 dark:border-white/10 rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                {c.logo ? (
                  <Image
                    src={c.logo}
                    alt={c.name}
                    width={48}
                    height={48}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                    unoptimized={true}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Tv className="h-5 w-5 text-slate-400 dark:text-zinc-500" />
                )}
              </div>

              {/* Text/Details */}
              <div className="min-w-0 flex-1 flex flex-col justify-center pr-3">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-violet-400 truncate leading-snug transition-colors duration-200">
                  {c.name}
                </h4>
                <span className="text-[9px] sm:text-[10px] text-slate-450 dark:text-zinc-500 font-semibold uppercase tracking-wider block mt-0.5">
                  {c.group}
                </span>
              </div>

              {/* Subtle Top-Right Live Badge */}
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded border border-rose-100 dark:border-rose-500/20">
                <span className="h-1 w-1 bg-rose-600 dark:bg-rose-500 rounded-full animate-pulse" />
                <span>LIVE</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col min-h-screen relative overflow-x-hidden bg-slate-50 dark:bg-[#070414] text-slate-900 dark:text-white transition-colors duration-250 ${mounted && theme === "dark" ? "dark" : ""}`}
    >
      {mounted && theme === "dark" && <BackgroundScene />}

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header
          favoritesCount={favorites.length}
          onShowFavorites={() => {
            setShowFavoritesOnly(!showFavoritesOnly);
            setSelectedCategory("All");
          }}
          showingFavorites={showFavoritesOnly}
          onSelectCategory={setSelectedCategory}
          onSearch={setSearchQuery}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="grow container mx-auto space-y-3.5 md:space-y-8 px-2 sm:px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
            {/* Main Video Player (Left 7/8 Cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {activeChannel ? (
                <VideoPlayer channel={activeChannel} />
              ) : (
                <div className="aspect-video w-full bg-slate-100 dark:bg-[#0d1127]/30 rounded-2xl flex flex-col items-center justify-center text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 p-4 backdrop-blur-md">
                  <Tv className="text-zinc-400 dark:text-zinc-600 animate-bounce mb-2 h-10 w-10" />
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-semibold text-center">
                    Select a channel from the list to start watching
                  </p>
                </div>
              )}

              {/* Active Channel Details */}
              {activeChannel && (
                <div className="glass-card p-4 rounded-2xl md:rounded-3xl shadow-lg space-y-4">
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2.5 sm:gap-4">
                      <div className="relative h-11 w-11 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                        {activeChannel.logo && !logoError ? (
                          <Image
                            src={activeChannel.logo}
                            alt={activeChannel.name}
                            width={56}
                            height={56}
                            className="max-h-full max-w-full object-contain"
                            unoptimized={true}
                            onError={() => setLogoError(true)}
                          />
                        ) : (
                          <Tv className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 dark:text-zinc-400" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                          {activeChannel.name}
                        </h2>
                        <span className="inline-block bg-slate-100 dark:bg-white/5 text-blue-600 dark:text-violet-400 font-bold px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs border border-slate-200 dark:border-white/10 mt-1">
                          {activeChannel.group}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 sm:gap-2 items-center">
                      <button
                        onClick={handlePrevChannel}
                        className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 bg-white dark:bg-white/5 flex items-center justify-center transition-all cursor-pointer"
                        title="Previous Channel"
                      >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                      <button
                        onClick={handleNextChannel}
                        className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 bg-white dark:bg-white/5 flex items-center justify-center transition-all cursor-pointer"
                        title="Next Channel"
                      >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>

                      <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-0.5 sm:mx-1" />

                      {/* Favorite Toggle Button */}
                      <button
                        onClick={() => handleToggleFavorite(activeChannel.url)}
                        className={`rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center transition-all cursor-pointer border ${
                          favorites.includes(activeChannel.url)
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 hover:text-rose-500"
                            : "text-slate-500 dark:text-zinc-400 hover:text-rose-500 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 bg-white dark:bg-white/5"
                        }`}
                        title={
                          favorites.includes(activeChannel.url)
                            ? "Remove from Favorites"
                            : "Add to Favorites"
                        }
                      >
                        <Heart
                          className={`h-4 w-4 sm:h-5 sm:w-5 ${favorites.includes(activeChannel.url) ? "fill-rose-500 text-rose-500" : ""}`}
                        />
                      </button>

                      <button
                        onClick={handleShare}
                        className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 text-slate-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 bg-white dark:bg-white/5 flex items-center justify-center transition-all cursor-pointer"
                        title="Share Channel"
                      >
                        <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Related Channels Carousel */}
                  <RelatedChannels
                    channels={channels}
                    activeChannel={activeChannel}
                    handleChannelSelect={handleChannelSelect}
                  />
                </div>
              )}
            </div>

            {/* Desktop Sidebar (always visible on lg+) */}
            <div
              ref={sidebarContainerRef}
              className="hidden lg:block lg:col-span-5 xl:col-span-4 space-y-4"
            >
              <ChannelSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                paginatedChannels={paginatedChannels}
                activeChannel={activeChannel}
                handleChannelSelect={handleChannelSelect}
                listContainerRef={listContainerRef}
                handleScroll={handleScroll}
                sidebarPage={sidebarPage}
                totalPages={totalPages}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                showFavoritesOnly={showFavoritesOnly}
                setShowFavoritesOnly={setShowFavoritesOnly}
              />
            </div>
          </div>

          {/* Mobile Floating Browse Button */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-blue-600 dark:bg-violet-600 hover:bg-blue-750 dark:hover:bg-violet-750 text-white text-sm font-bold rounded-full shadow-xl shadow-blue-600/30 dark:shadow-violet-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <List className="h-5 w-5" />
            <span>Channels</span>
          </button>

          {/* Mobile Sidebar Overlay */}
          {showMobileSidebar && (
            <div className="lg:hidden fixed inset-0 z-50 flex flex-col">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowMobileSidebar(false)}
              />
              {/* Drawer */}
              <div className="relative mt-auto h-[85vh] bg-white dark:bg-[#070414] border-t border-slate-200 dark:border-white/10 rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-350">
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200 dark:border-white/10">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Tv className="h-4 w-4 text-blue-500 dark:text-violet-400" />
                    Browse Channels
                  </h3>
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {/* Drawer Body */}
                <div className="flex-1 overflow-hidden p-1.5">
                  <ChannelSidebar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={categories}
                    paginatedChannels={paginatedChannels}
                    activeChannel={activeChannel}
                    handleChannelSelect={(channel) => {
                      handleChannelSelect(channel);
                      setShowMobileSidebar(false);
                    }}
                    listContainerRef={listContainerRef}
                    handleScroll={handleScroll}
                    sidebarPage={sidebarPage}
                    totalPages={totalPages}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    showFavoritesOnly={showFavoritesOnly}
                    setShowFavoritesOnly={setShowFavoritesOnly}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Movie Streaming Site Shelves */}
          {selectedCategory === "All" &&
            !searchQuery.trim() &&
            !showFavoritesOnly && (
              <div className="space-y-8 pt-8 border-t border-slate-200 dark:border-white/10 mt-8">
                {renderMovieShelf("Trending Streams", "🔥", trendingChannels)}
                {renderMovieShelf("Sports Live", "🏏", sportsChannels)}
                {renderMovieShelf("Bangla Channels", "🇧🇩", banglaChannels)}
                {renderMovieShelf("Live News Updates", "📰", newsChannels)}
                {renderMovieShelf(
                  "Movies & Entertainment",
                  "🎬",
                  movieChannels,
                )}
              </div>
            )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
