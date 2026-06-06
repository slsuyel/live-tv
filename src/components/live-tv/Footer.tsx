"use client";

import React from "react";
import { Tv, Info, Globe, Heart, Mail } from "lucide-react";
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
                className="h-8 sm:h-12 w-auto dark:[filter:invert(1)_hue-rotate(180deg)]"
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
          <div className="space-y-1">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} QoraPlay TV. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-400/80 dark:text-slate-500/80 flex items-center justify-center sm:justify-start gap-1">
              Developed by{" "}
              <a
                href="https://fb.com/slsuyel"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                slsuyel
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2">
            <a
              href="mailto:slsuyel@gmail.com"
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>slsuyel@gmail.com</span>
            </a>
            <a
              href="https://fb.com/slsuyel"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
