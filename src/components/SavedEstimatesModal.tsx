import React, { useState } from 'react';
import { SavedEstimate, Currency as CurrencyType } from '../types';
import { X, Trash2, Download, ExternalLink, Scale, Check } from 'lucide-react';

interface SavedEstimatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedEstimate[];
  onSelect: (record: SavedEstimate) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  currency: CurrencyType;
}

export const SavedEstimatesModal: React.FC<SavedEstimatesModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onSelect,
  onDelete,
  onClearAll,
  currency
}) => {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showComparisonView, setShowComparisonView] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(i => i !== id));
    } else {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const handleExportCSV = () => {
    if (savedList.length === 0) return;
    const headers = ['Title', 'Date', 'Location', 'Size', 'Unit', 'Zoning', 'Estimated Value', 'Price Per Acre'];
    const rows = savedList.map(s => [
      `"${s.title.replace(/"/g, '""')}"`,
      s.createdAt.split('T')[0],
      `"${s.inputs.locationName.replace(/"/g, '""')}"`,
      s.inputs.size,
      s.inputs.unit,
      s.inputs.zoning,
      s.result.estimatedValue,
      s.result.pricePerUnit.pricePerAcre
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TerraVal_Saved_Land_Estimates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const comparedRecords = savedList.filter(s => selectedForCompare.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
              Saved Land Evaluations ({savedList.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review past appraisals, compare parcels side-by-side, or export data.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {savedList.length > 0 && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                Export CSV
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {savedList.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <p className="text-sm font-semibold">No saved records yet.</p>
              <p className="text-xs">Run a land price estimate and click "Save Record" to bookmark evaluations.</p>
            </div>
          ) : showComparisonView ? (
            
            /* Side-by-side comparison matrix */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowComparisonView(false)}
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  &larr; Back to List View
                </button>
                <p className="text-xs font-semibold text-slate-300">Comparing {comparedRecords.length} Properties</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {comparedRecords.map(rec => (
                  <div key={rec.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <p className="font-bold text-sm text-white truncate">{rec.title}</p>
                    <div className="border-t border-slate-800/80 pt-2 space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Estimated Value</span>
                        <span className="text-lg font-extrabold text-emerald-400">${rec.result.estimatedValue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Price / Acre</span>
                        <span className="font-semibold text-slate-200">${rec.result.pricePerUnit.pricePerAcre.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Parcel Size</span>
                        <span className="font-semibold text-slate-200">{rec.inputs.size} {rec.inputs.unit}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Zoning</span>
                        <span className="font-semibold text-slate-200 capitalize">{rec.inputs.zoning.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Valuation Score</span>
                        <span className="font-bold text-emerald-400">{rec.result.valuationScore} / 100 ({rec.result.investmentGrade})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          ) : (

            /* Saved Records List */
            <div className="space-y-3">
              {selectedForCompare.length >= 2 && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span>{selectedForCompare.length} properties selected for side-by-side comparison</span>
                  <button
                    type="button"
                    onClick={() => setShowComparisonView(true)}
                    className="flex items-center gap-1.5 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-md"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    Compare Side-by-Side
                  </button>
                </div>
              )}

              {savedList.map(item => {
                const isChecked = selectedForCompare.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleCompare(item.id)}
                        className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 hover:border-slate-500'
                        }`}
                        title="Select to Compare"
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-slate-100">{item.title}</p>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {item.inputs.size} {item.inputs.unit} &bull; {item.inputs.zoning.replace('_', ' ')} &bull; {item.inputs.topography.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-base font-extrabold text-emerald-400">
                          ${item.result.estimatedValue.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          ${item.result.pricePerUnit.pricePerAcre.toLocaleString()}/acre
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(item);
                            onClose();
                          }}
                          className="p-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="p-2 bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          )}

        </div>

        {/* Modal Footer */}
        {savedList.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:underline font-semibold"
            >
              Clear All Saved Records
            </button>

            <p className="text-[11px] text-slate-500">Records persisted in browser storage</p>
          </div>
        )}

      </div>
    </div>
  );
};
