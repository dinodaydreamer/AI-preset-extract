
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Act as a senior high-end film colorist and photographer. Analyze the provided image to reverse-engineer a professional Lightroom/Camera Raw preset (.XMP).
  
  EXTRACT THE FOLLOWING PRECISE DATA:
  1. WHITE BALANCE: Temperature (2000-50000K) and Tint (-150 to +150).
  2. BASIC TONE: Exposure (-5 to +5), Contrast, Highlights, Shadows, Whites, Blacks (-100 to +100).
  3. PRESENCE: Texture, Clarity, Dehaze, Vibrance, Saturation (-100 to +100).
  4. HSL (8 COLORS): For Red, Orange, Yellow, Green, Aqua, Blue, Purple, Magenta, provide Hue, Saturation, and Luminance (-100 to +100).
  5. COLOR GRADING: 3-Way Wheels. For Shadows, Midtones, and Highlights: Hue (0-360), Sat (0-100), Lum (-100 to +100). Also provide Blending and Balance (0-100).
  6. DETAIL: Sharpness, Noise Reduction, Color Noise Reduction (0-100).

  Respond strictly in JSON format matching the schema provided. Be very accurate with color theory (e.g., skin tones usually involve orange/red HSL adjustments).`;

  // Fixed: Use gemini-3-pro-preview for complex reasoning tasks as per guidelines
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          presetName: { type: Type.STRING },
          description: { type: Type.STRING },
          parameters: {
            type: Type.OBJECT,
            properties: {
              exposure: { type: Type.NUMBER },
              contrast: { type: Type.NUMBER },
              highlights: { type: Type.NUMBER },
              shadows: { type: Type.NUMBER },
              whites: { type: Type.NUMBER },
              blacks: { type: Type.NUMBER },
              temperature: { type: Type.NUMBER },
              tint: { type: Type.NUMBER },
              vibrance: { type: Type.NUMBER },
              saturation: { type: Type.NUMBER },
              clarity: { type: Type.NUMBER },
              dehaze: { type: Type.NUMBER },
              texture: { type: Type.NUMBER },
              sharpness: { type: Type.NUMBER },
              noiseReduction: { type: Type.NUMBER },
              colorNoiseReduction: { type: Type.NUMBER },
              hsl: {
                type: Type.OBJECT,
                properties: {
                  red: { type: Type.OBJECT, properties: { hue: { type: Type.NUMBER }, sat: { type: Type.NUMBER }, lum: { type: Type.NUMBER } } },
                  orange: { type: Type.OBJECT, properties: { hue: { type: Type.NUMBER }, sat: { type: Type.NUMBER }, lum: { type: Type.NUMBER } } },
                  yellow: { type: Type.OBJECT, properties: { hue: { type: Type.NUMBER }, sat: { type: Type.NUMBER }, lum: { type: Type.NUMBER } } },
                  green: { type: Type.OBJECT, properties: { hue: { type: Type.NUMBER }, sat: { type: Type.NUMBER }, lum: { type: Type.NUMBER } } },
                  aqua: { type: Type.OBJECT, properties: { hue: { type: Type.NUMBER }, sat: { type: Type.NUMBER }, lum: { type: Type.NUMBER } } },
                  blue: { type: Type.OBJECT, properties: { hue: { type: Type.NUMBER }, sat: { type: Type.NUMBER }, lum: { type: Type.NUMBER } } },
                  purple: { type: Type.OBJECT, properties: { hue: { type: Type.NUMBER }, sat: { type: Type.NUMBER }, lum: { type: Type.NUMBER } } },
                  magenta: { type: Type.OBJECT, properties: { hue: { type: Type.NUMBER }, sat: { type: Type.NUMBER }, lum: { type: Type.NUMBER } } }
                }
              },
              colorGrading: {
                type: Type.OBJECT,
                properties: {
                  shadows: { type: Type.OBJECT, properties: { hue: { type: Type.NUMBER }, sat: { type: Type.NUMBER }, lum: { type: Type.NUMBER } } },
                  midtones: { type: Type.OBJECT, properties: { hue: { type: Type.NUMBER }, sat: { type: Type.NUMBER }, lum: { type: Type.NUMBER } } },
                  highlights: { type: Type.OBJECT, properties: { hue: { type: Type.NUMBER }, sat: { type: Type.NUMBER }, lum: { type: Type.NUMBER } } },
                  blending: { type: Type.NUMBER },
                  balance: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    }
  });

  try {
    // Fixed: Accessed .text property directly
    return JSON.parse(response.text.trim());
  } catch (e) {
    throw new Error("Neural Engine failed to parse visual data. Retrying connection...");
  }
};
