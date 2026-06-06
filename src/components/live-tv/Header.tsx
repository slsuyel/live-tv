"use client";

import React from "react";
import { Tv, ShieldCheck, Heart, User, Activity } from "lucide-react";

interface HeaderProps {
  favoritesCount: number;
  onShowFavorites: () => void;
  showingFavorites: boolean;
}

export default function Header({ favoritesCount, onShowFavorites, showingFavorites }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100/80 shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
            <Tv className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
              QoraPlay<span className="text-blue-600 font-semibold text-sm ml-0.5">TV</span>
            </span>
            <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold -mt-1 bg-emerald-50 px-1 py-px rounded-sm border border-emerald-100/50 w-fit">
              <Activity className="h-2 w-2 animate-pulse" />
              <span>ONLINE</span>
            </div>
          </div>
        </div>

        {/* Center - Stats badge */}
        <div className="hidden md:flex items-center gap-2.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Streaming 7,000+ Channels Free
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Favorites Button */}
          <button
            onClick={onShowFavorites}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              showingFavorites
                ? "bg-rose-50 border-rose-200 text-rose-600 shadow-xs"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Heart className={`h-4 w-4 ${showingFavorites ? "fill-rose-500 text-rose-500" : ""}`} />
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="bg-rose-500 text-white rounded-full text-[9px] h-4 min-w-4 px-1 flex items-center justify-center font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* User Badge */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:pl-4">
            <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">Guest Account</p>
              <div className="flex items-center gap-0.5 text-[10px] text-blue-600 font-semibold leading-none">
                <ShieldCheck className="h-3 w-3" />
                <span>Free Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
