"use client";

import React from "react";
import { Tv, Play } from "lucide-react";
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
    <div className="border-t pt-4 border-slate-100 dark:border-slate-800/40 space-y-3 transition-colors duration-200">
      <div className="flex justify-between items-center">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-205 flex items-center gap-1.5">
          <Tv className="h-4 w-4 text-blue-600 dark:text-blue-450" />
          More {activeChannel.group} Channels
        </h3>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold bg-slate-100 dark:bg-[#111a30] px-2 py-0.5 rounded-full">
          Related Streams
        </span>
      </div>

      <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
        {relatedList.map((related, idx) => (
          <button
            key={idx}
            onClick={() => handleChannelSelect(related)}
            className="group flex flex-col items-center justify-center p-2.5 bg-slate-50 dark:bg-[#111a30]/50 border border-slate-100 dark:border-slate-800/40 hover:border-blue-200 dark:hover:border-blue-900/60 hover:bg-blue-50/20 dark:hover:bg-[#1b2a4c]/50 rounded-xl transition-all duration-200 text-center space-y-1.5 relative overflow-hidden shrink-0 w-24 sm:w-28 cursor-pointer"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 rounded-lg p-1 flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              {related.logo ? (
                <img
                  src={related.logo}
                  alt={related.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <Tv className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              )}
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 truncate w-full px-0.5">
              {related.name}
            </span>

            {/* Hover Overlay Play Icon */}
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
              <Play className="h-2 w-2 fill-white text-white" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
