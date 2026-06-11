"use client";

import React from "react";
import { Tv, Play } from "lucide-react";
import Image from "next/image";
import { Channel } from "./types";

interface RelatedChannelsProps {
  channels: Channel[];
  activeChannel: Channel;
  handleChannelSelect: (channel: Channel) => void;
}

export default function RelatedChannels({
  channels,
  activeChannel,
  handleChannelSelect,
}: RelatedChannelsProps) {
  const relatedList = channels
    .filter(
      (c) => c.group === activeChannel.group && c.name !== activeChannel.name,
    )
    .slice(0, 15);

  if (relatedList.length === 0) return null;

  return (
    <div className="space-y-3 shrink-0">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-tight">
          Related Channels
        </span>
      </div>

      <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
        {relatedList.map((related, idx) => (
          <button
            key={idx}
            onClick={() => handleChannelSelect(related)}
            className="group flex flex-col items-center justify-center p-2.5 bg-white dark:bg-white/2 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-violet-500/50 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all duration-200 text-center space-y-1.5 relative overflow-hidden shrink-0 w-24 sm:w-28 cursor-pointer"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-1 flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform overflow-hidden relative">
              {related.logo ? (
                <Image
                  src={related.logo}
                  alt={related.name}
                  width={36}
                  height={36}
                  className="max-h-full max-w-full object-contain"
                  unoptimized={true}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <Tv className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-zinc-300 group-hover:text-slate-900 group-hover:dark:text-white truncate w-full px-0.5">
              {related.name}
            </span>

            {/* Hover Overlay Play Icon */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 dark:bg-violet-600 text-white rounded-full p-0.5 shadow-sm">
              <Play className="h-2 w-2 fill-white text-white" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
