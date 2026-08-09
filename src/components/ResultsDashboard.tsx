import React, { useState } from 'react';
import { 
  ValuationResult, 
  LandInputs, 
  Currency as CurrencyType, 
  LandUnit 
} from '../types';
import { convertFromAcres, USD_TO_PKR_RATE } from '../utils/valuationEngine';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  Award, 
  TrendingUp, 
  Layers, 
  ShieldAlert, 
  Building2, 
  FileText, 
  BookmarkCheck, 
  Printer, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface ResultsDashboardProps {
  result: ValuationResult;
  inputs: LandInputs;
  currency: CurrencyType;
  unit: LandUnit;
  onSave: () => void;
  isSaved: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  inputs,
  currency,
  unit,
  onSave,
  isSaved
}) => {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'comps' | 'development' | 'risks' | 'narrative'>('breakdown');

  const formatPrice = (usdVal: number) => {
    if (currency === 'PKR') {
      const pkrVal = Math.round(usdVal * USD_TO_PKR_RATE);
      return `Rs. ${pkrVal.toLocaleString()}`;
    }
    return `$${Math.round(usdVal).toLocaleString()}`;
  };

  // Convert unit price display for selected unit
  const pricePerKanal = currency === 'PKR' ? result.pricePerUnit.pricePerKanal * USD_TO_PKR_RATE : result.pricePerUnit.pricePerKanal;
  const pricePerMarla = currency === 'PKR' ? result.pricePerUnit.pricePerMarla * USD_TO_PKR_RATE : result.pricePerUnit.pricePerMarla;
  const pricePerAcre = currency === 'PKR' ? result.pricePerUnit.pricePerAcre * USD_TO_PKR_RATE : result.pricePerUnit.pricePerAcre;
  const pricePerSqFt = currency === 'PKR' ? result.pricePerUnit.pricePerSqFt * USD_TO_PKR_RATE : result.pricePerUnit.pricePerSqFt;

  const currSymbol = currency === 'PKR' ? 'Rs. ' : '$';

  // Prepare chart data for Value Factor Breakdown
  const chartData = result.breakdown.map((item) => ({
    name: item.category.split(' ')[0],
    category: item.category,
    impact: item.percentageDelta,
    color: item.impact === 'positive' ? '#059669' : '#e11d48'
  }));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Hero Valuation Executive Summary Banner */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 lg:p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Price Valuation Display */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Market Valuation
              </span>
              <span className="text-xs text-slate-400 font-medium truncate">
                {inputs.locationName || 'Property Parcel'}
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Estimated Fair Market Value
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-sans tracking-tight">
                {formatPrice(result.estimatedValue)}
              </h1>
              <p className="text-xs font-semibold text-emerald-400 mt-2">
                Value Range: {formatPrice(result.valueRange.low)} – {formatPrice(result.valueRange.high)}
              </p>
            </div>

            {/* Price Per Unit Breakdown Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="bg-[#0F172A] border border-[#334155] p-2.5 rounded-xl">
                <p className="text-[10px] text-slate-400 font-medium">Per Kanal</p>
                <p className="text-xs font-bold text-slate-100">{currSymbol}{Math.round(pricePerKanal).toLocaleString()}</p>
              </div>
              <div className="bg-[#0F172A] border border-[#334155] p-2.5 rounded-xl">
                <p className="text-[10px] text-slate-400 font-medium">Per Marla</p>
                <p className="text-xs font-bold text-slate-100">{currSymbol}{Math.round(pricePerMarla).toLocaleString()}</p>
              </div>
              <div className="bg-[#0F172A] border border-[#334155] p-2.5 rounded-xl">
                <p className="text-[10px] text-slate-400 font-medium">Per Acre</p>
                <p className="text-xs font-bold text-slate-100">{currSymbol}{Math.round(pricePerAcre).toLocaleString()}</p>
              </div>
              <div className="bg-[#0F172A] border border-[#334155] p-2.5 rounded-xl">
                <p className="text-[10px] text-slate-400 font-medium">Per Sq Ft</p>
                <p className="text-xs font-bold text-slate-100">{currSymbol}{pricePerSqFt.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Investment Grade & Buildability Score Scorecard */}
          <div className="lg:col-span-5 bg-[#0F172A] border border-[#334155] p-6 rounded-xl flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between border-b border-[#334155] pb-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold">Valuation Rating</p>
                <p className="text-2xl font-extrabold text-white mt-0.5">{result.valuationScore} <span className="text-xs font-medium text-slate-500">/ 100</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-semibold">Investment Grade</p>
                <span className="inline-block text-xl font-extrabold text-emerald-400 bg-emerald-600/20 px-3 py-1 rounded-lg border border-emerald-500/30 mt-0.5">
                  {result.investmentGrade}
                </span>
              </div>
            </div>

            {/* Score Gauges */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Buildability Index</span>
                  <span className="text-emerald-400">{result.buildabilityIndex}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${result.buildabilityIndex}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Location Score</span>
                  <span className="text-emerald-400">{result.locationScore}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${result.locationScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onSave}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSaved
                    ? 'bg-emerald-600/20 border border-emerald-500/50 text-emerald-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                {isSaved ? 'Saved to 15-Day Database' : 'Save to 15-Day Database'}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="p-2.5 bg-[#1E293B] hover:bg-slate-800 border border-[#334155] text-slate-300 rounded-xl transition-all"
                title="Print Report"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Navigation Tabs for Deep Dive Sections */}
      <div className="flex items-center gap-2 border-b border-[#334155] overflow-x-auto pb-3">
        {[
          { id: 'breakdown', label: 'Value Drivers Breakdown', icon: Layers },
          { id: 'comps', label: 'Comparable Sales', icon: TrendingUp },
          { id: 'development', label: 'Development Strategies', icon: Building2 },
          { id: 'risks', label: 'Risk Analysis', icon: ShieldAlert },
          { id: 'narrative', label: 'Executive Narrative', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:bg-[#1E293B] hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: VALUE FACTORS BREAKDOWN */}
      {activeTab === 'breakdown' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          
          {/* Chart View */}
          <div className="lg:col-span-7 bg-[#1E293B] border border-[#334155] p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-sans flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Value Drivers & Impact Percentage
            </h3>

            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                  <XAxis type="number" unit="%" stroke="#64748b" fontSize={11} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(value: any) => [`${value}% Impact`, 'Value Delta']}
                  />
                  <Bar dataKey="impact" radius={[0, 6, 6, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.impact >= 0 ? '#059669' : '#e11d48'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* List Breakdown */}
          <div className="lg:col-span-5 bg-[#1E293B] border border-[#334155] p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-sans">
              Factor Explanation Matrix
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {result.breakdown.map((item, idx) => (
                <div key={idx} className="bg-[#0F172A] p-3 rounded-xl border border-[#334155] space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200">{item.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      item.impact === 'positive' 
                        ? 'bg-emerald-600/20 text-emerald-400' 
                        : item.impact === 'negative' 
                        ? 'bg-rose-600/20 text-rose-400' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.percentageDelta > 0 ? `+${item.percentageDelta}%` : `${item.percentageDelta}%`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: COMPARABLE SALES (COMPS) */}
      {activeTab === 'comps' && (
        <div className="bg-[#1E293B] border border-[#334155] p-6 lg:p-8 rounded-2xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Comparative Market Analysis (Recent Nearby Sales)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.comparableSales.map((comp, idx) => (
              <div key={idx} className="bg-[#0F172A] p-5 rounded-xl border border-[#334155] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-600/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    {comp.similarity}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{comp.distance}</span>
                </div>

                <div>
                  <p className="font-bold text-xs text-slate-100">{comp.property}</p>
                  <p className="text-[11px] text-slate-400">Parcel Size: {comp.size}</p>
                </div>

                <div className="border-t border-[#334155] pt-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Sale Price</p>
                    <p className="font-extrabold text-white">{comp.salePrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Rate</p>
                    <p className="font-bold text-slate-300">{comp.pricePerAcre}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DEVELOPMENT STRATEGIES */}
      {activeTab === 'development' && (
        <div className="bg-[#1E293B] border border-[#334155] p-6 lg:p-8 rounded-2xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Strategic Development Opportunities
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.developmentPotentials.map((strat, idx) => (
              <div key={idx} className="bg-[#0F172A] p-5 rounded-xl border border-[#334155] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{strat.strategy}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                    strat.feasibility === 'High' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-amber-600/20 text-amber-400'
                  }`}>
                    {strat.feasibility} Feasibility
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{strat.description}</p>

                <div className="bg-emerald-600/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <ArrowUpRight className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Estimated Upside: {strat.estimatedUpside}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RISK ANALYSIS */}
      {activeTab === 'risks' && (
        <div className="bg-[#1E293B] border border-[#334155] p-6 lg:p-8 rounded-2xl space-y-6 animate-fadeIn">
          <div>
            <h3 className="text-lg font-bold text-amber-400 font-sans flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              Risk Assessment & Site Mitigation
            </h3>
          </div>

          <div className="space-y-3">
            {result.riskFactors.map((risk, idx) => (
              <div key={idx} className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      risk.severity === 'High' ? 'bg-rose-600/20 text-rose-400' : 'bg-amber-600/20 text-amber-400'
                    }`}>
                      {risk.severity} Risk
                    </span>
                    <p className="font-bold text-xs text-slate-200">{risk.factor}</p>
                  </div>
                  <p className="text-xs text-slate-400">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: NARRATIVE */}
      {activeTab === 'narrative' && (
        <div className="bg-[#1E293B] border border-[#334155] p-6 lg:p-8 rounded-2xl space-y-4 animate-fadeIn">
          <h3 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Executive Appraiser Narrative
          </h3>

          <div className="bg-[#0F172A] p-5 rounded-xl border border-[#334155] text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
            {result.aiSummary}
          </div>
        </div>
      )}

    </div>
  );
};
