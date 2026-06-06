"use client";

import React, { useRef, useState, useEffect } from "react";
import Hls, { Level } from "hls.js";
import { AlertCircle, Settings, Check, RefreshCw, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Channel } from "./types";

interface VideoPlayerProps {
  channel: Channel;
}

export default function VideoPlayer({ channel }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const [loadTimeout, setLoadTimeout] = useState(false);

  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [selectedLevel, setSelectedLevel] = useState<number>(-1);
  const [showSettings, setShowSettings] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const handleQualityChange = (levelIndex: number) => {
    setSelectedLevel(levelIndex);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
    }
  };

  const getLevelLabel = (level: Level, index: number) => {
    if (level.height) return `${level.height}p`;
    if (level.name) return level.name;
    return `Quality ${index + 1} (${Math.round(level.bitrate / 1000)} kbps)`;
  };

  // Loading Timeout Handler
  useEffect(() => {
    setLoadTimeout(false);
    if (!loading) return;

    const timer = setTimeout(() => {
      if (loading) {
        setLoadTimeout(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [loading, channel.url, reloadCount]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(channel.url);
      toast.success("Stream link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const handleReload = () => {
    setError(null);
    setLoading(true);
    setHasPlayed(false);
    setLoadTimeout(false);
    setReloadCount((prev) => prev + 1);
    toast.info("Reconnecting stream...");
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setError(null);
    setLoading(true);
    setHasPlayed(false);
    setLevels([]);
    setCurrentLevel(-1);
    setSelectedLevel(-1);
    setShowSettings(false);

    const handleWaiting = () => setLoading(true);
    const handlePlaying = () => {
      setLoading(false);
      setHasPlayed(true);
    };
    const handleCanPlay = () => {
      setLoading(false);
      setHasPlayed(true);
    };

    const handleStalled = () => {
      console.warn("Playback stalled, attempting gap-jump stall recovery...");
      if (video.buffered.length > 0) {
        video.currentTime += 0.1;
      }
    };

    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("stalled", handleStalled);

    let hls: Hls | null = null;

    const handleOnline = () => {
      if (hls) {
        console.log(
          "Network back online. Attempting to recover stream loading...",
        );
        hls.startLoad();
      }
    };
    window.addEventListener("online", handleOnline);

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        progressive: true,
        startLevel: 0,
        capLevelToPlayerSize: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 50 * 1024 * 1024,
        liveSyncDuration: 12,
        liveMaxLatencyDuration: 25,
        abrEwmaFastLive: 1.0,
        abrEwmaSlowLive: 3.0,
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.5,
        abrEwmaDefaultEstimate: 300000,
        maxStarvationDelay: 1.5,
        manifestLoadingMaxRetry: 6,
        levelLoadingMaxRetry: 6,
        fragLoadingMaxRetry: 10,
        fragLoadingTimeOut: 10000,
        fragLoadingRetryDelay: 1000,
        maxBufferHole: 2.0,
      });
      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (hls) {
          setLevels(hls.levels || []);
          setCurrentLevel(hls.currentLevel);
        }

        const connection = (navigator as any).connection;
        if (connection && hls) {
          if (connection.effectiveType === "2g") {
            hls.autoLevelCapping = 0;
          } else if (connection.effectiveType === "3g") {
            hls.autoLevelCapping = Math.min(1, hls.levels.length - 1);
          }
        }

        video.play().catch((err) => {
          console.warn("Autoplay was prevented:", err);
        });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentLevel(data.level);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn(
                "Fatal network error encountered, attempting automatic recovery...",
                data,
              );
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn(
                "Fatal media error encountered, recovering media...",
                data,
              );
              hls?.recoverMediaError();
              break;
            default:
              setError(
                "Playback failed. This stream is temporarily offline or inaccessible due to CORS browser policy.",
              );
              setLoading(false);
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.url;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((err) => {
          console.warn("Autoplay was prevented:", err);
        });
      });
      video.addEventListener("error", () => {
        setError("Failed to load stream natively in this browser.");
        setLoading(false);
      });
    } else {
      setError("HLS playback is not supported in this browser.");
      setLoading(false);
    }

    return () => {
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("stalled", handleStalled);
      window.removeEventListener("online", handleOnline);
      if (hls) {
        hls.destroy();
      }
      hlsRef.current = null;
    };
  }, [channel.url, reloadCount]);

  const backdropClass = hasPlayed
    ? "bg-slate-950/20 backdrop-blur-[1px]"
    : "bg-slate-950/60 backdrop-blur-[3px]";

  return (
    <div className="relative aspect-video w-full bg-[#030408] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80">
      {/* Loading Overlay */}
      {loading && !error && !loadTimeout && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center ${backdropClass} text-white z-20 pointer-events-none transition-all duration-300`}
        >
          <div className="flex flex-col items-center justify-center px-4 py-3 sm:px-6 sm:py-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800/80 shadow-2xl pointer-events-auto">
            <div className="relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12">
              <div className="absolute inset-0 rounded-full border-4 border-red-500/10 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <div className="text-center space-y-0.5 sm:space-y-1 mt-2.5 sm:mt-3">
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-100">
                {hasPlayed ? "Buffering..." : `Connecting to ${channel.name}`}
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-500">
                {hasPlayed
                  ? "Optimizing connection..."
                  : "Requesting media fragments..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timeout Overlay */}
      {loadTimeout && loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 text-white p-4 sm:p-6 z-20 text-center">
          <AlertCircle className="text-amber-500 h-8 w-8 sm:h-10 sm:w-10 animate-pulse mb-3" />
          <div className="space-y-2 max-w-sm">
            <p className="text-xs sm:text-sm font-bold text-amber-400">
              Stream Connection Timeout
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-400 leading-relaxed">
              This channel is taking longer than usual to respond. It may be offline, restricted by CORS policies, or currently congested.
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-2 pointer-events-auto">
              <button
                onClick={handleReload}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] sm:text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry Connection
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] sm:text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 text-white p-4 sm:p-6 z-20 text-center">
          <AlertCircle className="text-red-500 h-8 w-8 sm:h-10 sm:w-10 animate-bounce mb-3" />
          <div className="space-y-2 max-w-md">
            <p className="text-xs sm:text-sm font-bold text-red-400">{error}</p>
            <p className="text-[9px] sm:text-[10px] text-slate-500 leading-relaxed">
              IPTV channels often change server paths or restrict access outside specific apps. You can try copying the link to play in an external player like VLC or KMPlayer.
            </p>
            <div className="flex flex-wrap gap-2 justify-center pt-2 pointer-events-auto">
              <button
                onClick={handleReload}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] sm:text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reload Stream
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#1b223c] hover:bg-[#252f52] text-blue-300 border border-blue-900/40 rounded-lg text-[10px] sm:text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy Stream URL
              </button>
              <a
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] sm:text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open Directly
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Quality Settings Controller */}
      {levels.length > 0 && (
        <div
          ref={settingsRef}
          className="absolute top-3 right-3 z-35 flex flex-col items-end"
        >
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950/80 hover:bg-slate-950/95 text-white rounded-lg border border-slate-800/80 shadow-lg backdrop-blur-md transition-all active:scale-95 focus:outline-none pointer-events-auto cursor-pointer"
            title="Streaming Quality"
          >
            <Settings
              className={`h-4 w-4 ${showSettings ? "animate-spin" : ""}`}
              style={{ animationDuration: "3s" }}
            />
            <span className="text-[11px] font-semibold tracking-wide">
              {selectedLevel === -1
                ? `Auto${currentLevel >= 0 && levels[currentLevel] ? ` (${getLevelLabel(levels[currentLevel], currentLevel)})` : ""}`
                : getLevelLabel(levels[selectedLevel], selectedLevel)}
            </span>
          </button>

          {showSettings && (
            <div className="mt-1.5 w-40 bg-slate-950/95 border border-slate-800 rounded-lg shadow-xl backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 py-1 pointer-events-auto">
              <div className="px-3 py-1 border-b border-slate-900">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Select Quality
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto scrollbar-thin">
                {/* Auto Option */}
                <button
                  onClick={() => {
                    handleQualityChange(-1);
                    setShowSettings(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs transition-colors hover:bg-white/10 cursor-pointer ${
                    selectedLevel === -1
                      ? "text-red-400 font-bold"
                      : "text-slate-300"
                  }`}
                >
                  <span>Auto</span>
                  {selectedLevel === -1 && (
                    <Check className="h-3.5 w-3.5 text-red-500 shrink-0" />
                  )}
                </button>

                {/* Specific Levels */}
                {levels
                  .map((level, originalIndex) => ({ level, originalIndex }))
                  .sort((a, b) => (b.level.height || 0) - (a.level.height || 0))
                  .map(({ level, originalIndex }) => (
                    <button
                      key={originalIndex}
                      onClick={() => {
                        handleQualityChange(originalIndex);
                        setShowSettings(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs transition-colors hover:bg-white/10 cursor-pointer ${
                        selectedLevel === originalIndex
                          ? "text-red-400 font-bold"
                          : "text-slate-300"
                      }`}
                    >
                      <span>{getLevelLabel(level, originalIndex)}</span>
                      {selectedLevel === originalIndex && (
                        <Check className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      <video
        ref={videoRef}
        controls
        title="Live IPTV Video Stream"
        className="w-full h-full object-contain"
        poster={channel.logo}
        playsInline
      />
    </div>
  );
}
