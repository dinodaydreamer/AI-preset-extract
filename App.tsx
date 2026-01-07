
import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Download, Image as ImageIcon, Loader2, 
  Wand2, ArrowLeft, Palette, Sun, Sliders, 
  Smartphone, Monitor, Copy, Check, Key, ExternalLink, Activity
} from 'lucide-react';
import { analyzeImage } from './services/geminiService';
import { generateXMP } from './utils/xmpGenerator';
import { generateCUBE } from './utils/lutGenerator';
import { AnalysisResult, HSLChannel } from './types';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image || !apiKey) return;
    setAnalyzing(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const data = await analyzeImage(base64Data, apiKey);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Xảy ra lỗi trong quá trình phân tích.");
    } finally {
      setAnalyzing(false);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-2xl shadow-orange-900/20">
          <Activity size={40} />
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">CINE COLOR <span className="text-orange-600 italic">Creator</span></h1>
        <p className="text-zinc-500 mb-10 max-w-sm">Công cụ trích xuất màu sắc điện ảnh từ hình ảnh bằng trí tuệ nhân tạo Gemini 3 Pro.</p>
        
        <div className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="password"
              placeholder="Nhập Gemini API Key của bạn..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-orange-600 transition-all font-mono text-sm"
            />
          </div>
          <button 
            disabled={!apiKey}
            onClick={() => setIsUnlocked(true)}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-900/20 uppercase tracking-widest text-sm"
          >
            Bắt đầu vận hành
          </button>
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            className="flex items-center justify-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Lấy API Key tại đây <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-orange-600/30">
      <header className="bg-[#0f0f0f] border-b border-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity size={24} className="text-orange-600" />
            <h1 className="text-lg font-black text-white uppercase tracking-tighter">CINE COLOR <span className="text-orange-600">Creator</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setImage(null); setResult(null); }}
              className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={14} /> Dự án mới
            </button>
            <div className="h-4 w-px bg-zinc-800"></div>
            <button onClick={() => setIsUnlocked(false)} className="text-zinc-600 hover:text-orange-500 transition-colors">
              <Key size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        {!image ? (
          <div className="max-w-3xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase italic leading-[0.9]">Tái tạo bảng màu <br/> từ mọi khung hình</h2>
              <p className="text-zinc-500 text-lg max-w-xl mx-auto">Tải lên một tấm ảnh có tone màu bạn yêu thích, AI sẽ phân tích chính xác từng thông số HSL, Grading và tạo file Preset chuyên nghiệp.</p>
            </div>
            
            <label className="group relative cursor-pointer block">
              <div className="border-2 border-dashed border-zinc-800 group-hover:border-orange-600 transition-all rounded-[3rem] p-24 flex flex-col items-center gap-6 bg-zinc-950 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-20 h-20 bg-zinc-900 group-hover:bg-orange-600/10 rounded-full flex items-center justify-center text-zinc-700 group-hover:text-orange-500 transition-all duration-500">
                  <Upload size={36} />
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-white uppercase tracking-widest">Kéo và thả ảnh tham chiếu</p>
                  <p className="text-zinc-600 mt-2 text-sm uppercase font-bold tracking-widest">Hỗ trợ JPG, PNG chất lượng cao</p>
                </div>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-zinc-950 rounded-[2.5rem] p-4 shadow-2xl shadow-black border border-zinc-900 overflow-hidden">
                <img 
                  src={image} 
                  alt="Source" 
                  className="w-full h-auto rounded-2xl object-cover aspect-video"
                />
              </div>
              
              {!result && !analyzing && (
                <button 
                  onClick={startAnalysis}
                  className="w-full py-6 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl font-black text-xl shadow-xl shadow-orange-900/20 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] active:scale-95"
                >
                  <Wand2 size={24} />
                  Phân tích cấu trúc màu
                </button>
              )}

              {analyzing && (
                <div className="w-full py-6 bg-zinc-900 text-zinc-500 rounded-3xl font-black text-xl flex items-center justify-center gap-4 uppercase tracking-[0.2em] animate-pulse border border-zinc-800">
                  <Loader2 className="animate-spin text-orange-600" size={24} />
                  Đang tính toán pixel...
                </div>
              )}

              {error && (
                <div className="p-5 bg-red-900/20 text-red-400 rounded-2xl text-sm border border-red-900/30 font-bold uppercase tracking-widest text-center">
                  {error}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-6">
              {result ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col h-full">
                  <div className="bg-zinc-950 rounded-[2.5rem] p-8 shadow-2xl border border-zinc-900 flex-1">
                    <div className="flex items-start justify-between mb-8 pb-8 border-b border-zinc-900">
                      <div>
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{result.presetName}</h3>
                        <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse"></div>
                           AI Color Engine Analysis
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => downloadFile(generateXMP(result.parameters, result.presetName), `${result.presetName}.xmp`, 'application/xml')}
                          className="bg-zinc-900 hover:bg-zinc-800 text-white p-4 rounded-2xl border border-zinc-800 transition-all active:scale-90"
                          title="Desktop XMP"
                        >
                          <Monitor size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                       <ParamItem label="Exposure" value={result.parameters.exposure.toFixed(2)} />
                       <ParamItem label="Contrast" value={result.parameters.contrast} />
                       <ParamItem label="Highlights" value={result.parameters.highlights} />
                       <ParamItem label="Shadows" value={result.parameters.shadows} />
                    </div>

                    <div className="space-y-4 mb-10">
                        <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Color Precision</h4>
                        <div className="grid grid-cols-4 gap-2">
                           {Object.entries(result.parameters.hsl).slice(0, 8).map(([color, vals]) => (
                             <div key={color} className="h-6 rounded-full border border-zinc-800" style={{ backgroundColor: color }}></div>
                           ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <button 
                        onClick={() => downloadFile(generateXMP(result.parameters, result.presetName), `${result.presetName}.xmp`, 'application/xml')}
                        className="w-full py-5 bg-white text-black font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest hover:bg-zinc-200"
                      >
                        <Monitor size={18} /> Desktop Preset (.XMP)
                      </button>
                      <button 
                        onClick={() => downloadFile(generateXMP(result.parameters, result.presetName), `${result.presetName}.dng`, 'application/octet-stream')}
                        className="w-full py-5 border border-zinc-800 text-white hover:bg-zinc-900 font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                      >
                        <Smartphone size={18} /> Mobile Preset (.DNG)
                      </button>
                      <button 
                        onClick={() => downloadFile(generateCUBE(result.parameters, result.presetName), `${result.presetName}.cube`, 'text/plain')}
                        className="w-full py-5 bg-orange-600 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest hover:bg-orange-500 shadow-lg shadow-orange-900/10"
                      >
                        <Download size={18} /> Film LUT (.CUBE)
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-zinc-950 rounded-[2.5rem] border-2 border-dashed border-zinc-900 text-zinc-700">
                  <Activity size={48} className="mb-6 text-zinc-800" />
                  <h4 className="text-xl font-black uppercase tracking-tighter text-zinc-500">Kết quả phân tích</h4>
                  <p className="mt-2 text-sm max-w-[200px] font-bold uppercase tracking-widest opacity-30">Chờ lệnh từ Neural Engine...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-zinc-900 mt-20 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">
            Developed by CINE COLOR AI • Powered by Gemini 3 Pro • Adobe Color Engine
          </p>
        </div>
      </footer>
    </div>
  );
};

const ParamItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex flex-col gap-1 p-5 bg-zinc-900 rounded-2xl border border-zinc-800/50 shadow-inner group hover:border-orange-600/30 transition-all">
    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest group-hover:text-orange-600 transition-colors">{label}</span>
    <span className="text-2xl font-black text-white tabular-nums tracking-tighter">
      {typeof value === 'number' && value > 0 ? `+${value}` : value}
    </span>
  </div>
);

export default App;
