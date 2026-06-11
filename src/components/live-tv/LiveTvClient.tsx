"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

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

  const totalPages = Math.ceil(filteredChannels.length / channelsPerPage);
  const paginatedChannels = filteredChannels.slice(
    0,
    sidebarPage * channelsPerPage,
  );

  // Initialize categories and default active channel from props
  useEffect(() => {
    if (channels.length > 0) {
      const uniqueGroups = Array.from(
        new Set(channels.map((c) => c.group || "Others")),
      );

      // Sort categories prioritising Bangla, Sports, News
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

      setCategories(["All", ...sortedGroups]);

      if (!activeChannel) {
        if (initialSlug) {
          const matched = channels.find((c) => slugify(c.name) === initialSlug);
          if (matched) {
            setActiveChannel(matched);
          } else if (channels.length > 0) {
            setActiveChannel(channels[0]);
          }
        } else if (channels.length > 0) {
          setActiveChannel(channels[0]);
        }
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

  // Filter channels
  useEffect(() => {
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

    setFilteredChannels(result);
  }, [selectedCategory, searchQuery, channels, showFavoritesOnly, favorites]);

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

  const trendingChannels = channels.slice(10, 25);
  const sportsChannels = channels
    .filter((c) => c.group === "Sports")
    .slice(0, 15);
  const banglaChannels = channels
    .filter((c) => c.group === "Bangla")
    .slice(0, 15);
  const newsChannels = channels.filter((c) => c.group === "News").slice(0, 15);
  const movieChannels = channels
    .filter((c) => c.group === "Movies" || c.group === "Entertainment")
    .slice(0, 15);

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
        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 px-1 no-scrollbar scroll-smooth">
          {shelfChannels.map((c, idx) => (
            <button
              key={idx}
              onClick={() => {
                handleChannelSelect(c);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group shrink-0 w-36 sm:w-48 aspect-video bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 dark:hover:border-violet-500/55 hover:scale-[1.03] transition-all duration-300 relative text-left cursor-pointer flex flex-col justify-between"
            >
              {/* Bottom gradient fade for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-[#070414] dark:via-[#070414]/40 dark:to-transparent z-10" />

              {/* Corner Live Badge */}
              <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 bg-rose-600 text-white font-extrabold text-[8px] px-2 py-0.5 rounded-full shadow-xs tracking-wider">
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                <span>LIVE</span>
              </div>

              {/* Centered Circular Medallion Logo */}
              <div className="absolute inset-0 flex items-center justify-center pb-8 pt-4 z-0">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white dark:bg-white/5 shadow-md p-2 flex items-center justify-center transition-all duration-300 group-hover:scale-105 border border-slate-150 dark:border-white/10">
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt={c.name}
                      width="56"
                      height="56"
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Tv className="h-5 w-5 text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Title & Group Overlays */}
              <div className="absolute bottom-0 inset-x-0 p-3 z-20 min-w-0">
                <h4 className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-violet-400 truncate pr-2 tracking-wide">
                  {c.name}
                </h4>
                <span className="text-[8px] sm:text-[9px] text-slate-450 dark:text-zinc-500 font-semibold uppercase tracking-wider block mt-0.5">
                  {c.group}
                </span>
              </div>

              {/* Play Hover Overlay */}
              <div className="absolute inset-0 bg-blue-600/[0.02] dark:bg-violet-600/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-blue-600 dark:bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-violet-500/20 scale-75 group-hover:scale-100 transition-all duration-300">
                  <span className="text-xs">▶</span>
                </div>
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
                      <div className="relative h-11 w-11 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1.5 flex items-center justify-center shrink-0">
                        {activeChannel.logo ? (
                          <img
                            src={activeChannel.logo}
                            alt={activeChannel.name}
                            width="56"
                            height="56"
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
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
