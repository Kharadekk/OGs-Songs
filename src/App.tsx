/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { SongTrack, Legend, RadioStation } from './types';
import { TRACKS, RADIO_STATIONS } from './data/playlistData';
import { vintageAudio } from './utils/audioSynthesizer';
import { TurntableCenterpiece } from './components/TurntableCenterpiece';
import { VintageBackground } from './components/VintageBackground';
import { TapeDeckAndRadio } from './components/TapeDeckAndRadio';
import { NostalgicQuotesTicker } from './components/NostalgicQuotesTicker';
import { LegendsGalleryModal } from './components/LegendsGalleryModal';
import { PolaroidFlashModal } from './components/PolaroidFlashModal';
import { GlassmorphicMusicPlayer } from './components/GlassmorphicMusicPlayer';
import { Disc3, Heart, Radio, Sparkles, Volume2, Compass, Film, Coffee } from 'lucide-react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedRPM, setSpeedRPM] = useState<33 | 45>(33);
  const [crackleEnabled, setCrackleEnabled] = useState(false);
  const [lanternBrightness, setLanternBrightness] = useState(0.9);
  const [selectedLegend, setSelectedLegend] = useState<Legend | null>(null);
  const [isPolaroidOpen, setIsPolaroidOpen] = useState(false);
  const [activeStation, setActiveStation] = useState<RadioStation | null>(RADIO_STATIONS[0]);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);

  const currentTrack: SongTrack = TRACKS[currentTrackIndex] || TRACKS[0];

  // Manage Vinyl Needle Crackle audio loop - strictly off when paused or disabled
  useEffect(() => {
    if (isPlaying && crackleEnabled) {
      vintageAudio.startVinylCrackle(0.15);
    } else {
      vintageAudio.stopVinylCrackle();
    }
    return () => {
      vintageAudio.stopVinylCrackle();
    };
  }, [isPlaying, crackleEnabled]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleNextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  }, []);

  const handlePrevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  const handleSelectTrack = useCallback((track: SongTrack) => {
    const idx = TRACKS.findIndex((t) => t.id === track.id || t.youtubeId === track.youtubeId);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
      setIsPlaying(true);
    }
  }, []);

  const handleToggleRPM = useCallback(() => {
    setSpeedRPM((prev) => (prev === 33 ? 45 : 33));
  }, []);

  const handleToggleCrackle = useCallback(() => {
    vintageAudio.playMechanicalClick();
    setCrackleEnabled((prev) => !prev);
  }, []);

  const handleToggleLantern = useCallback(() => {
    setLanternBrightness((prev) => (prev > 0.6 ? 0.3 : prev > 0.2 ? 0.95 : 0.85));
  }, []);

  const handleSideToggle = useCallback(() => {
    // Switch to opposite side tracks
    const targetSide = currentTrack.side === 'A' ? 'B' : 'A';
    const nextSideTrack = TRACKS.find((t) => t.side === targetSide);
    if (nextSideTrack) {
      handleSelectTrack(nextSideTrack);
    }
  }, [currentTrack.side, handleSelectTrack]);

  const handlePlayLegendPlaylist = useCallback((legend: Legend) => {
    vintageAudio.playNeedleDrop();
    // 1. Direct match by exact YouTube video ID of the requested playlist
    let targetTrack = TRACKS.find((t) => t.youtubeId === legend.youtubeVideoId);

    // 2. If not found by video ID, match by legend ID playlist identifier
    if (!targetTrack) {
      targetTrack = TRACKS.find((t) => t.id === `track-${legend.id}-playlist`);
    }

    // 3. Match by specific legend name in artist/title
    if (!targetTrack) {
      targetTrack = TRACKS.find((t) => t.artist.toLowerCase().includes(legend.name.toLowerCase()));
    }

    if (targetTrack) {
      handleSelectTrack(targetTrack);
    }
  }, [handleSelectTrack]);

  const handlePlaySongByName = useCallback((songTitle: string) => {
    const found = TRACKS.find((t) => 
      t.title.toLowerCase().includes(songTitle.toLowerCase()) ||
      songTitle.toLowerCase().includes(t.title.toLowerCase())
    );
    if (found) {
      handleSelectTrack(found);
    } else {
      // fallback to first track
      setCurrentTrackIndex(0);
      setIsPlaying(true);
    }
  }, [handleSelectTrack]);

  // Global Keyboard Shortcuts (Space, N, P, C, L, F, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcut if typing in search input
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        vintageAudio.playNeedleDrop();
        handleTogglePlay();
      } else if (e.key === 'n' || e.key === 'N') {
        vintageAudio.playCassetteDeckClick();
        handleNextTrack();
      } else if (e.key === 'p' || e.key === 'P') {
        vintageAudio.playCassetteDeckClick();
        handlePrevTrack();
      } else if (e.key === 'c' || e.key === 'C') {
        handleToggleCrackle();
      } else if (e.key === 'l' || e.key === 'L') {
        vintageAudio.playLanternIgnite();
        handleToggleLantern();
      } else if (e.key === 'f' || e.key === 'F') {
        vintageAudio.playCameraShutter();
        setIsPolaroidOpen(true);
      } else if (e.key === 'r' || e.key === 'R') {
        const nextStationIdx = ((RADIO_STATIONS.findIndex(s => s.id === activeStation?.id) + 1) % RADIO_STATIONS.length);
        vintageAudio.playRadioTuningDial();
        setActiveStation(RADIO_STATIONS[nextStationIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleNextTrack, handlePrevTrack, handleToggleCrackle, handleToggleLantern, activeStation]);

  return (
    <div className="relative min-h-screen wood-texture-bg text-[#e8d5b5] flex flex-col justify-between pb-32">
      {/* Dynamic Ambient Top Lighting */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0"
        style={{
          background: `radial-gradient(ellipse at 50% 15%, rgba(245, 158, 11, ${lanternBrightness * 0.22}) 0%, rgba(120, 53, 15, ${lanternBrightness * 0.12}) 40%, transparent 80%)`
        }}
      />

      {/* Main Scenery & Header */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
        {/* Vintage Background Scene (Signboard, Legends Posters, Room Decor, Lantern, Agfa Camera) */}
        <VintageBackground
          lanternBrightness={lanternBrightness}
          onToggleLantern={handleToggleLantern}
          onSelectLegend={(legend) => setSelectedLegend(legend)}
          onTriggerCameraSnapshot={() => setIsPolaroidOpen(true)}
          onPlayLegendPlaylist={handlePlayLegendPlaylist}
        />

        {/* Rotating Nostalgic Quotes Ticker */}
        <NostalgicQuotesTicker />

        {/* Central Visual Masterpiece: Photorealistic Vintage Turntable Deck */}
        <section id="turntable-section" className="my-2">
          <TurntableCenterpiece
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            speedRPM={speedRPM}
            onToggleRPM={handleToggleRPM}
            crackleEnabled={crackleEnabled}
            onToggleCrackle={handleToggleCrackle}
          />
        </section>

        {/* Secondary Retro Hardware: Dual Cassette Deck & Tube Radio Tuner */}
        <section id="cassette-radio-section" className="my-4">
          <TapeDeckAndRadio
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSideToggle={handleSideToggle}
            onTrackSelect={(trackId) => {
              const trk = TRACKS.find(t => t.id === trackId);
              if (trk) handleSelectTrack(trk);
            }}
            activeStation={activeStation}
            onSelectStation={(st) => setActiveStation(st)}
          />
        </section>

        {/* Nostalgic Cultural Memories & Trivia Section */}
        <section className="max-w-5xl mx-auto w-full p-6 rounded-3xl brass-border bg-[#170e08]/85 backdrop-blur-md shadow-xl my-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3b2310] border border-[#d4af37] flex items-center justify-center shrink-0 shadow">
                <Coffee className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#fef3c7] uppercase">
                  THE GOLDEN ERA ESSENCE
                </h3>
                <p className="font-serif text-xs text-[#d4af37] mt-1 leading-relaxed">
                  Before streaming, music was an unhurried ritual. Waiting for Wednesday 8 PM Binaca Geetmala, rewinding cassette tapes with a Natraj pencil, and holding the warm vinyl sleeve while listening in the soft lantern glow.
                </p>
              </div>
            </div>

            {/* Quick Interactive Snapshot Trigger */}
            <button
              onClick={() => {
                vintageAudio.playCameraShutter();
                setIsPolaroidOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#b45309] to-[#78350f] hover:from-[#d97706] hover:to-[#92400e] text-[#fef3c7] font-serif text-xs font-bold border border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.25)] flex items-center gap-2 shrink-0 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#fde047]" />
              <span>Capture Session Polaroid</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer Tribute */}
      <footer className="relative z-10 text-center py-6 border-t border-[#3d2411]/50 text-xs font-mono text-[#8c6239] mb-12">
        <p>A Homage to the Immortals: Kishore Kumar • Mohammed Rafi • Lata Mangeshkar • Mukesh • RD Burman • Asha Bhosle</p>
        <p className="mt-1 text-[10px] text-[#6b4c2b]">Recorded in High-Fidelity 33⅓ RPM Stereo • Binaca Geetmala & Vividh Bharati Archives</p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1b1008]/90 border border-[#5c3e21] text-xs text-[#d4af37] shadow-md">
          <span>Site created by</span>
          <span className="font-bold text-[#fef3c7] font-cinzel">Karan Kharade</span>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <LegendsGalleryModal
        legend={selectedLegend}
        onClose={() => setSelectedLegend(null)}
        onPlaySongName={handlePlaySongByName}
        onPlayLegendPlaylist={handlePlayLegendPlaylist}
      />

      <PolaroidFlashModal
        isOpen={isPolaroidOpen}
        onClose={() => setIsPolaroidOpen(false)}
        currentTrack={currentTrack}
      />

      {/* Fixed Bottom Glassmorphism Music Player */}
      <GlassmorphicMusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNextTrack={handleNextTrack}
        onPrevTrack={handlePrevTrack}
        onSelectTrack={handleSelectTrack}
        crackleEnabled={crackleEnabled}
        onToggleCrackle={handleToggleCrackle}
        speedRPM={speedRPM}
        onToggleRPM={handleToggleRPM}
        onShowTrivia={() => setIsTriviaOpen(true)}
      />
    </div>
  );
}
