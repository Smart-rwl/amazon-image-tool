'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { TOOLS, TOOL_GROUPS, ToolGroupId } from '../config/tools.config';

const GROUP_ORDER: ToolGroupId[] = ['calculators', 'finance', 'listing', 'operations'];

export default function ToolsIndexPage() {
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<ToolGroupId | 'all'>('all');

  const filteredTools = useMemo(() => {
    const q = query.toLowerCase();
    return TOOLS.filter(tool => {
      const matchesGroup = activeGroup === 'all' || tool.group === activeGroup;
      const matchesSearch =
        !q ||
        tool.label.toLowerCase().includes(q) ||
        tool.slug.toLowerCase().includes(q) ||
        (tool.desc && tool.desc.toLowerCase().includes(q));
      return matchesGroup && matchesSearch;
    });
  }, [query, activeGroup]);

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 bg-slate-950 text-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Smart Seller Toolbox
            </h1>
            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-2xl">
              All your calculators, listing helpers and operational tools in one control center.
            </p>
          </div>

          {/* Search */}
          <div className="w-full md:w-80">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tools (e.g. PPC, FNSKU, keyword)…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <span className="absolute right-3 top-2.5 text-[11px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                Ctrl + F also works
              </span>
            </div>
          </div>
        </div>

        {/* Group tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton
            label="All tools"
            active={activeGroup === 'all'}
            onClick={() => setActiveGroup('all')}
          />
          {GROUP_ORDER.map(groupId => (
            <TabButton
              key={groupId}
              label={TOOL_GROUPS[groupId]}
              active={activeGroup === groupId}
              onClick={() => setActiveGroup(groupId)}
            />
          ))}
        </div>

        {/* Tool grid */}
        {filteredTools.length === 0 ? (
          <div className="mt-10 text-center text-slate-500 text-sm">
            No tools match your search. Try a different keyword.
          </div>
        ) : (
          <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map(tool => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="group rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-900 hover:border-indigo-500/70 transition-colors p-4 flex flex-col justify-between shadow-sm hover:shadow-lg hover:shadow-indigo-900/30"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h2 className="font-semibold text-sm md:text-base text-slate-50 group-hover:text-white">
                      {tool.label}
                    </h2>
                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {TOOL_GROUPS[tool.group]}
                    </span>
                  </div>
                  {tool.desc && (
                    <p className="text-xs md:text-sm text-slate-400 line-clamp-2">
                      {tool.desc}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono opacity-70">/{tool.slug}</span>
                  <span className="inline-flex items-center gap-1 text-indigo-400 group-hover:gap-1.5 transition-all">
                    Open tool
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5h10m0 0v10m0-10L9 15"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Small tab button component */
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs md:text-sm px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? 'bg-indigo-600 border-indigo-500 text-white'
          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
      }`}
    >
      {label}
    </button>
  );
}
