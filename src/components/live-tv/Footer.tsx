"use client";

import React from "react";
import { Tv, Info, Globe, Heart } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100/80 dark:border-slate-800/80 mt-auto transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Logo & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="QoraPlay TV"
                width={250}
                height={58}
                className="h-8 sm:h-12 w-auto"
              />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Enjoy free live television streaming from around the world. Access
              over 7,000 channels covering sports, news, entertainment, and
              movies on any device, completely free.
            </p>
          </div>

          {/* Legal / Disclaimer */}
          <div className="md:col-span-7 space-y-3 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/40 dark:border-amber-900/20 p-4 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              IPTV Content Disclaimer
            </h4>
            <p className="text-[11px] text-slate-505 dark:text-slate-400 leading-relaxed">
              QoraPlay TV serves as a directory of publicly available HLS
              streaming URL links. We do not host, store, stream, or broadcast
              any media or copyright content. All streams are retrieved directly
              from public repositories (such as IPTV indexes on GitHub). If you
              are a copyright owner and want any content removed, please contact
              the stream source providers directly.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800/80 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} QoraPlay TV. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />{" "}
            for free streaming access.
          </p>
        </div>
      </div>
    </footer>
  );
}
