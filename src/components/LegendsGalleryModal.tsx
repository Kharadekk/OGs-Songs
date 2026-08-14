import React from 'react';
import { X, Play, Music, Sparkles, Award, Quote, ExternalLink, Radio } from 'lucide-react';
import { Legend, SongTrack } from '../types';
import { vintageAudio } from '../utils/audioSynthesizer';

interface LegendsGalleryModalProps {
  legend: Legend | null;
  onClose: () => void;
  onPlaySongName: (songTitle: string) => void;
  onPlayLegendPlaylist?: (legend: Legend) => void;
}

export const LegendsGalleryModal: React.FC<LegendsGalleryModalProps> = ({
  legend,
  onClose,
  onPlaySongName,
  onPlayLegendPlaylist
}) => {
  if (!legend) return null;

  const handlePlayPlaylist = () => {
    vintageAudio.playNeedleDrop();
    if (onPlayLegendPlaylist) {
      onPlayLegendPlaylist(legend);
    } else {
      onPlaySongName(legend.playlistTitle || legend.name);
    }
    onClose();
  };

  return (
    <div 
      id="legend-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 brass-border shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, #24140b 0%, #140a05 100%)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(217, 119, 6, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-legend-modal-btn"
          onClick={() => {
            vintageAudio.playMechanicalClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#3b2310] hover:bg-[#523318] text-[#fde047] flex items-center justify-center border border-[#784d1e] shadow transition-transform active:scale-95 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Legend Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-5 border-b border-[#4d321c]/60">
          <div className="relative w-28 h-36 rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-xl shrink-0">
            <img 
              src={legend.imagePoster} 
              alt={legend.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover sepia contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Award className="w-4 h-4 text-[#f59e0b]" />
              <span className="text-xs font-mono text-[#f59e0b] uppercase tracking-wider">{legend.years}</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-[#fef3c7] mt-1">
              {legend.name}
            </h2>
            <p className="font-playfair text-sm text-[#fcd34d] italic mt-0.5">
              {legend.title}
            </p>
          </div>
        </div>

        {/* Dedicated YouTube Hits Playlist Feature Card */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-[#3b0d0c] to-[#200b05] border border-[#ef4444]/40 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#dc2626] text-white flex items-center justify-center shadow-lg shrink-0">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#7f1d1d] text-[#fca5a5] font-mono uppercase tracking-wider border border-[#b91c1c]">
                    Official Playlist
                  </span>
                  <span className="text-[10px] text-[#fde68a] font-mono">YouTube Radio</span>
                </div>
                <h4 className="font-serif text-sm font-bold text-[#fef3c7] mt-0.5">
                  {legend.playlistTitle || `${legend.name} Hits Playlist`}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                id={`play-playlist-btn-${legend.id}`}
                onClick={handlePlayPlaylist}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-[#b91c1c] to-[#991b1b] hover:from-[#dc2626] hover:to-[#b91c1c] text-white font-cinzel text-xs font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)] border border-[#f87171]/50 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play on Vinyl</span>
              </button>

              <a
                href={legend.youtubePlaylistUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#291307] hover:bg-[#451f0b] text-[#fcd34d] border border-[#784d1e] flex items-center justify-center transition-all"
                title="Open directly on YouTube"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="my-3">
          <p className="font-sans text-sm text-[#e2cfb7] leading-relaxed">
            {legend.bio}
          </p>
        </div>

        {/* Signature Quote */}
        <div className="p-3.5 rounded-xl bg-[#120803] border border-[#452712] mb-4">
          <div className="flex items-start gap-2">
            <Quote className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
            <p className="font-serif text-xs italic text-[#fde047]">
              &ldquo;{legend.quote}&rdquo;
            </p>
          </div>
        </div>

        {/* Iconic Evergreen Hits */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-4 h-4 text-[#f59e0b]" />
            <h3 className="font-cinzel text-xs font-bold text-[#d4af37] uppercase tracking-wider">
              INDIVIDUAL ICONIC TRACKS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {legend.iconicSongs.map((songTitle, idx) => (
              <button
                key={idx}
                onClick={() => {
                  vintageAudio.playNeedleDrop();
                  onPlaySongName(songTitle);
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-[#1a0f08] hover:bg-[#341b0e] border border-[#523318] hover:border-[#f59e0b] text-left flex items-center justify-between group transition-all"
              >
                <span className="text-xs font-serif text-[#fef3c7] group-hover:text-[#fde047] truncate">
                  {songTitle}
                </span>
                <Play className="w-3.5 h-3.5 text-[#f59e0b] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
