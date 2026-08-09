import React, { useState } from 'react';
import { 
  MapPin, 
  Ruler, 
  Building2, 
  ChevronDown, 
  Sparkles, 
  SlidersHorizontal,
  ChevronUp,
  Zap,
  Check
} from 'lucide-react';
import { 
  LandInputs, 
  PropertyType, 
  LandUnit, 
  Currency as CurrencyType, 
  ZoningType, 
  Topography, 
  RoadAccess 
} from '../types';
import { PRESET_REGIONS } from '../data/presetRegions';
import { LandMap } from './LandMap';

interface EstimatorFormProps {
  inputs: LandInputs;
  onChange: (updated: Partial<LandInputs>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  currency: CurrencyType;
  onCurrencyChange: (c: CurrencyType) => void;
}

export const EstimatorForm: React.FC<EstimatorFormProps> = ({
  inputs,
  onChange,
  onSubmit,
  isLoading,
  currency,
  onCurrencyChange
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleSelectPreset = (regionId: string) => {
    const found = PRESET_REGIONS.find(r => r.id === regionId);
    if (found) {
      onChange({
        regionPresetId: found.id,
        locationName: found.name,
        lat: found.lat,
        lng: found.lng,
      });
    }
  };

  const handleMapLocationChange = (lat: number, lng: number) => {
    onChange({
      lat: +lat.toFixed(5),
      lng: +lng.toFixed(5),
      locationName: inputs.locationName || `Parcel Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`
    });
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      
      {/* Front and Center Interactive Calculator Card */}
      <div className="space-y-5">
        
        {/* Row 1: Property Location Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1.5">
            Property Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={inputs.locationName}
              onChange={(e) => onChange({ locationName: e.target.value })}
              placeholder="e.g., Lahore, Punjab or Parcel ID"
              className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium transition-colors"
            />
          </div>

          {/* Location Presets Quick Chips */}
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-slate-400 font-medium shrink-0">Popular:</span>
            {PRESET_REGIONS.slice(0, 6).map((preset) => {
              const isSelected = inputs.regionPresetId === preset.id;
              const shortLabel = preset.name.split('(')[0].trim();
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400 font-bold'
                      : 'bg-[#0F172A] border-[#334155] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Land Size Input + Single Unit Dropdown + Currency Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          
          {/* Land Size Input & Single Unit Dropdown */}
          <div className="sm:col-span-7 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200">
              Land Area Size & Unit
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={inputs.size}
                onChange={(e) => onChange({ size: Math.max(0.01, parseFloat(e.target.value) || 0.1) })}
                className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
              />

              <div className="relative w-32 shrink-0">
                <select
                  value={inputs.unit}
                  onChange={(e) => onChange({ unit: e.target.value as LandUnit })}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2.5 pr-8 text-xs font-bold text-slate-200 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="kanal">Kanal (Pak)</option>
                  <option value="marla">Marla (Pak)</option>
                  <option value="acre">Acre</option>
                  <option value="sqft">Sq Ft</option>
                  <option value="hectare">Hectare</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Property Type Selector */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-200">
              Property Type
            </label>
            <div className="relative">
              <select
                value={inputs.propertyType}
                onChange={(e) => onChange({ propertyType: e.target.value as PropertyType })}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Industrial">Industrial</option>
                <option value="Mixed-Use">Mixed-Use</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Currency Option Toggle */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-400 font-medium">Valuation Currency:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onCurrencyChange('PKR')}
              className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                currency === 'PKR'
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-[#0F172A] border-[#334155] text-slate-300 hover:border-slate-500'
              }`}
            >
              Pakistani Rupee (PKR Rs.)
            </button>
            <button
              type="button"
              onClick={() => onCurrencyChange('USD')}
              className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-[#0F172A] border-[#334155] text-slate-300 hover:border-slate-500'
              }`}
            >
              US Dollar ($ USD)
            </button>
          </div>
        </div>

        {/* Primary High-Contrast Calculate Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={onSubmit}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Computing Valuation...</span>
            </>
          ) : (
            <>
              <span>Calculate Valuation</span>
            </>
          )}
        </button>

      </div>

      {/* Expandable Advanced Site Options */}
      <div className="pt-3 border-t border-[#334155]">
        <button
          type="button"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white py-1 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
            {showAdvancedOptions ? 'Hide Site Infrastructure & Terrain Options' : 'Configure Road Access, Utilities & Topography'}
          </span>
          {showAdvancedOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvancedOptions && (
          <div className="mt-4 space-y-4 pt-3 border-t border-slate-800 animate-fadeIn">
            
            {/* Topography & Access Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Road Access</label>
                <select
                  value={inputs.roadAccess}
                  onChange={(e) => onChange({ roadAccess: e.target.value as RoadAccess })}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="paved_highway">Paved Main Expressway (+35%)</option>
                  <option value="paved_local">Paved Local Road (+20%)</option>
                  <option value="gravel_unpaved">Unpaved / Gravel Road (-10%)</option>
                  <option value="dirt_easement">Private Dirt Passage (-30%)</option>
                  <option value="no_direct_access">No Direct Access (-55%)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Topography Grade</label>
                <select
                  value={inputs.topography}
                  onChange={(e) => onChange({ topography: e.target.value as Topography })}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="flat">Flat Level Ground (+10%)</option>
                  <option value="gently_sloping">Gently Sloping (Baseline)</option>
                  <option value="waterfront">Waterfront / Canal Frontage (+80%)</option>
                  <option value="hilltop_views">Elevated Scenic Views (+35%)</option>
                  <option value="steep_slope">Steep Sloped Slope (-35%)</option>
                </select>
              </div>
            </div>

            {/* Utility Toggles */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Connected Infrastructure</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { key: 'hasElectricity', label: 'Electricity Grid' },
                  { key: 'hasWater', label: 'Water Connection' },
                  { key: 'hasSewer', label: 'Sewer / Drainage' },
                  { key: 'hasInternet', label: 'Fiber Internet' },
                ].map((item) => {
                  const val = (inputs as any)[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onChange({ [item.key]: !val })}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                        val
                          ? 'bg-emerald-600/15 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-[#0F172A] border-[#334155] text-slate-400'
                      }`}
                    >
                      <span className="text-[11px]">{item.label}</span>
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${val ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-700'}`}>
                        {val && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Map Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Pinpoint Boundary Map Location
              </label>
              <LandMap
                lat={inputs.lat || 31.4700}
                lng={inputs.lng || 74.4100}
                size={inputs.size}
                unit={inputs.unit}
                locationName={inputs.locationName || 'Selected Parcel'}
                onLocationChange={handleMapLocationChange}
                className="h-56 w-full rounded-xl overflow-hidden border border-[#334155]"
              />
            </div>

          </div>
        )}
      </div>

    </div>
  );
};
