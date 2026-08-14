import React, { useState } from 'react';
import { Radio, Disc3, Sparkles, VolumeX, Volume2, FastForward, Rewind, RadioTower } from 'lucide-react';
import { RadioStation, SongTrack } from '../types';
import { RADIO_STATIONS } from '../data/playlistData';
import { vintageAudio } from '../utils/audioSynthesizer';

interface TapeDeckAndRadioProps {
  currentTrack: SongTrack;
  isPlaying: boolean;
  onSideToggle: () => void;
  onTrackSelect: (trackId: string) => void;
  activeStation: RadioStation | null;
  onSelectStation: (station: RadioStation) => void;
}

export const TapeDeckAndRadio: React.FC<TapeDeckAndRadioProps> = ({
  currentTrack,
  isPlaying,
  onSideToggle,
  onTrackSelect,
  activeStation,
  onSelectStation
}) => {
  const [tapeCounter, setTapeCounter] = useState(42);
  const [dialFreq, setDialFreq] = useState(102.8);
  const [isRadioActive, setIsRadioActive] = useState(false);
  const [dolbyNR, setDolbyNR] = useState(true);

  const handleTapeSideClick = () => {
    vintageAudio.playCassetteDeckClick();
    onSideToggle();
  };

  const handleRadioTune = (station: RadioStation) => {
    vintageAudio.playRadioTuningDial(Math.random() * 600 + 700);
    onSelectStation(station);
    setIsRadioActive(true);
  };

  const handleDolbyToggle = () => {
    vintageAudio.playMechanicalClick();
    setDolbyNR(!dolbyNR);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
      {/* 1. Vintage Cassette Deck Component */}
      <div 
        id="cassette-deck-card"
        className="rounded-3xl p-5 sm:p-6 brass-border shadow-xl flex flex-col justify-between"
        style={{
          background: 'linear-gradient(145deg, #20130b 0%, #130a05 100%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,215,0,0.1)'
        }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#4d321c]/50 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Disc3 className="w-4 h-4 text-[#f59e0b]" />
            <span className="font-cinzel text-xs font-bold text-[#d4af37] tracking-wider">NATIONAL PANASONIC RS-450</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-[#a88a6d]">TAPE COUNTER:</span>
            <span className="px-2 py-0.5 rounded bg-black text-[#22c55e] border border-[#22c55e]/30 font-bold">
              0{isPlaying ? tapeCounter + 7 : tapeCounter}
            </span>
          </div>
        </div>

        {/* Cassette Tape Door & Spinning Spools */}
        <div className="relative bg-[#0d0704] rounded-2xl p-4 border-2 border-[#3d2411] shadow-inner mb-4">
          {/* Cassette Window Glass */}
          <div className="relative bg-[#1f130b]/90 rounded-xl p-3 border border-[#523318] flex flex-col justify-between h-36">
            {/* Top Tape Label */}
            <div className="flex items-center justify-between text-[9px] font-mono text-[#fde68a] border-b border-[#523318] pb-1">
              <span className="font-bold text-[#f59e0b]">TDK D-90 • HIGH OUTPUT</span>
              <span>TYPE I (NORMAL BIAS)</span>
              <span className="px-1.5 py-0.5 rounded bg-[#b45309] text-white font-black">
                SIDE {currentTrack.side}
              </span>
            </div>

            {/* Middle Tape Spools with Animated Reel Teeth */}
            <div className="flex items-center justify-around my-2">
              {/* Left Spool */}
              <div className="relative w-14 h-14 rounded-full bg-[#120803] border-2 border-[#452712] flex items-center justify-center shadow-inner">
                {/* Spool Teeth Hub */}
                <div 
                  className={`w-9 h-9 rounded-full border-2 border-dashed border-[#d4af37] flex items-center justify-center ${
                    isPlaying ? 'animate-spin-tape' : ''
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-[#ffffff] shadow" />
                </div>
                {/* Magnetic tape layer */}
                <div className="absolute inset-0 rounded-full border-4 border-[#331c0c]/80 pointer-events-none" />
              </div>

              {/* Tape Level Window & Ruler */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-24 h-5 bg-[#0a0502] rounded border border-[#452712] flex items-center justify-center px-1">
                  <div className="w-full h-1 bg-gradient-to-r from-[#d97706] to-[#78350f] rounded" />
                </div>
                <div className="flex justify-between w-24 text-[7px] font-mono text-[#8c6239] mt-0.5">
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
              </div>

              {/* Right Spool */}
              <div className="relative w-14 h-14 rounded-full bg-[#120803] border-2 border-[#452712] flex items-center justify-center shadow-inner">
                <div 
                  className={`w-9 h-9 rounded-full border-2 border-dashed border-[#d4af37] flex items-center justify-center ${
                    isPlaying ? 'animate-spin-tape' : ''
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-[#ffffff] shadow" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-[#331c0c]/80 pointer-events-none" />
              </div>
            </div>

            {/* Song title printed on handwritten cassette label */}
            <div className="bg-[#fef3c7] text-[#1c1917] px-2 py-0.5 rounded text-center text-xs font-serif font-bold truncate shadow-inner">
              📼 &ldquo;{currentTrack.title}&rdquo; — {currentTrack.artist}
            </div>
          </div>
        </div>

        {/* Cassette Deck Mechanical Controls & VU Meter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Dual Analog VU Meters */}
          <div className="flex items-center gap-2 bg-[#0d0704] p-2 rounded-xl border border-[#3b2310]">
            <div className="text-[8px] font-mono text-[#d4af37] flex flex-col justify-center">
              <span>VU L</span>
              <span>VU R</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-20 h-2 bg-[#1f130b] rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-amber-400 to-red-500 transition-all duration-150"
                  style={{ width: isPlaying ? '78%' : '12%' }}
                />
              </div>
              <div className="w-20 h-2 bg-[#1f130b] rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 via-amber-400 to-red-500 transition-all duration-150"
                  style={{ width: isPlaying ? '84%' : '10%' }}
                />
              </div>
            </div>
          </div>

          {/* Quick Cassette Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="cassette-side-flip-btn"
              onClick={handleTapeSideClick}
              className="px-3 py-1.5 rounded-lg bg-[#3b2310] hover:bg-[#523318] text-[#fde68a] text-xs font-serif border border-[#784d1e] flex items-center gap-1 shadow active:scale-95 transition-all"
            >
              <FastForward className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Flip Side (A ↔ B)</span>
            </button>

            <button
              id="dolby-nr-btn"
              onClick={handleDolbyToggle}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                dolbyNR 
                  ? 'bg-[#15803d]/30 text-[#86efac] border-[#22c55e]/50'
                  : 'bg-[#29170c] text-[#a88a6d] border-[#523318]'
              }`}
            >
              Dolby NR: {dolbyNR ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Vintage Analog Tube Radio Tuner */}
      <div 
        id="radio-tuner-card"
        className="rounded-3xl p-5 sm:p-6 brass-border shadow-xl flex flex-col justify-between"
        style={{
          background: 'linear-gradient(145deg, #24140b 0%, #150b06 100%)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,215,0,0.1)'
        }}
      >
        {/* Radio Header */}
        <div className="flex items-center justify-between border-b border-[#4d321c]/50 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#f59e0b]" />
            <span className="font-cinzel text-xs font-bold text-[#d4af37] tracking-wider">MURPHY TUBE RADIO • 1968</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-mono text-[#fde047]">TUNED IN</span>
          </div>
        </div>

        {/* Illuminated Analog Radio Glass Dial */}
        <div className="relative bg-[#0d0704] rounded-2xl p-4 border-2 border-[#452712] shadow-inner mb-4 overflow-hidden">
          {/* Amber Backlight Glow on Dial Glass */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f59e0b]/10 via-[#d97706]/5 to-transparent pointer-events-none" />

          {/* Radio Frequency Scale Markings */}
          <div className="relative z-10 flex flex-col gap-2">
            {/* MW Band scale */}
            <div className="flex justify-between items-center text-[9px] font-mono text-[#d4af37] border-b border-[#3d2411] pb-1">
              <span className="font-bold text-[#f59e0b]">MW BAND</span>
              <span>550</span>
              <span>700</span>
              <span className="text-[#fde68a] font-bold">1180 (Ceylon)</span>
              <span>1400</span>
              <span>1600 kHz</span>
            </div>

            {/* FM Band scale */}
            <div className="flex justify-between items-center text-[9px] font-mono text-[#93c5fd] border-b border-[#3d2411] pb-1">
              <span className="font-bold text-[#60a5fa]">FM BAND</span>
              <span>88</span>
              <span>96</span>
              <span className="text-[#fde047] font-bold">102.8 (Vividh)</span>
              <span>106.4</span>
              <span>108 MHz</span>
            </div>

            {/* The Physical Tuning Indicator Needle */}
            <div className="relative h-6 w-full flex items-center mt-1">
              <div className="w-full h-1 bg-[#24140b] rounded-full relative">
                {/* Moving red tuner needle */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-7 bg-red-600 rounded-sm shadow-[0_0_8px_#ef4444] transition-all duration-500"
                  style={{
                    left: activeStation?.id === 'radio-ceylon' ? '58%' : activeStation?.id === 'air-gold' ? '82%' : '44%'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Station Signature Line Broadcast Box */}
          <div className="mt-3 p-2 rounded-lg bg-[#1a0e08] border border-[#4a2e16] text-center">
            <p className="text-xs font-serif text-[#fde047] italic">
              &ldquo;{activeStation?.signatureLine || 'यह आकाशवाणी का विविध भारती स्टेशन है...'}&rdquo;
            </p>
            <p className="text-[10px] font-mono text-[#a88a6d] mt-0.5">
              Host: {activeStation?.host || 'Ameen Sayani & Yunus Khan'}
            </p>
          </div>
        </div>

        {/* Station Preset Quick Tuner Buttons */}
        <div className="flex flex-wrap gap-2">
          {RADIO_STATIONS.map((st) => (
            <button
              key={st.id}
              id={`station-btn-${st.id}`}
              onClick={() => handleRadioTune(st)}
              className={`flex-1 min-w-[110px] py-1.5 px-2 rounded-xl text-xs font-serif border transition-all flex flex-col items-center text-center ${
                activeStation?.id === st.id
                  ? 'bg-[#78350f] text-[#fef3c7] border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.35)]'
                  : 'bg-[#1a0f08] text-[#d4af37] border-[#4d321c] hover:border-[#b45309]'
              }`}
            >
              <span className="font-bold truncate w-full">{st.name}</span>
              <span className="text-[9px] font-mono text-[#fcd34d]/80">{st.freq}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
