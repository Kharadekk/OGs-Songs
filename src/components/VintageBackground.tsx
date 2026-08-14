import React from 'react';
import { Sparkles, Flame, Camera, Award, Music, Film, Radio, Play } from 'lucide-react';
import { Legend } from '../types';
import { LEGENDS } from '../data/playlistData';
import { vintageAudio } from '../utils/audioSynthesizer';

interface VintageBackgroundProps {
  lanternBrightness: number;
  onToggleLantern: () => void;
  onSelectLegend: (legend: Legend) => void;
  onTriggerCameraSnapshot: () => void;
  onPlayLegendPlaylist?: (legend: Legend) => void;
}

export const VintageBackground: React.FC<VintageBackgroundProps> = ({
  lanternBrightness,
  onToggleLantern,
  onSelectLegend,
  onTriggerCameraSnapshot,
  onPlayLegendPlaylist
}) => {
  const handleLanternClick = () => {
    vintageAudio.playLanternIgnite();
    onToggleLantern();
  };

  const handleCameraClick = () => {
    vintageAudio.playCameraShutter();
    onTriggerCameraSnapshot();
  };

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Background Brick & Wood Shading Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage: `radial-gradient(#d97706 1px, transparent 1px), radial-gradient(#92400e 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}
      />

      {/* Dynamic Lantern Glow Aura across the entire room */}
      <div 
        className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none transition-all duration-700 blur-3xl"
        style={{
          background: `radial-gradient(circle, rgba(251, 191, 36, ${lanternBrightness * 0.35}) 0%, rgba(217, 119, 6, ${lanternBrightness * 0.18}) 50%, transparent 80%)`
        }}
      />

      {/* Top Banner Signage: "OLD IS GOLD - Evergreen Song's" */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 px-4 text-center">
        {/* Vintage Tin Metal Signboard */}
        <div 
          id="old-is-gold-sign"
          className="relative inline-block px-8 sm:px-14 py-4 sm:py-5 rounded-2xl border-4 border-[#164e63]/80 shadow-2xl transition-transform hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(180deg, #042f2e 0%, #083344 60%, #031e24 100%)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -3px 8px rgba(0,0,0,0.6)'
          }}
        >
          {/* Corner Rivet Screws */}
          <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#94a3b8] border border-black/60 shadow" />
          <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#94a3b8] border border-black/60 shadow" />
          <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#94a3b8] border border-black/60 shadow" />
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#94a3b8] border border-black/60 shadow" />

          {/* Title Text in Classic Retro Serif */}
          <div className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-black tracking-widest text-[#fde047] uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            OLD IS GOLD
          </div>
          
          <div className="font-playfair italic text-xl sm:text-2xl md:text-3xl text-[#fed7aa] font-medium tracking-wide mt-1">
            Evergreen Song&apos;s
          </div>

          <div className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#67e8f9] uppercase mt-1 border-t border-[#155e75] pt-1 opacity-90">
            THE TIMELESS GOLDEN ERA • 1960s – 1980s
          </div>

          <div className="mt-1.5 text-[10px] sm:text-xs font-mono tracking-wider text-[#d4af37] uppercase flex items-center justify-center gap-1.5">
            <span>Site created by</span>
            <span className="font-cinzel font-bold text-[#fef3c7] tracking-normal">Karan Kharade</span>
          </div>
        </div>
      </div>

      {/* Retro Wall Décor & Vintage Artifacts Bar */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Wall Gallery of Framed Legends Posters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 border-b border-[#4d321c]/40 pb-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#f59e0b]" />
              <h2 className="font-cinzel text-sm sm:text-base font-bold text-[#d4af37] uppercase tracking-wider">
                LEGENDS NEVER DIE • HALL OF IMMORTALS
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#a88a6d] italic hidden sm:inline">
              Click any legend to explore discography & trivia
            </span>
          </div>

          {/* Grid of Vintage Portrait Frames */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {LEGENDS.map((legend) => (
              <div
                key={legend.id}
                id={`legend-poster-${legend.id}`}
                onClick={() => onSelectLegend(legend)}
                className="group relative cursor-pointer rounded-xl p-2 bg-[#1b1008] border-2 border-[#5c3e21] hover:border-[#f59e0b] shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(217,119,6,0.3)]"
              >
                {/* Photo container */}
                <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#0d0704] border border-[#3b2310]">
                  <img 
                    src={legend.imagePoster} 
                    alt={legend.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-125 sepia group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500"
                  />
                  {/* Vintage film photo overlay tint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1b1008] via-transparent to-transparent opacity-80" />
                  
                  {/* Quick Play Overlay Button */}
                  <button
                    id={`quick-play-${legend.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      vintageAudio.playNeedleDrop();
                      if (onPlayLegendPlaylist) {
                        onPlayLegendPlaylist(legend);
                      } else {
                        onSelectLegend(legend);
                      }
                    }}
                    title={`Play ${legend.name} Playlist`}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#dc2626] hover:bg-[#ef4444] text-white flex items-center justify-center shadow-lg border border-[#f87171] transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </button>

                  {/* Years badge */}
                  <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[#fde047] text-[8px] font-mono border border-[#784d1e]">
                    {legend.years}
                  </span>
                </div>

                {/* Name Label */}
                <div className="text-center mt-2">
                  <div className="font-serif text-xs font-bold text-[#fef3c7] truncate group-hover:text-[#f59e0b] transition-colors">
                    {legend.name}
                  </div>
                  <div className="text-[9px] text-[#a88a6d] font-mono truncate">
                    {legend.title.split(' ')[0]} {legend.title.split(' ')[1]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Authentic Nostalgic Room Objects Row (Lantern, Rangefinder Camera, Radio, Cassettes) */}
        <div className="flex flex-wrap items-center justify-around gap-6 p-4 rounded-2xl bg-[#140b06]/80 border border-[#3d2411] shadow-inner mb-6">
          {/* 1. Interactive Hurricane Lantern */}
          <div 
            id="interactive-lantern"
            onClick={handleLanternClick}
            className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-[#201209] transition-all border border-transparent hover:border-[#784d1e] group"
            title="Click to light / dim the hurricane lantern"
          >
            <div className={`relative w-12 h-14 rounded-full flex items-center justify-center transition-all ${lanternBrightness > 0.5 ? 'animate-flicker-lantern' : ''}`}>
              <Flame className={`w-8 h-8 transition-colors ${lanternBrightness > 0.5 ? 'text-[#f59e0b] drop-shadow-[0_0_15px_#f59e0b]' : 'text-[#784d1e]'}`} />
              <div className="absolute inset-0 rounded-full border border-[#d4af37]/30 pointer-events-none" />
            </div>
            <div>
              <div className="font-serif text-xs font-bold text-[#fde047] flex items-center gap-1.5">
                <span>Hurricane Lantern</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#78350f] text-[#fde68a] font-mono">
                  {Math.round(lanternBrightness * 100)}%
                </span>
              </div>
              <p className="text-[10px] text-[#a88a6d] font-mono">Click to toggle ambiance</p>
            </div>
          </div>

          {/* 2. Interactive Vintage Camera */}
          <div 
            id="interactive-camera"
            onClick={handleCameraClick}
            className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-[#201209] transition-all border border-transparent hover:border-[#784d1e] group"
            title="Click to take a sepia memory polaroid snapshot!"
          >
            <div className="w-12 h-12 rounded-xl bg-[#24150b] border border-[#523318] flex items-center justify-center group-hover:scale-105 transition-transform shadow">
              <Camera className="w-6 h-6 text-[#d4af37] group-hover:text-[#f59e0b] transition-colors" />
            </div>
            <div>
              <div className="font-serif text-xs font-bold text-[#fde047] flex items-center gap-1">
                <span>Agfa Retro Camera</span>
                <Sparkles className="w-3 h-3 text-[#f59e0b]" />
              </div>
              <p className="text-[10px] text-[#a88a6d] font-mono">Snap Polaroid Keepsake [F]</p>
            </div>
          </div>

          {/* 3. Authentic Trivia Badge */}
          <div className="hidden md:flex items-center gap-3 p-3 rounded-xl bg-[#1d1007] border border-[#4d321c]">
            <div className="w-10 h-10 rounded-lg bg-[#3b2310] flex items-center justify-center">
              <Film className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <div>
              <div className="text-xs font-serif font-bold text-[#fde68a]">
                33⅓ RPM Microgroove
              </div>
              <div className="text-[10px] text-[#a88a6d] font-mono">
                HMV Studio • Bombay 1974
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
