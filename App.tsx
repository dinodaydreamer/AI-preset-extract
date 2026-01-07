
import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Download, Image as ImageIcon, Loader2, 
  Wand2, ArrowLeft, Palette, Sun, Sliders, 
  Smartphone, Monitor, Copy, Check, HelpCircle, X, Languages, Zap, Focus, Activity, CircleDot, Key, ExternalLink, ShieldCheck, AlertCircle, Lock
} from 'lucide-react';
import { analyzeImage } from './services/geminiService';
import { generateXMP } from './utils/xmpGenerator';
import { AnalysisResult, HSLChannel } from './types';

type Language = 'en' | 'vi';
type ActiveTab = 'tone' | 'presence' | 'hsl' | 'grading' | 'detail';

const TRANSLATIONS = {
  en: {
    tagline: "NEURAL COLOR ENGINE",
    newProject: "NEW PROJECT",
    landingTitle: "Master the Art of Color in Photography",
    landingSub: "Upload any reference frame. Our AI deconstructs complex color science into professional Lightroom presets.",
    importRef: "Import Reference Frame",
    deconstruct: "DECONSTRUCT COLOR GRADE",
    analyzing: "PROCESSING NEURAL LUT...",
    desktop: "DESKTOP (.XMP)",
    mobile: "MOBILE (.DNG)",
    copyManual: "Copy Manual Values",
    copied: "Copied",
    outputTerminal: "Output Terminal",
    connectRef: "Connect reference image to begin extraction.",
    howToUse: "User Manual",
    guideStep1: "1. Select a high-quality photo with colors you want to replicate.",
    guideStep2: "2. Enter your Gemini API Key in the box below.",
    guideStep3: "3. Press Deconstruct to analyze color science.",
    guideStep4: "4. Export as .XMP for Desktop or .DNG for Mobile.",
    startApp: "INITIATE ENGINE",
    v: "VERSION 3.5",
    apiKey: "API CONNECTION",
    keyActive: "CONNECTED",
    keyRequired: "ENTER API KEY",
    pasteKey: "Enter your API Key...",
    billingLink: "Get API Key",
    tabs: {
      tone: "TONE",
      presence: "PRESENCE",
      hsl: "HSL",
      grading: "GRADING",
      detail: "DETAIL"
    },
    params: {
      exp: "EXPOSURE",
      cont: "CONTRAST",
      high: "HIGHLIGHTS",
      shad: "SHADOWS",
      white: "WHITES",
      black: "BLACKS",
      temp: "TEMP",
      tint: "TINT",
      vib: "VIBRANCE",
      sat: "SATURATION",
      clar: "CLARITY",
      dehaze: "DEHAZE",
      tex: "TEXTURE",
      sharp: "SHARPENING",
      noise: "NOISE RED.",
      colNoise: "COLOR NOISE"
    }
  },
  vi: {
    tagline: "CÔNG CỤ MÀU SẮC AI",
    newProject: "DỰ ÁN MỚI",
    landingTitle: "Làm chủ nghệ thuật màu sắc trong nhiếp ảnh",
    landingSub: "Tải lên ảnh tham chiếu. AI sẽ phân tích các thông số màu sắc phức tạp thành Preset Lightroom chuyên nghiệp.",
    importRef: "Nhập Ảnh Tham Chiếu",
    deconstruct: "PHÂN TÍCH MÀU SẮC",
    analyzing: "ĐANG XỬ LÝ NEURAL LUT...",
    desktop: "MÁY TÍNH (.XMP)",
    mobile: "DI ĐỘNG (.DNG)",
    copyManual: "Sao chép thông số",
    copied: "Đã chép",
    outputTerminal: "Trạm Đầu Ra",
    connectRef: "Kết nối ảnh tham chiếu để bắt đầu trích xuất.",
    howToUse: "Hướng Dẫn Sử Dụng",
    guideStep1: "1. Chọn một tấm ảnh chất lượng cao có màu sắc bạn yêu thích.",
    guideStep2: "2. Nhập API Key của bạn vào ô bên dưới.",
    guideStep3: "3. Nhấn nút Phân tích để AI xử lý toàn bộ bảng màu.",
    guideStep4: "4. Xuất file .XMP cho máy tính hoặc .DNG cho di động.",
    startApp: "BẮT ĐẦU VẬN HÀNH",
    v: "PHIÊN BẢN 3.5",
    apiKey: "KẾT NỐI API",
    keyActive: "ĐÃ KẾT NỐI",
    keyRequired: "NHẬP API KEY ĐỂ BẮT ĐẦU",
    pasteKey: "Nhập API Key của bạn tại đây...",
    billingLink: "Lấy API Key tại đây",
    tabs: {
      tone: "ÁNH SÁNG",
      presence: "HIỆU ỨNG",
      hsl: "MÀU SẮC",
      grading: "TÔ MÀU",
      detail: "CHI TIẾT"
    },
    params: {
      exp: "PHƠI SÁNG",
      cont: "TƯƠNG PHẢN",
      high: "VÙNG SÁNG",
      shad: "VÙNG TỐI",
      white: "TRẮNG",
      black: "ĐEN",
      temp: "NHIỆT ĐỘ",
      tint: "SẮC THÁI",
      vib: "SINH ĐỘNG",
      sat: "BÃO HÒA",
      clar: "ĐỘ RÕ NÉT",
      dehaze: "SƯƠNG MÙ",
      tex: "TEXTURE",
      sharp: "SẮC CẠNH",
      noise: "KHỬ NHIỄU",
      colNoise: "NHIỄU MÀU"
    }
  }
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('vi');
  const [hasStarted, setHasStarted] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('tone');
  const [copied, setCopied] = useState(false);
  const [manualKey, setManualKey] = useState<string>('');
  
  const t = TRANSLATIONS[lang];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image || !manualKey) return;
    
    setAnalyzing(true);
    try {
      const base64Data = image.split(',')[1];
      const data = await analyzeImage(base64Data, manualKey);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      alert("Lỗi: " + (err.message || "Không thể kết nối API. Vui lòng kiểm tra lại Key."));
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
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyMobileSummary = () => {
    if (!result) return;
    const { parameters: p } = result;
    const summary = `CINEGRADE: ${result.presetName}\nExp: ${p.exposure}\nCont: ${p.contrast}\nTemp: ${p.temperature}\nGrading: S:${p.colorGrading.shadows.hue} M:${p.colorGrading.midtones.hue} H:${p.colorGrading.highlights.hue}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-2xl shadow-orange-900/40 animate-pulse">
          <Zap size={48} strokeWidth={2.5} />
        </div>
        
        <div className="space-y-1 mb-8">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">CINEGRADE</h1>
          <p className="text-orange-500 font-black tracking-[0.4em] text-xs">{t.tagline}</p>
        </div>

        <div className="flex gap-4 mb-10">
          <button onClick={() => setLang('en')} className={`px-4 py-2 text-[10px] font-black tracking-widest rounded border transition-all ${lang === 'en' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>EN</button>
          <button onClick={() => setLang('vi')} className={`px-4 py-2 text-[10px] font-black tracking-widest rounded border transition-all ${lang === 'vi' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>VI</button>
        </div>

        {/* REAL TEXTBOX FOR API KEY ENTRY */}
        <div className="w-full max-w-sm mb-10 space-y-4">
          <div className="flex flex-col items-start gap-1.5 w-full">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1">{t.keyRequired}</label>
            <div className={`flex items-center w-full px-4 py-3.5 bg-zinc-950 border-2 rounded-2xl transition-all shadow-2xl group ${manualKey ? 'border-emerald-600/50' : 'border-zinc-900 focus-within:border-orange-600'}`}>
              <Key size={18} className={manualKey ? "text-emerald-500" : "text-zinc-600 group-focus-within:text-orange-500"} />
              <input 
                type="password"
                value={manualKey}
                onChange={(e) => setManualKey(e.target.value)}
                placeholder={t.pasteKey}
                className="bg-transparent border-none outline-none flex-1 ml-3 text-sm font-mono tracking-widest text-white placeholder:text-zinc-800"
              />
              {manualKey && <ShieldCheck size={18} className="text-emerald-500" />}
            </div>
          </div>
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] text-zinc-600 hover:text-orange-500 flex items-center justify-center gap-1 transition-colors uppercase tracking-[0.2em] font-black"
          >
            {t.billingLink} <ExternalLink size={10} />
          </a>
        </div>

        <button 
          onClick={() => manualKey && setHasStarted(true)} 
          disabled={!manualKey}
          className={`px-20 py-5 rounded-full font-black tracking-widest uppercase transition-all shadow-2xl ${manualKey ? 'bg-orange-600 hover:bg-orange-500 text-white orange-glow active:scale-95' : 'bg-zinc-900 text-zinc-700 border border-zinc-800 cursor-not-allowed opacity-50'}`}
        >
          {t.startApp}
        </button>

        <p className="mt-12 text-zinc-800 text-[9px] font-black tracking-[0.3em] uppercase italic">{t.v}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-200">
      <header className="bg-black border-b border-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap size={24} className="text-orange-600 cursor-pointer" onClick={() => setHasStarted(false)} />
            <div className="hidden sm:block">
              <h1 className="text-lg font-black tracking-tight text-white uppercase italic">Cinegrade</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* MINI API STATUS IN HEADER (NOW AN INPUT) */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 border border-emerald-900/20 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">API SECURED</span>
            </div>

            <div className="flex items-center gap-2 border-l border-zinc-800 pl-4">
              <button onClick={() => setLang(lang === 'en' ? 'vi' : 'en')} className="p-2 text-zinc-500 hover:text-white transition-colors"><Languages size={18} /></button>
              <button onClick={() => setShowGuide(true)} className="p-2 text-zinc-500 hover:text-white transition-colors"><HelpCircle size={18} /></button>
              <button onClick={() => setHasStarted(false)} className="p-2 text-zinc-500 hover:text-orange-500 transition-colors"><Lock size={18} /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-zinc-900 w-full max-w-xl rounded-[2.5rem] border border-zinc-800 p-10 relative shadow-3xl">
            <button onClick={() => setShowGuide(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
            <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter italic">{t.howToUse}</h2>
            <div className="space-y-6 text-zinc-400 font-medium leading-relaxed">
              <p className="flex gap-4"><span className="text-orange-500 font-black">01</span> {t.guideStep1}</p>
              <p className="flex gap-4"><span className="text-orange-500 font-black">02</span> {t.guideStep2}</p>
              <p className="flex gap-4"><span className="text-orange-500 font-black">03</span> {t.guideStep3}</p>
              <p className="flex gap-4"><span className="text-orange-500 font-black">04</span> {t.guideStep4}</p>
            </div>
            <button onClick={() => setShowGuide(false)} className="mt-10 w-full py-4 bg-white text-black font-black uppercase rounded-2xl hover:bg-zinc-200 transition-all">ĐÃ HIỂU</button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        {!image ? (
          <div className="max-w-4xl mx-auto mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.9] uppercase italic">{t.landingTitle}</h2>
            <p className="text-zinc-500 text-xl mb-12 max-w-2xl mx-auto">{t.landingSub}</p>
            <label className="group relative border-2 border-dashed border-zinc-900 hover:border-orange-600 transition-all rounded-[4rem] p-32 block cursor-pointer bg-zinc-950 shadow-2xl overflow-hidden active:scale-95 duration-200">
              <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Upload size={64} className="mx-auto mb-8 text-zinc-800 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-500" />
              <p className="text-2xl font-black text-white uppercase group-hover:tracking-[0.1em] transition-all">{t.importRef}</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-zinc-950 rounded-[3rem] p-5 border border-zinc-900 shadow-2xl">
                <img src={image} alt="Source" className="w-full rounded-[2rem] object-cover aspect-video" />
              </div>
              {!result && !analyzing && (
                <button 
                  onClick={startAnalysis} 
                  className="w-full py-7 bg-orange-600 hover:bg-orange-500 text-white rounded-3xl font-black text-xl shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest transition-all orange-glow active:scale-95"
                >
                  <Wand2 size={24} /> {t.deconstruct}
                </button>
              )}
              {analyzing && (
                <div className="w-full py-7 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-3xl font-black text-xl flex items-center justify-center gap-3 uppercase animate-pulse">
                  <Loader2 className="animate-spin text-orange-600" size={24} /> 
                  {t.analyzing}
                </div>
              )}
            </div>

            <div className="lg:col-span-6 space-y-6">
              {result ? (
                <div className="bg-zinc-950 rounded-[3rem] p-10 border border-zinc-900 shadow-2xl flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="mb-10 flex justify-between items-start">
                    <div>
                      <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-1 italic">{result.presetName}</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.6)]"></div>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Cinegrade AI Analysis</p>
                      </div>
                    </div>
                    {image && <button onClick={() => setImage(null)} className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors"><ArrowLeft size={16} /></button>}
                  </div>

                  <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar border-b border-zinc-900">
                    {(['tone', 'presence', 'hsl', 'grading', 'detail'] as ActiveTab[]).map(tab => (
                      <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-500/5' : 'text-zinc-600 hover:text-zinc-400'}`}
                      >
                        {t.tabs[tab]}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 no-scrollbar min-h-[420px]">
                    {activeTab === 'tone' && (
                      <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                        <ParamBox label={t.params.exp} value={result.parameters.exposure.toFixed(2)} />
                        <ParamBox label={t.params.cont} value={result.parameters.contrast} />
                        <ParamBox label={t.params.high} value={result.parameters.highlights} />
                        <ParamBox label={t.params.shad} value={result.parameters.shadows} />
                        <ParamBox label={t.params.white} value={result.parameters.whites} />
                        <ParamBox label={t.params.black} value={result.parameters.blacks} />
                        <ParamBox label={t.params.temp} value={result.parameters.temperature} />
                        <ParamBox label={t.params.tint} value={result.parameters.tint} />
                      </div>
                    )}

                    {activeTab === 'presence' && (
                      <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                        <ParamBox label={t.params.tex} value={result.parameters.texture} />
                        <ParamBox label={t.params.clar} value={result.parameters.clarity} />
                        <ParamBox label={t.params.dehaze} value={result.parameters.dehaze} />
                        <ParamBox label={t.params.vib} value={result.parameters.vibrance} />
                        <ParamBox label={t.params.sat} value={result.parameters.saturation} />
                      </div>
                    )}

                    {activeTab === 'hsl' && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        {(Object.entries(result.parameters.hsl) as [string, HSLChannel][]).map(([color, vals]) => (
                          <div key={color} className="p-5 bg-black rounded-2xl border border-zinc-900 group hover:border-zinc-700 transition-all shadow-inner">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-4 h-4 rounded-full border border-white/10 shadow-lg" style={{ backgroundColor: color }}></div>
                              <span className="text-xs font-black uppercase tracking-widest text-white">{color}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <HSLVal label="H" val={vals.hue} />
                              <HSLVal label="S" val={vals.sat} />
                              <HSLVal label="L" val={vals.lum} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'grading' && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <GradingRow label="SHADOWS" values={result.parameters.colorGrading.shadows} />
                        <GradingRow label="MIDTONES" values={result.parameters.colorGrading.midtones} />
                        <GradingRow label="HIGHLIGHTS" values={result.parameters.colorGrading.highlights} />
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <ParamBox label="BLENDING" value={result.parameters.colorGrading.blending} />
                          <ParamBox label="BALANCE" value={result.parameters.colorGrading.balance} />
                        </div>
                      </div>
                    )}

                    {activeTab === 'detail' && (
                      <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-300">
                        <ParamBox label={t.params.sharp} value={result.parameters.sharpness} />
                        <ParamBox label={t.params.noise} value={result.parameters.noiseReduction} />
                        <ParamBox label={t.params.colNoise} value={result.parameters.colorNoiseReduction} />
                      </div>
                    )}
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-5">
                    <button onClick={() => downloadFile(generateXMP(result.parameters, result.presetName), `${result.presetName}.xmp`, 'application/xml')} className="py-5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-[1.25rem] font-black text-xs uppercase flex items-center justify-center gap-3 transition-all border border-zinc-800 shadow-xl active:scale-95"><Monitor size={18} /> {t.desktop}</button>
                    <button onClick={() => downloadFile(generateXMP(result.parameters, result.presetName), `${result.presetName}.dng`, 'application/octet-stream')} className="py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-[1.25rem] font-black text-xs uppercase flex items-center justify-center gap-3 transition-all shadow-2xl shadow-orange-900/40 active:scale-95"><Smartphone size={18} /> {t.mobile}</button>
                  </div>
                  <button onClick={copyMobileSummary} className="mt-5 w-full py-4 bg-zinc-900 text-zinc-500 hover:text-white rounded-[1.25rem] text-[10px] font-black uppercase flex items-center justify-center gap-3 border border-zinc-900 transition-all active:bg-zinc-800">
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />} {copied ? t.copied : t.copyManual}
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-16 bg-zinc-950/50 rounded-[3rem] border-2 border-dashed border-zinc-900">
                   <Activity size={64} className="text-zinc-900 mb-8" />
                   <p className="text-zinc-700 font-black uppercase tracking-[0.3em] text-[10px] max-w-[200px] leading-loose italic">{t.connectRef}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-zinc-900 text-center mt-20 bg-zinc-950/50">
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.4em]">
          © 2025 CINEGRADE - Bản quyền bởi DINO AI MEDIA - Nguyễn Quốc Hưng - 0914286003
        </p>
      </footer>
    </div>
  );
};

const ParamBox: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-black p-5 rounded-2xl border border-zinc-900 group hover:border-orange-900 transition-all shadow-inner">
    <div className="text-[9px] font-black text-zinc-700 group-hover:text-orange-500 mb-2 tracking-widest uppercase transition-colors">{label}</div>
    <div className="text-2xl font-black text-white tabular-nums mono tracking-tighter">{typeof value === 'number' && value > 0 ? `+${value}` : value}</div>
  </div>
);

const HSLVal: React.FC<{ label: string; val: number }> = ({ label, val }) => (
  <div className="flex flex-col">
    <span className="text-[9px] text-zinc-700 font-black uppercase mb-1">{label}</span>
    <span className="text-sm font-black text-white mono">{val > 0 ? `+${val}` : val}</span>
  </div>
);

const GradingRow: React.FC<{ label: string; values: { hue: number; sat: number; lum: number } }> = ({ label, values }) => (
  <div className="p-6 bg-black rounded-2xl border border-zinc-900 group hover:border-zinc-800 transition-all shadow-inner">
    <div className="text-[11px] font-black text-zinc-600 uppercase mb-4 tracking-widest flex items-center gap-3 italic">
      <div className="w-1 h-3 bg-orange-600 rounded-full"></div>
      {label}
    </div>
    <div className="grid grid-cols-3 gap-4">
      <HSLVal label="HUE" val={values.hue} />
      <HSLVal label="SAT" val={values.sat} />
      <HSLVal label="LUM" val={values.lum} />
    </div>
  </div>
);

export default App;
