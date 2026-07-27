'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { HiDownload } from 'react-icons/hi';

interface ExcelExportProps {
  data?: Record<string, any[]>;
  filename: string;
  sheets: { name: string; data: any[]; columns: string[] }[];
}

function autoFitColumns(worksheet: XLSX.WorkSheet, headers: string[]) {
  const colWidths = headers.map((header, i) => {
    const cell = XLSX.utils.encode_cell({ r: 0, c: i });
    return Math.max(header.length + 4, 12);
  });
  worksheet['!cols'] = colWidths.map(wch => ({ wch }));
}

function applyHeaderStyle(worksheet: XLSX.WorkSheet, range: XLSX.Range) {
  if (!worksheet['!rows']) worksheet['!rows'] = [];
  worksheet['!rows'][0] = { hpx: 24 };
}

export default function ExcelExport({ filename, sheets }: ExcelExportProps) {
  const [exporting, setExporting] = useState(false);

  const exportToExcel = () => {
    setExporting(true);
    try {
      const wb = XLSX.utils.book_new();

      sheets.forEach(sheet => {
        const headers = sheet.columns;
        const rows = sheet.data.map(row =>
          headers.map(col => row[col] ?? '')
        );

        const dataWithHeaders = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);

        const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
        autoFitColumns(ws, headers);
        applyHeaderStyle(ws, range);

        for (let R = range.s.r; R <= range.e.r; R++) {
          for (let C = range.s.c; C <= range.e.c; C++) {
            const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
            if (!ws[cellRef]) continue;
            ws[cellRef].s = {
              font: {
                bold: R === 0,
                color: R === 0 ? { rgb: 'FFFFFF' } : { rgb: '333333' },
              },
              fill: {
                fgColor: R === 0
                  ? { rgb: '2563EB' }
                  : R % 2 === 1
                    ? { rgb: 'F8FAFC' }
                    : { rgb: 'FFFFFF' },
              },
              border: {
                top: { style: 'thin', color: { rgb: 'D1D5DB' } },
                bottom: { style: 'thin', color: { rgb: 'D1D5DB' } },
                left: { style: 'thin', color: { rgb: 'D1D5DB' } },
                right: { style: 'thin', color: { rgb: 'D1D5DB' } },
              },
              alignment: { vertical: 'center', horizontal: 'left', wrapText: false },
            };
          }
        }

        XLSX.utils.book_append_sheet(wb, ws, sheet.name.slice(0, 31));
      });

      XLSX.writeFile(wb, `${filename}.xlsx`);
    } finally {
      setExporting(false);
    }
  };

  const exportToCsv = () => {
    const activeSheet = sheets[0];
    if (!activeSheet) return;
    const headers = activeSheet.columns;
    const rows = activeSheet.data.map(row =>
      headers.map(col => {
        const val = row[col] ?? '';
        const str = String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      }).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportToExcel}
        disabled={exporting}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        <HiDownload className="w-4 h-4" />
        {exporting ? 'Exporting...' : 'Export Excel'}
      </button>
      <button
        onClick={exportToCsv}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-300"
      >
        <HiDownload className="w-4 h-4" />
        Export CSV
      </button>
    </div>
  );
}
