'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { HiUpload, HiX } from 'react-icons/hi';

interface ExcelImportProps {
  onImport: (data: Record<string, any[][]>) => void;
}

export default function ExcelImport({ onImport }: ExcelImportProps) {
  const [showModal, setShowModal] = useState(false);
  const [parsedData, setParsedData] = useState<Record<string, any[][]>>({});
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });

        const result: Record<string, any[][]> = {};
        const names: string[] = [];

        wb.SheetNames.forEach(name => {
          const ws = wb.Sheets[name];
          const jsonData = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '' });
          if (jsonData.length > 0) {
            result[name] = jsonData;
            names.push(name);
          }
        });

        if (names.length === 0) {
          setError('No sheets with data found in the file.');
          return;
        }

        setParsedData(result);
        setSheetNames(names);
        setActiveTab(0);
        setShowModal(true);
      } catch {
        setError('Failed to parse the file. Please ensure it is a valid .xlsx or .xls file.');
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = () => {
    onImport(parsedData);
    setShowModal(false);
    resetState();
  };

  const resetState = () => {
    setParsedData({});
    setSheetNames([]);
    setActiveTab(0);
    setError(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentSheetData = sheetNames[activeTab] ? parsedData[sheetNames[activeTab]] : [];
  const previewRows = currentSheetData.slice(0, 10);

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <HiUpload className="w-4 h-4" />
        Import Excel
      </button>

      {error && (
        <div className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-600">&times;</button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Import Preview</h2>
                <p className="text-xs text-slate-500 mt-0.5">{fileName}</p>
              </div>
              <button
                onClick={() => { setShowModal(false); resetState(); }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-slate-200 px-6">
              {sheetNames.map((name, idx) => (
                <button
                  key={name}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    idx === activeTab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-6">
              {previewRows.length > 0 ? (
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      {previewRows[0].map((cell: any, i: number) => (
                        <th
                          key={i}
                          className="text-left px-3 py-2 bg-blue-600 text-white font-semibold text-xs border border-blue-700 sticky top-0"
                        >
                          {cell || `Column ${i + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.slice(1).map((row: any[], ri: number) => (
                      <tr key={ri} className={ri % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                        {row.map((cell: any, ci: number) => (
                          <td key={ci} className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs">
                            {String(cell ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-sm text-slate-400 text-center py-8">No data in this sheet.</div>
              )}

              {currentSheetData.length > 10 && (
                <div className="mt-3 text-xs text-slate-400 text-center">
                  Showing first 10 of {currentSheetData.length} rows
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => { setShowModal(false); resetState(); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
