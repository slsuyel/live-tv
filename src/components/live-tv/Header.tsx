"use client";

import React from "react";
import { Tv, ShieldCheck, User, Moon, Sun, Heart } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  favoritesCount: number;
  onShowFavorites: () => void;
  showingFavorites: boolean;
  onSelectCategory: (category: string) => void;
  onSearch: (query: string) => void;
  selectedCategory: string;
  searchQuery: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Header({
  favoritesCount,
  onShowFavorites,
  showingFavorites,
  onSelectCategory,
  onSearch,
  selectedCategory,
  searchQuery,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const isHomeActive =
    selectedCategory === "All" && !showingFavorites && !searchQuery;
  const isSportsActive =
    selectedCategory === "Sports" && !searchQuery && !showingFavorites;
  const isCricketActive =
    selectedCategory === "Sports" &&
    searchQuery.toLowerCase() === "cricket" &&
    !showingFavorites;
  const isFootballActive =
    selectedCategory === "Sports" &&
    searchQuery.toLowerCase() === "football" &&
    !showingFavorites;
  const isNewsActive =
    selectedCategory === "News" && !showingFavorites && !searchQuery;

  return (
    <div className="sticky top-0 z-50 w-full bg-[#070414]/75 backdrop-blur-xl border-b border-white/10 shadow-lg transition-all">
      {/* Upper Brand & Profile Row */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => {
            onSelectCategory("All");
            onSearch("");

            if (showingFavorites) {
              onShowFavorites();
            }

            window.history.pushState({}, "", "/");
          }}
          className="flex items-center gap-2 cursor-pointer focus:outline-none hover:opacity-90 active:scale-95 transition-all"
        >
          <Image
            src="/logo.png"
            alt="QoraPlay TV"
            width={220}
            height={50}
            priority
            className="h-8 sm:h-12 w-auto [filter:invert(1)_hue-rotate(180deg)]"
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => {
              onSelectCategory("All");
              onSearch("");
              if (showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isHomeActive
                ? "bg-white/10 text-white border border-white/15"
                : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <span>📺</span> Live TV
          </button>

          <button
            onClick={() => {
              onSelectCategory("Sports");
              onSearch("");
              if (showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSportsActive
                ? "bg-white/10 text-white border border-white/15"
                : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <span>🏆</span> Sports
          </button>

          <button
            onClick={() => {
              onSelectCategory("Sports");
              onSearch("cricket");
              if (showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isCricketActive
                ? "bg-white/10 text-white border border-white/15"
                : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <span>🏏</span> Cricket
          </button>

          <button
            onClick={() => {
              onSelectCategory("Sports");
              onSearch("football");
              if (showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isFootballActive
                ? "bg-white/10 text-white border border-white/15"
                : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <span>⚽</span> Football
          </button>

          <button
            onClick={() => {
              onSelectCategory("News");
              onSearch("");
              if (showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isNewsActive
                ? "bg-white/10 text-white border border-white/15"
                : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <span>📰</span> News
          </button>

          <button
            onClick={() => {
              if (!showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              showingFavorites
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                : "text-zinc-400 hover:bg-white/5 hover:text-white border-transparent"
            }`}
          >
            <span>❤️</span> Favorites
            {favoritesCount > 0 && (
              <span className="bg-rose-500 text-white rounded-full text-[9px] h-4 min-w-4 px-1 flex items-center justify-center font-bold">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Section (Theme Toggle + User Badge) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
            title={
              theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"
            }
          >
            {theme === "light" ? (
              <Moon className="h-4.5 w-4.5" />
            ) : (
              <Sun className="h-4.5 w-4.5 text-amber-400 fill-amber-400/10" />
            )}
          </button>

          {/* User Badge */}
          <div className="flex items-center gap-2 pl-1.5 sm:pl-3 border-l border-white/10">
            <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-100 leading-tight">
                Guest Account
              </p>
              <div className="flex items-center gap-0.5 text-[10px] text-cyan-400 font-semibold leading-none">
                <ShieldCheck className="h-3 w-3" />
                <span>Free Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row (Scrollable) */}
      <div className="md:hidden border-t border-white/10 bg-[#070414]/50">
        <div className="container mx-auto px-2 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => {
              onSelectCategory("All");
              onSearch("");
              if (showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
              isHomeActive
                ? "bg-white/10 text-white border-white/15 shadow-sm"
                : "text-zinc-400 bg-transparent border-transparent"
            }`}
          >
            <span>📺</span> Live TV
          </button>

          <button
            onClick={() => {
              onSelectCategory("Sports");
              onSearch("");
              if (showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
              isSportsActive
                ? "bg-white/10 text-white border-white/15 shadow-sm"
                : "text-zinc-400 bg-transparent border-transparent"
            }`}
          >
            <span>🏆</span> Sports
          </button>

          <button
            onClick={() => {
              onSelectCategory("Sports");
              onSearch("cricket");
              if (showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
              isCricketActive
                ? "bg-white/10 text-white border-white/15 shadow-sm"
                : "text-zinc-400 bg-transparent border-transparent"
            }`}
          >
            <span>🏏</span> Cricket
          </button>

          <button
            onClick={() => {
              onSelectCategory("Sports");
              onSearch("football");
              if (showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
              isFootballActive
                ? "bg-white/10 text-white border-white/15 shadow-sm"
                : "text-zinc-400 bg-transparent border-transparent"
            }`}
          >
            <span>⚽</span> Football
          </button>

          <button
            onClick={() => {
              onSelectCategory("News");
              onSearch("");
              if (showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
              isNewsActive
                ? "bg-white/10 text-white border-white/15 shadow-sm"
                : "text-zinc-400 bg-transparent border-transparent"
            }`}
          >
            <span>📰</span> News
          </button>

          <button
            onClick={() => {
              if (!showingFavorites) onShowFavorites();
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
              showingFavorites
                ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                : "text-rose-400 bg-rose-500/5 border-rose-500/10"
            }`}
          >
            <span>❤️</span> Favorites
            {favoritesCount > 0 && (
              <span
                className={`rounded-full text-[9px] h-4 min-w-4 px-1 flex items-center justify-center font-bold ml-1 ${
                  showingFavorites
                    ? "bg-rose-500 text-white"
                    : "bg-rose-500/30 text-rose-450"
                }`}
              >
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
