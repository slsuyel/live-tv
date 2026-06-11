"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Hls, { Level } from "hls.js";
import {
  AlertCircle,
  Settings,
  Check,
  RefreshCw,
  Copy,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture,
  ChevronsLeft,
  ChevronsRight,
  Tv,
} from "lucide-react";
import { toast } from "sonner";
import { Channel } from "./types";

interface VideoPlayerProps {
  channel: Channel;
}

export default function VideoPlayer({ channel }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Core stream loading states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const [loadTimeout, setLoadTimeout] = useState(false);

  // Quality settings
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [selectedLevel, setSelectedLevel] = useState<number>(-1);
  const [showSettings, setShowSettings] = useState(false);

  // Custom Controls UI states
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Double Click / Double Tap Seek States
  const [activeSeekIndicator, setActiveSeekIndicator] = useState<{
    side: "left" | "right";
    visible: boolean;
  }>({ side: "left", visible: false });

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const seekTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      const video = videoRef.current;
      if (video && !video.paused) {
        setShowControls(false);
      }
    }, 3000);
  }, []);

  // Close quality settings dropdown on click outside
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
    setShowSettings(false);
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

  // Listen to video element properties changes to keep React state in sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);
    const handleVolumeChange = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    setIsPaused(video.paused);
    setIsMuted(video.muted);
    setVolume(video.volume);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [channel.url, reloadCount]);

  // Hls.js setup
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

    let stallTimer: NodeJS.Timeout | null = null;

    const handleWaiting = () => {
      setLoading(true);
      if (stallTimer) clearTimeout(stallTimer);
      // If the player remains in a waiting state for over 3 seconds, nudge the playhead to bypass the buffer stall
      stallTimer = setTimeout(() => {
        if (video && !video.paused) {
          console.warn(
            "Stall watchdog triggered: Nudging playback slightly to recover from buffering...",
          );
          video.currentTime += 0.25;
        }
      }, 3000);
    };

    const handlePlaying = () => {
      setLoading(false);
      setHasPlayed(true);
      if (stallTimer) {
        clearTimeout(stallTimer);
        stallTimer = null;
      }
    };

    const handleCanPlay = () => {
      setLoading(false);
      setHasPlayed(true);
    };

    const handleStalled = () => {
      console.warn("Playback stalled, attempting gap-jump stall recovery...");
      if (video.buffered.length > 0) {
        video.currentTime += 0.2;
      }
    };

    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("stalled", handleStalled);

    let hls: Hls | null = null;
    let networkRetryCount = 0;
    let mediaRetryCount = 0;

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
        lowLatencyMode: true,
        progressive: true,
        startLevel: -1,
        capLevelToPlayerSize: true,
        maxBufferLength: 20, // Keep buffer small to avoid latency bloat
        maxMaxBufferLength: 40,
        maxBufferSize: 60 * 1024 * 1024,
        liveSyncDuration: 8, // Target playhead to be 8 seconds behind the live edge (low latency)
        liveMaxLatencyDuration: 15,
        abrEwmaFastLive: 1.0,
        abrEwmaSlowLive: 3.0,
        abrBandWidthFactor: 0.9,
        abrBandWidthUpFactor: 0.6,
        abrEwmaDefaultEstimate: 500000,
        maxStarvationDelay: 2.0,
        manifestLoadingMaxRetry: 6,
        levelLoadingMaxRetry: 6,
        fragLoadingMaxRetry: 10,
        fragLoadingTimeOut: 12000,
        fragLoadingRetryDelay: 1000,
        maxBufferHole: 0.5, // Automatically skip buffer holes larger than 0.5 seconds
        nudgeMaxRetry: 8,
      });
      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (hls) {
          setLevels(hls.levels || []);
          setCurrentLevel(hls.currentLevel);
        }

        // Attempt muted autoplay to satisfy browser security rules
        video.muted = true;
        setIsMuted(true);
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
              const statusCode = data.response?.code;
              if (statusCode === 404 || statusCode === 403) {
                console.error(
                  `Fatal stream error (${statusCode}): Stream is offline or unauthorized.`,
                );
                setError(
                  `Playback failed: Stream returned status ${statusCode}.`,
                );
                setLoading(false);
                hls?.destroy();
                break;
              }

              if (networkRetryCount < 3) {
                networkRetryCount++;
                console.warn(
                  `Fatal network error encountered (attempt ${networkRetryCount}/3), retrying...`,
                  data,
                );
                hls?.startLoad();
              } else {
                console.error(
                  "Fatal network error: reached maximum retry limit.",
                );
                setError(
                  "Playback failed: Stream is offline or blocked by original server CORS policy.",
                );
                setLoading(false);
                hls?.destroy();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              if (mediaRetryCount < 3) {
                mediaRetryCount++;
                console.warn(
                  `Fatal media error encountered (attempt ${mediaRetryCount}/3), recovering...`,
                  data,
                );
                hls?.recoverMediaError();
              } else {
                console.error(
                  "Fatal media error: reached maximum recovery limit.",
                );
                setError(
                  "Playback failed: Stream decoding issues. Please try reloading.",
                );
                setLoading(false);
                hls?.destroy();
              }
              break;
            default:
              setError(
                "Playback failed. This stream is offline or blocked by original server CORS policy.",
              );
              setLoading(false);
              hls?.destroy();
              break;
          }
        } else {
          // Automatic recovery for non-fatal buffer stalls
          if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
            console.warn("Non-fatal buffer stall encountered, recovering...");
            if (video && !video.paused) {
              video.currentTime += 0.2;
            }
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.url;
      video.addEventListener("loadedmetadata", () => {
        video.muted = true;
        setIsMuted(true);
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
      if (stallTimer) clearTimeout(stallTimer);
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

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Picture in Picture event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnterPip = () => setIsPip(true);
    const handleLeavePip = () => setIsPip(false);

    video.addEventListener("enterpictureinpicture", handleEnterPip);
    video.addEventListener("leavepictureinpicture", handleLeavePip);

    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnterPip);
      video.removeEventListener("leavepictureinpicture", handleLeavePip);
    };
  }, []);

  // Controls overlay auto-hide
  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [resetControlsTimeout]);

  // Toggle Play / Pause
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch((err) => console.warn(err));
    } else {
      video.pause();
    }
    resetControlsTimeout();
  };

  // Toggle Mute / Unmute
  const handleMuteUnmute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    if (!video.muted && video.volume === 0) {
      video.volume = 0.8;
      setVolume(0.8);
    }
    resetControlsTimeout();
  };

  // Handle Volume Slider Change
  const handleVolumeChangeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = parseFloat(e.target.value);
    video.volume = newVol;
    setVolume(newVol);
    if (newVol > 0) {
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
    resetControlsTimeout();
  };

  // Seek forward/backward
  const handleSeek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.currentTime = Math.max(
        0,
        Math.min(video.duration || 99999, video.currentTime + seconds),
      );
    } catch (err) {
      console.warn("Seeking failed:", err);
    }
    resetControlsTimeout();
  };

  // Toggle Fullscreen
  const handleFullscreenToggle = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => console.warn(err));
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
    }
    resetControlsTimeout();
  };

  // Toggle Picture-in-Picture
  const handlePipToggle = async () => {
    const video = videoRef.current;
    if (!video || !document.pictureInPictureEnabled) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.warn("PiP error:", err);
    }
    resetControlsTimeout();
  };

  // Handle Single Click -> Play/Pause
  const handlePlayerClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".player-controls-container")) {
      return;
    }
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      return;
    }
    clickTimeoutRef.current = setTimeout(() => {
      handlePlayPause();
      clickTimeoutRef.current = null;
    }, 200);
  };

  // Handle Double Click -> Seek 10s
  const handlePlayerDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".player-controls-container")) {
      return;
    }
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeft = clickX < rect.width / 2;

    handleSeek(isLeft ? -10 : 10);

    setActiveSeekIndicator({
      side: isLeft ? "left" : "right",
      visible: true,
    });

    if (seekTimeoutRef.current) clearTimeout(seekTimeoutRef.current);
    seekTimeoutRef.current = setTimeout(() => {
      setActiveSeekIndicator((prev) => ({ ...prev, visible: false }));
    }, 600);
  };

  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  const isPipSupported =
    typeof document !== "undefined" && document.pictureInPictureEnabled;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handlePlayerClick}
      onDoubleClick={handlePlayerDoubleClick}
      className={`relative group bg-black shadow-2xl overflow-hidden transition-all duration-300 border border-white/10 ${
        isFullscreen
          ? "w-full h-full"
          : "aspect-video w-full rounded-2xl sm:rounded-3xl"
      } ${showControls ? "cursor-default" : "cursor-none"}`}
    >
      <video
        ref={videoRef}
        playsInline
        className="w-full h-full object-contain bg-black"
        poster={channel.logo}
      />

      {/* Loading Overlay */}
      {loading && !error && !loadTimeout && (
        <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-4 z-20 pointer-events-none">
          <div className="relative flex items-center justify-center h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/25 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-slate-100 animate-pulse">
              Connecting to stream...
            </p>
            <p className="text-[10px] text-zinc-500">{channel.name}</p>
          </div>
        </div>
      )}

      {/* Slow Connection / Timeout Overlay */}
      {loadTimeout && loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 text-white p-4 z-20 text-center">
          <AlertCircle className="text-amber-500 h-10 w-10 animate-pulse mb-3" />
          <div className="space-y-2 max-w-sm pointer-events-auto">
            <p className="text-sm font-bold text-amber-400">Connection Delay</p>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              This channel is taking longer than usual to load. It may be
              offline or limited by your network connection.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={handleReload}
                className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 text-white p-4 z-20 text-center">
          <AlertCircle className="text-rose-500 h-10 w-10 animate-bounce mb-3" />
          <div className="space-y-2 max-w-md pointer-events-auto">
            <p className="text-sm font-bold text-rose-400">{error}</p>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Broadcasters sometimes alter paths or restrict streaming outside
              their systems. You can copy the URL to try in a player like VLC.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={handleReload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3" />
                Reload
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                Copy Link
              </button>
              <a
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <ExternalLink className="h-3 w-3" />
                Open
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Center play icon overlay when paused */}
      {!loading && !error && isPaused && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 cursor-pointer hover:bg-black/30 transition-colors"
          onClick={handlePlayPause}
        >
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-violet-600/90 hover:bg-violet-600 hover:scale-105 text-white flex items-center justify-center shadow-lg shadow-violet-500/20 border border-white/10 transition-all">
            <Play size={24} className="fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Tap to Unmute overlay badge */}
      {!loading && !error && isMuted && (
        <div
          className="absolute top-4 right-4 z-30 pointer-events-auto cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleMuteUnmute();
          }}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/10 shadow-lg backdrop-blur-md hover:scale-105 transition-all text-[10px] font-bold tracking-wider">
            <VolumeX size={12} className="text-violet-400 animate-pulse" />
            <span>TAP TO UNMUTE</span>
          </div>
        </div>
      )}

      {/* Double Tap seek ripple visuals */}
      {activeSeekIndicator.visible && (
        <div
          className={`absolute inset-y-0 w-1/3 flex items-center justify-center pointer-events-none z-30 bg-white/5 transition-opacity duration-300 ${
            activeSeekIndicator.side === "left"
              ? "left-0 rounded-r-full"
              : "right-0 rounded-l-full"
          }`}
        >
          <div className="flex flex-col items-center gap-1 text-white bg-black/75 px-4 py-2.5 rounded-full border border-white/10 backdrop-blur-md">
            {activeSeekIndicator.side === "left" ? (
              <>
                <ChevronsLeft className="h-5 w-5 text-violet-400 animate-pulse" />
                <span className="text-[10px] font-black tracking-widest">
                  -10s
                </span>
              </>
            ) : (
              <>
                <ChevronsRight className="h-5 w-5 text-violet-400 animate-pulse" />
                <span className="text-[10px] font-black tracking-widest">
                  +10s
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Custom controls overlay bar */}
      {!loading && !error && (
        <div
          className={`player-controls-container absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-linear-to-t from-black/95 via-black/40 to-transparent flex items-center justify-between transition-all duration-300 z-20 ${
            showControls
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              {isPaused ? (
                <Play size={16} className="fill-white" />
              ) : (
                <Pause size={16} className="fill-white" />
              )}
            </button>

            <div className="flex items-center gap-1 group/volume">
              <button
                onClick={handleMuteUnmute}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={16} />
                ) : (
                  <Volume2 size={16} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChangeSlider}
                className="w-16 h-1 rounded-lg appearance-none cursor-pointer outline-none transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.25) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.25) 100%)`,
                }}
              />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 relative">
            {/* Quality level settings */}
            {levels.length > 0 && (
              <div ref={settingsRef} className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-semibold"
                  title="Stream Quality"
                >
                  <Settings
                    className={`h-4 w-4 ${showSettings ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline">
                    {selectedLevel === -1
                      ? `Auto${currentLevel >= 0 && levels[currentLevel] ? ` (${getLevelLabel(levels[currentLevel], currentLevel)})` : ""}`
                      : getLevelLabel(levels[selectedLevel], selectedLevel)}
                  </span>
                </button>

                {showSettings && (
                  <div className="absolute bottom-8 right-0 w-36 bg-zinc-950/95 border border-zinc-800 rounded-lg shadow-xl backdrop-blur-md overflow-hidden py-1 z-30">
                    <div className="px-3 py-1 border-b border-zinc-900">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">
                        Quality
                      </span>
                    </div>
                    <div className="max-h-40 overflow-y-auto custom-scrollbar">
                      <button
                        onClick={() => handleQualityChange(-1)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs transition-colors hover:bg-white/10 cursor-pointer ${
                          selectedLevel === -1
                            ? "text-violet-400 font-bold"
                            : "text-zinc-350"
                        }`}
                      >
                        <span>Auto</span>
                        {selectedLevel === -1 && (
                          <Check className="h-3 w-3 text-violet-500" />
                        )}
                      </button>
                      {levels.map((level, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQualityChange(idx)}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs transition-colors hover:bg-white/10 cursor-pointer ${
                            selectedLevel === idx
                              ? "text-violet-400 font-bold"
                              : "text-zinc-350"
                          }`}
                        >
                          <span>{getLevelLabel(level, idx)}</span>
                          {selectedLevel === idx && (
                            <Check className="h-3 w-3 text-violet-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isPipSupported && (
              <button
                onClick={handlePipToggle}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                title="Picture in Picture"
              >
                <PictureInPicture
                  size={16}
                  className={isPip ? "text-violet-400" : ""}
                />
              </button>
            )}

            <button
              onClick={handleReload}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Reload Stream"
            >
              <RefreshCw size={16} />
            </button>

            <button
              onClick={handleFullscreenToggle}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
