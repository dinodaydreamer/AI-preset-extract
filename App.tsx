
import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Download, Loader2, Wand2, ArrowLeft, 
  Smartphone, Monitor, Check, Key, ExternalLink, Activity, ShieldCheck, Zap, 
  Library, Cpu, Film, ChevronRight, Info, HelpCircle, X, MousePointer2, Clapperboard, Layers
} from 'lucide-react';
import { analyzeImage } from './services/geminiService';
import { generateXMP } from './utils/xmpGenerator';
import { generateCUBE } from './utils/lutGenerator';
import { AnalysisResult, LightroomParams } from './types';
import { PRESET_LIBRARY, LibraryPreset, PresetCategory } from './utils/presetLibrary';

type MainTab = 'ANALYZER' | 'LIBRARY';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mainTab, setMainTab] = useState<MainTab>('ANALYZER');
  const [libraryCategory, setLibraryCategory] = useState<PresetCategory | 'ALL'>('ALL');
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
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
      setError(err.message || "Xảy ra lỗi trong quá trình phân tích màu sắc.");
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

  const filteredLibrary = PRESET_LIBRARY.filter(item => 
    libraryCategory === 'ALL' || item.category === libraryCategory
  );

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white mb-10 shadow-[0_0_50px_rgba(234,88,12,0.3)] animate-pulse">
          <Zap size={48} strokeWidth={2.5} />
        </div>
        <h1 className="text-5xl font-black text-white mb-3 tracking-tighter uppercase italic leading-none">CINE COLOR <span className="text-orange-600 not-italic">Creator</span></h1>
        <p className="text-zinc-500 mb-12 max-w-sm font-medium tracking-wide italic">Hệ thống AI tái cấu trúc DNA màu sắc điện ảnh.</p>
        
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-start gap-2">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">Xác thực hệ thống</span>
            <div className="relative w-full group">
              <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-600 transition-colors" size={20} />
              <input 
                type="password"
                placeholder="Nhập Gemini API Key của bạn..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-zinc-900 border-2 border-zinc-800 text-white pl-14 pr-4 py-5 rounded-[1.5rem] focus:outline-none focus:border-orange-600 transition-all font-mono text-sm tracking-widest placeholder:text-zinc-800"
              />
              {apiKey && <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />}
            </div>
          </div>
          
          <button 
            disabled={!apiKey}
            onClick={() => setIsUnlocked(true)}
            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-20 disabled:cursor-not-allowed text-white font-black py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-orange-900/20 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 active:scale-95"
          >
            Kích hoạt hệ thống <Activity size={18} />
          </button>
          
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            className="flex items-center justify-center gap-2 text-[10px] text-zinc-700 hover:text-orange-500 transition-all uppercase font-black tracking-widest"
          >
            Lấy mã API tại Google AI Studio <ExternalLink size={10} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-300 font-sans selection:bg-orange-600 selection:text-white overflow-x-hidden">
      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="bg-[#0f0f0f] border border-zinc-800 rounded-[3rem] w-full max-w-2xl p-10 relative overflow-hidden shadow-[0_0_100px_rgba(234,88,12,0.1)]">
              <button onClick={() => setShowHelp(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"><X size={32} /></button>
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white"><HelpCircle size={28} /></div>
                 <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Hướng dẫn <span className="text-orange-600 not-italic">Vận hành</span></h2>
              </div>
              <div className="space-y-8">
                 <HelpStep number="01" title="Nhập dữ liệu" text="Tải lên hình ảnh tham chiếu có tone màu bạn muốn trích xuất (Ưu tiên ảnh chất lượng cao, ít nhiễu)." />
                 <HelpStep number="02" title="AI Phân tích" text="Hệ thống Gemini 3 Pro sẽ de-construct các pixel để tìm ra thông số HSL, 3-Way Grading và Tone Balance." />
                 <HelpStep number="03" title="Xuất kết quả" text="Lựa chọn định dạng: .XMP cho Lightroom Desktop, .DNG cho Mobile và .CUBE cho các phần mềm dựng phim (Premiere, Resolve, CapCut)." />
                 <HelpStep number="04" title="Áp dụng" text="Đối với LUT: Trong Premiere, sử dụng Lumetri Color > Creative > Browse để nạp file .CUBE vào footage của bạn." />
              </div>
              <button onClick={() => setShowHelp(false)} className="w-full mt-12 py-5 bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-2xl transition-all uppercase text-xs tracking-[0.2em] border border-zinc-800">Tôi đã hiểu</button>
           </div>
        </div>
      )}

      <header className="bg-[#0c0c0c] border-b border-zinc-900 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-900/20">
              <Zap size={20} />
            </div>
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">CINE COLOR <span className="text-orange-600">Creator</span></h1>
          </div>

          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800">
             <button 
                onClick={() => setMainTab('ANALYZER')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mainTab === 'ANALYZER' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
                <Cpu size={14} /> AI Analyzer
             </button>
             <button 
                onClick={() => setMainTab('LIBRARY')}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mainTab === 'LIBRARY' ? 'bg-orange-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
                <Library size={14} /> Library
             </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHelp(true)}
              className="p-2 text-zinc-500 hover:text-orange-600 transition-colors"
              title="Hướng dẫn sử dụng"
            >
              <HelpCircle size={22} />
            </button>
            <div className="h-6 w-px bg-zinc-800"></div>
            <button onClick={() => setIsUnlocked(false)} className="p-2 text-zinc-600 hover:text-orange-500 transition-colors" title="Đổi API Key">
              <Key size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        {mainTab === 'ANALYZER' ? (
          <div className="animate-in fade-in duration-500">
            {!image ? (
              <div className="max-w-4xl mx-auto mt-16 animate-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center mb-20 space-y-4">
                  <div className="inline-block px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4">
                    Neural Color Reconstruction
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
                    TRÍCH XUẤT <br/> <span className="text-orange-600 not-italic">DNA MÀU SẮC</span>
                  </h2>
                  <p className="text-zinc-500 text-xl max-w-2xl mx-auto pt-6 leading-relaxed">
                    Tải lên một khung hình tham chiếu. AI sẽ phân tích DNA màu sắc để tạo ra bộ Preset và LUT chuyên nghiệp nhất.
                  </p>
                </div>
                
                <label className="group relative cursor-pointer block">
                  <div className="border-[3px] border-dashed border-zinc-900 group-hover:border-orange-600 transition-all rounded-[4rem] p-32 flex flex-col items-center gap-8 bg-[#0a0a0a] shadow-3xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-24 h-24 bg-zinc-900 group-hover:bg-orange-600 group-hover:text-white rounded-[2.5rem] flex items-center justify-center text-zinc-700 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-2xl">
                      <Upload size={40} strokeWidth={2.5} />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-black text-white uppercase tracking-[0.1em]">Nhập ảnh tham chiếu</p>
                      <p className="text-zinc-600 text-xs uppercase font-black tracking-[0.3em]">Hỗ trợ RAW, JPEG, PNG High Fidelity</p>
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-7 space-y-8 sticky top-32">
                  <div className="bg-zinc-950 rounded-[3rem] p-6 shadow-2xl border border-zinc-900 overflow-hidden">
                    <img src={image} alt="Source" className="w-full h-auto rounded-[2rem] object-cover aspect-video" />
                  </div>
                  {!result && !analyzing && (
                    <button onClick={startAnalysis} className="w-full py-8 bg-orange-600 hover:bg-orange-500 text-white rounded-[2rem] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-5 uppercase tracking-[0.2em] active:scale-95">
                      <Wand2 size={32} /> Kích hoạt Neural Analysis
                    </button>
                  )}
                  {analyzing && (
                    <div className="w-full py-8 bg-zinc-900 text-zinc-500 rounded-[2rem] font-black text-2xl flex items-center justify-center gap-5 uppercase animate-pulse border-2 border-zinc-800">
                      <Loader2 className="animate-spin text-orange-600" size={32} /> Đang quét Vector...
                    </div>
                  )}
                  {error && <div className="p-6 bg-red-950/20 text-red-500 rounded-[2rem] border border-red-900/30 font-black uppercase text-center">{error}</div>}
                </div>
                <div className="lg:col-span-5">
                   {result ? <ResultPanel result={result} downloadFile={downloadFile} /> : <TerminalPlaceholder />}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
             <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900 rounded-full text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">
                   <MousePointer2 size={12} className="text-orange-600" /> Rê chuột lên icon Info để xem chi tiết
                </div>
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">THƯ VIỆN <span className="text-orange-600">ĐIỆN ẢNH</span></h2>
                <p className="text-zinc-500 max-w-xl mx-auto font-medium">Bộ sưu tập DNA màu sắc từ các bậc thầy và các hãng phim danh tiếng.</p>
             </div>

             {/* Library Category Filter */}
             <div className="flex justify-center gap-4 mb-12">
                <FilterButton active={libraryCategory === 'ALL'} onClick={() => setLibraryCategory('ALL')} icon={<Layers size={14}/>} label="TẤT CẢ" />
                <FilterButton active={libraryCategory === 'DIRECTOR'} onClick={() => setLibraryCategory('DIRECTOR')} icon={<Clapperboard size={14}/>} label="ĐẠO DIỄN" />
                <FilterButton active={libraryCategory === 'STUDIO'} onClick={() => setLibraryCategory('STUDIO')} icon={<Film size={14}/>} label="HÃNG PHIM" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px]">
                {filteredLibrary.map((item) => (
                  <PresetCard key={item.id} preset={item} downloadFile={downloadFile} />
                ))}
             </div>
          </div>
        )}
      </main>

      <footer className="py-16 border-t border-zinc-900 mt-24 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-800 text-[9px] font-black uppercase tracking-[0.8em]">
            © 2025 CINE COLOR AI CREATOR • RE-ENGINEERING COLOR SCIENCE
          </p>
        </div>
      </footer>
    </div>
  );
};

const FilterButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 border ${active ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-950/40' : 'bg-zinc-950 text-zinc-500 border-zinc-900 hover:border-zinc-700'}`}
  >
    {icon} {label}
  </button>
);

const HelpStep: React.FC<{ number: string; title: string; text: string }> = ({ number, title, text }) => (
  <div className="flex gap-6 group">
     <div className="text-3xl font-black text-zinc-800 group-hover:text-orange-950 transition-colors italic leading-none">{number}</div>
     <div>
        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-1">{title}</h4>
        <p className="text-zinc-500 text-sm leading-relaxed">{text}</p>
     </div>
  </div>
);

const ResultPanel: React.FC<{ result: AnalysisResult; downloadFile: (c: string, f: string, t: string) => void }> = ({ result, downloadFile }) => (
  <div className="bg-zinc-950 rounded-[3rem] p-10 shadow-2xl border border-zinc-900">
    <div className="mb-10 pb-10 border-b border-zinc-900">
      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-2">{result.presetName}</h3>
      <div className="flex items-center gap-3">
         <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
         <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em]">High Precision Grade</span>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-10">
       <ParamItem label="Exposure" value={result.parameters.exposure.toFixed(2)} />
       <ParamItem label="Contrast" value={result.parameters.contrast} />
       <ParamItem label="Highlights" value={result.parameters.highlights} />
       <ParamItem label="Shadows" value={result.parameters.shadows} />
    </div>
    <div className="grid grid-cols-1 gap-4">
       <div className="grid grid-cols-2 gap-4">
          <button onClick={() => downloadFile(generateXMP(result.parameters, result.presetName), `${result.presetName}.xmp`, 'application/xml')} className="py-6 bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-[1.5rem] border border-zinc-800 transition-all flex flex-col items-center justify-center gap-2 uppercase text-[10px] tracking-[0.2em] shadow-xl"><Monitor size={20} /> Desktop (.XMP)</button>
          <button onClick={() => downloadFile(generateXMP(result.parameters, result.presetName), `${result.presetName}.dng`, 'application/octet-stream')} className="py-6 bg-zinc-900 hover:bg-zinc-800 text-white font-black rounded-[1.5rem] border border-zinc-800 transition-all flex flex-col items-center justify-center gap-2 uppercase text-[10px] tracking-[0.2em] shadow-xl"><Smartphone size={20} /> Mobile (.DNG)</button>
       </div>
       <button onClick={() => downloadFile(generateCUBE(result.parameters, result.presetName), `${result.presetName}.cube`, 'text/plain')} className="w-full py-7 bg-orange-600 text-white font-black rounded-[1.5rem] transition-all flex items-center justify-center gap-4 uppercase text-sm tracking-[0.3em] hover:bg-orange-500 shadow-2xl active:scale-[0.98]"><Download size={22} /> Export Film LUT (.CUBE)</button>
    </div>
  </div>
);

const PresetCard: React.FC<{ preset: LibraryPreset; downloadFile: (c: string, f: string, t: string) => void }> = ({ preset, downloadFile }) => (
  <div className="bg-zinc-950 rounded-[2.5rem] p-8 border border-zinc-900 hover:border-orange-900/50 transition-all group relative overflow-visible flex flex-col justify-between">
     <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
           <div>
              <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{preset.name}</h4>
              <p className="text-orange-600 text-[10px] font-black uppercase tracking-[0.3em]">{preset.author}</p>
           </div>
           
           <div className="relative group/info">
              <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700 group-hover:text-orange-500 transition-colors cursor-help">
                 <Info size={18} />
              </div>
              
              <div className="absolute top-full right-0 mt-4 w-72 bg-[#121212] border border-orange-900/30 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-[60] animate-in slide-in-from-top-2">
                 <h5 className="text-white font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                    <Zap size={10} className="text-orange-600" /> Cinematic Highlights
                 </h5>
                 <ul className="space-y-3">
                    {preset.highlights.map((h, i) => (
                       <li key={i} className="text-zinc-400 text-[11px] font-medium leading-relaxed flex items-start gap-2">
                          <div className="w-1 h-1 bg-orange-600 rounded-full mt-1.5 shrink-0"></div>
                          {h}
                       </li>
                    ))}
                 </ul>
                 <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center">
                    <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Accuracy Level</span>
                    <div className="flex gap-1">
                       <div className="w-2 h-1 bg-orange-600 rounded-full"></div>
                       <div className="w-2 h-1 bg-orange-600 rounded-full"></div>
                       <div className="w-2 h-1 bg-orange-600 rounded-full"></div>
                       <div className="w-2 h-1 bg-orange-600/20 rounded-full"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed font-medium min-h-[40px]">{preset.description}</p>
     </div>
        
     <div className="grid grid-cols-3 gap-3">
        <button onClick={() => downloadFile(generateXMP(preset.params, preset.name), `${preset.id}.xmp`, 'application/xml')} className="py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all border border-zinc-900">XMP</button>
        <button onClick={() => downloadFile(generateXMP(preset.params, preset.name), `${preset.id}.dng`, 'application/octet-stream')} className="py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all border border-zinc-900">DNG</button>
        <button onClick={() => downloadFile(generateCUBE(preset.params, preset.name), `${preset.id}.cube`, 'text/plain')} className="py-3 bg-orange-600/10 hover:bg-orange-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-orange-600 hover:text-white transition-all shadow-lg shadow-orange-950/20">LUT</button>
     </div>
  </div>
);

const TerminalPlaceholder = () => (
  <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-16 bg-zinc-950/30 rounded-[3rem] border-2 border-dashed border-zinc-900 text-zinc-800 group">
    <div className="w-20 h-20 border-2 border-zinc-900 rounded-full flex items-center justify-center mb-8 group-hover:border-orange-950 transition-colors">
      <Activity size={40} className="opacity-20 group-hover:opacity-100 group-hover:text-orange-950 transition-all" />
    </div>
    <h4 className="text-xl font-black uppercase tracking-widest text-zinc-900 italic">Terminal Standby</h4>
    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] opacity-20 leading-loose">Hệ thống đang ở trạng thái chờ. Kết nối dữ liệu hình ảnh để bắt đầu trích xuất.</p>
  </div>
);

const ParamItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex flex-col gap-2 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 group hover:border-orange-900/50 transition-all shadow-inner">
    <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] group-hover:text-orange-600 transition-colors">{label}</span>
    <span className="text-3xl font-black text-white tabular-nums tracking-tighter">{typeof value === 'number' && value > 0 ? `+${value}` : value}</span>
  </div>
);

export default App;
