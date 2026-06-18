"use client";

import Hls from "hls.js";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Maximize,
  Minimize,
  Pause,
  PictureInPicture,
  Play,
  RefreshCw,
  Sliders,
  Volume2,
  VolumeX
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Channel } from "./types";

interface VideoPlayerProps {
  channel: Channel;
  isMuted?: boolean;
  onMuteChange?: (muted: boolean) => void;
  reloadCount?: number;
}

export default function VideoPlayer({
  channel,
  isMuted: propsIsMuted,
  onMuteChange,
  reloadCount: propsReloadCount,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const shakaRef = useRef<any>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Core stream loading states
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (propsReloadCount !== undefined && propsReloadCount > 0) {
      setReloadCount(propsReloadCount);
    }
  }, [propsReloadCount]);
  const [loadTimeout, setLoadTimeout] = useState(false);

  interface UnifiedLevel {
    id: number;
    height: number;
    bitrate: number;
    label: string;
  }

  interface UnifiedAudioTrack {
    id: number | string;
    lang: string;
    name: string;
  }

  // Quality settings
  const [levels, setLevels] = useState<UnifiedLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);
  const [selectedLevel, setSelectedLevel] = useState<number>(-1);
  const [showSettings, setShowSettings] = useState(false);

  // Audio settings
  const [audioTracks, setAudioTracks] = useState<UnifiedAudioTrack[]>([]);
  const [currentAudioTrack, setCurrentAudioTrack] = useState<number | string>(-1);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const audioSettingsRef = useRef<HTMLDivElement>(null);

  // Custom Controls UI states
  const [isPaused, setIsPaused] = useState(true);
  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0,
      );
    }
  }, []);

  const [isMuted, setIsMuted] = useState(propsIsMuted !== undefined ? propsIsMuted : true);

  useEffect(() => {
    if (propsIsMuted !== undefined) {
      setIsMuted(propsIsMuted);
      const video = videoRef.current;
      if (video) {
        video.muted = propsIsMuted;
      }
    }
  }, [propsIsMuted]);
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

  // Close quality & audio settings dropdowns on click outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        settingsRef.current &&
        !settingsRef.current.contains(target) &&
        !(e.target as HTMLElement).closest(".quality-trigger")
      ) {
        setShowSettings(false);
      }
      if (
        audioSettingsRef.current &&
        !audioSettingsRef.current.contains(target) &&
        !(e.target as HTMLElement).closest(".audio-trigger")
      ) {
        setShowAudioSettings(false);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const handleQualityChange = (levelIndex: number) => {
    setSelectedLevel(levelIndex);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
    } else if (shakaRef.current) {
      const shakaPlayerInstance = shakaRef.current;
      if (levelIndex === -1) {
        shakaPlayerInstance.configure({ abr: { enabled: true } });
      } else {
        shakaPlayerInstance.configure({ abr: { enabled: false } });
        const tracks = shakaPlayerInstance.getVariantTracks();
        const targetTrack = tracks.find((t: any) => t.id === levelIndex);
        if (targetTrack) {
          shakaPlayerInstance.selectVariantTrack(targetTrack, true);
        }
      }
    }
    setShowSettings(false);
  };

  const handleAudioTrackChange = (trackId: number | string) => {
    setCurrentAudioTrack(trackId);
    if (hlsRef.current) {
      hlsRef.current.audioTrack = trackId as number;
    } else if (shakaRef.current) {
      const shakaPlayerInstance = shakaRef.current;
      shakaPlayerInstance.selectAudioLanguage(trackId as string);
    }
    setShowAudioSettings(false);
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
    const handlePlaying = () => setIsPaused(false);
    const handleTimeUpdate = () => {
      if (video.paused !== isPausedRef.current) {
        setIsPaused(video.paused);
      }
    };
    const handleVolumeChange = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("volumechange", handleVolumeChange);

    setIsPaused(video.paused);
    setIsMuted(video.muted);
    setVolume(video.volume);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
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
    let shakaPlayerInstance: any = null;
    let networkRetryCount = 0;
    let mediaRetryCount = 0;
    let active = true;

    const handleOnline = () => {
      if (hls) {
        console.log(
          "Network back online. Attempting to recover stream loading...",
        );
        hls.startLoad();
      }
    };
    window.addEventListener("online", handleOnline);

    // Detect if this is a DASH stream
    const isDash =
      channel.type === "dash" ||
      channel.url.toLowerCase().endsWith(".mpd") ||
      channel.url.toLowerCase().includes(".mpd?") ||
      channel.url.toLowerCase().includes("/index.mpd");

    if (isDash) {
      (async () => {
        try {
          const shakaModule = await import("shaka-player");
          const shaka = shakaModule.default || shakaModule;

          if (!active) return;

          shaka.polyfill.installAll();

          if (!shaka.Player.isBrowserSupported()) {
            setError("Your browser does not support DASH playback.");
            setLoading(false);
            return;
          }

          shakaPlayerInstance = new shaka.Player();
          shakaRef.current = shakaPlayerInstance;
          await shakaPlayerInstance.attach(video);

          shakaPlayerInstance.configure({
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
            abr: {
              enabled: true,
              defaultBandwidthEstimate: 6500000, // 6.5 Mbps default bandwidth for immediate HD
              switchInterval: 1,
              clearBufferSwitch: false,
              restrictToElementSize: false, // Set to false to allow HD quality on small grid containers
              restrictToScreenSize: false,
              bandwidthDowngradeTarget: 0.92,
              bandwidthUpgradeTarget: 0.72,
            },
          });

          // Apply ClearKey DRM keys if provided
          if (channel.kid && channel.key) {
            shakaPlayerInstance.configure({
              drm: {
                clearKeys: {
                  [String(channel.kid).toLowerCase()]: String(
                    channel.key,
                  ).toLowerCase(),
                },
              },
            });
          }

          shakaPlayerInstance.addEventListener("error", (event: any) => {
            if (!active) return;
            const detail = event?.detail;
            console.error("[SHAKA] Setup error detail:", JSON.stringify(detail));

            // Ignore non-fatal (recoverable) errors
            if (detail && detail.severity === 1) {
              console.warn("[SHAKA] Recoverable error encountered, allowing player to self-recover:", detail);
              return;
            }

            let errMsg = "DASH / MPD load failed";
            if (detail) {
              if (detail.code === 6007 || detail.code === 6008) {
                errMsg =
                  "Playback failed: DRM decryption key is incorrect or missing.";
              } else if (detail.code === 1001 || detail.code === 1002) {
                errMsg =
                  "Playback failed: Stream is offline or original server is unreachable.";
              } else {
                errMsg = `Playback failed: Shaka Player Error ${detail.code} (${detail.message || "Unknown error"
                  })`;
              }
            }
            setError(errMsg);
            setLoading(false);
          });

          shakaPlayerInstance.addEventListener("buffering", (event: any) => {
            if (!active) return;
            setLoading(event.buffering);
          });

          const updateShakaTracks = () => {
            if (!shakaPlayerInstance) return;
            const tracks = shakaPlayerInstance.getVariantTracks() || [];
            const unique = tracks.filter((track: any, index: number, self: any[]) =>
              self.findIndex((t) => t.height === track.height) === index
            ).sort((a: any, b: any) => (b.height || 0) - (a.height || 0));

            const formatted = unique.map((track: any) => {
              const h = track.height || 0;
              const b = track.bandwidth || 0;
              const isHd = h >= 720;
              const label = h > 0 ? `${h}p ${isHd ? 'HD' : 'SD'}` : `Quality`;
              const speedStr = b >= 1000000
                ? `${(b / 1000000).toFixed(1)} Mbps`
                : `${Math.round(b / 1000)} Kbps`;
              return {
                id: track.id,
                height: h,
                bitrate: b,
                label: `${label} (${speedStr})`
              };
            });
            setLevels(formatted);
          };

          const updateShakaAudioTracks = () => {
            if (!shakaPlayerInstance) return;
            const langs = shakaPlayerInstance.getAudioLanguagesAndRoles() || [];
            const tracks = langs.map((l: any, idx: number) => ({
              id: l.language,
              lang: l.language,
              name: l.label || l.language || `Audio ${idx + 1}`
            }));
            setAudioTracks(tracks);

            const activeTracks = shakaPlayerInstance.getVariantTracks().filter((t: any) => t.active);
            if (activeTracks.length > 0) {
              setCurrentAudioTrack(activeTracks[0].language);
            }
          };

          shakaPlayerInstance.addEventListener("trackschanged", () => {
            updateShakaTracks();
            updateShakaAudioTracks();
          });
          shakaPlayerInstance.addEventListener("variantchanged", () => {
            const activeTracks = shakaPlayerInstance.getVariantTracks().filter((t: any) => t.active);
            if (activeTracks.length > 0) {
              setCurrentLevel(activeTracks[0].id);
              setCurrentAudioTrack(activeTracks[0].language);
            }
          });

          await shakaPlayerInstance.load(channel.url);

          if (!active) return;
          setLoading(false);

          // Autoplay stream
          video.muted = true;
          setIsMuted(true);
          video.play().catch((err) => {
            console.warn("Autoplay was prevented:", err);
          });
        } catch (shakaErr: any) {
          if (!active) return;
          console.error("[SHAKA] Setup catch error:", shakaErr);
          setError(shakaErr?.message || "Failed to initialize Shaka Player.");
          setLoading(false);
        }
      })();
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        progressive: true,
        startLevel: -1,
        capLevelToPlayerSize: false, // Disable to allow HD even on smaller/mobile screen sizes
        maxBufferLength: 22,
        maxMaxBufferLength: 36,
        maxBufferSize: 48 * 1024 * 1024, // 48MB buffer limit
        liveSyncDurationCount: 3,
        abrEwmaFastLive: 2.0,
        abrEwmaSlowLive: 5.0,
        abrBandWidthFactor: 0.88,
        abrBandWidthUpFactor: 0.72,
        abrEwmaDefaultEstimate: 6500000, // 6.5 Mbps default estimate to force immediate HD selection
        maxStarvationDelay: 3.0,
        manifestLoadingMaxRetry: 3,
        levelLoadingMaxRetry: 3,
        fragLoadingMaxRetry: 4,
        fragLoadingTimeOut: 10000,
        fragLoadingRetryDelay: 700,
        maxBufferHole: 0.7,
        nudgeMaxRetry: 12,
      });
      hlsRef.current = hls;
      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (hls) {
          const formatted = (hls.levels || []).map((level, idx) => {
            const h = level.height || 0;
            const b = level.bitrate || 0;
            const isHd = h >= 720;
            const label = h > 0 ? `${h}p ${isHd ? 'HD' : 'SD'}` : `Quality ${idx + 1}`;
            const speedStr = b >= 1000000
              ? `${(b / 1000000).toFixed(1)} Mbps`
              : `${Math.round(b / 1000)} Kbps`;
            return {
              id: idx,
              height: h,
              bitrate: b,
              label: `${label} (${speedStr})`
            };
          });
          setLevels(formatted);
          setCurrentLevel(hls.currentLevel);

          // Populate HLS audio tracks
          const tracks = (hls.audioTracks || []).map((t, idx) => ({
            id: idx,
            lang: t.lang || '',
            name: t.name || t.lang || `Audio ${idx + 1}`
          }));
          setAudioTracks(tracks);
          setCurrentAudioTrack(hls.audioTrack);
        }

        // Attempt muted autoplay to satisfy browser security rules
        video.muted = true;
        setIsMuted(true);
        video.play().catch((err) => {
          console.warn("Autoplay was prevented:", err);
        });
      });

      hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {
        if (hls) {
          const tracks = (hls.audioTracks || []).map((t, idx) => ({
            id: idx,
            lang: t.lang || '',
            name: t.name || t.lang || `Audio ${idx + 1}`
          }));
          setAudioTracks(tracks);
        }
      });

      hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (event, data) => {
        setCurrentAudioTrack(data.id);
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
                if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR || data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT) {
                  hls?.loadSource(channel.url);
                } else {
                  hls?.startLoad();
                }
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
      active = false;
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
      if (shakaPlayerInstance) {
        shakaPlayerInstance.destroy().catch(() => { });
      }
      shakaRef.current = null;
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
    if (onMuteChange) {
      onMuteChange(video.muted);
    }
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

  // Handle Single Click -> Play/Pause on Desktop, Toggle Controls on Mobile
  const handlePlayerClick = (e: React.MouseEvent) => {
    // Ignore click if it was on controls or settings/dropdowns
    if (
      (e.target as HTMLElement).closest(".player-controls-container") ||
      (e.target as HTMLElement).closest(".settings-dropdown")
    ) {
      return;
    }

    if (isTouchDevice) {
      // On mobile/touch devices, single click toggles controls visibility instead of playing/pausing
      setShowControls((prev) => !prev);
      resetControlsTimeout();
    } else {
      // On desktop, single click toggles play/pause with 200ms delay to detect double click
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
        return;
      }
      clickTimeoutRef.current = setTimeout(() => {
        handlePlayPause();
        clickTimeoutRef.current = null;
      }, 200);
    }
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
      className={`relative group bg-black shadow-2xl overflow-hidden transition-all duration-300 border border-white/10 ${isFullscreen
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
      {loading && !hasPlayed && !error && !loadTimeout && (
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
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 text-white p-4 z-20 text-center"
        >
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
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 text-white p-4 z-20 text-center"
        >
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
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
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
          className={`absolute inset-y-0 w-1/3 flex items-center justify-center pointer-events-none z-30 bg-white/5 transition-opacity duration-300 ${activeSeekIndicator.side === "left"
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
          className={`player-controls-container absolute bottom-0 left-0 right-0 bg-slate-950/80 border-t border-white/5 flex flex-col transition-all duration-300 z-20 ${showControls
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
            }`}
        >
          {/* Progress timeline */}
          <div className="w-full h-1 bg-white/20 relative group/timeline cursor-pointer">
            <div className="h-full bg-red-600 w-full relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-red-500 shadow-md scale-0 group-hover/timeline:scale-100 transition-transform" />
            </div>
          </div>

          {/* Indicators Row (above controls, below timeline) */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/5 bg-black/10">
            {/* Live Indicator + Language Select */}
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              {error ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[10px] tracking-wide">
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 inline-block" />
                  OFFLINE
                </div>
              ) : loading ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-600/30 text-amber-400 text-[10px] tracking-wide animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block animate-ping" />
                  BUFFERING
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-600 text-[10px] tracking-wide animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-white inline-block animate-ping" />
                  LIVE
                </div>
              )}
              {audioTracks.length > 1 && (
                <>
                  <span className="text-white/20">|</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAudioSettings(!showAudioSettings);
                    }}
                    className="audio-trigger flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer text-[11px]"
                  >
                    <span>{audioTracks.find(t => t.id === currentAudioTrack)?.name || "Default Audio"}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </>
              )}
            </div>

            {/* Quality selection and seek indicator */}
            <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
              {levels.length > 0 && (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="quality-trigger hover:text-white transition-colors flex items-center gap-0.5 cursor-pointer text-[11px]"
                >
                  <span>
                    {selectedLevel === -1
                      ? `Auto`
                      : `${levels.find((l) => l.id === selectedLevel)?.height || selectedLevel}p`}
                  </span>
                  <span>...</span>
                </button>
              )}
              <button
                onClick={() => handleSeek(-10)}
                className="hover:text-white transition-colors cursor-pointer text-zinc-400/90 text-[11px]"
              >
                -10s
              </button>
            </div>
          </div>

          {/* Main Controls Row */}
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            {/* Left side: Channel details */}
            <div className="flex items-center gap-2 min-w-0">
              {channel.logo && (
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="h-6 w-6 rounded-md object-cover bg-white shrink-0 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              )}
              <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px] sm:max-w-[200px] tracking-wide">
                {channel.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0" />
            </div>

            {/* Center side: Actions buttons */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-1">
              {/* Play Pause */}
              <button
                onClick={handlePlayPause}
                className="w-14 h-8 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-lg flex items-center justify-center transition-all cursor-pointer shadow-md shadow-blue-600/20"
              >
                {isPaused ? (
                  <Play size={16} className="fill-white" />
                ) : (
                  <Pause size={16} className="fill-white" />
                )}
              </button>

              {/* Mute Volume */}
              <button
                onClick={handleMuteUnmute}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-white transition-all cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreenToggle}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-white transition-all cursor-pointer"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>

              {/* PiP */}
              {isPipSupported && (
                <button
                  onClick={handlePipToggle}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-white transition-all cursor-pointer"
                  title="Picture in Picture"
                >
                  <PictureInPicture
                    size={16}
                    className={isPip ? "text-blue-400" : ""}
                  />
                </button>
              )}

              {/* Reload */}
              <button
                onClick={handleReload}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-white transition-all cursor-pointer"
                title="Reload"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Right side spacer to keep center aligned */}
            <div className="w-[120px] hidden sm:block shrink-0" />
          </div>
        </div>
      )}

      {/* Floating Quality popup menu (anchored on right side) */}
      {showSettings && levels.length > 0 && (
        <div
          ref={settingsRef}
          className="absolute bottom-16 right-4 w-64 bg-slate-950/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden py-2.5 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="px-4 py-1.5 border-b border-white/5 flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-extrabold">
              ≡ Quality
            </span>
          </div>
          <div className="max-h-56 overflow-y-auto custom-scrollbar py-1">
            {/* Auto Option */}
            <button
              onClick={() => handleQualityChange(-1)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left text-xs transition-colors hover:bg-white/5 cursor-pointer ${selectedLevel === -1 ? "text-blue-400 font-bold" : "text-zinc-350"
                }`}
            >
              <div
                className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${selectedLevel === -1
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-white/20"
                  }`}
              >
                {selectedLevel === -1 && <Check className="h-3 w-3 stroke-3" />}
              </div>
              <span>Auto</span>
            </button>

            {/* Levels mapping */}
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => handleQualityChange(level.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left text-xs transition-colors hover:bg-white/5 cursor-pointer ${selectedLevel === level.id ? "text-blue-400 font-bold" : "text-zinc-350"
                  }`}
              >
                <div
                  className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${selectedLevel === level.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-white/20"
                    }`}
                >
                  {selectedLevel === level.id && <Check className="h-3 w-3 stroke-3" />}
                </div>
                <span>{level.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Audio Language popup menu (anchored on left side) */}
      {showAudioSettings && audioTracks.length > 0 && (
        <div
          ref={audioSettingsRef}
          className="absolute bottom-16 left-4 w-52 bg-slate-950/95 border border-white/10 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden py-2.5 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="px-4 py-1.5 border-b border-white/5 flex items-center gap-1.5">
            <Volume2 className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-extrabold">
              Audio Language
            </span>
          </div>
          <div className="max-h-56 overflow-y-auto custom-scrollbar py-1">
            {audioTracks.map((track) => (
              <button
                key={track.id}
                onClick={() => handleAudioTrackChange(track.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left text-xs transition-colors hover:bg-white/5 cursor-pointer ${currentAudioTrack === track.id ? "text-blue-400 font-bold" : "text-zinc-350"
                  }`}
              >
                <div
                  className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${currentAudioTrack === track.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-white/20"
                    }`}
                >
                  {currentAudioTrack === track.id && <Check className="h-3 w-3 stroke-3" />}
                </div>
                <span>{track.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
