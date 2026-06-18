"use client";

import VideoPlayer from "@/components/live-tv/VideoPlayer";
import { ArrowLeft, Play, Radio, RefreshCw, Search, ShieldCheck, Tv } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface UgbyChannel {
  key: string;
  name: string;
  image: string;
  category: string;
  quality: string;
  status: string;
  play_token: string;
}

export default function LiveKhelaTvPage() {
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState<UgbyChannel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Active playback states
  const [activeChannel, setActiveChannel] = useState<UgbyChannel | null>(null);
  const [decryptedStream, setDecryptedStream] = useState<{
    url: string;
    type?: string;
    kid?: string;
    key?: string;
  } | null>(null);
  const [loadingStream, setLoadingStream] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);

  // Fetch list of channels
  useEffect(() => {
    async function fetchChannels() {
      try {
        setLoading(true);
        const res = await fetch("/api/ugby/channels");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setChannels(json.data);
            // Auto-load the first channel
            if (json.data.length > 0) {
              handleChannelSelect(json.data[0]);
            }
          } else {
            toast.error("Failed to parse channels feed");
          }
        } else {
          toast.error("Failed to load live channels");
        }
      } catch (err) {
        console.error("Error loading channels:", err);
        toast.error("Failed to load channel list");
      } finally {
        setLoading(false);
      }
    }
    fetchChannels();
  }, []);

  // Decrypt and load selected channel stream
  const handleChannelSelect = async (ch: UgbyChannel) => {
    if (loadingStream) return;
    setActiveChannel(ch);
    setLoadingStream(true);
    setDecryptedStream(null);

    try {
      const res = await fetch(`/api/ugby/stream?key=${ch.key}&token=${ch.play_token}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDecryptedStream({
            url: json.data.url,
            type: json.data.type,
            kid: json.data.key_id,
            key: json.data.key_value,
          });
        } else {
          toast.error(`Decryption failed for ${ch.name}`);
        }
      } else {
        toast.error(`Unable to retrieve keys for ${ch.name}`);
      }
    } catch (err) {
      console.error("Stream decryption error:", err);
      toast.error(`Error decrypting stream for ${ch.name}`);
    } finally {
      setLoadingStream(false);
    }
  };

  // Refresh current stream token
  const handleReload = async () => {
    if (!activeChannel) return;
    setLoadingStream(true);
    try {
      const res = await fetch(`/api/ugby/stream?key=${activeChannel.key}&token=${activeChannel.play_token}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDecryptedStream({
            url: json.data.url,
            type: json.data.type,
            kid: json.data.key_id,
            key: json.data.key_value,
          });
          setReloadCount(prev => prev + 1);
          toast.success("Stream decryption refreshed!");
        } else {
          toast.error("Failed to refresh keys");
        }
      } else {
        toast.error("Unable to reload stream info");
      }
    } catch (err) {
      console.error("Reload error:", err);
    } finally {
      setLoadingStream(false);
    }
  };

  // Derive categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    channels.forEach(ch => {
      if (ch.category) cats.add(ch.category);
    });
    return Array.from(cats);
  }, [channels]);

  // Filter channels list
  const filteredChannels = useMemo(() => {
    return channels.filter(ch => {
      const matchesSearch = ch.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || ch.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [channels, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#070518] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-900/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-900/15 rounded-full blur-[140px]" />
      </div>

      {/* Main Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0a0720]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/fifa-live"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors font-semibold shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Fifa Multiview</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center h-8 w-8 rounded-xl bg-linear-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20">
              <Tv size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-black tracking-tight bg-linear-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                LIVEKHELA TV
              </h1>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                  Decrypted Portal
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
          <ShieldCheck size={14} className="text-violet-400" />
          <span className="hidden sm:inline font-medium">Automatic ClearKey Decryption Enabled</span>
          <span className="sm:hidden font-medium">Decrypted</span>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10 overflow-hidden">
        {/* Player column */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-4 overflow-y-auto lg:max-h-[calc(100vh-65px)]">
          <div className="bg-[#0b0827]/60 border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col backdrop-blur-xs min-h-[300px] sm:min-h-[400px]">
            {/* Player Container */}
            <div className="flex-1 bg-black relative flex items-center justify-center">
              {decryptedStream ? (
                <div className="w-full h-full">
                  <VideoPlayer
                    channel={{
                      name: activeChannel?.name || "Live Stream",
                      logo: activeChannel?.image || "",
                      url: decryptedStream.url,
                      group: activeChannel?.category || "Sports",
                      type: decryptedStream.type,
                      kid: decryptedStream.kid,
                      key: decryptedStream.key,
                    }}
                    isMuted={false}
                    reloadCount={reloadCount}
                  />
                </div>
              ) : loadingStream ? (
                <div className="flex flex-col items-center justify-center text-center p-6 gap-3">
                  <RefreshCw className="animate-spin text-violet-500 h-10 w-10" />
                  <p className="text-sm font-bold uppercase tracking-wider text-zinc-400 animate-pulse">
                    Decrypting Secure stream credentials...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 gap-3">
                  <Tv className="h-16 w-16 text-zinc-600 animate-bounce" />
                  <h3 className="text-lg font-bold text-zinc-300">No stream active</h3>
                  <p className="text-xs text-zinc-500 max-w-xs">
                    Please select a channel from the right sidebar panel to begin playback.
                  </p>
                </div>
              )}
            </div>

            {/* Under player details */}
            {activeChannel && (
              <div className="p-4 sm:p-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 bg-[#090721]/90">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-xl p-2 flex items-center justify-center shrink-0 overflow-hidden">
                    {activeChannel.image ? (
                      <img
                        src={activeChannel.image}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Tv className="h-6 w-6 text-zinc-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                      {activeChannel.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="bg-violet-600/20 border border-violet-500/30 text-violet-300 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {activeChannel.category || "General"}
                      </span>
                      <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {activeChannel.quality || "HD"}
                      </span>
                      {decryptedStream?.type && (
                        <span className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {decryptedStream.type}
                        </span>
                      )}
                      {decryptedStream?.kid && (
                        <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                          <Radio size={10} className="animate-pulse" /> DRM Protected
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center shrink-0">
                  <button
                    onClick={handleReload}
                    disabled={loadingStream}
                    className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-zinc-300 hover:text-white transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <RefreshCw size={13} className={loadingStream ? "animate-spin" : ""} />
                    <span>Refresh Token</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar Channels List */}
        <aside className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0a0720]/80 backdrop-blur-md flex flex-col shrink-0 lg:max-h-[calc(100vh-65px)]">
          {/* Sidebar Header & Filters */}
          <div className="p-4 border-b border-white/5 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search live channels..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30 rounded-xl text-xs text-white placeholder-zinc-500 transition-all shadow-inner"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin select-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                      ? "bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/20"
                      : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Channels list scroll container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-zinc-500" />
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider animate-pulse">Loading Channels list...</span>
              </div>
            ) : filteredChannels.map((ch) => {
              const isSelected = activeChannel?.key === ch.key;
              return (
                <button
                  key={ch.key}
                  onClick={() => handleChannelSelect(ch)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${isSelected
                      ? "bg-violet-600/20 border-violet-500/40 text-violet-300 font-bold shadow-lg shadow-violet-950/20"
                      : "bg-white/2 border-white/5 hover:border-white/15 hover:bg-white/5 text-zinc-350 hover:text-white"
                    }`}
                >
                  <div className="relative h-10 w-10 bg-white/5 border border-white/10 rounded-lg p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                    {ch.image ? (
                      <img
                        src={ch.image}
                        alt=""
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Tv className="h-5 w-5 text-zinc-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-bold leading-snug truncate">
                      {ch.name}
                    </h4>
                    <span className="text-[9px] text-zinc-500 font-medium">
                      {ch.category || "General"}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="bg-rose-500/25 border border-rose-500/40 text-rose-400 text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-widest flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-rose-500 animate-pulse" /> Live
                    </span>
                    {isSelected && (
                      <span className="text-[9px] text-violet-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        Playing <Play size={8} className="fill-current animate-pulse" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {!loading && filteredChannels.length === 0 && (
              <div className="py-20 text-center text-zinc-500 text-xs">
                No channels found.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
