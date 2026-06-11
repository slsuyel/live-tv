"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Tv,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  RefreshCw,
  Play,
  Pause,
  ArrowLeft,
  Grid2X2,
  Columns,
  Columns3,
  MonitorPlay,
} from "lucide-react";
import Hls from "hls.js";
import { toast } from "sonner";

interface Channel {
  _id?: string;
  name: string;
  logo?: string;
  group: string;
  url: string;
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
}

export default function FifaLivePage() {
  const [loading, setLoading] = useState(true);
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
        // Fetch last 6 channels from the stream database to verify
        const apiDbUrl = `${baseUrl}/stream/all?limit=6`;

        let fetched: Channel[] = [];
        try {
          const res = await fetch(apiDbUrl);
          if (res.ok) {
            const json = await res.json();
            fetched = json?.data || [];
          } else {
            throw new Error("API failed");
          }
        } catch (e) {
          console.error("FifaLive: API failed", e);
        }

        if (Array.isArray(fetched) && fetched.length > 0) {
          // Check working streams in parallel (2.5 seconds timeout per stream check)
          const checkPromises = fetched.slice(0, 6).map(async (ch) => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 2500);
              const checkRes = await fetch(ch.url, {
                method: "GET",
                signal: controller.signal,
              });
              clearTimeout(timeoutId);
              if (checkRes.ok) {
                return ch;
              }
            } catch (err) {
              console.warn(`Stream verification failed for ${ch.name}:`, err);
            }
            return null;
          });

          const verifiedResults = await Promise.all(checkPromises);
          const workingStreams = verifiedResults.filter(
            (ch): ch is Channel => ch !== null,
          );

          // Render at most 4 working streams
          const latest4 = workingStreams.slice(0, 4);

          if (latest4.length > 0) {
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
            }));
            setActiveStreams(initial);
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
    setActiveStreams((prev) =>
      prev.filter((stream) => stream.gridId !== gridId),
    );
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
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-lg border border-white/10 transition-colors"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Main Portal</span>
          </Link>
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
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
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
                Fetching Latest 4 Live Channels...
              </p>
            </div>
          ) : activeStreams.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[#0a071d]/40 rounded-2xl border border-white/5 backdrop-blur-sm">
              <Tv size={48} className="text-zinc-600 mb-3 animate-bounce" />
              <h3 className="text-lg font-bold text-zinc-300">
                No active streams found
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm mt-1">
                Unable to load the latest live streams. Please try again later.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-1 sm:gap-2 h-full ${getGridContainerClass()}`}
            >
              {activeStreams.map((stream) => (
                <div
                  key={stream.gridId}
                  className={`bg-[#0c0924] border border-white/10 rounded-xl overflow-hidden flex flex-col transition-all duration-300 group hover:border-purple-500/50 shadow-xl ${
                    stream.colSpan === 2
                      ? "md:col-span-2"
                      : stream.colSpan === 3
                        ? "md:col-span-3"
                        : ""
                  } ${stream.rowSpan === 2 ? "md:row-span-2" : ""}`}
                >
                  <div className="bg-[#0f0b2d] px-2 py-1.5 border-b border-white/5 flex items-center justify-between text-[10px] sm:text-xs gap-1.5 shrink-0">
                    <div className="flex items-center gap-1.5 min-w-0">
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
                      <div className="flex items-center bg-white/5 border border-white/10 rounded px-1 text-[10px] gap-1">
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
                        className={`p-1.5 rounded hover:bg-white/10 transition-colors ${
                          !stream.isMuted ? "text-emerald-400" : "text-zinc-400"
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
                    <MultiviewPlayerElement
                      url={stream.url}
                      isMuted={stream.isMuted}
                      reloadCount={stream.reloadCount}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

interface MultiviewPlayerElementProps {
  url: string;
  isMuted: boolean;
  reloadCount: number;
}

function MultiviewPlayerElement({
  url,
  isMuted,
  reloadCount,
}: MultiviewPlayerElementProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setLoading(true);
    setError(null);
    setIsPaused(false);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported() && url.includes(".m3u8")) {
      const hls = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch((err) => {
          console.warn("Autoplay was blocked or interrupted:", err);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setError("Live stream went offline or is not loading.");
              setLoading(false);
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        setLoading(false);
        video.play().catch((err) => {
          console.warn("Autoplay blocked:", err);
        });
      });
      video.addEventListener("error", () => {
        setError("Playback error loading the stream.");
        setLoading(false);
      });
    } else {
      setError("This stream format is not supported by your browser.");
      setLoading(false);
    }
  }, [url, reloadCount]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const wasFullscreenRef = useRef(false);
  const pausedByFullscreenRef = useRef(false);

  // Fullscreen change detection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleFullscreenChange = () => {
      const isCurrentFs =
        document.fullscreenElement === video ||
        (document as any).webkitFullscreenElement === video;
      if (isCurrentFs) {
        wasFullscreenRef.current = true;
        window.dispatchEvent(
          new CustomEvent("stream-fullscreen-enter", { detail: { url } }),
        );
      } else if (wasFullscreenRef.current) {
        wasFullscreenRef.current = false;
        window.dispatchEvent(new CustomEvent("stream-fullscreen-exit"));
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, [url]);

  // Fullscreen sibling sync (pause/resume)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnterFs = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.url !== url) {
        if (!video.paused) {
          video.pause();
          setIsPaused(true);
          pausedByFullscreenRef.current = true;
        }
      }
    };

    const onExitFs = () => {
      if (pausedByFullscreenRef.current) {
        pausedByFullscreenRef.current = false;
        video
          .play()
          .then(() => setIsPaused(false))
          .catch(() => {});
      }
    };

    window.addEventListener("stream-fullscreen-enter", onEnterFs);
    window.addEventListener("stream-fullscreen-exit", onExitFs);
    return () => {
      window.removeEventListener("stream-fullscreen-enter", onEnterFs);
      window.removeEventListener("stream-fullscreen-exit", onExitFs);
    };
  }, [url]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPaused(false));
    } else {
      video.pause();
      setIsPaused(true);
      pausedByFullscreenRef.current = false; // Manually paused, reset fullscreen sync flag
    }
  };

  const enterFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-black group/player">
      <video
        ref={videoRef}
        playsInline
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlayPause}
      />

      {loading && !error && (
        <div className="absolute inset-0 bg-[#070415]/85 flex flex-col items-center justify-center z-10 gap-2">
          <RefreshCw className="animate-spin text-purple-500 h-6 w-6" />
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
            Loading Live Stream...
          </span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center z-10 p-4 text-center gap-2">
          <X className="text-red-500 h-6 w-6" />
          <p className="text-[11px] font-bold text-red-300">{error}</p>
          <span className="text-[9px] text-red-400/70">
            Check details or try reloading.
          </span>
        </div>
      )}

      {isPaused && !error && !loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 pointer-events-none">
          <Play className="h-8 w-8 text-white opacity-80" />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/40 to-transparent p-2 opacity-0 group-hover/player:opacity-100 transition-opacity duration-200 flex items-center justify-between z-10">
        <button
          onClick={togglePlayPause}
          className="p-1 rounded hover:bg-white/10 text-white transition-colors"
        >
          {isPaused ? <Play size={12} /> : <Pause size={12} />}
        </button>

        <button
          onClick={enterFullscreen}
          className="p-1 rounded hover:bg-white/10 text-white transition-colors"
          title="Fullscreen"
        >
          <Maximize2 size={12} />
        </button>
      </div>
    </div>
  );
}
