export type Stage = 'Lead' | 'Prospect' | 'Qualified' | 'Customer';

export const STAGES: { id: Stage; label: string; color: string; bg: string; border: string; text: string; dot: string }[] = [
  {
    id: 'Lead',
    label: 'Lead',
    color: 'blue',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800/60',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  {
    id: 'Prospect',
    label: 'Prospect',
    color: 'purple',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800/60',
    text: 'text-purple-700 dark:text-purple-300',
    dot: 'bg-purple-500',
  },
  {
    id: 'Qualified',
    label: 'Qualified',
    color: 'amber',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800/60',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  {
    id: 'Customer',
    label: 'Customer',
    color: 'emerald',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800/60',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
];

export interface Contact {
  id: string;
  name: string;
  email?: string;
  company?: string;
  role?: string;
  owner?: string;
  labels: string[];
  stage: Stage;
  notes?: string;
  updatedAt: string;
}

export type ViewMode = 'table' | 'board';

export type SortField = 'name' | 'company' | 'stage' | 'owner' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface FilterOptions {
  search: string;
  stageFilter: Stage | 'all';
  ownerFilter: string | 'all';
}
