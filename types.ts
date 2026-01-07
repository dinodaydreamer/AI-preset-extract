
export interface HSLChannel {
  hue: number;
  sat: number;
  lum: number;
}

export interface LightroomParams {
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  temperature: number;
  tint: number;
  vibrance: number;
  saturation: number;
  clarity: number;
  dehaze: number;
  texture: number;
  sharpness: number;
  noiseReduction: number;
  colorNoiseReduction: number;
  hsl: {
    red: HSLChannel;
    orange: HSLChannel;
    yellow: HSLChannel;
    green: HSLChannel;
    aqua: HSLChannel;
    blue: HSLChannel;
    purple: HSLChannel;
    magenta: HSLChannel;
  };
  colorGrading: {
    shadows: { hue: number; sat: number; lum: number };
    midtones: { hue: number; sat: number; lum: number };
    highlights: { hue: number; sat: number; lum: number };
    blending: number;
    balance: number;
  };
}

export interface AnalysisResult {
  presetName: string;
  parameters: LightroomParams;
  description: string;
}
