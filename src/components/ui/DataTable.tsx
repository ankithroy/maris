import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { ArrowUpDown } from 'lucide-react';

export interface Column {
  key: string;
  label: string;
  render?: (val: any, row: any) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  selectedIds?: string[];
  onSelectChange?: (selectedIds: string[]) => void;
  idKey?: string;
  onRowClick?: (row: any) => void;
}

export function DataTable({ 
  columns, 
  data, 
  selectedIds = [], 
  onSelectChange, 
  idKey = 'id',
  onRowClick 
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectChange) return;
    if (e.target.checked) {
      onSelectChange(data.map((row) => row[idKey]));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectRow = (rowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSelectChange) return;
    if (selectedIds.includes(rowId)) {
      onSelectChange(selectedIds.filter((id) => id !== rowId));
    } else {
      onSelectChange([...selectedIds, rowId]);
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const allSelected = data.length > 0 && selectedIds.length === data.length;

  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-tx-secondary uppercase bg-black/40 sticky top-0 z-10 backdrop-blur-md border-b border-glass-border">
            <tr>
              {onSelectChange && (
                <th className="px-6 py-4 font-semibold tracking-wider w-12">
                  <input 
                    type="checkbox" 
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="rounded border-glass-border bg-black/40 text-cyan-acc focus:ring-cyan-acc/50 cursor-pointer" 
                  />
                </th>
              )}
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-6 py-4 font-semibold tracking-wider cursor-pointer hover:text-tx-primary transition-colors"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border">
            {sortedData.length > 0 ? (
              sortedData.map((row) => {
                const rowId = row[idKey];
                const isSelected = selectedIds.includes(rowId);
                return (
                  <tr 
                    key={rowId} 
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-cyan-acc/10' : 'hover:bg-white/5'
                    }`}
                  >
                    {onSelectChange && (
                      <td className="px-6 py-4" onClick={(e) => handleSelectRow(rowId, e)}>
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded border-glass-border bg-black/40 text-cyan-acc focus:ring-cyan-acc/50 cursor-pointer" 
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 whitespace-nowrap text-tx-secondary">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + (onSelectChange ? 1 : 0)} className="px-6 py-12 text-center text-tx-muted font-mono">
                  No anomaly records match the active criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-glass-border flex items-center justify-between text-xs text-tx-muted bg-black/20 font-mono">
        <span>Showing {sortedData.length} of {data.length} entries {selectedIds.length > 0 && `(${selectedIds.length} selected)`}</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-glass-bg hover:bg-white/10 transition-colors">Prev</button>
          <button className="px-3 py-1 rounded bg-glass-bg hover:bg-white/10 transition-colors">Next</button>
        </div>
      </div>
    </GlassCard>
  );
}
