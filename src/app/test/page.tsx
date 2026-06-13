"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCw, AlertCircle, Info } from "lucide-react";

export default function TestPlayerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shakaRef = useRef<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [status, setStatus] = useState("Initializing Shaka Player...");

  // Channel/Stream Details
  const streamUrl = "https://qp-pldt-live-bpk-ucd-prod.akamaized.net/bpk-tv/ch299/default/index.mpd";
  const kid = "549ab7cd35a64bb6bb479ecead04d69d";
  const key = "829799ed534d11fcadeb4b192467e050";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let active = true;
    let shakaPlayer: any = null;

    (async () => {
      try {
        setStatus("Loading Shaka Player module...");
        const shakaModule = await import("shaka-player");
        const shaka = shakaModule.default || shakaModule;
        
        if (!active) return;
        
        setStatus("Installing Shaka polyfills...");
        shaka.polyfill.installAll();

        if (!shaka.Player.isBrowserSupported()) {
          setError("Your browser does not support DASH playback.");
          setLoading(false);
          return;
        }

        setStatus("Creating player instance...");
        shakaPlayer = new shaka.Player();
        shakaRef.current = shakaPlayer;
        
        setStatus("Attaching video element...");
        await shakaPlayer.attach(video);

        // Configure tuning parameters
        shakaPlayer.configure({
          manifest: {
            defaultPresentationDelay: 8,
            ignoreDrmInfo: true,
            dash: {
              ignoreMinBufferTime: true,
              ignoreSuggestedPresentationDelay: true,
              autoCorrectDrift: true,
            },
          },
          streaming: {
            bufferingGoal: 10,
            rebufferingGoal: 0.8,
            bufferBehind: 12,
            stallEnabled: true,
            stallThreshold: 1,
            stallSkip: 0.15,
            retryParameters: {
              maxAttempts: 12,
              baseDelay: 500,
              backoffFactor: 1.6,
              fuzzFactor: 0.35,
              timeout: 15000,
            },
          },
        });

        // Configure ClearKeys
        setStatus("Configuring ClearKey DRM keys...");
        shakaPlayer.configure({
          drm: {
            clearKeys: {
              [kid.toLowerCase()]: key.toLowerCase(),
            },
          },
        });

        // Error Listeners
        shakaPlayer.addEventListener("error", (event: any) => {
          if (!active) return;
          const detail = event?.detail;
          console.error("[SHAKA TEST] Error detail:", detail);
          setError(`Shaka Player Error (Code: ${detail?.code ?? "unknown"}) - ${detail?.message ?? ""}`);
          setLoading(false);
        });

        shakaPlayer.addEventListener("buffering", (event: any) => {
          if (!active) return;
          setLoading(event.buffering);
          setStatus(event.buffering ? "Buffering stream..." : "Playing");
        });

        setStatus("Loading MPD manifest URL...");
        await shakaPlayer.load(streamUrl);

        if (!active) return;
        setLoading(false);
        setStatus("Stream loaded successfully!");

        // Try playing muted
        video.muted = true;
        setIsMuted(true);
        video.play()
          .then(() => {
            setIsPaused(false);
          })
          .catch((playErr) => {
            console.warn("Autoplay block:", playErr);
            setIsPaused(true);
          });

      } catch (err: any) {
        if (!active) return;
        console.error("[SHAKA TEST] Setup catch error:", err);
        setError(err?.message || "Failed to initialize Shaka Player.");
        setLoading(false);
      }
    })();

    // Event listeners on video element to update UI states
    const onPlay = () => setIsPaused(false);
    const onPause = () => setIsPaused(true);
    const onVolumeChange = () => {
      setIsMuted(video.muted || video.volume === 0);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("volumechange", onVolumeChange);

    return () => {
      active = false;
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("volumechange", onVolumeChange);
      
      if (shakaPlayer) {
        shakaPlayer.destroy().catch((destroyErr: any) => {
          console.warn("Shaka destroy warning:", destroyErr);
        });
      }
      shakaRef.current = null;
    };
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(err => console.error("Play error:", err));
    } else {
      video.pause();
    }
  };

  const handleMuteUnmute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-violet-500/30 selection:text-white">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl space-y-6">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              DASH Stream Test Player
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Validating Playback with Shaka Player and ClearKey DRM decrypter
            </p>
          </div>
          <button
            onClick={handleReload}
            className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-bold border border-zinc-800 transition-all cursor-pointer active:scale-95"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Reload Player
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
          <video
            ref={videoRef}
            playsInline
            className="w-full h-full object-contain"
          />

          {/* Loading / Status Overlay */}
          {loading && !error && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-20">
              <div className="relative h-10 w-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/25 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>
              <p className="text-xs text-zinc-400 animate-pulse font-medium">{status}</p>
            </div>
          )}

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-6 z-25 text-center gap-3">
              <AlertCircle className="text-rose-500 h-12 w-12 animate-bounce" />
              <div className="space-y-1 max-w-md">
                <p className="text-sm font-bold text-rose-400">Playback Failed</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{error}</p>
              </div>
              <button
                onClick={handleReload}
                className="mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                Retry Setup
              </button>
            </div>
          )}

          {/* Controls Bar Overlay */}
          {!loading && !error && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayPause}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-all cursor-pointer"
                >
                  {isPaused ? <Play size={18} className="fill-white" /> : <Pause size={18} className="fill-white" />}
                </button>
                <button
                  onClick={handleMuteUnmute}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-all cursor-pointer"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
              <div className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                LIVE
              </div>
            </div>
          )}

          {/* Tap to Unmute Overlay */}
          {!loading && !error && isMuted && (
            <button
              onClick={handleMuteUnmute}
              className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 text-white border border-white/10 shadow-lg text-[10px] font-bold tracking-wider hover:scale-105 transition-all cursor-pointer"
            >
              <VolumeX size={12} className="text-violet-400 animate-pulse" />
              <span>TAP TO UNMUTE</span>
            </button>
          )}
        </div>

        {/* Diagnostic Metadata & Info Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center gap-2 text-violet-400 border-b border-zinc-800 pb-2">
            <Info size={16} />
            <h2 className="text-xs sm:text-sm font-bold tracking-wide uppercase">
              Stream Information
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 font-bold">Manifest URL:</span>
              <span className="bg-zinc-950/70 p-2 rounded-lg border border-zinc-800 font-mono break-all text-[11px] text-zinc-300">
                {streamUrl}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-bold">Key ID (KID) [Hex]:</span>
                <span className="bg-zinc-950/70 p-2 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-300 break-all">
                  {kid}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-zinc-500 font-bold">ClearKey Key [Hex]:</span>
                <span className="bg-zinc-950/70 p-2 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-300 break-all">
                  {key}
                </span>
              </div>
            </div>
            
            <div className="pt-2 flex items-start gap-2 text-[10px] text-zinc-400 bg-zinc-950/30 p-3 rounded-lg border border-zinc-850">
              <span className="text-violet-400 font-bold">Status:</span>
              <span className="leading-relaxed">{status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
