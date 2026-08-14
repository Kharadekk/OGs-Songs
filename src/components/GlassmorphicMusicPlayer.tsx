import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  ListMusic, 
  Sparkles, 
  ExternalLink, 
  Info, 
  BookOpen, 
  Keyboard,
  Shuffle,
  Repeat,
  Disc,
  Sliders,
  Radio
} from 'lucide-react';
import { SongTrack } from '../types';
import { TRACKS, PLAYLIST_URL } from '../data/playlistData';
import { vintageAudio } from '../utils/audioSynthesizer';

interface GlassmorphicMusicPlayerProps {
  currentTrack: SongTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSelectTrack: (track: SongTrack) => void;
  crackleEnabled: boolean;
  onToggleCrackle: () => void;
  speedRPM: 33 | 45;
  onToggleRPM: () => void;
  onShowTrivia: () => void;
}

interface LiveYTMetadata {
  title?: string;
  author?: string;
  videoId?: string;
  duration?: number;
}

// Declare YT global interface for TypeScript
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const GlassmorphicMusicPlayer: React.FC<GlassmorphicMusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onSelectTrack,
  crackleEnabled,
  onToggleCrackle,
  speedRPM,
  onToggleRPM,
  onShowTrivia
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [filterSide, setFilterSide] = useState<'ALL' | 'A' | 'B'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [ytPlayerReady, setYtPlayerReady] = useState(false);
  const [liveMetadata, setLiveMetadata] = useState<LiveYTMetadata>({});

  const playerRef = useRef<any>(null);
  const progressTimerRef = useRef<any>(null);

  // Synchronize track title and metadata directly from YouTube Player instance state
  const syncMetadataFromPlayer = useCallback((targetPlayer?: any) => {
    const p = targetPlayer || playerRef.current;
    if (!p) return;
    try {
      const videoData = p.getVideoData?.();
      const duration = p.getDuration?.();
      const liveTitle = videoData?.title;
      const liveAuthor = videoData?.author;
      const liveVideoId = videoData?.video_id;

      if (liveTitle || liveVideoId || (typeof duration === 'number' && duration > 0)) {
        setLiveMetadata({
          title: liveTitle && liveTitle.trim().length > 0 ? liveTitle : undefined,
          author: liveAuthor && liveAuthor.trim().length > 0 ? liveAuthor : undefined,
          videoId: liveVideoId || undefined,
          duration: typeof duration === 'number' && duration > 0 ? Math.round(duration) : undefined
        });
      }
    } catch {
      // Safe fallback if YouTube player is in uninitialized state
    }
  }, []);

  // Initialize YouTube IFrame Player
  useEffect(() => {
    const initPlayer = () => {
      if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
        try {
          const container = document.getElementById('yt-player-hidden-container');
          if (!container) return;

          playerRef.current = new window.YT.Player('yt-player-hidden-container', {
            height: '1',
            width: '1',
            videoId: currentTrack.youtubeId,
            playerVars: {
              autoplay: isPlaying ? 1 : 0,
              controls: 0,
              disablekb: 1,
              enablejsapi: 1,
              rel: 0
            },
            events: {
              onReady: (event: any) => {
                setYtPlayerReady(true);
                try {
                  event.target?.setVolume?.(volume);
                  syncMetadataFromPlayer(event.target);
                  if (isPlaying) {
                    event.target?.playVideo?.();
                  }
                } catch {
                  // ignore
                }
              },
              onStateChange: (event: any) => {
                try {
                  // 0 = Ended, 1 = Playing, 2 = Paused, 3 = Buffering, 5 = Cued
                  syncMetadataFromPlayer(event.target);
                  if (event.data === 0) {
                    onNextTrack();
                  }
                } catch {
                  // ignore
                }
              },
              onError: (event: any) => {
                console.warn('YouTube Player Error code:', event?.data);
                // Auto-advance if video is blocked or restricted to keep playback smooth
                try {
                  if (event?.data === 150 || event?.data === 101 || event?.data === 2) {
                    onNextTrack();
                  }
                } catch {
                  // ignore
                }
              }
            }
          });
        } catch {
          // YT player initialization safe catch
        }
      }
    };

    if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
      initPlayer();
    } else if (typeof window !== 'undefined') {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // cleanup safe
        }
      }
    };
  }, []);

  // When track changes, load new video and synchronize metadata
  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById) {
      try {
        playerRef.current.loadVideoById(currentTrack.youtubeId);
        if (isPlaying) {
          playerRef.current.playVideo?.();
        } else {
          playerRef.current.pauseVideo?.();
        }
        // Query player state immediately and with a short timeout to catch async metadata populate
        setTimeout(() => syncMetadataFromPlayer(), 250);
        setTimeout(() => syncMetadataFromPlayer(), 800);
      } catch {
        // ignore
      }
    }
    setCurrentTime(0);
  }, [currentTrack, syncMetadataFromPlayer]);

  // Sync play / pause with YouTube Player
  useEffect(() => {
    if (playerRef.current) {
      try {
        if (isPlaying) {
          playerRef.current.playVideo?.();
        } else {
          playerRef.current.pauseVideo?.();
        }
        syncMetadataFromPlayer();
      } catch {
        // ignore
      }
    }
  }, [isPlaying, syncMetadataFromPlayer]);

  // Total active track duration in seconds (direct from YT or fallback to track definition)
  const activeDuration = (liveMetadata.duration && liveMetadata.duration > 0) 
    ? liveMetadata.duration 
    : currentTrack.durationSec;

  // Display title and artist fetched directly from YouTube instance state with fallback
  const displayTitle = liveMetadata.title || currentTrack.title;
  const displayArtist = currentTrack.artist || liveMetadata.author || 'Golden Era Maestro';

  // Progress ticker
  useEffect(() => {
    if (isPlaying) {
      progressTimerRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          try {
            const time = playerRef.current.getCurrentTime();
            if (typeof time === 'number') {
              setCurrentTime(time);
            }
            // Continuous metadata check if title/duration were pending
            if (!liveMetadata.title || !liveMetadata.duration) {
              syncMetadataFromPlayer();
            }
          } catch {
            setCurrentTime((prev) => (prev + 1) % activeDuration);
          }
        } else {
          setCurrentTime((prev) => (prev + 1) % activeDuration);
        }
      }, 1000);
    } else {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    }
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [isPlaying, activeDuration, liveMetadata.title, liveMetadata.duration, syncMetadataFromPlayer]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = Number(e.target.value);
    setCurrentTime(seekTo);
    if (playerRef.current && playerRef.current.seekTo) {
      try {
        playerRef.current.seekTo(seekTo, true);
      } catch {
        // ignore
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (playerRef.current && playerRef.current.setVolume) {
      try {
        playerRef.current.setVolume(val);
      } catch {
        // ignore
      }
    }
  };

  const handleMuteToggle = () => {
    vintageAudio.playMechanicalClick();
    if (isMuted) {
      setIsMuted(false);
      if (playerRef.current) playerRef.current.unMute?.();
    } else {
      setIsMuted(true);
      if (playerRef.current) playerRef.current.mute?.();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredTracks = TRACKS.filter((t) => {
    const matchesSide = filterSide === 'ALL' || t.side === filterSide;
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.movie.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSide && matchesSearch;
  });

  return (
    <>
      {/* Off-screen container for YouTube iframe controller (kept in DOM layout for reliable playback) */}
      <div 
        id="yt-player-hidden-container" 
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '320px',
          height: '240px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1
        }}
      />

      {/* Main Glassmorphism Fixed Bottom Player Bar */}
      <div 
        id="glassmorphic-bottom-player"
        className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-[#140b06]/92 backdrop-blur-xl border-t border-[#613f1e]/60 shadow-[0_-15px_40px_rgba(0,0,0,0.85)]"
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          {/* Top Scrubber & Timecode Row */}
          <div className="flex items-center gap-3 w-full">
            <span className="text-[10px] font-mono text-[#d4af37] w-9 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 flex items-center">
              <input
                id="playback-scrubber"
                type="range"
                min="0"
                max={activeDuration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-[#2b170c] rounded-lg appearance-none cursor-pointer accent-[#f59e0b] hover:h-2 transition-all"
              />
            </div>
            <span className="text-[10px] font-mono text-[#8c6239] w-9">
              {formatTime(activeDuration)}
            </span>
          </div>

          {/* Core Controls & Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: Track Information & Album Badge */}
            <div className="flex items-center gap-3 min-w-[200px] flex-1">
              {/* Spinning Mini Vinyl Badge */}
              <div 
                className="relative w-12 h-12 rounded-full bg-[#0a0502] border-2 border-[#d4af37] flex items-center justify-center shrink-0 cursor-pointer shadow-md"
                onClick={onTogglePlay}
                title="Click to toggle playback"
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${isPlaying ? 'animate-spin-vinyl' : ''}`}
                  style={{
                    backgroundColor: currentTrack.colorScheme.labelBg || '#7c2d12',
                    border: `1px solid ${currentTrack.colorScheme.labelBorder || '#f59e0b'}`
                  }}
                >
                  <Disc className="w-4 h-4 text-[#fde047]" />
                </div>
              </div>

              {/* Title & Artist directly synchronized with YouTube state */}
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <h4 className="font-playfair text-sm sm:text-base font-bold text-[#fef3c7] truncate drop-shadow">
                    {displayTitle}
                  </h4>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#3b2310] text-[#fcd34d] font-mono border border-[#784d1e]">
                    Side {currentTrack.side}
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${currentTrack.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-md bg-[#291307] hover:bg-[#451f0b] text-[#fcd34d] border border-[#784d1e]/80 flex items-center justify-center transition-all hover:scale-105"
                    title="Open song/playlist on YouTube"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3 text-[#f59e0b]" />
                  </a>
                  {liveMetadata.title && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[8px] px-1 py-0.2 rounded bg-[#291307] text-[#a7f3d0] font-mono border border-[#059669]/40" title="Live synchronized with YouTube player state">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE YT
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#d4af37] font-serif truncate">
                  {displayArtist} • <span className="text-[#a88a6d] italic">{currentTrack.movie} ({currentTrack.year})</span>
                </div>
              </div>
            </div>

            {/* Middle: Vintage Playback Controls */}
            <div className="flex items-center gap-3 sm:gap-4 justify-center">
              {/* Previous Track */}
              <button
                id="prev-track-btn"
                onClick={() => {
                  vintageAudio.playCassetteDeckClick();
                  onPrevTrack();
                }}
                className="w-9 h-9 rounded-full bg-[#241308] hover:bg-[#3d2210] border border-[#5c3717] flex items-center justify-center text-[#d4af37] hover:text-[#fef3c7] transition-all active:scale-95 shadow"
                title="Previous track [P]"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Main Play / Pause Master Button */}
              <button
                id="master-play-pause-btn"
                onClick={() => {
                  vintageAudio.playNeedleDrop();
                  onTogglePlay();
                }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#b45309] hover:from-[#fbbf24] hover:to-[#d97706] text-[#1a0f07] flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95"
                title="Play / Pause [Space]"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                )}
              </button>

              {/* Next Track */}
              <button
                id="next-track-btn"
                onClick={() => {
                  vintageAudio.playCassetteDeckClick();
                  onNextTrack();
                }}
                className="w-9 h-9 rounded-full bg-[#241308] hover:bg-[#3d2210] border border-[#5c3717] flex items-center justify-center text-[#d4af37] hover:text-[#fef3c7] transition-all active:scale-95 shadow"
                title="Next track [N]"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Sound FX, Volume, Playlist Drawer, Lyrics */}
            <div className="flex items-center gap-2 sm:gap-3 justify-end">
              {/* Animated Vintage Equalizer visualizer bars */}
              <div className="hidden md:flex items-end gap-1 h-6 bg-[#0a0502] px-2 py-1 rounded-lg border border-[#3b2310]">
                {[45, 85, 60, 95, 70, 40].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-[#f59e0b] rounded-t transition-all duration-200 ${
                      isPlaying ? 'animate-pulse' : 'opacity-30'
                    }`}
                    style={{
                      height: isPlaying ? `${(h * (i + 1) * 17) % 20 + 4}px` : '4px'
                    }}
                  />
                ))}
              </div>

              {/* Volume Slider & Mute */}
              <div className="hidden sm:flex items-center gap-1.5 bg-[#201107] px-2.5 py-1.5 rounded-xl border border-[#4d2d14]">
                <button
                  id="mute-btn"
                  onClick={handleMuteToggle}
                  className="text-[#d4af37] hover:text-[#fef3c7] transition-colors"
                  title="Mute / Unmute"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-[#120803] rounded-lg appearance-none cursor-pointer accent-[#f59e0b]"
                />
              </div>

              {/* Lyrics Reader Button */}
              <button
                id="toggle-lyrics-btn"
                onClick={() => {
                  vintageAudio.playMechanicalClick();
                  setIsLyricsOpen(!isLyricsOpen);
                }}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-serif ${
                  isLyricsOpen
                    ? 'bg-[#78350f] text-[#fef3c7] border-[#f59e0b]'
                    : 'bg-[#201107] text-[#d4af37] border-[#4d2d14] hover:border-[#b45309]'
                }`}
                title="View original lyrics & poetic translation"
              >
                <BookOpen className="w-4 h-4 text-[#f59e0b]" />
                <span className="hidden lg:inline">Lyrics</span>
              </button>

              {/* Playlist Tracklist Drawer Toggle */}
              <button
                id="toggle-tracklist-btn"
                onClick={() => {
                  vintageAudio.playMechanicalClick();
                  setIsDrawerOpen(!isDrawerOpen);
                }}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-serif ${
                  isDrawerOpen
                    ? 'bg-[#78350f] text-[#fef3c7] border-[#f59e0b]'
                    : 'bg-[#201107] text-[#d4af37] border-[#4d2d14] hover:border-[#b45309]'
                }`}
                title="Browse Full Golden Era Tracklist"
              >
                <ListMusic className="w-4 h-4 text-[#f59e0b]" />
                <span className="hidden lg:inline">Tracks ({TRACKS.length})</span>
              </button>

              {/* YouTube Playlist Direct Link */}
              <a
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#201107] hover:bg-[#341b0b] text-[#f59e0b] border border-[#4d2d14] hover:border-[#f59e0b] transition-all flex items-center"
                title="Open original YouTube playlist"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Keyboard Shortcuts Guide Button */}
              <button
                onClick={() => {
                  vintageAudio.playMechanicalClick();
                  setIsShortcutsOpen(!isShortcutsOpen);
                }}
                className="p-2 rounded-xl bg-[#201107] text-[#a88a6d] hover:text-[#fde68a] border border-[#4d2d14]"
                title="View Keyboard Hotkeys"
              >
                <Keyboard className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lyrics & Trivia Overlay Drawer */}
      {isLyricsOpen && (
        <div 
          id="lyrics-drawer-panel"
          className="fixed bottom-24 right-4 z-40 w-full max-w-md rounded-2xl p-5 brass-border shadow-2xl bg-[#1c1008]/95 backdrop-blur-xl animate-fadeIn text-left"
        >
          <div className="flex items-center justify-between border-b border-[#4d321c] pb-2 mb-3">
            <div className="flex items-center gap-2 truncate pr-2">
              <BookOpen className="w-4 h-4 text-[#f59e0b] shrink-0" />
              <h3 className="font-cinzel text-xs font-bold text-[#d4af37] tracking-wider uppercase truncate">
                LYRICS & POETRY • {displayTitle}
              </h3>
            </div>
            <button
              onClick={() => setIsLyricsOpen(false)}
              className="text-[#a88a6d] hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          </div>

          <div className="my-2 p-3 rounded-xl bg-[#120803] border border-[#3b2310]">
            <p className="font-playfair text-base sm:text-lg text-[#fef3c7] leading-relaxed italic">
              {currentTrack.lyricSnippet}
            </p>
            <p className="text-xs font-serif text-[#d4af37] mt-2 italic border-t border-[#2b170c] pt-2">
              &ldquo;{currentTrack.lyricTranslation}&rdquo;
            </p>
          </div>

          <div className="text-[11px] font-mono text-[#a88a6d] mt-2 space-y-1">
            <div><span className="text-[#f59e0b]">Composer:</span> {currentTrack.composer}</div>
            <div><span className="text-[#f59e0b]">Lyricist:</span> {currentTrack.lyricist}</div>
            <div className="text-xs font-serif text-[#fed7aa] bg-[#29170c] p-2 rounded-lg mt-2">
              💡 <span className="font-bold">Behind the Melody:</span> {currentTrack.trivia}
            </div>
          </div>
        </div>
      )}

      {/* Full Tracklist Drawer */}
      {isDrawerOpen && (
        <div 
          id="tracklist-drawer-panel"
          className="fixed bottom-24 left-4 z-40 w-full max-w-lg rounded-3xl p-5 brass-border shadow-2xl bg-[#1a0e07]/95 backdrop-blur-xl animate-fadeIn text-left max-h-[70vh] flex flex-col"
        >
          <div className="flex items-center justify-between border-b border-[#4d321c] pb-3 mb-3">
            <div className="flex items-center gap-2">
              <ListMusic className="w-5 h-5 text-[#f59e0b]" />
              <h3 className="font-cinzel text-sm font-bold text-[#d4af37] tracking-wider uppercase">
                GOLDEN ERA PLAYLIST VAULT
              </h3>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="text-[#a88a6d] hover:text-white text-xs font-mono"
            >
              ✕ CLOSE
            </button>
          </div>

          {/* Search & Filter bar */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Search by song, singer, movie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#110703] border border-[#4d321c] text-xs text-[#fef3c7] placeholder-[#78593f] focus:outline-none focus:border-[#f59e0b]"
            />
            <div className="flex gap-1">
              {(['ALL', 'A', 'B'] as const).map((side) => (
                <button
                  key={side}
                  onClick={() => setFilterSide(side)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg border ${
                    filterSide === side
                      ? 'bg-[#b45309] text-white border-[#f59e0b]'
                      : 'bg-[#120703] text-[#a88a6d] border-[#3b2310]'
                  }`}
                >
                  {side === 'ALL' ? 'All Sides' : `Side ${side}`}
                </button>
              ))}
            </div>
          </div>

          {/* Track rows */}
          <div className="overflow-y-auto space-y-2 pr-1 flex-1">
            {filteredTracks.map((track, idx) => (
              <div
                key={track.id}
                onClick={() => {
                  vintageAudio.playNeedleDrop();
                  onSelectTrack(track);
                  setIsDrawerOpen(false);
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                  currentTrack.id === track.id
                    ? 'bg-[#3b2010] border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                    : 'bg-[#140a05] border-[#3d2411] hover:border-[#854d0e] hover:bg-[#241308]'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-xs font-mono text-[#d4af37] w-5">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <div className="truncate">
                    <div className="font-playfair text-sm font-bold text-[#fef3c7] group-hover:text-[#fde047] truncate">
                      {track.title}
                    </div>
                    <div className="text-xs text-[#a88a6d] font-serif truncate">
                      {track.artist} • <span className="italic">{track.movie}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#24140a] text-[#fcd34d] border border-[#523318]">
                    Side {track.side}
                  </span>
                  {currentTrack.id === track.id && isPlaying ? (
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {isShortcutsOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsShortcutsOpen(false)}
        >
          <div 
            className="relative w-full max-w-sm rounded-2xl p-5 brass-border bg-[#1c1008] text-left shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#4d321c] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-[#f59e0b]" />
                <h4 className="font-cinzel text-xs font-bold text-[#d4af37] uppercase">KEYBOARD SHORTCUTS</h4>
              </div>
              <button onClick={() => setIsShortcutsOpen(false)} className="text-xs text-[#a88a6d]">✕</button>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#2e190d]">
                <span className="text-[#fef3c7]">Play / Pause</span>
                <span className="px-2 py-0.5 rounded bg-[#2e190d] text-[#f59e0b] border border-[#523318]">Space</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2e190d]">
                <span className="text-[#fef3c7]">Next Classic</span>
                <span className="px-2 py-0.5 rounded bg-[#2e190d] text-[#f59e0b] border border-[#523318]">N</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2e190d]">
                <span className="text-[#fef3c7]">Previous Classic</span>
                <span className="px-2 py-0.5 rounded bg-[#2e190d] text-[#f59e0b] border border-[#523318]">P</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2e190d]">
                <span className="text-[#fef3c7]">Toggle Vinyl Crackle</span>
                <span className="px-2 py-0.5 rounded bg-[#2e190d] text-[#f59e0b] border border-[#523318]">C</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2e190d]">
                <span className="text-[#fef3c7]">Light / Dim Lantern</span>
                <span className="px-2 py-0.5 rounded bg-[#2e190d] text-[#f59e0b] border border-[#523318]">L</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2e190d]">
                <span className="text-[#fef3c7]">Take Polaroid Photo</span>
                <span className="px-2 py-0.5 rounded bg-[#2e190d] text-[#f59e0b] border border-[#523318]">F</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
