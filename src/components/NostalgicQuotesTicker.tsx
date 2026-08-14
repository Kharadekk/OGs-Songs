import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Sparkles, Radio } from 'lucide-react';
import { NostalgicQuote } from '../types';
import { NOSTALGIC_QUOTES } from '../data/playlistData';
import { vintageAudio } from '../utils/audioSynthesizer';

export const NostalgicQuotesTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setIsFading(true);
    const timeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % (NOSTALGIC_QUOTES.length || 1));
      setIsFading(false);
    }, 300);
    return () => clearTimeout(timeout);
  };

  const handlePrev = () => {
    setIsFading(true);
    vintageAudio.playMechanicalClick();
    const timeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + (NOSTALGIC_QUOTES.length || 1)) % (NOSTALGIC_QUOTES.length || 1));
      setIsFading(false);
    }, 300);
    return () => clearTimeout(timeout);
  };

  const currentQuote: NostalgicQuote = NOSTALGIC_QUOTES[currentIndex] || NOSTALGIC_QUOTES[0] || {
    id: 1,
    text: 'कुछ तो लोग कहेंगे, लोगों का काम है कहना... छोड़ो बेकार की बातों में कहीं बीत ना जाए रैना...',
    source: 'Kishore Kumar • Amar Prem (1972)',
    tag: 'Philosophy & Life',
    year: '1972'
  };

  return (
    <div 
      id="nostalgic-quotes-ticker"
      className="relative w-full max-w-4xl mx-auto my-6 px-4"
    >
      <div 
        className="relative rounded-2xl p-5 sm:p-6 brass-border shadow-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 18, 10, 0.92) 0%, rgba(18, 10, 5, 0.95) 100%)',
          backdropFilter: 'blur(12px)'
        }}
      >
        {/* Subtle decorative quote watermark */}
        <Quote className="absolute right-4 bottom-2 w-24 h-24 text-[#d97706]/5 pointer-events-none" />

        {/* Top Tag & Indicator Bar */}
        <div className="flex items-center justify-between border-b border-[#4d321c]/40 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#f59e0b] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#f59e0b]">
              MEMORIES OF THE GOLDEN ERA • {currentQuote.tag}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-[#a88a6d]">
              {currentIndex + 1} / {NOSTALGIC_QUOTES.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                id="quote-prev-btn"
                onClick={handlePrev}
                className="w-6 h-6 rounded-full bg-[#29170c] hover:bg-[#452712] border border-[#523318] flex items-center justify-center text-[#d4af37] transition-all"
                title="Previous nostalgia memory"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                id="quote-next-btn"
                onClick={() => {
                  vintageAudio.playMechanicalClick();
                  handleNext();
                }}
                className="w-6 h-6 rounded-full bg-[#29170c] hover:bg-[#452712] border border-[#523318] flex items-center justify-center text-[#d4af37] transition-all"
                title="Next nostalgia memory"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quote Content with Smooth Transition */}
        <div className={`transition-opacity duration-300 min-h-[68px] flex flex-col justify-center ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          <p className="font-playfair text-base sm:text-lg md:text-xl text-[#fef3c7] leading-relaxed italic text-center sm:text-left drop-shadow">
            &ldquo;{currentQuote.text}&rdquo;
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-[#3d2411]/50">
            <span className="text-xs font-serif font-bold text-[#d4af37]">
              — {currentQuote.source}
            </span>
            {currentQuote.year && (
              <span className="text-[10px] font-mono text-[#a88a6d] bg-[#120804] px-2 py-0.5 rounded border border-[#3b2310]">
                {currentQuote.year}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
