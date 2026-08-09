import React from 'react';
import { Layers, ChevronDown, Smartphone, User, Globe, RotateCcw } from 'lucide-react';
import { Currency as CurrencyType, LandUnit } from '../types';

interface HeaderProps {
  currency: CurrencyType;
  onCurrencyChange: (c: CurrencyType) => void;
  unit: LandUnit;
  onUnitChange: (u: LandUnit) => void;
  savedCount: number;
  onOpenRecentValuations: () => void;
  onOpenPwaModal: () => void;
  onOpenLogInModal: () => void;
  onReset: () => void;
  activeNavSection: string;
  onNavClick: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  unit,
  onUnitChange,
  savedCount,
  onOpenRecentValuations,
  onOpenPwaModal,
  onOpenLogInModal,
  onReset,
  activeNavSection,
  onNavClick,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0F172A] border-b border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Top-Left: Minimalist "TerraVal" logo with subtle geometric icon */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer" 
          onClick={onReset}
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              TerraVal
            </span>
          </div>
        </div>

        {/* Center: Standard Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            type="button"
            onClick={() => onNavClick('tool')}
            className={`hover:text-white transition-colors ${
              activeNavSection === 'tool' ? 'text-emerald-400 font-bold border-b-2 border-emerald-500 py-4' : ''
            }`}
          >
            Valuation Tool
          </button>
          <button
            type="button"
            onClick={() => onNavClick('market')}
            className={`hover:text-white transition-colors ${
              activeNavSection === 'market' ? 'text-emerald-400 font-bold border-b-2 border-emerald-500 py-4' : ''
            }`}
          >
            Market Data
          </button>
          <button
            type="button"
            onClick={onOpenRecentValuations}
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Recent Valuations</span>
            {savedCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onOpenPwaModal}
            className="hover:text-white transition-colors flex items-center gap-1 text-slate-400"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mobile App</span>
          </button>
        </nav>

        {/* Top-Right Controls & Solid Log In Button */}
        <div className="flex items-center gap-3">
          
          {/* Currency Toggle */}
          <div className="relative inline-block text-left">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyType)}
              className="bg-[#1E293B] border border-[#334155] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="PKR">Rs. PKR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Unit Toggle */}
          <div className="hidden lg:flex items-center bg-[#1E293B] border border-[#334155] rounded-lg p-0.5 text-xs font-medium">
            {(['kanal', 'marla', 'acre', 'sqft', 'hectare'] as LandUnit[]).map((u) => (
              <button
                key={u}
                onClick={() => onUnitChange(u)}
                className={`px-2 py-1 rounded capitalize transition-all ${
                  unit === u
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {u === 'sqft' ? 'Sq Ft' : u}
              </button>
            ))}
          </div>

          {/* Solid Log In Button */}
          <button
            type="button"
            onClick={onOpenLogInModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <User className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>

        </div>

      </div>
    </header>
  );
};
