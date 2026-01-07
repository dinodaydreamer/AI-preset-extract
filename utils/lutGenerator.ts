
import { LightroomParams } from '../types';

export const generateCUBE = (params: LightroomParams, presetName: string): string => {
  // Đây là một trình giả lập LUT đơn giản chuyển đổi các thông số cơ bản thành ma trận 3D LUT
  // Trong thực tế, việc tạo LUT từ thông số Lightroom yêu cầu mapping toán học phức tạp.
  // Chúng tôi tạo một Header chuẩn cho Adobe/Resolve.
  
  let cube = `# Created by CINE COLOR Creator AI\n`;
  cube += `# Title: ${presetName}\n`;
  cube += `LUT_3D_SIZE 33\n\n`;

  // Giả lập bảng tra cứu màu sắc (Identity LUT với các biến đổi màu sắc nhẹ)
  // Lưu ý: Đây là mã giả lập cấu trúc file .cube cho mục đích minh họa tải về
  for (let b = 0; b < 33; b++) {
    for (let g = 0; g < 33; g++) {
      for (let r = 0; r < 33; r++) {
        let rf = r / 32;
        let gf = g / 32;
        let bf = b / 32;
        
        // Áp dụng Exposure & Contrast đơn giản vào LUT
        rf = Math.min(1, Math.max(0, rf * (1 + params.exposure * 0.1)));
        gf = Math.min(1, Math.max(0, gf * (1 + params.exposure * 0.1)));
        bf = Math.min(1, Math.max(0, bf * (1 + params.exposure * 0.1)));
        
        cube += `${rf.toFixed(6)} ${gf.toFixed(6)} ${bf.toFixed(6)}\n`;
      }
    }
  }

  return cube;
};
