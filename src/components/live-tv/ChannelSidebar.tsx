"use client";

import React from "react";
import { Search, Tv, Play, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
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
    <Card className="border border-slate-100 dark:border-slate-800/40 shadow-sm rounded-xl sm:rounded-2xl overflow-hidden h-[calc(100vh-220px)] lg:h-[calc(100vh-180px)] flex flex-col bg-white dark:bg-[#0d1527] transition-colors duration-200">
      {/* Search & Category Filter Header */}
      <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800/30 space-y-2.5 sm:space-y-3 bg-slate-50/50 dark:bg-[#070b13]/40">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-550" />
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
            className="w-full pl-8 sm:pl-9 pr-4 py-1.5 sm:py-2 border border-slate-200 dark:border-slate-800 rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-105 placeholder-slate-405 dark:placeholder-slate-500"
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
                  : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30 hover:border-rose-200"
              }`}
            >
              <Heart className={`h-3 w-3 ${showFavoritesOnly ? "fill-white text-white" : "fill-rose-500 text-rose-500"}`} />
              Favorites ({favorites.length})
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

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
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
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
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-xl border text-left transition-all w-full group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    isActive
                      ? "bg-blue-50/70 dark:bg-blue-950/20 border-blue-100/80 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "bg-white dark:bg-[#111a30] border-slate-100 dark:border-slate-800/40 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50/40 dark:hover:bg-slate-800/30 text-slate-655 dark:text-slate-400 hover:text-slate-955 dark:hover:text-white"
                  }`}
                >
                  <div className="relative h-8 w-8 sm:h-10 sm:w-10 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-md sm:rounded-lg p-1 flex items-center justify-center shrink-0">
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
                      <Tv className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-slate-400 dark:text-slate-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-[11px] sm:text-xs font-bold leading-snug truncate pr-1 ${isActive ? "text-blue-600 dark:text-blue-405" : "text-slate-700 dark:text-slate-300 group-hover:text-slate-900 group-hover:dark:text-white"}`}
                    >
                      {channel.name}
                    </h4>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-medium">
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
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-rose-505 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />
                    </button>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play
                        className={`h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current ${
                          isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-405 dark:text-slate-500 group-hover:text-slate-600 group-hover:dark:text-slate-300"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 dark:text-slate-500 text-sm">
            {showFavoritesOnly 
              ? "You haven't added any channels to your favorites yet. Click the heart icon on any channel to save it!" 
              : "No channels found matching current filter."}
          </div>
        )}
      </div>

      {/* Sidebar Infinite loading footer */}
      {sidebarPage < totalPages && (
        <div className="py-2 text-center text-[10px] text-slate-400 dark:text-slate-500 font-semibold animate-pulse bg-slate-50/50 dark:bg-[#070b13]/40 border-t border-slate-100 dark:border-slate-800/30 shrink-0">
          Loading more channels...
        </div>
      )}
    </Card>
  );
}
