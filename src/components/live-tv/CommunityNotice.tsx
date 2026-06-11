"use client";

import React, { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";

interface CommunityNoticeProps {
  id?: string;
  className?: string;
}

export default function CommunityNotice({
  id = "developer-support-card",
  className = "",
}: CommunityNoticeProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`relative group bg-white dark:bg-[#13112a]/45 border border-slate-200 dark:border-white/10 rounded-xl p-3 sm:py-2.5 sm:px-4 overflow-hidden transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between gap-2.5 sm:gap-3 relative z-10 pr-6">
        {/* Info Text */}
        {/* Info Text with Marquee */}
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <Heart
            size={14}
            className="text-emerald-500 fill-emerald-500/10 shrink-0 animate-pulse"
          />
          <div className="overflow-hidden flex-1">
            {React.createElement(
              "marquee",
              {
                className:
                  "text-[11px] sm:text-xs text-slate-600 dark:text-zinc-350 font-medium block pt-0.5",
                scrollamount: "3.5",
              },
              <>
                এটি সুয়েল হক দ্বারা তৈরি একটি অলাভজনক সামাজিক প্রকল্প। যেকোনো সমস্যা,
                সহায়তা বা চ্যানেল লিংকের জন্য WhatsApp-এ যোগাযোগ করুন:{" "}
                <strong className="text-slate-800 dark:text-white">
                  01722597565
                </strong>
                . Non-profit community project developed by{" "}
                <strong className="text-slate-800 dark:text-white">
                  Suyel Haque
                </strong>
                .
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center">
          <a
            href="https://wa.me/8801722597565?text=Hello%20Suyel,%20I%20have%20an%20issue%2520with%20the%20Live%20TV%20App."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <svg
              className="h-3 w-3 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.488 1.977 14.021.953 11.4.953 5.962.953 1.539 5.322 1.536 10.75c0 1.702.469 3.366 1.356 4.845L1.874 20.3l4.773-1.146zm11.378-5.077c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2.5 right-2.5 h-5 w-5 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
        aria-label="Dismiss Notice"
      >
        <X size={12} />
      </button>
    </div>
  );
}
