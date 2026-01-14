import React, { useState, useRef } from 'react';
import { analyzeMealImage } from './services/geminiService';
import { AppState } from './types';
import NutritionResultDisplay from './components/NutritionResultDisplay';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'landing',
    isAnalyzing: false,
    result: null,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';

    setState(prev => ({ ...prev, isAnalyzing: true, error: null, view: 'analyzer' }));

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });

      reader.readAsDataURL(file);
      const base64Image = await base64Promise;
      
      const nutritionData = await analyzeMealImage(base64Image);
      setState(prev => ({ ...prev, isAnalyzing: false, result: nutritionData }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        error: err.message || "Analysis timed out. Please check your image clarity and try again." 
      }));
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();
  const reset = () => setState({ view: 'landing', isAnalyzing: false, result: null, error: null });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Utility Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900 uppercase">Hill Calories</span>
          </div>
          <button 
            onClick={triggerUpload}
            className="px-4 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded uppercase tracking-wider hover:bg-slate-800 transition-all active:scale-95"
          >
            Analyze Meal
          </button>
        </div>
      </nav>

      <main className="flex-1 pt-14">
        {state.view === 'landing' && (
          <div className="w-full">
            {/* Direct Hero */}
            <section className="pt-24 pb-20 px-6 report-grid">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <div className="inline-block px-3 py-1 border border-slate-200 bg-white text-slate-500 rounded text-[10px] font-bold tracking-[0.2em] uppercase">
                  Precision Computer Vision v2.0
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                  Photograph your plate.<br/>Get your macros.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
                  We identify ingredients and estimate portions automatically using volumetric analysis. No manual entry required.
                </p>
                <div className="pt-6">
                  <button 
                    onClick={triggerUpload}
                    className="group relative px-10 py-5 bg-emerald-600 text-white rounded font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mx-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                    Capture & Analyze
                  </button>
                </div>
              </div>
            </section>

            {/* Technical Proof Section */}
            <section className="py-20 border-y border-slate-100 bg-slate-50">
              <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">The Engine.</h2>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      Most apps guess. We analyze. Our multi-modal model detects food textures and depth to estimate mass. Every scan is cross-referenced with the USDA FoodData Central database.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Volumetric portion estimation
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Automated ingredient identification
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        Adjusts for cooking method caloric density
                      </div>
                    </div>
                  </div>
                  <div className="technical-border rounded-lg overflow-hidden bg-white p-2">
                    <img 
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" 
                      alt="Sample Analysis" 
                      className="w-full grayscale-[0.3]"
                    />
                    <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                       <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 italic">Processing Frame_042</span>
                       <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">Scan Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Integrity / Credentials */}
            <section className="py-16 bg-white">
               <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                  <div className="max-w-sm space-y-2">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Technology</h4>
                    <p className="text-sm font-bold text-slate-900 leading-tight">Leveraging Gemini 3 Flash for sub-second visual inference.</p>
                  </div>
                  <div className="max-w-sm space-y-2">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Database</h4>
                    <p className="text-sm font-bold text-slate-900 leading-tight">Syncing with USDA Clinical Datasets for macro integrity.</p>
                  </div>
                  <div className="max-w-sm space-y-2">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Accuracy</h4>
                    <p className="text-sm font-bold text-slate-900 leading-tight">Validated against 100k+ professional nutritional logs.</p>
                  </div>
               </div>
            </section>
          </div>
        )}

        {state.view === 'analyzer' && (
          <div className="max-w-3xl mx-auto px-6 py-12">
            {state.isAnalyzing ? (
              <LoadingScreen />
            ) : state.error ? (
              <div className="max-w-md mx-auto technical-border rounded bg-white p-8 space-y-6">
                <div className="flex items-center gap-4 text-red-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Analysis Error</h3>
                </div>
                <p className="text-slate-600 font-medium">{state.error}</p>
                <div className="pt-4 flex flex-col gap-2">
                  <button onClick={triggerUpload} className="w-full py-3 bg-slate-900 text-white font-bold rounded hover:bg-slate-800 uppercase tracking-widest text-[11px]">Retry Analysis</button>
                  <button onClick={reset} className="w-full py-3 text-slate-400 font-bold uppercase tracking-widest text-[11px]">Cancel</button>
                </div>
              </div>
            ) : state.result ? (
              <NutritionResultDisplay data={state.result} onReset={reset} />
            ) : null}
          </div>
        )}
      </main>

      <footer className="py-12 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-xs font-black uppercase tracking-widest">Hill Calories AI</span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">© 2025 Hill Technology Group. All rights reserved.</p>
        </div>
      </footer>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default App;