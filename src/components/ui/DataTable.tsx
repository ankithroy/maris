import React from 'react';
import { GlassCard } from './GlassCard';

interface Column {
  key: string;
  label: string;
  render?: (val: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
}

export function DataTable({ columns, data }: DataTableProps) {
  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-tx-secondary uppercase bg-black/20 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">
                <input type="checkbox" className="rounded border-glass-border bg-black/20 text-cyan-acc focus:ring-cyan-acc/50" />
              </th>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 font-semibold tracking-wider cursor-pointer hover:text-tx-primary transition-colors">
                  <div className="flex items-center gap-2">{col.label}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border">
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded border-glass-border bg-black/20 text-cyan-acc focus:ring-cyan-acc/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-tx-secondary">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-glass-border flex items-center justify-between text-xs text-tx-muted bg-black/20">
        <span>Showing 1 to {data.length} of {data.length} entries</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-glass-bg hover:bg-white/10 transition-colors">Prev</button>
          <button className="px-3 py-1 rounded bg-glass-bg hover:bg-white/10 transition-colors">Next</button>
        </div>
      </div>
    </GlassCard>
  );
}
