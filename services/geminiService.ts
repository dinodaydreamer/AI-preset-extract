
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeImage = async (base64Image: string, manualApiKey?: string): Promise<AnalysisResult> => {
  const apiKey = manualApiKey || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key không hợp lệ. Vui lòng kiểm tra lại.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Act as a world-class senior film colorist and master of Adobe Lightroom/Camera Raw. 
  Your mission is to perform a pixel-perfect color deconstruction of the provided image to create a professional .XMP preset.

  CRITICAL CONSTRAINTS FOR ABSOLUTE ACCURACY:
  1. SHARPENING: Must be extremely subtle. STRICTLY between 0 and 10. Do not exceed 10 to maintain a natural cinematic look.
  2. WHITE BALANCE: Precisely identify the light source temperature. Range: 2000-50000.
  3. COLOR GRADING (3-WAY): This is the soul of the look. Analyze the color cast in Shadows, Midtones, and Highlights. 
     - Look for complementary color harmonies (e.g., Teal shadows, Warm highlights).
     - Provide Hue (0-360), Sat (0-100), and Lum (-100 to +100).
  4. HSL ANALYSIS: 
     - Analyze specific shifts. For example, if greens are desaturated and shifted towards yellow, reflect that in Hue and Sat.
     - Protect Skin Tones: Ensure Orange/Red channels are optimized for natural skin rendition.
  5. TONE MAPPING: 
     - Exposure should be precise to 0.05 increments.
     - Contrast, Highlights, Shadows, Whites, Blacks must balance to preserve the full dynamic range of the reference image.
  6. PRESENCE: 
     - Texture and Clarity should be used sparingly (usually between -20 and +20) to avoid digital artifacts.
     - Dehaze should reflect the atmospheric depth of the reference.

  Respond strictly in JSON format. Your goal is "Visual Identity Cloning" - the resulting preset should make any standard photo look exactly like this reference in terms of color science.`;

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
              sharpness: { type: Type.NUMBER, description: "Must be between 0 and 10" },
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
    const result = JSON.parse(response.text.trim());
    // Hậu kiểm tra thủ công để đảm bảo Sharpening không vượt quá 10 nếu AI vi phạm
    if (result.parameters.sharpness > 10) {
      result.parameters.sharpness = 10;
    }
    return result;
  } catch (e) {
    throw new Error("Neural Engine failed to parse visual data. Retrying connection...");
  }
};
