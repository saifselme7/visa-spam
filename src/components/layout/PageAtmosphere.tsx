import { cn } from '@/utils/cn';

export type Atmosphere =
  | 'catalog'
  | 'product'
  | 'deals'
  | 'checkout'
  | 'account'
  | 'support'
  | 'legal'
  | 'error';

interface AtmosphereSpec {
  /** Coloured light wash for this surface. */
  light: string;
  /** Texture overlay: a technical grid, a dot field, or nothing. */
  texture: 'grid' | 'dots' | 'none';
  textureOpacity: number;
}

/**
 * Per-route background treatment. Each surface gets its own light and texture
 * so pages don't all read as the same template.
 */
const SPECS: Record<Atmosphere, AtmosphereSpec> = {
  // Clean product environment — an even wash, light structure.
  catalog: {
    light: 'radial-gradient(120% 60% at 50% -10%, rgba(90,110,140,0.14), transparent 62%)',
    texture: 'grid',
    textureOpacity: 0.35,
  },
  // Dramatic single-source light from the upper left.
  product: {
    light: 'radial-gradient(70% 50% at 18% 0%, rgba(120,150,190,0.16), transparent 60%)',
    texture: 'dots',
    textureOpacity: 0.25,
  },
  // Warmer and more energetic, still restrained.
  deals: {
    light:
      'radial-gradient(90% 50% at 80% -5%, rgba(224,169,77,0.12), transparent 58%), radial-gradient(70% 45% at 10% 5%, rgba(77,224,192,0.10), transparent 60%)',
    texture: 'none',
    textureOpacity: 0,
  },
  // Quiet and trustworthy — almost no decoration.
  checkout: {
    light: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent 18%)',
    texture: 'none',
    textureOpacity: 0,
  },
  // Technical dashboard grid.
  account: {
    light: 'linear-gradient(180deg, rgba(255,255,255,0.015), transparent 20%)',
    texture: 'grid',
    textureOpacity: 0.28,
  },
  // Documentation-style: flat and legible.
  support: {
    light: 'linear-gradient(180deg, rgba(93,138,224,0.07), transparent 22%)',
    texture: 'none',
    textureOpacity: 0,
  },
  legal: { light: 'none', texture: 'none', textureOpacity: 0 },
  // Restrained but distinct.
  error: {
    light: 'radial-gradient(60% 50% at 50% 0%, rgba(77,224,192,0.10), transparent 60%)',
    texture: 'dots',
    textureOpacity: 0.3,
  },
};

export function PageAtmosphere({ variant }: { variant: Atmosphere }) {
  const spec = SPECS[variant];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[520px] mask-fade-b"
      style={{ backgroundImage: spec.light === 'none' ? undefined : spec.light }}
    >
      {spec.texture !== 'none' && (
        <div
          className={cn(
            'absolute inset-0',
            spec.texture === 'grid' ? 'grid-backdrop' : 'dot-backdrop',
          )}
          style={{ opacity: spec.textureOpacity }}
        />
      )}
    </div>
  );
}
