import React, { useState, useEffect } from 'react';
import { 
  LandInputs, 
  ValuationResult, 
  SavedEstimate, 
  Currency as CurrencyType, 
  LandUnit 
} from './types';
import { PRESET_REGIONS } from './data/presetRegions';
import { calculateInstantValuation } from './utils/valuationEngine';
import { Header } from './components/Header';
import { EstimatorForm } from './components/EstimatorForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { RecentValuationsTable } from './components/RecentValuationsTable';
import { LogInModal } from './components/LogInModal';
import { PwaInstallModal } from './components/PwaInstallModal';
import { AiLandAdvisorDrawer } from './components/AiLandAdvisorDrawer';
import { Layers, Smartphone, ShieldCheck, Compass, Sparkles, User, RefreshCw, BarChart2 } from 'lucide-react';

const DEFAULT_PRESET = PRESET_REGIONS[0]; // Lahore (DHA / Gulberg), Punjab

export default function App() {
  const [inputs, setInputs] = useState<LandInputs>({
    locationName: DEFAULT_PRESET.name,
    lat: DEFAULT_PRESET.lat,
    lng: DEFAULT_PRESET.lng,
    regionPresetId: DEFAULT_PRESET.id,
    size: 1, // 1 Kanal default
    unit: 'kanal',
    propertyType: 'Residential',
    zoning: 'residential_single',
    topography: 'flat',
    roadAccess: 'paved_local',
    lotShape: 'rectangular',
    soilQuality: 'prime_buildable',
    hasElectricity: true,
    hasWater: true,
    hasSewer: true,
    hasInternet: true,
    distanceToCityMiles: 5,
    marketTrend: 'steady_appreciation',
    subdivisionPotential: true,
    floodZone: false,
    hasWaterfront: false,
    hasMineralTimberRights: false,
  });

  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currency, setCurrency] = useState<CurrencyType>('PKR');
  const [unit, setUnit] = useState<LandUnit>('kanal');
  const [history, setHistory] = useState<SavedEstimate[]>([]);
  
  // UI Modals & Sections
  const [isLogInOpen, setIsLogInOpen] = useState<boolean>(false);
  const [isPwaOpen, setIsPwaOpen] = useState<boolean>(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);
  const [activeNavSection, setActiveNavSection] = useState<'tool' | 'market'>('tool');

  // Load recent valuations from 15-day backend database
  const fetchHistoryFromDb = async () => {
    try {
      const res = await fetch('/api/valuations');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setHistory(json.data);
      }
    } catch (err) {
      console.error('Error fetching 15-day valuation history:', err);
    }
  };

  useEffect(() => {
    fetchHistoryFromDb();
  }, []);

  // Compute baseline estimate automatically on initial load or inputs change
  useEffect(() => {
    const instant = calculateInstantValuation(inputs);
    setResult(prev => (prev ? { ...instant, aiSummary: prev.aiSummary, comparableSales: prev.comparableSales } : instant));
  }, [inputs]);

  const handleInputsChange = (updated: Partial<LandInputs>) => {
    setInputs(prev => ({ ...prev, ...updated }));
  };

  const handleUnitChange = (newUnit: LandUnit) => {
    setUnit(newUnit);
    handleInputsChange({ unit: newUnit });
  };

  const handleRunValuation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/estimate-land', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });

      const json = await response.json();
      if (json.success && json.data) {
        setResult(json.data);
        // Automatically save to 15-day database
        await saveValuationToDb(inputs, json.data);
      } else {
        const fallback = calculateInstantValuation(inputs);
        setResult(fallback);
        await saveValuationToDb(inputs, fallback);
      }
    } catch (err) {
      console.error('Error running valuation:', err);
      const fallback = calculateInstantValuation(inputs);
      setResult(fallback);
      await saveValuationToDb(inputs, fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const saveValuationToDb = async (currInputs: LandInputs, currResult: ValuationResult) => {
    try {
      const res = await fetch('/api/valuations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: currInputs,
          result: currResult,
          currency,
          title: `${currInputs.locationName || 'Land Parcel'} (${currInputs.size} ${currInputs.unit})`
        })
      });
      const json = await res.json();
      if (json.success) {
        fetchHistoryFromDb();
      }
    } catch (err) {
      console.error('Error saving valuation to 15-day DB:', err);
    }
  };

  const handleDeleteValuationFromDb = async (id: string) => {
    try {
      const res = await fetch(`/api/valuations/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setHistory(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Error deleting valuation:', err);
    }
  };

  const handleSelectRecord = (record: SavedEstimate) => {
    setInputs(record.inputs);
    setResult(record.result);
    if (record.currency) setCurrency(record.currency);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setInputs({
      locationName: DEFAULT_PRESET.name,
      lat: DEFAULT_PRESET.lat,
      lng: DEFAULT_PRESET.lng,
      regionPresetId: DEFAULT_PRESET.id,
      size: 1,
      unit: 'kanal',
      propertyType: 'Residential',
      zoning: 'residential_single',
      topography: 'flat',
      roadAccess: 'paved_local',
      lotShape: 'rectangular',
      soilQuality: 'prime_buildable',
      hasElectricity: true,
      hasWater: true,
      hasSewer: true,
      hasInternet: true,
      distanceToCityMiles: 5,
      marketTrend: 'steady_appreciation',
      subdivisionPotential: true,
      floodZone: false,
      hasWaterfront: false,
      hasMineralTimberRights: false,
    });
    setCurrency('PKR');
    setUnit('kanal');
  };

  const scrollToRecentTable = () => {
    const el = document.getElementById('recent-valuations-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isCurrentSaved = result 
    ? history.some(s => s.result.estimatedValue === result.estimatedValue && s.inputs.locationName === inputs.locationName) 
    : false;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans selection:bg-emerald-600/30 selection:text-emerald-300">
      
      {/* Navigation Header */}
      <Header
        currency={currency}
        onCurrencyChange={setCurrency}
        unit={unit}
        onUnitChange={handleUnitChange}
        savedCount={history.length}
        onOpenRecentValuations={scrollToRecentTable}
        onOpenPwaModal={() => setIsPwaOpen(true)}
        onOpenLogInModal={() => setIsLogInOpen(true)}
        onReset={handleReset}
        activeNavSection={activeNavSection}
        onNavClick={(sec) => setActiveNavSection(sec as any)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Above the Fold Hero & Main Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-sans tracking-tight">
            Accurate Land & Property Valuations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-3xl">
            Enter location details and parcel dimensions to compute instant market estimates with Pakistani (Kanal, Marla) and international land units.
          </p>
        </div>

        {/* Hero Valuation Tool Grid (Above the Fold) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Calculator Card (Front and Center) */}
          <div className="lg:col-span-6">
            <EstimatorForm
              inputs={inputs}
              onChange={handleInputsChange}
              onSubmit={handleRunValuation}
              isLoading={isLoading}
              currency={currency}
              onCurrencyChange={setCurrency}
            />
          </div>

          {/* Right Column: Live Results Dashboard */}
          <div className="lg:col-span-6">
            {result ? (
              <ResultsDashboard
                result={result}
                inputs={inputs}
                currency={currency}
                unit={unit}
                onSave={() => saveValuationToDb(inputs, result)}
                isSaved={isCurrentSaved}
              />
            ) : (
              <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-12 text-center text-slate-400 space-y-3">
                <BarChart2 className="w-8 h-8 mx-auto text-emerald-500" />
                <p className="text-sm font-semibold text-slate-200">Valuation Ready</p>
                <p className="text-xs text-slate-400">Click "Calculate Valuation" to compute comprehensive parcel estimates.</p>
              </div>
            )}
          </div>

        </div>

        {/* Section 2: Recent Valuations Table (15-day Persistent DB History) */}
        <div id="recent-valuations-section">
          <RecentValuationsTable
            history={history}
            currency={currency}
            onSelect={handleSelectRecord}
            onDelete={handleDeleteValuationFromDb}
            onRefresh={fetchHistoryFromDb}
          />
        </div>

        {/* Market Data & Feature Overview Grid */}
        {activeNavSection === 'market' && (
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 lg:p-8 space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-white font-sans">
              Pakistani & International Real Estate Market Benchmarks
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PRESET_REGIONS.map((region) => (
                <div key={region.id} className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-600/20 px-2 py-0.5 rounded">
                    {region.tier}
                  </span>
                  <h4 className="font-bold text-xs text-slate-100">{region.name}</h4>
                  <p className="text-[11px] text-slate-400">{region.description}</p>
                  <div className="pt-2 border-t border-[#334155] flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>Base Kanal Rate:</span>
                    <span className="text-emerald-400">Rs. {(region.basePricePerKanalPKR / 10000000).toFixed(2)} Crore</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enterprise Highlights Footer Band */}
        <div className="border-t border-[#334155] pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="flex items-start gap-3 bg-[#1E293B] p-4 rounded-xl border border-[#334155]">
            <Compass className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Pakistani Land Unit Conversions</p>
              <p className="text-slate-400 text-[11px]">Exact mathematical conversion formulas for Kanal (20 Marlas / 8 per Acre) and Marla (272.25 Sq Ft).</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#1E293B] p-4 rounded-xl border border-[#334155]">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">15-Day Database Persistence</p>
              <p className="text-slate-400 text-[11px]">All valuation reports automatically stored on server backend with 15-day auto-purge database retention.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#1E293B] p-4 rounded-xl border border-[#334155]">
            <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-200">Play Store & Mobile Ready</p>
              <p className="text-slate-400 text-[11px]">Fully touch-optimized web manifest and TWA integration readiness for direct Android app distribution.</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#334155] bg-[#0F172A] py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">TerraVal</span> &bull; Land & Property Valuation Platform
          </div>
          <p>&copy; {new Date().getFullYear()} TerraVal Enterprise. All valuation data calculated via market appraisal algorithms.</p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <LogInModal
        isOpen={isLogInOpen}
        onClose={() => setIsLogInOpen(false)}
      />

      <PwaInstallModal
        isOpen={isPwaOpen}
        onClose={() => setIsPwaOpen(false)}
      />

      <AiLandAdvisorDrawer
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        currentInputs={inputs}
      />

    </div>
  );
}
