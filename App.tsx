
import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Download, Image as ImageIcon, Loader2, 
  Wand2, ArrowLeft, Palette, Sun, Sliders, 
  Smartphone, Monitor, Copy, Check, HelpCircle, X, Languages, Zap, Focus, Activity, CircleDot, Key, ExternalLink
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
    landingTitle: "Master the Cinema Aesthetic.",
    landingSub: "Upload any reference frame. Our AI deconstructs complex color science into professional Lightroom presets.",
    importRef: "Import Reference Frame",
    dragDrop: "Drag & drop high-res stills or dailies",
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
    guideStep2: "2. Press the Deconstruct button to let Gemini AI analyze the color science.",
    guideStep3: "3. Export as .XMP for Desktop Lightroom or .DNG for Mobile version.",
    guideStep4: "4. Import and apply to your photos for professional results.",
    startApp: "INITIATE ENGINE",
    v: "VERSION 3.5",
    apiKey: "API KEY",
    keyActive: "ACTIVE",
    keyRequired: "REQUIRED",
    billingLink: "Billing Docs",
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
    landingTitle: "Làm chủ nghệ thuật điện ảnh.",
    landingSub: "Tải lên ảnh tham chiếu. AI sẽ phân tích các thông số màu sắc phức tạp thành Preset Lightroom chuyên nghiệp.",
    importRef: "Nhập Ảnh Tham Chiếu",
    dragDrop: "Kéo và thả ảnh tại đây",
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
    guideStep2: "2. Nhấn nút Phân tích để AI xử lý toàn bộ bảng màu.",
    guideStep3: "3. Xuất file .XMP cho máy tính hoặc .DNG cho di động.",
    guideStep4: "4. Nhập vào Lightroom để áp dụng lên bộ ảnh của bạn.",
    startApp: "BẮT ĐẦU VẬN HÀNH",
    v: "PHIÊN BẢN 3.5",
    apiKey: "API KEY",
    keyActive: "ĐÃ KÍCH HOẠT",
    keyRequired: "CHƯA CÓ KEY",
    billingLink: "Tài liệu thanh toán",
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
  const [hasApiKey, setHasApiKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      const active = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(active);
    };
    checkKey();
    const interval = setInterval(checkKey, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setHasApiKey(true);
  };

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
    if (!image) return;
    if (!hasApiKey) {
      await handleSelectKey();
      return;
    }
    setAnalyzing(true);
    try {
      const base64Data = image.split(',')[1];
      const data = await analyzeImage(base64Data);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        await handleSelectKey();
      }
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-2xl shadow-orange-900/40 animate-pulse">
          <Zap size={48} strokeWidth={2.5} />
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-white mb-2 uppercase">CINEGRADE</h1>
        <p className="text-orange-500 font-black tracking-[0.4em] text-xs mb-12">{t.tagline}</p>
        <div className="flex gap-4 mb-12">
          <button onClick={() => setLang('en')} className={`px-4 py-2 text-xs font-black tracking-widest rounded border ${lang === 'en' ? 'bg-white text-black' : 'border-zinc-800 text-zinc-500'}`}>EN</button>
          <button onClick={() => setLang('vi')} className={`px-4 py-2 text-xs font-black tracking-widest rounded border ${lang === 'vi' ? 'bg-white text-black' : 'border-zinc-800 text-zinc-500'}`}>VI</button>
        </div>
        <button onClick={() => setHasStarted(true)} className="px-12 py-5 bg-orange-600 hover:bg-orange-500 text-white font-black tracking-widest uppercase rounded-full shadow-2xl orange-glow transition-all">{t.startApp}</button>
        <p className="mt-8 text-zinc-700 text-[10px] font-black tracking-widest">{t.v}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-200">
      <header className="bg-black border-b border-zinc-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap size={24} className="text-orange-600 cursor-pointer" onClick={() => setHasStarted(false)} />
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">CINEGRADE</h1>
              <p className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">{t.tagline}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* API KEY STATUS BAR */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex flex-col items-end mr-2">
                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{t.apiKey}</span>
                <a 
                  href="https://ai.google.dev/gemini-api/docs/billing" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[7px] text-zinc-700 hover:text-orange-500 flex items-center gap-1 transition-colors"
                >
                  {t.billingLink} <ExternalLink size={6} />
                </a>
              </div>
              <div className="flex items-center gap-1 p-1 bg-zinc-900/50 border border-zinc-900 rounded-lg group hover:border-zinc-800 transition-all">
                <div 
                  onClick={handleSelectKey}
                  className="flex items-center gap-3 px-3 py-1.5 bg-black rounded border border-zinc-800 cursor-pointer hover:bg-zinc-950 transition-all min-w-[180px]"
                >
                  <div className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-orange-500 animate-pulse'}`}></div>
                  <span className={`text-[10px] font-mono tracking-widest ${hasApiKey ? 'text-zinc-500' : 'text-zinc-700'}`}>
                    {hasApiKey ? '••••••••••••••••' : t.keyRequired}
                  </span>
                </div>
                <button 
                  onClick={handleSelectKey}
                  className="p-1.5 text-zinc-500 hover:text-orange-500 transition-colors"
                  title="Update Key"
                >
                  <Key size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setLang(lang === 'en' ? 'vi' : 'en')} className="p-2 text-zinc-500 hover:text-orange-500"><Languages size={20} /></button>
              <button onClick={() => setShowGuide(true)} className="p-2 text-zinc-500 hover:text-orange-500"><HelpCircle size={20} /></button>
              {image && <button onClick={() => setImage(null)} className="hidden sm:flex px-4 py-2 text-[10px] font-black bg-zinc-900 border border-zinc-800 rounded uppercase tracking-widest items-center"><ArrowLeft size={12} className="mr-2" /> {t.newProject}</button>}
            </div>
          </div>
        </div>
      </header>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-zinc-900 w-full max-w-xl rounded-[2rem] border border-zinc-800 p-10 relative">
            <button onClick={() => setShowGuide(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white"><X size={24} /></button>
            <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">{t.howToUse}</h2>
            <div className="space-y-6 text-zinc-400 font-medium">
              <p>{t.guideStep1}</p><p>{t.guideStep2}</p><p>{t.guideStep3}</p><p>{t.guideStep4}</p>
            </div>
            <button onClick={() => setShowGuide(false)} className="mt-10 w-full py-4 bg-zinc-800 text-white font-black uppercase rounded-xl">CLOSE</button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        {!image ? (
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">{t.landingTitle}</h2>
            <p className="text-zinc-500 text-xl mb-12">{t.landingSub}</p>
            <label className="border-2 border-dashed border-zinc-900 hover:border-orange-600 transition-all rounded-[3rem] p-24 block cursor-pointer bg-zinc-950 shadow-2xl">
              <Upload size={48} className="mx-auto mb-6 text-zinc-700" />
              <p className="text-2xl font-black text-white uppercase">{t.importRef}</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-zinc-950 rounded-[2rem] p-4 border border-zinc-900 shadow-2xl">
                <img src={image} alt="Source" className="w-full rounded-xl object-cover aspect-video" />
              </div>
              {!result && !analyzing && (
                <button 
                  onClick={startAnalysis} 
                  className={`w-full py-6 text-white rounded-2xl font-black text-xl shadow-2xl flex items-center justify-center gap-3 uppercase tracking-widest transition-all ${!hasApiKey ? 'bg-zinc-800 border border-zinc-700 opacity-50' : 'bg-orange-600 hover:bg-orange-500 orange-glow'}`}
                >
                  <Wand2 size={24} /> {t.deconstruct}
                </button>
              )}
              {analyzing && <div className="w-full py-6 bg-zinc-900 text-zinc-500 rounded-2xl font-black text-xl flex items-center justify-center gap-3 uppercase animate-pulse"><Loader2 className="animate-spin" size={24} /> {t.analyzing}</div>}
            </div>

            <div className="lg:col-span-6 space-y-6">
              {result ? (
                <div className="bg-zinc-950 rounded-[2.5rem] p-8 border border-zinc-900 shadow-2xl flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{result.presetName}</h3>
                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">CHROMATIC ENGINE RESULT</p>
                  </div>

                  <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar border-b border-zinc-900">
                    {(['tone', 'presence', 'hsl', 'grading', 'detail'] as ActiveTab[]).map(tab => (
                      <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'text-orange-500 border-b-2 border-orange-500' : 'text-zinc-600 hover:text-zinc-400'}`}
                      >
                        {t.tabs[tab]}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 no-scrollbar min-h-[400px]">
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
                      <div className="space-y-6 animate-in fade-in duration-300">
                        {(Object.entries(result.parameters.hsl) as [string, HSLChannel][]).map(([color, vals]) => (
                          <div key={color} className="p-4 bg-black rounded-xl border border-zinc-900">
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: color }}></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-white">{color}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
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
                        <div className="grid grid-cols-2 gap-4 mt-4">
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

                  <div className="mt-10 grid grid-cols-2 gap-4">
                    <button onClick={() => downloadFile(generateXMP(result.parameters, result.presetName), `${result.presetName}.xmp`, 'application/xml')} className="py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all border border-zinc-800"><Monitor size={16} /> {t.desktop}</button>
                    <button onClick={() => downloadFile(generateXMP(result.parameters, result.presetName), `${result.presetName}.dng`, 'application/octet-stream')} className="py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-900/40"><Smartphone size={16} /> {t.mobile}</button>
                  </div>
                  <button onClick={copyMobileSummary} className="mt-4 w-full py-3 bg-zinc-900 text-zinc-500 hover:text-white rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 border border-zinc-900 transition-all">
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />} {copied ? t.copied : t.copyManual}
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-zinc-950/50 rounded-[2.5rem] border border-zinc-900">
                   <Activity size={48} className="text-zinc-900 mb-6" />
                   <p className="text-zinc-700 font-black uppercase tracking-widest text-xs">{t.connectRef}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-zinc-900 text-center mt-20">
        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.2em]">
          © 2025 CINEGRADE - Bản quyền bởi DINO AI MEDIA - Nguyễn Quốc Hưng - 0914286003
        </p>
      </footer>
    </div>
  );
};

const ParamBox: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-black p-4 rounded-xl border border-zinc-900 group hover:border-orange-900 transition-all">
    <div className="text-[8px] font-black text-zinc-700 group-hover:text-orange-500 mb-1 tracking-widest">{label}</div>
    <div className="text-xl font-black text-white tabular-nums mono">{typeof value === 'number' && value > 0 ? `+${value}` : value}</div>
  </div>
);

const HSLVal: React.FC<{ label: string; val: number }> = ({ label, val }) => (
  <div className="flex flex-col">
    <span className="text-[8px] text-zinc-700 font-black uppercase">{label}</span>
    <span className="text-xs font-black text-white mono">{val > 0 ? `+${val}` : val}</span>
  </div>
);

const GradingRow: React.FC<{ label: string; values: { hue: number; sat: number; lum: number } }> = ({ label, values }) => (
  <div className="p-4 bg-black rounded-xl border border-zinc-900">
    <div className="text-[10px] font-black text-zinc-600 uppercase mb-3 tracking-widest">{label}</div>
    <div className="grid grid-cols-3 gap-2">
      <HSLVal label="HUE" val={values.hue} />
      <HSLVal label="SAT" val={values.sat} />
      <HSLVal label="LUM" val={values.lum} />
    </div>
  </div>
);

export default App;
