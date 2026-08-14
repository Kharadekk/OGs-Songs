export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  movie: string;
  year: number;
  youtubeId: string;
  durationSec: number;
  side: 'A' | 'B';
  mood: string;
  lyricSnippet: string;
  lyricTranslation: string;
  trivia: string;
  singers: string[];
  composer: string;
  lyricist: string;
  colorScheme: {
    labelBg: string;
    labelBorder: string;
    accent: string;
  };
}

export interface Legend {
  id: string;
  name: string;
  title: string;
  years: string;
  imagePoster: string;
  bio: string;
  iconicSongs: string[];
  quote: string;
  youtubePlaylistUrl: string;
  youtubeVideoId: string;
  playlistId: string;
  playlistTitle: string;
}

export interface RadioStation {
  id: string;
  name: string;
  freq: string;
  band: 'MW' | 'SW' | 'FM';
  description: string;
  host?: string;
  signatureLine: string;
}

export interface NostalgicQuote {
  id: number;
  text: string;
  source: string;
  tag: string;
  year?: string;
}
