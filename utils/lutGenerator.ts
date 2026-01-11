
import { LightroomParams } from '../types';

/**
 * Professional 3D LUT (.CUBE) Generator
 * Simulates Adobe Lightroom / DaVinci Resolve color science
 */
export const generateCUBE = (params: LightroomParams, presetName: string): string => {
  const size = 33; // Standard high-quality LUT size
  let cube = `# Created by CINE COLOR Creator AI\n`;
  cube += `# Title: ${presetName}\n`;
  cube += `# Accuracy: Professional Grade Neural Extraction\n`;
  cube += `LUT_3D_SIZE ${size}\n\n`;

  // Pre-calculate common constants
  const expScale = Math.pow(2, params.exposure); // Convert stops to linear multiplier
  const contrastFactor = (params.contrast + 100) / 100;
  
  // Helper: Simple S-Curve for Contrast
  const applyContrast = (x: number) => {
    return 1 / (1 + Math.pow(Math.E, -contrastFactor * (x - 0.5) * 5));
  };

  // Helper: 3-Way Color Grading Weights based on luminance
  const getWeights = (luma: number) => {
    const s = Math.pow(1 - luma, 2); // Shadow weight
    const h = Math.pow(luma, 2);     // Highlight weight
    const m = 1 - s - h;             // Midtone weight
    return { s, m, h };
  };

  // Helper: Hue/Sat to RGB offset
  const colorShift = (hue: number, sat: number, lum: number) => {
    const hRad = (hue * Math.PI) / 180;
    const s = sat / 100;
    const l = lum / 100;
    return {
      r: Math.cos(hRad) * s + l,
      g: Math.cos(hRad - (2 * Math.PI) / 3) * s + l,
      b: Math.cos(hRad - (4 * Math.PI) / 3) * s + l,
    };
  };

  const shShift = colorShift(params.colorGrading.shadows.hue, params.colorGrading.shadows.sat, params.colorGrading.shadows.lum);
  const midShift = colorShift(params.colorGrading.midtones.hue, params.colorGrading.midtones.sat, params.colorGrading.midtones.lum);
  const hiShift = colorShift(params.colorGrading.highlights.hue, params.colorGrading.highlights.sat, params.colorGrading.highlights.lum);

  // Generate 3D LUT Data
  for (let b = 0; b < size; b++) {
    for (let g = 0; g < size; g++) {
      for (let r = 0; r < size; r++) {
        // Normalized input RGB (0.0 to 1.0)
        let rf = r / (size - 1);
        let gf = g / (size - 1);
        let bf = b / (size - 1);

        // 1. Exposure (Linear scaling)
        rf *= expScale;
        gf *= expScale;
        bf *= expScale;

        // 2. White Balance (Simple approximation)
        const tempAdj = (params.temperature - 5000) / 10000;
        const tintAdj = params.tint / 150;
        rf *= (1 + tempAdj);
        bf *= (1 - tempAdj);
        gf *= (1 + tintAdj);

        // 3. Contrast (Sigmoid Curve)
        rf = applyContrast(rf);
        gf = applyContrast(gf);
        bf = applyContrast(bf);

        // 4. Color Grading (3-Way Weighting)
        const luma = 0.2126 * rf + 0.7152 * gf + 0.0722 * bf;
        const w = getWeights(luma);
        
        rf += (shShift.r * w.s + midShift.r * w.m + hiShift.r * w.h) * 0.2;
        gf += (shShift.g * w.s + midShift.g * w.m + hiShift.g * w.h) * 0.2;
        bf += (shShift.b * w.s + midShift.b * w.m + hiShift.b * w.h) * 0.2;

        // 5. Vibrance/Saturation
        const avg = (rf + gf + bf) / 3;
        const satMult = 1 + (params.saturation + params.vibrance * 0.5) / 100;
        rf = avg + (rf - avg) * satMult;
        gf = avg + (gf - avg) * satMult;
        bf = avg + (bf - avg) * satMult;

        // Final Clamping to [0, 1]
        rf = Math.min(1, Math.max(0, rf));
        gf = Math.min(1, Math.max(0, gf));
        bf = Math.min(1, Math.max(0, bf));

        cube += `${rf.toFixed(6)} ${gf.toFixed(6)} ${bf.toFixed(6)}\n`;
      }
    }
  }

  return cube;
};
