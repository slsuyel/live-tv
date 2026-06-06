"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tv, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Channel } from "./types";
import VideoPlayer from "./VideoPlayer";
import RelatedChannels from "./RelatedChannels";
import ChannelSidebar from "./ChannelSidebar";

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

  const [sidebarPage, setSidebarPage] = useState(1);
  const channelsPerPage = 30;

  const listContainerRef = useRef<HTMLDivElement>(null);

  // Reset page when category or search query changes
  useEffect(() => {
    setSidebarPage(1);
    // Scroll list container back to top when filter changes
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredChannels.length / channelsPerPage);
  const paginatedChannels = filteredChannels.slice(
    0,
    sidebarPage * channelsPerPage
  );

  // Initialize categories and default active channel from props
  useEffect(() => {
    if (channels.length > 0) {
      // Get unique groups/categories
      const uniqueGroups = Array.from(
        new Set(channels.map((c) => c.group || "Others"))
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

      // Determine active channel from slug or fallback
      if (initialSlug) {
        const matched = channels.find((c) => slugify(c.name) === initialSlug);
        if (matched) {
          setActiveChannel(matched);
          setSelectedCategory("All");
        } else {
          // Fallback if slug doesn't match
          if (channels.length > 0) {
            setActiveChannel(channels[0]);
            setSelectedCategory("All");
          }
        }
      } else {
        // No slug - check localStorage first!
        let lastWatchedChannel: Channel | null = null;

        if (typeof window !== "undefined") {
          const savedSlug = localStorage.getItem("lastWatchedChannelSlug");

          if (savedSlug) {
            const matched = channels.find((c) => slugify(c.name) === savedSlug);
            if (matched) {
              lastWatchedChannel = matched;
            }
          }
        }

        if (lastWatchedChannel) {
          setActiveChannel(lastWatchedChannel);
          setSelectedCategory("All");
        } else if (channels.length > 0) {
          setActiveChannel(channels[0]);
          setSelectedCategory("All");
        }
      }
    }
  }, [channels, initialSlug]);

  // Save last watched channel to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && activeChannel) {
      localStorage.setItem(
        "lastWatchedChannelSlug",
        slugify(activeChannel.name)
      );
    }
  }, [activeChannel]);

  // Synchronize active channel when slug changes (e.g. back navigation)
  useEffect(() => {
    if (!initialSlug || channels.length === 0) return;
    const matched = channels.find((c) => slugify(c.name) === initialSlug);
    if (matched && activeChannel?.url !== matched.url) {
      setActiveChannel(matched);
      if (matched.group) {
        setSelectedCategory(matched.group);
      }
    }
  }, [initialSlug, channels, activeChannel]);

  // Filter channels based on category and search query
  useEffect(() => {
    let result = channels;

    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((c) => c.group === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.group && c.group.toLowerCase().includes(q))
      );
    }

    setFilteredChannels(result);
  }, [selectedCategory, searchQuery, channels]);

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
    router.push(`/live-tv/${slugify(channel.name)}`);
  };

  const handleNextChannel = () => {
    if (!activeChannel || filteredChannels.length === 0) return;
    const currentIndex = filteredChannels.findIndex(
      (c) => c.url === activeChannel.url
    );
    if (currentIndex === -1) {
      handleChannelSelect(filteredChannels[0]);
    } else {
      const nextIndex = (currentIndex + 1) % filteredChannels.length;
      handleChannelSelect(filteredChannels[nextIndex]);
    }
  };

  const handlePrevChannel = () => {
    if (!activeChannel || filteredChannels.length === 0) return;
    const currentIndex = filteredChannels.findIndex(
      (c) => c.url === activeChannel.url
    );
    if (currentIndex === -1) {
      handleChannelSelect(filteredChannels[filteredChannels.length - 1]);
    } else {
      const prevIndex =
        (currentIndex - 1 + filteredChannels.length) % filteredChannels.length;
      handleChannelSelect(filteredChannels[prevIndex]);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: activeChannel?.name || "Live TV",
      text: `Watch ${activeChannel?.name || "Live TV"} streaming live on NextQora!`,
      url: window.location.href,
    };

    try {
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if ((error as any).name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!");
        } catch {
          toast.error("Failed to copy link.");
        }
      }
    }
  };

  // Keyboard navigation for channel change
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElem = document.activeElement;
      if (
        activeElem &&
        (activeElem.tagName === "INPUT" ||
          activeElem.tagName === "TEXTAREA" ||
          activeElem.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevChannel();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextChannel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeChannel, filteredChannels]);

  return (
    <div className="container mx-auto space-y-3.5 md:space-y-8 min-h-screen px-2 sm:px-4 py-4 md:py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 sm:gap-2">
            <Tv className="text-red-500 animate-pulse h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
            Live TV{" "}
            <span className="text-red-500 font-semibold text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 bg-red-50 rounded-full border border-red-200">
              LIVE
            </span>
          </h1>
          <p className="hidden md:block text-slate-500 text-xs sm:text-sm mt-0.5 md:mt-1">
            Enjoy 7000+ live television channels from around the world.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-8">
        {/* Main Video Player (Left 7 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3 md:space-y-4">
          {activeChannel ? (
            <VideoPlayer channel={activeChannel} />
          ) : (
            <div className="aspect-video w-full bg-[#0d1127] rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-white border border-slate-200 p-4">
              <Tv className="text-slate-600 animate-bounce mb-2 h-10 w-10 sm:h-12 sm:w-12" />
              <p className="text-xs sm:text-sm text-slate-450 font-semibold text-center">
                Select a channel from the list to start watching
              </p>
            </div>
          )}

          {/* Active Channel Details */}
          {activeChannel && (
            <div className="bg-white border border-slate-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2.5 sm:gap-4">
                  <div className="relative h-11 w-11 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center shrink-0">
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
                      <Tv className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900">
                      {activeChannel.name}
                    </h2>
                    <span className="inline-block bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full text-[10px] sm:text-xs border border-blue-100/40 mt-0.5 sm:mt-1">
                      {activeChannel.group}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1.5 sm:gap-2 items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevChannel}
                    className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 text-slate-700 hover:text-blue-600 border-slate-200 hover:bg-slate-50 bg-white cursor-pointer"
                    title="Previous Channel"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextChannel}
                    className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 text-slate-700 hover:text-blue-600 border-slate-200 hover:bg-slate-50 bg-white cursor-pointer"
                    title="Next Channel"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>

                  <div className="h-6 w-px bg-slate-200 mx-0.5 sm:mx-1" />

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10 text-slate-500 hover:text-blue-600 border-slate-200 hover:bg-slate-50 bg-white cursor-pointer"
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
          />
        </div>
      </div>
    </div>
  );
}
