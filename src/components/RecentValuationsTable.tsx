import React from 'react';
import { SavedEstimate, Currency as CurrencyType } from '../types';
import { Trash2, ExternalLink, Calendar, MapPin, Database, Clock, RefreshCw } from 'lucide-react';
import { USD_TO_PKR_RATE } from '../utils/valuationEngine';

interface RecentValuationsTableProps {
  history: SavedEstimate[];
  currency: CurrencyType;
  onSelect: (record: SavedEstimate) => void;
  onDelete: (id: string) => void;
  onRefresh?: () => void;
}

export const RecentValuationsTable: React.FC<RecentValuationsTableProps> = ({
  history,
  currency,
  onSelect,
  onDelete,
  onRefresh,
}) => {
  const formatValue = (usdVal: number, recordCurrency?: CurrencyType) => {
    const selectedCurrency = currency || 'PKR';
    if (selectedCurrency === 'PKR') {
      const pkrVal = Math.round(usdVal * USD_TO_PKR_RATE);
      return `Rs. ${pkrVal.toLocaleString()}`;
    }
    return `$${Math.round(usdVal).toLocaleString()}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            <h3 className="text-base font-bold text-white font-sans">
              Recent Valuations (Last 15 Days)
            </h3>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-md border border-slate-700">
              {history.length} Saved
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Persisted automatically for 15 days in the server database for easy comparison.
          </p>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            Sync DB
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10 text-slate-500 space-y-2">
          <Clock className="w-8 h-8 mx-auto text-slate-600" />
          <p className="text-xs font-medium">No saved valuations recorded yet.</p>
          <p className="text-[11px] text-slate-600">
            Calculate a valuation above to store history in the 15-day database.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Location</th>
                <th className="pb-3 px-3">Area Size</th>
                <th className="pb-3 px-3">Property Type</th>
                <th className="pb-3 px-3 text-right">Estimated Value</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {history.map((record) => {
                const formattedDate = new Date(record.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="py-3 px-3 text-slate-400 font-medium whitespace-nowrap">
                      {formattedDate}
                    </td>

                    <td className="py-3 px-3 text-slate-200 font-semibold max-w-[180px] truncate">
                      {record.inputs.locationName || 'Unspecified Parcel'}
                    </td>

                    <td className="py-3 px-3 text-slate-300 font-medium whitespace-nowrap">
                      {record.inputs.size} {record.inputs.unit}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {record.inputs.propertyType || 'Residential'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-emerald-400 whitespace-nowrap">
                      {formatValue(record.result.estimatedValue, record.currency)}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelect(record)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-all"
                          title="View Details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(record.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
