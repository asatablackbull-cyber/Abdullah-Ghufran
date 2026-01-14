import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { NutritionResult, MacroData } from '../types';

interface Props {
  data: NutritionResult;
  onReset: () => void;
}

const NutritionResultDisplay: React.FC<Props> = ({ data, onReset }) => {
  const macroData: MacroData[] = [
    { name: 'Protein', value: data.protein, color: '#0f172a' }, 
    { name: 'Carbs', value: data.carbs, color: '#64748b' },   
    { name: 'Fat', value: data.fat, color: '#94a3b8' },       
  ];

  const totalMacros = data.protein + data.carbs + data.fat;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
        {/* Report Header */}
        <div className="border-b border-slate-200 p-6 flex justify-between items-end bg-slate-50/50">
          <div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] block mb-1">Success: Scan_Verified</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Nutritional Profile</h2>
          </div>
          <div className="text-right">
             <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{data.calories}</div>
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Kilocalories</div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-12 border-b border-slate-100">
            {/* Visual Balance */}
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Density</span>
                <span className="text-sm font-black text-slate-900">{Math.round((data.protein / (totalMacros || 1)) * 100)}% Pro</span>
              </div>
            </div>

            {/* Macro Matrix */}
            <div className="grid grid-cols-1 gap-4">
              {macroData.map((macro) => (
                <div key={macro.name} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: macro.color }}></div>
                    <span className="font-bold text-slate-500 uppercase tracking-widest text-[11px]">{macro.name}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-lg text-slate-900">{macro.value}g</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">
                      ({Math.round((macro.value / (totalMacros || 1)) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Composition */}
          {data.detailedFoods && data.detailedFoods.length > 0 && (
            <div className="mt-10 space-y-4">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Analyzed Composition</h3>
              <div className="divide-y divide-slate-50 border-t border-slate-50">
                {data.detailedFoods.map((food, idx) => (
                  <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{food.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase ml-3 tracking-widest">{food.quantity}</span>
                    </div>
                    <div className="flex gap-4 sm:gap-6 font-mono text-[11px] font-bold">
                      <div className="text-slate-400">P <span className="text-slate-900">{food.protein}g</span></div>
                      <div className="text-slate-400">C <span className="text-slate-900">{food.carbs}g</span></div>
                      <div className="text-slate-400">F <span className="text-slate-900">{food.fat}g</span></div>
                      <div className="text-emerald-600 font-black ml-2">{food.calories}kcal</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Description */}
          <div className="mt-10 p-5 bg-slate-50 rounded border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Automated Insight</h4>
            <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase tracking-wide">
              "{data.description}"
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 bg-slate-900 text-white rounded font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-slate-800 transition-all active:scale-[0.98]"
      >
        Discard & New Capture
      </button>
    </div>
  );
};

export default NutritionResultDisplay;