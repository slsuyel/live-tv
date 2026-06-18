"use client";

import VideoPlayer from "@/components/live-tv/VideoPlayer";
import {
  ArrowLeft,
  Columns,
  Columns3,
  Grid2X2,
  MonitorPlay,
  RefreshCw,
  Search,
  Tv,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Channel {
  _id?: string;
  name: string;
  logo?: string;
  group: string;
  url: string;
  type?: string;
  kid?: string;
  key?: string;
}

interface ActiveStream {
  gridId: string;
  _id: string;
  name: string;
  url: string;
  logo?: string;
  colSpan: 1 | 2 | 3;
  rowSpan: 1 | 2;
  isMuted: boolean;
  reloadCount: number;
  type?: string;
  kid?: string;
  key?: string;
}

export default function FifaLivePage() {
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedGridId, setFocusedGridId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeStreams, setActiveStreams] = useState<ActiveStream[]>([]);
  const [gridColumns, setGridColumns] = useState<"auto" | "2" | "3" | "4">(
    "auto",
  );

  useEffect(() => {
    async function fetchLast4Channels() {
      try {
        setLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://server.nextqora.com/api/v1";
        const apiDbUrl = `${baseUrl}/stream/all?limit=150`;
        const fifaUrl =
          "https://raw.githubusercontent.com/SHAJON-404/iptv-playlist/main/app/data/fifa.json";

        let fetched: Channel[] = [];
        let fifa: Channel[] = [];

        // Fetch FIFA playlist
        try {
          const res = await fetch(fifaUrl);
          if (res.ok) {
            const data = await res.json();
            fifa = Array.isArray(data) ? data : [];
          }
        } catch (err) {
          console.error("FifaLive: failed to fetch FIFA channels", err);
        }

        // Fetch DB channels
        try {
          const res = await fetch(apiDbUrl);
          if (res.ok) {
            const json = await res.json();
            fetched = json?.data || [];
          }
        } catch (err) {
          console.error("FifaLive: failed to fetch API database channels", err);
        }

        // Merge channels
        let merged = [...fifa];
        const fifaUrls = new Set(fifa.map((c) => c.url));
        fetched.forEach((c) => {
          if (!fifaUrls.has(c.url)) {
            merged.push(c);
          }
        });

        setChannels(merged);

        // Prepopulate the grid with the first 4 channels
        if (merged.length > 0) {
          const latest4 = merged.slice(0, 4);
          const initial = latest4.map((ch, idx) => ({
            gridId: `${ch._id || `id_${idx}`}_${Date.now()}_${idx}`,
            _id: ch._id || `id_${idx}`,
            name: ch.name,
            url: ch.url,
            logo: ch.logo,
            colSpan: 1 as const,
            rowSpan: 1 as const,
            isMuted: true,
            reloadCount: 0,
            type: ch.type,
            kid: ch.kid,
            key: ch.key,
          }));
          setActiveStreams(initial);
          if (initial.length > 0) {
            setFocusedGridId(initial[0].gridId);
          }
        }
      } catch (err) {
        console.error("Error loading channels:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLast4Channels();
  }, []);

  const removeStream = (gridId: string) => {
    setActiveStreams((prev) => {
      const filtered = prev.filter((stream) => stream.gridId !== gridId);
      if (focusedGridId === gridId) {
        setFocusedGridId(filtered.length > 0 ? filtered[0].gridId : null);
      }
      return filtered;
    });
  };

  const handleChannelSelect = (ch: Channel) => {
    if (focusedGridId && activeStreams.some(s => s.gridId === focusedGridId)) {
      setActiveStreams((prev) =>
        prev.map((stream) =>
          stream.gridId === focusedGridId
            ? {
              ...stream,
              _id: ch._id || `id_${Date.now()}`,
              name: ch.name,
              url: ch.url,
              logo: ch.logo,
              type: ch.type,
              kid: ch.kid,
              key: ch.key,
              reloadCount: stream.reloadCount + 1,
            }
            : stream
        )
      );
      toast.success(`Loaded ${ch.name} into selected slot`);
    } else {
      if (activeStreams.length >= 4) {
        toast.error("Grid is full! Close a stream or select a slot to replace it.");
        return;
      }
      const newStream: ActiveStream = {
        gridId: `${ch._id || `id_${Date.now()}`}_${Date.now()}`,
        _id: ch._id || `id_${Date.now()}`,
        name: ch.name,
        url: ch.url,
        logo: ch.logo,
        colSpan: 1,
        rowSpan: 1,
        isMuted: true,
        reloadCount: 0,
        type: ch.type,
        kid: ch.kid,
        key: ch.key,
      };
      setActiveStreams((prev) => [...prev, newStream]);
      setFocusedGridId(newStream.gridId);
      toast.success(`Added ${ch.name} to grid`);
    }
  };

  const toggleMuteStream = (gridId: string) => {
    setActiveStreams((prev) =>
      prev.map((stream) => {
        if (stream.gridId === gridId) {
          const newMutedState = !stream.isMuted;
          if (!newMutedState) {
            toast.info(`Audio focused on ${stream.name}`);
          }
          return { ...stream, isMuted: newMutedState };
        } else {
          return { ...stream, isMuted: true };
        }
      }),
    );
  };

  const reloadStream = (gridId: string) => {
    setActiveStreams((prev) =>
      prev.map((stream) =>
        stream.gridId === gridId
          ? { ...stream, reloadCount: stream.reloadCount + 1 }
          : stream,
      ),
    );
    toast.success("Stream reloaded!");
  };

  const updateStreamSpan = (
    gridId: string,
    type: "col" | "row",
    action: "inc" | "dec",
  ) => {
    setActiveStreams((prev) =>
      prev.map((stream) => {
        if (stream.gridId === gridId) {
          if (type === "col") {
            const current = stream.colSpan;
            let next = current;
            if (action === "inc" && current < 3) next = (current + 1) as any;
            if (action === "dec" && current > 1) next = (current - 1) as any;
            return { ...stream, colSpan: next };
          } else {
            const current = stream.rowSpan;
            let next = current;
            if (action === "inc" && current < 2) next = (current + 1) as any;
            if (action === "dec" && current > 1) next = (current - 1) as any;
            return { ...stream, rowSpan: next };
          }
        }
        return stream;
      }),
    );
  };

  const applyLayoutPreset = (
    preset: "dual" | "quad" | "triple" | "cinematic",
  ) => {
    if (activeStreams.length === 0) return;

    // Adjust spanning based on presets
    if (preset === "dual") {
      setActiveStreams((prev) =>
        prev.map((st) => ({ ...st, colSpan: 1, rowSpan: 1 })),
      );
      setGridColumns("2");
    } else if (preset === "quad") {
      setActiveStreams((prev) =>
        prev.map((st) => ({ ...st, colSpan: 1, rowSpan: 1 })),
      );
      setGridColumns("2");
    } else if (preset === "triple") {
      setActiveStreams((prev) =>
        prev.map((st) => ({ ...st, colSpan: 1, rowSpan: 1 })),
      );
      setGridColumns("3");
    } else if (preset === "cinematic") {
      setActiveStreams((prev) =>
        prev.map((st, i) => ({
          ...st,
          colSpan: i === 0 ? 2 : 1,
          rowSpan: i === 0 ? 2 : 1,
        })),
      );
      setGridColumns("auto");
    }
    toast.success(`Applied layout preset!`);
  };

  const getGridContainerClass = () => {
    const count = activeStreams.length;
    if (gridColumns === "2") return "grid-cols-2";
    if (gridColumns === "3") return "grid-cols-2 md:grid-cols-3";
    if (gridColumns === "4") return "grid-cols-2 lg:grid-cols-4";

    if (count <= 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    return "grid-cols-2 md:grid-cols-3";
  };

  return (
    <div className="min-h-screen bg-[#070415] text-white flex flex-col font-sans selection:bg-purple-600/35 selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 border-b border-white/5 bg-[#0a071d]/80 backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-white/10 transition-colors shrink-0"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Main Portal</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${showSidebar
              ? "bg-violet-600 border-violet-500 text-white font-bold shadow-md shadow-violet-500/20"
              : "bg-white/5 border-white/10 text-zinc-350 hover:bg-white/10 hover:text-white"
              }`}
            title="Toggle Channels Sidebar"
          >
            <Search size={13} />
            <span>Channels</span>
          </button>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center h-7.5 w-7.5 rounded-lg bg-linear-to-tr from-purple-600 to-cyan-500 shadow-lg shadow-purple-500/20">
              <Tv size={15} className="text-white" />
            </div>
            <div>
              <h1 className="text-xs sm:text-base font-black tracking-tight bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                FIFA MULTIVIEW LIVE
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[8px] sm:text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                  Control Room
                </span>
              </div>
            </div>
          </div>
        </div>

        {activeStreams.length > 0 && (
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-xs shrink-0">
            <span className="text-zinc-500 font-semibold px-2 text-[10px] uppercase hidden sm:inline">
              Layouts:
            </span>
            <button
              onClick={() => applyLayoutPreset("dual")}
              className="flex items-center gap-1 px-2 py-1 hover:bg-white/5 rounded transition-all text-[11px]"
              title="Dual Screen Layout"
            >
              <Columns size={12} className="text-cyan-400" />
              <span className="hidden sm:inline">Dual</span>
            </button>
            <button
              onClick={() => applyLayoutPreset("quad")}
              className="flex items-center gap-1 px-2 py-1 hover:bg-white/5 rounded transition-all text-[11px]"
              title="Quad Grid 2x2"
            >
              <Grid2X2 size={12} className="text-purple-400" />
              <span className="hidden sm:inline">Quad</span>
            </button>
            <button
              onClick={() => applyLayoutPreset("triple")}
              className="flex items-center gap-1 px-2 py-1 hover:bg-white/5 rounded transition-all text-[11px]"
              title="Triple Grid"
            >
              <Columns3 size={12} className="text-emerald-400" />
              <span className="hidden sm:inline">Triple</span>
            </button>
            <button
              onClick={() => applyLayoutPreset("cinematic")}
              className="flex items-center gap-1 px-2 py-1 hover:bg-white/5 rounded transition-all text-[11px]"
              title="Cinematic Focus Layout"
            >
              <MonitorPlay size={12} className="text-rose-400" />
              <span className="hidden sm:inline">Cinematic</span>
            </button>
          </div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        <main className="flex-1 p-1 sm:p-2 overflow-y-auto min-w-0">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <RefreshCw className="animate-spin text-purple-500 h-10 w-10 mb-3" />
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-wider animate-pulse">
                Fetching Latest Live Channels...
              </p>
            </div>
          ) : activeStreams.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[#0a071d]/40 rounded-2xl border border-white/5 backdrop-blur-sm">
              <Tv size={48} className="text-zinc-600 mb-3 animate-bounce" />
              <h3 className="text-lg font-bold text-zinc-300">
                No active streams found
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm mt-1">
                Unable to load the latest live streams. Click "Channels" to add some!
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-1 sm:gap-2 h-full ${getGridContainerClass()}`}
            >
              {activeStreams.map((stream) => (
                <div
                  key={stream.gridId}
                  onClick={() => setFocusedGridId(stream.gridId)}
                  className={`bg-[#0c0924] border rounded-xl overflow-hidden flex flex-col transition-all duration-300 group shadow-xl ${focusedGridId === stream.gridId
                    ? "border-violet-500 shadow-violet-500/25 ring-2 ring-violet-500/20"
                    : "border-white/10 hover:border-purple-500/50"
                    } ${stream.colSpan === 2
                      ? "md:col-span-2"
                      : stream.colSpan === 3
                        ? "md:col-span-3"
                        : ""
                    } ${stream.rowSpan === 2 ? "md:row-span-2" : ""}`}
                >
                  <div className="bg-[#0f0b2d] px-2 py-1.5 border-b border-white/5 flex items-center justify-between text-[10px] sm:text-xs gap-1.5 shrink-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {focusedGridId === stream.gridId && (
                        <span className="bg-violet-600 text-white font-extrabold text-[8px] px-1 py-0.5 rounded shadow-sm shadow-violet-600/30 tracking-wider shrink-0 animate-pulse">
                          FOCUS
                        </span>
                      )}
                      {stream.logo && (
                        <img
                          src={stream.logo}
                          alt=""
                          className="h-4.5 w-7 object-cover rounded bg-white/10 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      )}
                      <span className="font-bold text-zinc-200 truncate">
                        {stream.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center bg-white/5 border border-white/10 rounded px-1 text-[10px] gap-1" onClick={(e) => e.stopPropagation()}>
                        <span className="text-zinc-500 font-semibold px-0.5">
                          Size:
                        </span>
                        <button
                          onClick={() =>
                            updateStreamSpan(stream.gridId, "col", "dec")
                          }
                          disabled={stream.colSpan <= 1}
                          className="px-1 hover:text-white text-zinc-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                          title="Reduce Width"
                        >
                          W-
                        </button>
                        <span className="font-bold text-[9px] text-purple-400">
                          {stream.colSpan}x
                        </span>
                        <button
                          onClick={() =>
                            updateStreamSpan(stream.gridId, "col", "inc")
                          }
                          disabled={stream.colSpan >= 3}
                          className="px-1 hover:text-white text-zinc-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                          title="Increase Width"
                        >
                          W+
                        </button>
                        <div className="w-px h-2.5 bg-white/10" />
                        <button
                          onClick={() =>
                            updateStreamSpan(stream.gridId, "row", "dec")
                          }
                          disabled={stream.rowSpan <= 1}
                          className="px-1 hover:text-white text-zinc-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                          title="Reduce Height"
                        >
                          H-
                        </button>
                        <span className="font-bold text-[9px] text-cyan-400">
                          {stream.rowSpan}x
                        </span>
                        <button
                          onClick={() =>
                            updateStreamSpan(stream.gridId, "row", "inc")
                          }
                          disabled={stream.rowSpan >= 2}
                          className="px-1 hover:text-white text-zinc-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                          title="Increase Height"
                        >
                          H+
                        </button>
                      </div>

                      <button
                        onClick={() => toggleMuteStream(stream.gridId)}
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${!stream.isMuted ? "text-emerald-400" : "text-zinc-400"
                          }`}
                        title={
                          stream.isMuted
                            ? "Listen to this stream"
                            : "Mute audio"
                        }
                      >
                        {!stream.isMuted ? (
                          <Volume2 size={13} />
                        ) : (
                          <VolumeX size={13} />
                        )}
                      </button>

                      <button
                        onClick={() => reloadStream(stream.gridId)}
                        className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        title="Reload stream player"
                      >
                        <RefreshCw size={12} />
                      </button>

                      <button
                        onClick={() => removeStream(stream.gridId)}
                        className="p-1.5 rounded hover:bg-rose-500/25 text-zinc-400 hover:text-rose-400 transition-colors ml-0.5"
                        title="Close player screen"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 bg-black relative flex items-center justify-center min-h-[160px]">
                    <VideoPlayer
                      channel={{
                        name: stream.name,
                        logo: stream.logo || "",
                        url: stream.url,
                        group: "FIFA",
                        type: stream.type,
                        kid: stream.kid,
                        key: stream.key,
                      }}
                      isMuted={stream.isMuted}
                      onMuteChange={(muted) => toggleMuteStream(stream.gridId)}
                      reloadCount={stream.reloadCount}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Channels Selection Sidebar */}
        {showSidebar && (
          <aside className="w-80 border-l border-white/10 bg-[#0a071d]/90 backdrop-blur-md flex flex-col shrink-0 z-20 animate-in slide-in-from-right duration-350">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase">
                  Available Streams
                </h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search streams..."
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none rounded-xl text-xs text-white placeholder-zinc-500 transition-all"
                />
              </div>
              {focusedGridId && (
                <div className="bg-violet-955/40 border border-violet-500/20 rounded-lg p-2 text-[10px] text-violet-300">
                  <span className="font-bold">Active Focus:</span> Click any stream below to load it into the selected grid slot.
                </div>
              )}
            </div>

            {/* Sidebar Channels List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
              {channels
                .filter((ch) =>
                  ch.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((ch, idx) => {
                  const isInGrid = activeStreams.some((s) => s.url === ch.url);
                  return (
                    <button
                      key={`${ch.url}-${idx}`}
                      onClick={() => handleChannelSelect(ch)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${isInGrid
                          ? "bg-violet-600/15 border-violet-500/30 text-violet-400 font-bold"
                          : "bg-white/2 border-white/5 hover:border-white/15 hover:bg-white/5 text-zinc-350 hover:text-white"
                        }`}
                    >
                      <div className="relative h-8 w-8 bg-white/5 border border-white/10 rounded-lg p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        {ch.logo ? (
                          <img
                            src={ch.logo}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <Tv className="h-4 w-4 text-zinc-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[11px] font-bold leading-snug truncate">
                          {ch.name}
                        </h4>
                        <span className="text-[9px] text-zinc-500 font-medium">
                          {ch.group}
                        </span>
                      </div>
                      <div className="text-[10px] font-semibold text-zinc-500 shrink-0">
                        {isInGrid ? "Active" : "Load"}
                      </div>
                    </button>
                  );
                })}
              {channels.filter((ch) =>
                ch.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                  <div className="py-20 text-center text-zinc-500 text-xs">
                    No streams found.
                  </div>
                )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
