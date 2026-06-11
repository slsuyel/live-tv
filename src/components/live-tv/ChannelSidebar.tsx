"use client";

import React from "react";
import { Search, Tv, Play, Heart } from "lucide-react";
import { Channel } from "./types";

interface ChannelSidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  paginatedChannels: Channel[];
  activeChannel: Channel | null;
  handleChannelSelect: (channel: Channel) => void;
  listContainerRef: React.RefObject<HTMLDivElement | null>;
  handleScroll: () => void;
  sidebarPage: number;
  totalPages: number;
  favorites: string[];
  onToggleFavorite: (url: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (val: boolean) => void;
}

export default function ChannelSidebar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  paginatedChannels,
  activeChannel,
  handleChannelSelect,
  listContainerRef,
  handleScroll,
  sidebarPage,
  totalPages,
  favorites,
  onToggleFavorite,
  showFavoritesOnly,
  setShowFavoritesOnly,
}: ChannelSidebarProps) {
  return (
    <div className="glass-card border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden h-full lg:h-[calc(100vh-180px)] flex flex-col bg-white/[0.01] transition-all duration-300">
      {/* Search & Category Filter Header */}
      <div className="p-3 sm:p-4 border-b border-white/10 space-y-2.5 sm:space-y-3 bg-white/[0.02]">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim()) {
                setSelectedCategory("All");
                setShowFavoritesOnly(false);
              }
            }}
            placeholder="Search channel by name..."
            className="w-full pl-8 sm:pl-9 pr-4 py-1.5 sm:py-2 border border-white/10 focus:border-violet-500/50 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none transition-all bg-white/5 text-white placeholder-zinc-500"
          />
        </div>

        {/* Categories Tab (Scrollable) */}
        {!searchQuery && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-1.5 no-scrollbar items-center">
            {/* Favorites Tab Button */}
            <button
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
                setSelectedCategory("All");
              }}
              className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                showFavoritesOnly
                  ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/10"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:border-rose-500/30"
              }`}
            >
              <Heart className={`h-3 w-3 ${showFavoritesOnly ? "fill-white text-white" : "fill-rose-500 text-rose-450"}`} />
              Favorites ({favorites.length})
            </button>

            <div className="h-4 w-px bg-white/10 shrink-0" />

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat && !showFavoritesOnly;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setShowFavoritesOnly(false);
                  }}
                  className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/10"
                      : "bg-white/5 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Channels Grid / List */}
      <div
        ref={listContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2.5 sm:p-4 space-y-1.5 sm:space-y-2 custom-scrollbar"
      >
        {paginatedChannels.length > 0 ? (
          <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
            {paginatedChannels.map((channel, index) => {
              const isActive = activeChannel?.url === channel.url;
              const isFavorite = favorites.includes(channel.url);
              return (
                <div
                  key={index}
                  onClick={() => handleChannelSelect(channel)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleChannelSelect(channel);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl border text-left transition-all w-full group cursor-pointer focus:outline-none ${
                    isActive
                      ? "bg-violet-600/10 border-violet-500/40 text-violet-400 shadow-lg shadow-violet-500/5"
                      : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05] text-zinc-300 hover:text-white"
                  }`}
                >
                  <div className="relative h-8 w-8 sm:h-10 sm:w-10 bg-white/5 border border-white/10 rounded-md sm:rounded-lg p-1 flex items-center justify-center shrink-0">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        width="40"
                        height="40"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Tv className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-zinc-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-[11px] sm:text-xs font-bold leading-snug truncate pr-1 ${isActive ? "text-violet-400" : "text-zinc-200 group-hover:text-white"}`}
                    >
                      {channel.name}
                    </h4>
                    <span className="text-[9px] sm:text-[10px] text-zinc-500 font-medium">
                      {channel.group}
                    </span>
                  </div>
                  
                  {/* Actions (Favorite + Play Icon) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(channel.url);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play
                        className={`h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current ${
                          isActive ? "text-violet-400 animate-pulse" : "text-zinc-500 group-hover:text-white"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500 text-sm">
            {showFavoritesOnly 
              ? "You haven't added any channels to your favorites yet. Click the heart icon on any channel to save it!" 
              : "No channels found matching current filter."}
          </div>
        )}
      </div>

      {/* Sidebar Infinite loading footer */}
      {sidebarPage < totalPages && (
        <div className="py-2 text-center text-[10px] text-zinc-500 font-semibold animate-pulse bg-white/[0.02] border-t border-white/10 shrink-0">
          Loading more channels...
        </div>
      )}
    </div>
  );
}
