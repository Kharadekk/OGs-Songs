import React, { useState } from 'react';
import { Play, Pause, Volume2, Disc, Sparkles, Gauge } from 'lucide-react';
import { SongTrack } from '../types';
import { vintageAudio } from '../utils/audioSynthesizer';
import { VinylDustCanvas } from './VinylDustCanvas';

interface TurntableCenterpieceProps {
  currentTrack: SongTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speedRPM: 33 | 45;
  onToggleRPM: () => void;
  crackleEnabled: boolean;
  onToggleCrackle: () => void;
}

export const TurntableCenterpiece: React.FC<TurntableCenterpieceProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  speedRPM,
  onToggleRPM,
  crackleEnabled,
  onToggleCrackle
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pitch, setPitch] = useState(0);

  const handlePlatterClick = () => {
    vintageAudio.playNeedleDrop();
    onTogglePlay();
  };

  const handleRpmClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    vintageAudio.playMechanicalClick();
    onToggleRPM();
  };

  const handleCrackleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCrackle();
  };

  return (
    <div 
      id="turntable-deck"
      className="relative w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-8 brass-border shadow-2xl transition-all duration-500"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #2e1d13 0%, #170d07 70%, #0c0704 100%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), inset 0 2px 4px rgba(255, 200, 120, 0.15), 0 0 40px rgba(217, 119, 6, 0.15)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Plinth Brass Plate with Inscription */}
      <div className="flex items-center justify-between pb-5 border-b border-[#5c3e21]/40 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#f59e0b] shadow-[0_0_12px_#f59e0b] animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel tracking-widest text-xs font-bold text-[#d4af37] uppercase">HMV MasterVoice</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#42220f] text-[#fcd34d] border border-[#d97706]/40 font-mono">MODEL 1974</span>
            </div>
            <p className="text-[11px] text-[#a88a6d] font-serif italic">High Fidelity Direct Drive Turntable • 33⅓ & 45 RPM</p>
          </div>
        </div>

        {/* Status Indicators & Speed Selector */}
        <div className="flex items-center gap-2">
          {/* 33 / 45 RPM Switch */}
          <button
            id="rpm-toggle-btn"
            onClick={handleRpmClick}
            title="Switch turntable rotational speed"
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
              speedRPM === 45
                ? 'bg-[#b45309] text-white border-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                : 'bg-[#29170c] text-[#d4af37] border-[#784d1e] hover:border-[#f59e0b]'
            }`}
          >
            <Gauge className="w-3 h-3" />
            <span>{speedRPM} RPM</span>
          </button>

          {/* Needle Crackle Toggle */}
          <button
            id="crackle-toggle-btn"
            onClick={handleCrackleClick}
            title="Toggle authentic 1970s vinyl surface needle crackle"
            className={`px-2.5 py-1 text-xs rounded-lg border transition-all flex items-center gap-1 font-serif ${
              crackleEnabled
                ? 'bg-[#78350f] text-[#fef3c7] border-[#d97706] shadow-[0_0_8px_rgba(217,119,6,0.4)]'
                : 'bg-[#29170c] text-[#a88a6d] border-[#784d1e] hover:text-[#fcd34d]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#f59e0b]" />
            <span className="hidden sm:inline">Vinyl Crackle</span>
            <span className="text-[10px] font-mono font-bold text-[#f59e0b]">{crackleEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Turntable Deck Platter Area */}
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 my-2">
        {/* The Rotating Vinyl Platter */}
        <div 
          id="vinyl-platter"
          onClick={handlePlatterClick}
          className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-[#120a06] border-4 border-[#3d2411] shadow-[0_0_35px_rgba(0,0,0,0.9)] cursor-pointer group select-none"
        >
          {/* Strobe Ring with Tiny Dots */}
          <div className="absolute inset-1 rounded-full border border-dashed border-[#d4af37]/20 pointer-events-none" />

          {/* Heavy Rubber Slipmat / Turntable Platter */}
          <div className="relative w-full h-full rounded-full bg-[#1b120c] flex items-center justify-center p-2.5 overflow-hidden">
            {/* The Vinyl Disc itself */}
            <div 
              className={`relative w-full h-full rounded-full bg-[#0a0604] border-2 border-[#1f150e] flex items-center justify-center transition-transform duration-1000 ${
                isPlaying 
                  ? speedRPM === 45 ? 'animate-spin-vinyl-45' : 'animate-spin-vinyl' 
                  : ''
              }`}
              style={{
                boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.95), 0 4px 15px rgba(0,0,0,0.8)'
              }}
            >
              {/* Concentric Sound Grooves (Micro-groove rings) */}
              <div className="absolute inset-3 rounded-full border border-[#2b1e15]/60 pointer-events-none" />
              <div className="absolute inset-6 rounded-full border border-[#231811]/70 pointer-events-none" />
              <div className="absolute inset-9 rounded-full border border-[#2b1e15]/50 pointer-events-none" />
              <div className="absolute inset-12 rounded-full border border-[#231811]/80 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-[#2b1e15]/60 pointer-events-none" />
              <div className="absolute inset-20 rounded-full border border-[#231811]/70 pointer-events-none" />

              {/* Dynamic Angular Sheen / Light Reflection on Vinyl Grooves */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-screen"
                style={{
                  background: 'conic-gradient(from 45deg, transparent 0deg, rgba(255,230,180,0.2) 40deg, transparent 80deg, transparent 180deg, rgba(255,230,180,0.18) 220deg, transparent 260deg)'
                }}
              />

              {/* Animated Surface Dust & Scratch Artifacts Canvas Overlay */}
              <VinylDustCanvas
                isPlaying={isPlaying}
                speedRPM={speedRPM}
                crackleEnabled={crackleEnabled}
              />

              {/* Center Record Paper Label (HMV / Polydor Golden Style) */}
              <div 
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center text-center p-2.5 shadow-md border-2"
                style={{
                  backgroundColor: currentTrack.colorScheme.labelBg || '#851b1b',
                  borderColor: currentTrack.colorScheme.labelBorder || '#d97706',
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.3) 100%)'
                }}
              >
                {/* Gold Dog & Gramophone iconic emblem / text */}
                <div className="text-[8px] font-cinzel tracking-widest text-[#fde047] font-black uppercase border-b border-[#fde047]/40 pb-0.5 mb-0.5">
                  HIS MASTER&apos;S VOICE
                </div>

                <div className="text-[10px] sm:text-[11px] font-bold text-white font-playfair leading-tight truncate max-w-[90px] drop-shadow">
                  {currentTrack.title}
                </div>

                <div className="text-[8px] text-[#fde68a] font-serif truncate max-w-[85px] mt-0.5">
                  {currentTrack.movie} ({currentTrack.year})
                </div>

                <div className="text-[7px] text-[#fed7aa] font-mono mt-0.5">
                  SIDE {currentTrack.side} • {currentTrack.artist.split(' ')[0]}
                </div>

                {/* Center Spindle Hole */}
                <div className="absolute w-4 h-4 rounded-full bg-[#110804] border-2 border-[#d4af37] shadow-inner flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#silver] shadow" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Hover / Play Cue Overlay */}
          <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
            <div className="w-12 h-12 rounded-full bg-[#d97706] text-black flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </div>
          </div>
        </div>

        {/* Vintage Tonearm & Mechanical Controls */}
        <div className="flex flex-col items-center md:items-start justify-between h-full gap-5 w-full md:w-auto">
          {/* Visual Stylus Tonearm Unit */}
          <div className="relative w-48 h-36 bg-[#1a0e08] rounded-2xl p-4 border border-[#523318] shadow-inner flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider text-[#d4af37]">S-SHAPED TONEARM</span>
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500/60'}`} />
            </div>

            {/* Stylus Status Diagram */}
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-16 bg-[#120803] rounded-lg border border-[#3b2310] flex items-center justify-center overflow-hidden">
                {/* Animated Brass Tonearm */}
                <div 
                  className={`w-16 h-1.5 bg-gradient-to-r from-[#d4af37] to-[#854d0e] rounded-full origin-right transition-all duration-700 ${
                    isPlaying ? 'rotate-[-12deg] translate-y-1' : 'rotate-[-38deg] -translate-y-2'
                  }`}
                  style={{
                    boxShadow: '0 2px 5px rgba(0,0,0,0.8)'
                  }}
                >
                  {/* Cartridge headshell */}
                  <div className="w-3 h-2.5 bg-[#ef4444] rounded-sm -translate-x-1 -translate-y-0.5 border border-white/40 flex items-center justify-center">
                    <div className="w-0.5 h-1 bg-white" />
                  </div>
                </div>
              </div>

              <div className="text-left">
                <div className="text-xs font-serif font-bold text-[#fde047]">
                  {isPlaying ? 'Stylus Engaged' : 'Tonearm Rested'}
                </div>
                <div className="text-[10px] text-[#a88a6d] font-mono mt-0.5">
                  Tracking Force: 1.75g
                </div>
                <div className="text-[10px] text-[#d97706] font-mono">
                  Cartridge: Shure M44-7
                </div>
              </div>
            </div>

            {/* Manual Cue Lever */}
            <button
              id="cue-lever-btn"
              onClick={handlePlatterClick}
              className="w-full py-1.5 text-xs font-serif font-bold rounded-lg bg-gradient-to-b from-[#78350f] to-[#451a03] hover:from-[#92400e] hover:to-[#582104] text-[#fef3c7] border border-[#b45309] shadow flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Disc className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
              <span>{isPlaying ? 'Lift Tonearm (Pause)' : 'Drop Needle (Play)'}</span>
            </button>
          </div>

          {/* Pitch / Fine Speed Trim Control */}
          <div className="w-full max-w-[200px] bg-[#170d07] rounded-xl p-3 border border-[#452712] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#d4af37]">
              <span>PITCH TRIM</span>
              <span>{pitch > 0 ? `+${pitch}%` : `${pitch}%`}</span>
            </div>
            <input 
              type="range"
              min="-8"
              max="8"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full h-1.5 bg-[#2b170c] rounded-lg appearance-none cursor-pointer accent-[#f59e0b]"
            />
            <div className="flex justify-between text-[8px] font-mono text-[#785433]">
              <span>-8%</span>
              <span>0% (Quartz)</span>
              <span>+8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Turntable Plinth Corner Screws & Badges */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#8c6239] border border-[#d4af37]/40 shadow-inner" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#8c6239] border border-[#d4af37]/40 shadow-inner" />
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#8c6239] border border-[#d4af37]/40 shadow-inner" />
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#8c6239] border border-[#d4af37]/40 shadow-inner" />
    </div>
  );
};
