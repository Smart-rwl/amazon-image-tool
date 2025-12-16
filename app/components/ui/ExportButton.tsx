'use client'; // This directive is crucial!

import { Download } from 'lucide-react';

// Define the type for the data prop for better type safety
type ExportButtonProps = {
  data: any[];
  filename: string;
};

export function ExportButton({ data, filename }: ExportButtonProps) {
  const handleExport = () => {
    if (data.length === 0) return;

    // Simple CSV creation logic
    const headers = Object.keys(data[0]).join(',');
    const csvRows = data.map(row => Object.values(row).join(','));
    const csvContent = `${headers}\n${csvRows.join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
    >
      <Download className="h-3 w-3" />
      Export CSV
    </button>
  );
}