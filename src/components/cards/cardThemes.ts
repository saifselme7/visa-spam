import type { CardTheme } from '@/types/domain';

export interface CardThemeTokens {
  /** Base plate gradient. */
  surface: string;
  /** Edge highlight colour. */
  edge: string;
  /** Text colour on the plate. */
  ink: string;
  /** Muted text on the plate. */
  inkMuted: string;
  /** Chip metal. */
  chip: string;
  /** Ambient glow cast under the card. */
  glow: string;
}

/**
 * Six restrained plate finishes. Each is a metal/material study rather than a
 * decorative gradient — hue shifts stay within a narrow band so the cards read
 * as a family.
 */
export const CARD_THEMES: Record<CardTheme, CardThemeTokens> = {
  graphite: {
    surface:
      'linear-gradient(145deg, #23272e 0%, #15181d 38%, #0d0f13 68%, #191d23 100%)',
    edge: 'rgba(255,255,255,0.16)',
    ink: '#eef1f6',
    inkMuted: 'rgba(238,241,246,0.52)',
    chip: 'linear-gradient(135deg, #d6c79a 0%, #9c8b5f 45%, #efe4bd 100%)',
    glow: 'rgba(120,140,170,0.20)',
  },
  obsidian: {
    surface:
      'linear-gradient(150deg, #14161a 0%, #08090b 42%, #101318 72%, #1b1f26 100%)',
    edge: 'rgba(255,255,255,0.12)',
    ink: '#f3f5f9',
    inkMuted: 'rgba(243,245,249,0.48)',
    chip: 'linear-gradient(135deg, #c9cdd6 0%, #7d838f 48%, #e6e9ef 100%)',
    glow: 'rgba(90,110,140,0.18)',
  },
  titanium: {
    surface:
      'linear-gradient(140deg, #4a5059 0%, #2b3037 35%, #1c2025 62%, #3d434c 100%)',
    edge: 'rgba(255,255,255,0.22)',
    ink: '#f7f9fc',
    inkMuted: 'rgba(247,249,252,0.55)',
    chip: 'linear-gradient(135deg, #e3e6ec 0%, #969ba6 50%, #f2f4f8 100%)',
    glow: 'rgba(150,170,200,0.22)',
  },
  aurora: {
    surface:
      'linear-gradient(145deg, #10312c 0%, #0a1d1f 40%, #0b1216 70%, #123b34 100%)',
    edge: 'rgba(120,240,210,0.28)',
    ink: '#ecfffa',
    inkMuted: 'rgba(236,255,250,0.55)',
    chip: 'linear-gradient(135deg, #bdf0e0 0%, #5fae9a 50%, #dffaf1 100%)',
    glow: 'rgba(77,224,192,0.24)',
  },
  copper: {
    surface:
      'linear-gradient(145deg, #3a2721 0%, #241813 40%, #14100e 70%, #402a22 100%)',
    edge: 'rgba(224,169,77,0.26)',
    ink: '#fdf3e7',
    inkMuted: 'rgba(253,243,231,0.52)',
    chip: 'linear-gradient(135deg, #f0d2a0 0%, #b88a52 50%, #f7e4c2 100%)',
    glow: 'rgba(224,169,77,0.20)',
  },
  ice: {
    surface:
      'linear-gradient(145deg, #1d2a38 0%, #121b26 40%, #0c1119 70%, #22303f 100%)',
    edge: 'rgba(160,200,255,0.24)',
    ink: '#f0f6ff',
    inkMuted: 'rgba(240,246,255,0.52)',
    chip: 'linear-gradient(135deg, #d5e4f5 0%, #8ea4bd 50%, #eef4fc 100%)',
    glow: 'rgba(93,138,224,0.20)',
  },
};
