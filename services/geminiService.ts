
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeImage = async (base64Image: string, apiKey: string): Promise<AnalysisResult> => {
  if (!apiKey) throw new Error("Vui lòng nhập API Key");

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Act as a senior high-end film colorist and master of Adobe Lightroom/Camera Raw. 
  Perform an absolute precision color deconstruction of the provided image to create a professional .XMP preset.

  STRICT TECHNICAL REQUIREMENTS:
  1. SHARPENING: Must be natural. Range: 0-10. DO NOT exceed 10.
  2. COLOR GRADING (3-WAY): This is critical. Identify Hue (0-360), Sat (0-100), and Lum (-100 to 100) for Shadows, Midtones, and Highlights separately.
  3. HSL PRECISION: Analyze shifts for all 8 colors. Pay extreme attention to Orange/Red for skin tone accuracy.
  4. TONE BALANCE: Extract Exposure (-5 to +5), Contrast, Highlights, Shadows, Whites, Blacks to preserve dynamic range.
  5. COLOR TEMPERATURE: Precisely identify Kelvin (2000-50000) and Tint (-150 to 150).

  Respond strictly in JSON format. The goal is "Visual Cloning" - a standard RAW file should look like this reference after applying the settings.`;

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
    const data = JSON.parse(response.text.trim());
    // Hậu kiểm tra giới hạn sharpening
    if (data.parameters.sharpness > 10) data.parameters.sharpness = 10;
    return data;
  } catch (e) {
    throw new Error("Không thể xử lý phản hồi từ AI. Thử lại.");
  }
};
