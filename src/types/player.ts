export interface Player {
  id: string;
  name: string;
  image: string;
  stats: {
    sensiGeral: number;
    redDot: number;
    mira2x: number;
    mira4x: number;
    awm?: number;
    olhadinha?: number;
    dpi?: number;
  };
}
