'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

// This is a simplified placeholder. A real implementation would use a library like `react-day-picker` or `date-fns`.
export function DateRangePicker() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700"
            >
                <Calendar className="h-4 w-4" />
                Last 30 Days
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-lg z-10">
                    <p className="text-xs text-slate-400">Date range options would go here.</p>
                    {/* Add date picker inputs here */}
                </div>
            )}
        </div>
    );
}