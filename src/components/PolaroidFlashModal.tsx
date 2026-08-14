import React, { useEffect, useState } from 'react';
import { X, Camera, Download, Sparkles, Heart, Disc, Check } from 'lucide-react';
import { SongTrack } from '../types';
import { vintageAudio } from '../utils/audioSynthesizer';
import confetti from 'canvas-confetti';

interface PolaroidFlashModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: SongTrack;
}

export const PolaroidFlashModal: React.FC<PolaroidFlashModalProps> = ({
  isOpen,
  onClose,
  currentTrack
}) => {
  const [flashActive, setFlashActive] = useState(false);
  const [developed, setDeveloped] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFlashActive(true);
      setDeveloped(false);
      setSavedNotice(false);

      // Trigger warm celebratory golden sparkles
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#d97706', '#ffe4a0']
        });
      } catch {
        // Safe catch if canvas is constrained
      }

      const flashTimer = setTimeout(() => {
        setFlashActive(false);
      }, 350);

      const devTimer = setTimeout(() => {
        setDeveloped(true);
      }, 1200);

      return () => {
        clearTimeout(flashTimer);
        clearTimeout(devTimer);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    vintageAudio.playMechanicalClick();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  return (
    <div 
      id="polaroid-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Visual Strobe Camera Flash Overlay */}
      {flashActive && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300" />
      )}

      <div 
        className="relative w-full max-w-sm rounded-2xl p-6 brass-border shadow-2xl flex flex-col items-center text-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #2b180d 0%, #150b06 100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#3b2310] hover:bg-[#523318] text-[#fde047] flex items-center justify-center border border-[#784d1e] shadow"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-[#f59e0b]" />
          <span className="font-cinzel text-xs font-bold text-[#d4af37] tracking-widest uppercase">
            POLAROID MEMORY • 1974
          </span>
        </div>

        {/* The Classic Polaroid Frame */}
        <div 
          className="w-full bg-[#fdfbf7] p-3.5 pb-6 rounded-lg shadow-2xl border border-[#d6cfc7] text-[#1c1917] transform rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500"
        >
          {/* Polaroid Image Area with gradual chemical development effect */}
          <div className="relative aspect-square w-full rounded bg-[#1f1610] overflow-hidden border border-[#3b2c21]">
            <img 
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80" 
              alt="Vintage Music Session" 
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-1000 ${
                developed 
                  ? 'sepia brightness-105 contrast-125 opacity-100 filter' 
                  : 'sepia contrast-150 brightness-50 opacity-40 blur-sm'
              }`}
            />

            {/* Vintage Film Timestamp & Watermark */}
            <div className="absolute bottom-2 left-2 text-[9px] font-mono text-[#fde047] bg-black/70 px-1.5 py-0.5 rounded">
              OCT 1974 • HMV STUDIOS
            </div>

            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-red-600/80 text-white font-mono text-[8px] font-bold">
              33⅓ RPM
            </div>
          </div>

          {/* Handwritten Polaroid Caption */}
          <div className="mt-3.5 text-center">
            <p className="font-playfair text-sm font-bold text-[#1f1610]">
              &ldquo;{currentTrack.title}&rdquo;
            </p>
            <p className="font-serif text-xs text-[#574332] italic mt-0.5">
              {currentTrack.lyricSnippet}
            </p>
            <div className="text-[10px] font-mono text-[#78593f] mt-1 border-t border-[#d6cfc7] pt-1">
              {currentTrack.artist} • {currentTrack.movie} ({currentTrack.year})
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-5 w-full">
          <button
            onClick={handleDownload}
            className={`flex-1 py-2 rounded-xl font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
              savedNotice 
                ? 'bg-emerald-600 text-white' 
                : 'bg-[#d97706] hover:bg-[#b45309] text-black'
            }`}
          >
            {savedNotice ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved to Scrapbook!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Keep Souvenir</span>
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-[#29170c] hover:bg-[#3d2413] text-[#fde68a] text-xs font-serif border border-[#6b421a]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
