import React from 'react';
import {
  Table2,
  Kanban,
  Search,
  Filter,
  Plus,
  RotateCcw,
  Users,
  Layers,
} from 'lucide-react';
import { type ViewMode, type Stage, STAGES } from '../types/contact';
import { AVAILABLE_OWNERS } from '../data/mockContacts';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalContacts: number;
  filteredCount: number;
  search: string;
  onSearchChange: (query: string) => void;
  stageFilter: Stage | 'all';
  onStageFilterChange: (stage: Stage | 'all') => void;
  ownerFilter: string | 'all';
  onOwnerFilterChange: (owner: string | 'all') => void;
  onNewContact: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  totalContacts,
  filteredCount,
  search,
  onSearchChange,
  stageFilter,
  onStageFilterChange,
  ownerFilter,
  onOwnerFilterChange,
  onNewContact,
  onResetData,
}) => {
  const isFiltered = search !== '' || stageFilter !== 'all' || ownerFilter !== 'all';

  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
      {/* Top bar: Notion database title and stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shadow-xs">
              <Users className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900 tracking-tight">Business Contacts</h1>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  {totalContacts} records
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Shared database prototype with synchronized table & board views
              </p>
            </div>
          </div>

          {/* Action buttons: Reset & Add */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200 transition-colors"
              title="Reset contacts back to initial mock dataset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            <button
              type="button"
              onClick={onNewContact}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Contact</span>
            </button>
          </div>
        </div>

        {/* Tab switcher & Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-4 pt-2 border-t border-stone-100">
          {/* Notion-style View Tabs */}
          <div className="flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-lg border border-stone-200/80 w-fit">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              aria-label="Table View"
              aria-pressed={viewMode === 'table'}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('board')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'board'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              aria-label="Board View"
              aria-pressed={viewMode === 'board'}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name, company, notes..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 hover:bg-white focus:bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-stone-800 placeholder-stone-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Stage Filter */}
            <div className="relative">
              <select
                value={stageFilter}
                onChange={(e) => onStageFilterChange(e.target.value as Stage | 'all')}
                className="appearance-none bg-stone-50 hover:bg-white border border-stone-200 rounded-md pl-7 pr-7 py-1.5 text-xs text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Stages</option>
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Layers className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              <span className="text-[10px] text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">▼</span>
            </div>

            {/* Owner Filter */}
            <div className="relative">
              <select
                value={ownerFilter}
                onChange={(e) => onOwnerFilterChange(e.target.value)}
                className="appearance-none bg-stone-50 hover:bg-white border border-stone-200 rounded-md pl-7 pr-7 py-1.5 text-xs text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Owners</option>
                {AVAILABLE_OWNERS.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              <span className="text-[10px] text-stone-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">▼</span>
            </div>

            {isFiltered && (
              <span className="text-xs text-stone-500 pl-1">
                Showing {filteredCount} of {totalContacts}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
