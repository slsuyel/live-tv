"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tv, Share2, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Channel } from "./types";
import VideoPlayer from "./VideoPlayer";
import RelatedChannels from "./RelatedChannels";
import ChannelSidebar from "./ChannelSidebar";
import Header from "./Header";
import Footer from "./Footer";

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

  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [sidebarPage, setSidebarPage] = useState(1);
  const channelsPerPage = 30;

  const listContainerRef = useRef<HTMLDivElement>(null);

  // Sync favorites on mount
  useEffect(() => {
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

  // Reset page when category or search query changes
  useEffect(() => {
    setSidebarPage(1);
    // Scroll list container back to top when filter changes
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
      // Get unique groups/categories
      const uniqueGroups = Array.from(
        new Set(channels.map((c) => c.group || "Others")),
      );

      // Sort categories to put Bangla, Sports, News at the beginning
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

      // Determine active channel from slug or fallback on mount
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
  }, [channels]);

  // Synchronize active channel on browser Back/Forward navigation (popstate)
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

  // Filter channels based on category, search query, and favorites status
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

  // Movie site shelves grouping
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
      <div className="space-y-3 pt-6 border-t border-slate-200/50 dark:border-slate-800/60 first:border-0 transition-colors duration-200">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
            <span>{icon}</span>
            {title}
          </h3>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/20 px-2.5 py-0.5 rounded-full border border-blue-100/30 dark:border-blue-900/20">
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
              className="group shrink-0 w-36 sm:w-48 aspect-video bg-[#0f172a] dark:bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-blue-550/10 hover:scale-[1.04] transition-all duration-300 relative text-left cursor-pointer flex flex-col justify-between"
            >
              {/* Bottom gradient fade for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

              {/* Corner Live Badge */}
              <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1 bg-rose-600 text-white font-black text-[8px] px-2 py-0.5 rounded-md shadow-xs tracking-wider">
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                <span>LIVE</span>
              </div>

              {/* Centered Logo Container */}
              <div className="absolute inset-0 flex items-center justify-center pb-8 pt-4 z-0">
                <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/95 dark:bg-slate-900/90 shadow-sm p-1.5 flex items-center justify-center transition-all duration-300 group-hover:scale-105 border border-white/10 dark:border-slate-800/40">
                  {c.logo ? (
                    <img
                      src={c.logo}
                      alt={c.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <Tv className="h-5 w-5 text-slate-400 dark:text-slate-550" />
                  )}
                </div>
              </div>

              {/* Title & Group Overlays */}
              <div className="absolute bottom-0 inset-x-0 p-3 z-20 min-w-0">
                <h4 className="text-[10px] sm:text-xs font-bold text-white group-hover:text-blue-405 truncate pr-2 tracking-wide">
                  {c.name}
                </h4>
                <span className="text-[8px] sm:text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                  {c.group}
                </span>
              </div>

              {/* Play Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-35 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 scale-75 group-hover:scale-100 transition-all duration-300">
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
    <div className="flex flex-col min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] transition-colors duration-200">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-8">
          {/* Main Video Player (Left 7 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3 md:space-y-4">
            {activeChannel ? (
              <VideoPlayer channel={activeChannel} />
            ) : (
              <div className="aspect-video w-full bg-[#0d1127] dark:bg-slate-950 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-white border border-slate-200 dark:border-slate-800 p-4">
                <Tv className="text-slate-600 dark:text-slate-700 animate-bounce mb-2 h-10 w-10 sm:h-12 sm:w-12" />
                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-550 font-semibold text-center">
                  Select a channel from the list to start watching
                </p>
              </div>
            )}

            {/* Active Channel Details */}
            {activeChannel && (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm space-y-3 sm:space-y-4 transition-colors duration-200">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex items-center gap-2.5 sm:gap-4">
                    <div className="relative h-11 w-11 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-1.5 flex items-center justify-center shrink-0">
                      {activeChannel.logo ? (
                        <img
                          src={activeChannel.logo}
                          alt={activeChannel.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <Tv className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 dark:text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                        {activeChannel.name}
                      </h2>
                      <span className="inline-block bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full text-[10px] sm:text-xs border border-blue-100/40 dark:border-blue-900/30 mt-0.5 sm:mt-1">
                        {activeChannel.group}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2 items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePrevChannel}
                      className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
                      title="Previous Channel"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextChannel}
                      className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
                      title="Next Channel"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>

                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1" />

                    {/* Favorite Toggle Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleFavorite(activeChannel.url)}
                      className={`rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 cursor-pointer ${
                        favorites.includes(activeChannel.url)
                          ? "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:text-rose-700"
                          : "text-slate-500 dark:text-slate-400 hover:text-rose-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900"
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
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                      className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
                      title="Share Channel"
                    >
                      <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>

                {/* Related Channels horizontal carousel */}
                <RelatedChannels
                  channels={channels}
                  activeChannel={activeChannel}
                  handleChannelSelect={handleChannelSelect}
                />
              </div>
            )}

            {/* Movie Streaming Site Shelves */}
            {selectedCategory === "All" &&
              !searchQuery.trim() &&
              !showFavoritesOnly && (
                <div className="space-y-6 pt-4">
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
          </div>

          {/* Channels Selector Sidebar (Right 5 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-3 md:space-y-4">
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
      </main>

      <Footer />
    </div>
  );
}
