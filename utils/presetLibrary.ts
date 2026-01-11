
import { LightroomParams } from '../types';

export type PresetCategory = 'DIRECTOR' | 'STUDIO';

export interface LibraryPreset {
  id: string;
  name: string;
  author: string; // Tên đạo diễn hoặc Hãng phim
  category: PresetCategory;
  description: string;
  highlights: string[];
  params: LightroomParams;
}

const defaultHSL = {
  red: { hue: 0, sat: 0, lum: 0 },
  orange: { hue: 0, sat: 0, lum: 0 },
  yellow: { hue: 0, sat: 0, lum: 0 },
  green: { hue: 0, sat: 0, lum: 0 },
  aqua: { hue: 0, sat: 0, lum: 0 },
  blue: { hue: 0, sat: 0, lum: 0 },
  purple: { hue: 0, sat: 0, lum: 0 },
  magenta: { hue: 0, sat: 0, lum: 0 },
};

const defaultGrading = {
  shadows: { hue: 0, sat: 0, lum: 0 },
  midtones: { hue: 0, sat: 0, lum: 0 },
  highlights: { hue: 0, sat: 0, lum: 0 },
  blending: 50,
  balance: 0,
};

export const PRESET_LIBRARY: LibraryPreset[] = [
  // --- DIRECTORS ---
  {
    id: 'wes-anderson',
    name: 'Budapest Pastel',
    author: 'Wes Anderson',
    category: 'DIRECTOR',
    description: 'Tông màu pastel, ấm áp, rực rỡ nhưng nhẹ nhàng như truyện cổ tích.',
    highlights: ['Bảng màu vàng hồng (Pastel Pink & Yellow)', 'Độ bão hòa màu đồng nhất', 'Shadows nâng sáng', 'Ánh sáng phẳng'],
    params: {
      exposure: 0.3, contrast: -15, highlights: -20, shadows: 40, whites: 10, blacks: 20,
      temperature: 6800, tint: 10, vibrance: 25, saturation: 10, clarity: -10, dehaze: -5, texture: -10,
      sharpness: 5, noiseReduction: 15, colorNoiseReduction: 25,
      hsl: { ...defaultHSL, orange: { hue: 5, sat: 20, lum: 10 }, red: { hue: 0, sat: 15, lum: 5 } },
      colorGrading: { ...defaultGrading, highlights: { hue: 45, sat: 15, lum: 0 }, shadows: { hue: 20, sat: 5, lum: 0 } }
    }
  },
  {
    id: 'christopher-nolan',
    name: 'Dark Knight Cold',
    author: 'Christopher Nolan',
    category: 'DIRECTOR',
    description: 'Tông màu lạnh, xanh xám, độ tương phản cao và mang tính thực tế.',
    highlights: ['Ám xanh lạnh (Cool Cyan)', 'Tương phản gắt', 'Vùng đen sâu sắc nét', 'Giảm bão hòa màu nóng'],
    params: {
      exposure: -0.2, contrast: 25, highlights: -10, shadows: -15, whites: 5, blacks: -10,
      temperature: 4800, tint: -5, vibrance: -10, saturation: -15, clarity: 15, dehaze: 10, texture: 5,
      sharpness: 8, noiseReduction: 10, colorNoiseReduction: 20,
      hsl: { ...defaultHSL, blue: { hue: 0, sat: -10, lum: -5 }, green: { hue: 5, sat: -30, lum: -10 } },
      colorGrading: { ...defaultGrading, shadows: { hue: 215, sat: 15, lum: -5 }, midtones: { hue: 210, sat: 5, lum: 0 } }
    }
  },
  {
    id: 'tim-burton',
    name: 'Gothic Mystery',
    author: 'Tim Burton',
    category: 'DIRECTOR',
    description: 'U ám, huyền bí với độ tương phản gắt giữa đen, trắng và xanh lá đậm.',
    highlights: ['Gothic Contrast', 'Ám sắc tím/xanh đen', 'Clarity cực cao', 'Màu da nhợt nhạt'],
    params: {
      exposure: -0.5, contrast: 40, highlights: -30, shadows: -20, whites: 20, blacks: -40,
      temperature: 5200, tint: 15, vibrance: -30, saturation: -20, clarity: 30, dehaze: 15, texture: 10,
      sharpness: 10, noiseReduction: 5, colorNoiseReduction: 15,
      hsl: { ...defaultHSL, green: { hue: -10, sat: 20, lum: -20 }, purple: { hue: 0, sat: 10, lum: -10 } },
      colorGrading: { ...defaultGrading, shadows: { hue: 260, sat: 20, lum: -10 }, highlights: { hue: 120, sat: 5, lum: 0 } }
    }
  },
  {
    id: 'quentin-tarantino',
    name: 'Vintage Pulp',
    author: 'Quentin Tarantino',
    category: 'DIRECTOR',
    description: 'Màu sắc mạnh, ấm nóng, mang hơi thở của phim nhựa thập niên 70.',
    highlights: ['Retro Warmth', 'Màu đỏ/vàng rực rỡ', 'Grain mịn màng', 'Dải tương phản động rộng'],
    params: {
      exposure: 0.1, contrast: 30, highlights: -10, shadows: 10, whites: 15, blacks: -5,
      temperature: 6200, tint: 5, vibrance: 20, saturation: 15, clarity: 10, dehaze: 5, texture: 15,
      sharpness: 7, noiseReduction: 10, colorNoiseReduction: 20,
      hsl: { ...defaultHSL, red: { hue: -5, sat: 30, lum: 5 }, yellow: { hue: -5, sat: 20, lum: 5 } },
      colorGrading: { ...defaultGrading, midtones: { hue: 35, sat: 20, lum: 0 }, shadows: { hue: 20, sat: 10, lum: -5 } }
    }
  },
  {
    id: 'hayao-miyazaki',
    name: 'Ghibli Nature',
    author: 'Hayao Miyazaki',
    category: 'DIRECTOR',
    description: 'Mềm mại, trong trẻo, tông màu thiên nhiên tươi sáng và ấm áp.',
    highlights: ['Natural Palettes', 'Soft Highlights', 'Analog Painting feel', 'Selective Color Pop'],
    params: {
      exposure: 0.4, contrast: -20, highlights: 10, shadows: 30, whites: 20, blacks: 10,
      temperature: 5600, tint: 2, vibrance: 35, saturation: 10, clarity: -15, dehaze: -10, texture: -5,
      sharpness: 4, noiseReduction: 20, colorNoiseReduction: 30,
      hsl: { ...defaultHSL, green: { hue: 10, sat: 25, lum: 10 }, aqua: { hue: 5, sat: 20, lum: 5 } },
      colorGrading: { ...defaultGrading, highlights: { hue: 50, sat: 10, lum: 0 }, midtones: { hue: 40, sat: 5, lum: 0 } }
    }
  },
  {
    id: 'guillermo-del-toro',
    name: 'Teal Fantasy',
    author: 'Guillermo del Toro',
    category: 'DIRECTOR',
    description: 'Sự kết hợp giữa xanh Teal và cam vàng rực rỡ trong bóng tối u uất.',
    highlights: ['Teal & Orange Complementary', 'Deep Blue Shadows', 'Amber Highlights', 'Textural Drama'],
    params: {
      exposure: -0.3, contrast: 20, highlights: -15, shadows: -10, whites: 5, blacks: -20,
      temperature: 5400, tint: -10, vibrance: 15, saturation: 5, clarity: 20, dehaze: 10, texture: 5,
      sharpness: 9, noiseReduction: 15, colorNoiseReduction: 20,
      hsl: { ...defaultHSL, orange: { hue: 0, sat: 30, lum: 10 }, aqua: { hue: 0, sat: 25, lum: -10 } },
      colorGrading: { ...defaultGrading, shadows: { hue: 190, sat: 30, lum: -5 }, highlights: { hue: 40, sat: 25, lum: 0 } }
    }
  },
  {
    id: 'denis-villeneuve',
    name: 'Modern Arid',
    author: 'Denis Villeneuve',
    category: 'DIRECTOR',
    description: 'Màu bạc, lạnh, tối giản và mang tính tương lai, hơi hướng cát bụi.',
    highlights: ['Monochrome/Silver Tones', 'Dusty Yellow overlay', 'Muted Saturation', 'Massive scale feel'],
    params: {
      exposure: -0.1, contrast: 10, highlights: -20, shadows: 15, whites: -10, blacks: 5,
      temperature: 4600, tint: -8, vibrance: -25, saturation: -20, clarity: 15, dehaze: 20, texture: 5,
      sharpness: 10, noiseReduction: 25, colorNoiseReduction: 25,
      hsl: { ...defaultHSL, blue: { hue: 5, sat: -40, lum: -10 }, orange: { hue: 5, sat: -15, lum: -5 } },
      colorGrading: { ...defaultGrading, shadows: { hue: 210, sat: 10, lum: 0 }, midtones: { hue: 200, sat: 5, lum: 0 } }
    }
  },
  {
    id: 'pedro-almodovar',
    name: 'Vibrant Passion',
    author: 'Pedro Almodóvar',
    category: 'DIRECTOR',
    description: 'Sắc đỏ rực rỡ, bão hòa màu cực cao và không gian ấm áp kịch tính.',
    highlights: ['Spanish Reds dominance', 'Ultra Saturated', 'Warm Interior lighting', 'High contrast mix'],
    params: {
      exposure: 0.2, contrast: 15, highlights: -5, shadows: 5, whites: 10, blacks: 5,
      temperature: 6500, tint: 15, vibrance: 40, saturation: 20, clarity: 5, dehaze: 0, texture: 5,
      sharpness: 6, noiseReduction: 10, colorNoiseReduction: 20,
      hsl: { ...defaultHSL, red: { hue: 0, sat: 50, lum: 5 }, magenta: { hue: 0, sat: 30, lum: 0 } },
      colorGrading: { ...defaultGrading, midtones: { hue: 10, sat: 15, lum: 0 }, highlights: { hue: 20, sat: 10, lum: 0 } }
    }
  },
  {
    id: 'stanley-kubrick',
    name: 'Odyssey Clean',
    author: 'Stanley Kubrick',
    category: 'DIRECTOR',
    description: 'Cân bằng hoàn hảo, cực kỳ sắc nét và tông màu lạnh lùng, chính xác.',
    highlights: ['Maximum color fidelity', 'Pure Whites & Blacks', 'Clean Texture', 'Ultra Sharpness'],
    params: {
      exposure: 0.1, contrast: 10, highlights: 0, shadows: 5, whites: 10, blacks: -5,
      temperature: 5100, tint: 0, vibrance: 5, saturation: 0, clarity: 10, dehaze: 5, texture: 5,
      sharpness: 10, noiseReduction: 30, colorNoiseReduction: 30,
      hsl: { ...defaultHSL },
      colorGrading: { ...defaultGrading, midtones: { hue: 210, sat: 5, lum: 0 }, shadows: { hue: 220, sat: 5, lum: 0 } }
    }
  },
  {
    id: 'david-fincher',
    name: 'Zodiac Green',
    author: 'David Fincher',
    category: 'DIRECTOR',
    description: 'Ám xanh lá nhẹ, tương phản gắt ở vùng trung tính, tạo cảm giác căng thẳng.',
    highlights: ['Moss/Olive overlay', 'Moody lighting', 'Colored Midtones', 'Desaturated Blues'],
    params: {
      exposure: -0.2, contrast: 35, highlights: -25, shadows: -10, whites: 5, blacks: -15,
      temperature: 5300, tint: 12, vibrance: -15, saturation: -10, clarity: 25, dehaze: 10, texture: 10,
      sharpness: 9, noiseReduction: 10, colorNoiseReduction: 20,
      hsl: { ...defaultHSL, yellow: { hue: 10, sat: 10, lum: -5 }, green: { hue: 0, sat: 15, lum: -10 } },
      colorGrading: { ...defaultGrading, midtones: { hue: 75, sat: 15, lum: -5 }, shadows: { hue: 150, sat: 5, lum: -10 } }
    }
  },

  // --- STUDIOS ---
  {
    id: 'warner-bros',
    name: 'WB Blockbuster',
    author: 'Warner Bros.',
    category: 'STUDIO',
    description: 'Trung tính, điện ảnh, hơi lạnh. Phù hợp cho các phim hành động quy mô lớn.',
    highlights: ['Neutral Cinematic Balance', 'Slightly Cool shadows', 'High contrast dynamic', 'Clean Blockbuster look'],
    params: {
      exposure: -0.1, contrast: 15, highlights: -10, shadows: 5, whites: 10, blacks: -10,
      temperature: 5200, tint: -2, vibrance: 10, saturation: -5, clarity: 15, dehaze: 5, texture: 5,
      sharpness: 7, noiseReduction: 10, colorNoiseReduction: 20,
      hsl: { ...defaultHSL, blue: { hue: 0, sat: 10, lum: -5 } },
      colorGrading: { ...defaultGrading, shadows: { hue: 210, sat: 10, lum: 0 }, midtones: { hue: 205, sat: 5, lum: 0 } }
    }
  },
  {
    id: 'a24-indie',
    name: 'A24 Art-House',
    author: 'A24',
    category: 'STUDIO',
    description: 'Muted, tự nhiên, mang cảm giác nghệ thuật Indie độc lập.',
    highlights: ['Desaturated Earthy tones', 'Natural skin reproduction', 'Soft film-like roll-off', 'Analog texture'],
    params: {
      exposure: 0.1, contrast: -10, highlights: -15, shadows: 10, whites: 0, blacks: 15,
      temperature: 5800, tint: 5, vibrance: -15, saturation: -20, clarity: -5, dehaze: -5, texture: 10,
      sharpness: 4, noiseReduction: 15, colorNoiseReduction: 20,
      hsl: { ...defaultHSL, orange: { hue: 0, sat: -15, lum: -5 }, green: { hue: 5, sat: -25, lum: 10 } },
      colorGrading: { ...defaultGrading, shadows: { hue: 40, sat: 5, lum: 0 }, highlights: { hue: 60, sat: 5, lum: 0 } }
    }
  },
  {
    id: 'marvel-studios',
    name: 'MCU Heroic',
    author: 'Marvel Studios',
    category: 'STUDIO',
    description: 'Sáng, sạch, các màu cơ bản bão hòa mạnh mẽ (đỏ/xanh).',
    highlights: ['Saturated primary colors', 'Clean Whites', 'Entertaining pop', 'CGI-friendly clarity'],
    params: {
      exposure: 0.2, contrast: 10, highlights: -5, shadows: 10, whites: 15, blacks: 0,
      temperature: 5500, tint: 2, vibrance: 30, saturation: 15, clarity: 10, dehaze: 5, texture: 5,
      sharpness: 8, noiseReduction: 20, colorNoiseReduction: 20,
      hsl: { ...defaultHSL, red: { hue: 0, sat: 25, lum: 10 }, blue: { hue: 0, sat: 25, lum: 5 } },
      colorGrading: { ...defaultGrading, highlights: { hue: 210, sat: 10, lum: 0 }, shadows: { hue: 200, sat: 5, lum: 0 } }
    }
  },
  {
    id: 'pixar-vibrant',
    name: 'Pixar Emotional',
    author: 'Pixar Studios',
    category: 'STUDIO',
    description: 'Rực rỡ, ấm áp và giàu cảm xúc qua từng khung hình.',
    highlights: ['Emotional Color Scripting', 'Warm Midtones', 'Friendly saturation', 'Vibrant storytelling'],
    params: {
      exposure: 0.4, contrast: 5, highlights: -10, shadows: 20, whites: 10, blacks: 5,
      temperature: 5800, tint: 5, vibrance: 40, saturation: 20, clarity: -10, dehaze: -5, texture: -10,
      sharpness: 3, noiseReduction: 15, colorNoiseReduction: 25,
      hsl: { ...defaultHSL, orange: { hue: 0, sat: 30, lum: 10 }, red: { hue: 5, sat: 20, lum: 5 } },
      colorGrading: { ...defaultGrading, midtones: { hue: 40, sat: 15, lum: 0 }, shadows: { hue: 30, sat: 10, lum: 0 } }
    }
  },
  {
    id: 'studio-ghibli',
    name: 'Ghibli Dream',
    author: 'Studio Ghibli',
    category: 'STUDIO',
    description: 'Pastel, xanh thiên nhiên, cảm giác màu nước watercolor mơ mộng.',
    highlights: ['Watercolor aesthetic', 'Dreamy nature greens', 'Soft sky blues', 'Nostalgic lighting'],
    params: {
      exposure: 0.5, contrast: -25, highlights: 15, shadows: 40, whites: 20, blacks: 10,
      temperature: 5400, tint: -2, vibrance: 35, saturation: 10, clarity: -25, dehaze: -15, texture: -15,
      sharpness: 2, noiseReduction: 30, colorNoiseReduction: 30,
      hsl: { ...defaultHSL, green: { hue: 15, sat: 40, lum: 15 }, aqua: { hue: 10, sat: 30, lum: 10 } },
      colorGrading: { ...defaultGrading, highlights: { hue: 60, sat: 15, lum: 0 }, shadows: { hue: 180, sat: 5, lum: 0 } }
    }
  },
  {
    id: 'laika-gothic',
    name: 'Laika Handmade',
    author: 'Laika',
    category: 'STUDIO',
    description: 'Dark fantasy với tông tím/xanh u ám, đầy mê hoặc.',
    highlights: ['Dark fairy tale aesthetic', 'Handmade stop-motion texture', 'Indigo/Violet shadow play', 'High textural detail'],
    params: {
      exposure: -0.4, contrast: 30, highlights: -25, shadows: -15, whites: 10, blacks: -30,
      temperature: 5000, tint: 20, vibrance: 10, saturation: 0, clarity: 35, dehaze: 15, texture: 25,
      sharpness: 10, noiseReduction: 5, colorNoiseReduction: 15,
      hsl: { ...defaultHSL, purple: { hue: 0, sat: 25, lum: -10 }, magenta: { hue: -5, sat: 20, lum: -5 } },
      colorGrading: { ...defaultGrading, shadows: { hue: 270, sat: 25, lum: -10 }, highlights: { hue: 180, sat: 10, lum: 0 } }
    }
  },
  {
    id: 'studiocanal-classy',
    name: 'European Cinema',
    author: 'StudioCanal',
    category: 'STUDIO',
    description: 'Châu Âu, lạnh, tinh tế và sang trọng.',
    highlights: ['Sophisticated European look', 'Muted elegance', 'Cool gray balance', 'Refined film grain'],
    params: {
      exposure: 0, contrast: 5, highlights: -20, shadows: 10, whites: -5, blacks: 5,
      temperature: 4900, tint: -5, vibrance: -10, saturation: -15, clarity: 5, dehaze: 10, texture: 0,
      sharpness: 6, noiseReduction: 15, colorNoiseReduction: 20,
      hsl: { ...defaultHSL, blue: { hue: 0, sat: -15, lum: -5 }, orange: { hue: 5, sat: -10, lum: -5 } },
      colorGrading: { ...defaultGrading, shadows: { hue: 205, sat: 15, lum: 0 }, midtones: { hue: 210, sat: 5, lum: 0 } }
    }
  },
  {
    id: 'golden-harvest-neon',
    name: 'HK Action Neon',
    author: 'Golden Harvest',
    category: 'STUDIO',
    description: 'Neon, đỏ, xanh lá, vàng. Phong cách điện ảnh Hong Kong cổ điển.',
    highlights: ['Vibrant Neon lights', 'Classic HK Film stock', 'Saturated Green & Yellow', 'High action contrast'],
    params: {
      exposure: 0.2, contrast: 35, highlights: -10, shadows: 5, whites: 15, blacks: -5,
      temperature: 6000, tint: 15, vibrance: 25, saturation: 20, clarity: 15, dehaze: 5, texture: 15,
      sharpness: 8, noiseReduction: 10, colorNoiseReduction: 20,
      hsl: { ...defaultHSL, red: { hue: 0, sat: 40, lum: 10 }, green: { hue: -10, sat: 35, lum: 5 } },
      colorGrading: { ...defaultGrading, midtones: { hue: 50, sat: 20, lum: 0 }, shadows: { hue: 160, sat: 15, lum: -5 } }
    }
  },
  {
    id: 'toho-godzilla',
    name: 'Kaiju Gloom',
    author: 'Toho',
    category: 'STUDIO',
    description: 'Xanh xám, u ám, quy mô lớn kịch tính.',
    highlights: ['Blue-gray gloom', 'Dramatic high contrast', 'Large scale disaster feel', 'Heavy cinematic grain'],
    params: {
      exposure: -0.3, contrast: 40, highlights: -30, shadows: -10, whites: 10, blacks: -20,
      temperature: 4700, tint: -10, vibrance: -20, saturation: -25, clarity: 30, dehaze: 20, texture: 10,
      sharpness: 10, noiseReduction: 5, colorNoiseReduction: 15,
      hsl: { ...defaultHSL, blue: { hue: 5, sat: -15, lum: -10 }, green: { hue: 0, sat: -30, lum: -15 } },
      colorGrading: { ...defaultGrading, shadows: { hue: 215, sat: 25, lum: -10 }, midtones: { hue: 210, sat: 15, lum: -5 } }
    }
  },
  {
    id: 'blumhouse-horror',
    name: 'Blumhouse Thrill',
    author: 'Blumhouse',
    category: 'STUDIO',
    description: 'Tối, ám xanh, ánh sáng thấp. Phù hợp kinh dị tâm lý.',
    highlights: ['Psychological horror tint', 'Crushed shadows', 'Minimalist low light', 'Tense blue-green undertones'],
    params: {
      exposure: -0.6, contrast: 45, highlights: -40, shadows: -30, whites: 5, blacks: -40,
      temperature: 4500, tint: -15, vibrance: -15, saturation: -20, clarity: 40, dehaze: 25, texture: 10,
      sharpness: 9, noiseReduction: 5, colorNoiseReduction: 10,
      hsl: { ...defaultHSL, blue: { hue: 0, sat: 20, lum: -20 }, green: { hue: -5, sat: 15, lum: -15 } },
      colorGrading: { ...defaultGrading, shadows: { hue: 190, sat: 35, lum: -15 }, midtones: { hue: 185, sat: 15, lum: -5 } }
    }
  }
];
