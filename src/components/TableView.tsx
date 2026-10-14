import React from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building2,
  Mail,
  FileText,
  ExternalLink,
  Plus,
} from 'lucide-react';
import type { Contact, SortField, SortDirection } from '../types/contact';
import { StageBadge, LabelBadge } from './Badge';
import { Avatar } from './Avatar';

interface TableViewProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
  sorting: { field: SortField; direction: SortDirection };
  onToggleSort: (field: SortField) => void;
  onNewContact: () => void;
  onClearFilters?: () => void;
  isFiltered?: boolean;
}

export const TableView: React.FC<TableViewProps> = ({
  contacts,
  selectedContactId,
  onSelectContact,
  sorting,
  onToggleSort,
  onNewContact,
  onClearFilters,
  isFiltered,
}) => {
  const renderSortIcon = (field: SortField) => {
    if (sorting.field !== field) {
      return <ArrowUpDown className="w-3 h-3 text-stone-300 group-hover:text-stone-500" />;
    }
    return sorting.direction === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-stone-800" />
    ) : (
      <ArrowDown className="w-3 h-3 text-stone-800" />
    );
  };

  if (contacts.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400 mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-stone-800 mb-1">No contacts found</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
          {isFiltered
            ? 'No contacts match your current search query or filter criteria.'
            : 'Your contact database is currently empty.'}
        </p>
        {isFiltered && onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border-t border-stone-200 bg-white shadow-2xs">
      <table className="w-full text-left border-collapse min-w-[980px]">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            {/* Name Column */}
            <th
              scope="col"
              onClick={() => onToggleSort('name')}
              className="py-2.5 px-4 cursor-pointer hover:bg-stone-100/70 transition-colors select-none group w-[220px]"
            >
              <div className="flex items-center gap-1.5">
                <span>Name</span>
                {renderSortIcon('name')}
              </div>
            </th>

            {/* Stage Column */}
            <th
              scope="col"
              onClick={() => onToggleSort('stage')}
              className="py-2.5 px-4 cursor-pointer hover:bg-stone-100/70 transition-colors select-none group w-[130px]"
            >
              <div className="flex items-center gap-1.5">
                <span>Stage</span>
                {renderSortIcon('stage')}
              </div>
            </th>

            {/* Company Column */}
            <th
              scope="col"
              onClick={() => onToggleSort('company')}
              className="py-2.5 px-4 cursor-pointer hover:bg-stone-100/70 transition-colors select-none group w-[180px]"
            >
              <div className="flex items-center gap-1.5">
                <span>Company</span>
                {renderSortIcon('company')}
              </div>
            </th>

            {/* Role Column */}
            <th scope="col" className="py-2.5 px-4 w-[160px] select-none">
              <span>Role</span>
            </th>

            {/* Owner Column */}
            <th
              scope="col"
              onClick={() => onToggleSort('owner')}
              className="py-2.5 px-4 cursor-pointer hover:bg-stone-100/70 transition-colors select-none group w-[150px]"
            >
              <div className="flex items-center gap-1.5">
                <span>Owner</span>
                {renderSortIcon('owner')}
              </div>
            </th>

            {/* Labels Column */}
            <th scope="col" className="py-2.5 px-4 w-[170px] select-none">
              <span>Labels</span>
            </th>

            {/* Email Column */}
            <th scope="col" className="py-2.5 px-4 w-[200px] select-none">
              <span>Email</span>
            </th>

            {/* Notes Column */}
            <th scope="col" className="py-2.5 px-4 select-none min-w-[220px]">
              <span>Notes</span>
            </th>

            {/* Actions Column */}
            <th scope="col" className="py-2.5 px-3 text-right w-[70px] select-none">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
          {contacts.map((contact) => {
            const isSelected = contact.id === selectedContactId;
            return (
              <tr
                key={contact.id}
                tabIndex={0}
                onClick={() => onSelectContact(contact.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectContact(contact.id);
                  }
                }}
                className={`group cursor-pointer transition-colors outline-none focus:bg-blue-50/50 focus:ring-1 focus:ring-blue-400 ${
                  isSelected
                    ? 'bg-blue-50/70 hover:bg-blue-50/90'
                    : 'hover:bg-stone-50/80'
                }`}
                aria-label={`Open details for ${contact.name}`}
              >
                {/* Name */}
                <td className="py-2.5 px-4 font-medium text-stone-900">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={contact.name} size="sm" />
                    <span className="font-semibold text-stone-900 group-hover:text-blue-600 transition-colors truncate">
                      {contact.name}
                    </span>
                  </div>
                </td>

                {/* Stage */}
                <td className="py-2.5 px-4 whitespace-nowrap">
                  <StageBadge stage={contact.stage} size="sm" />
                </td>

                {/* Company */}
                <td className="py-2.5 px-4">
                  {contact.company ? (
                    <div className="flex items-center gap-1.5 text-stone-800 truncate">
                      <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{contact.company}</span>
                    </div>
                  ) : (
                    <span className="text-stone-300 select-none">—</span>
                  )}
                </td>

                {/* Role */}
                <td className="py-2.5 px-4 text-stone-600">
                  {contact.role ? (
                    <span className="truncate block" title={contact.role}>
                      {contact.role}
                    </span>
                  ) : (
                    <span className="text-stone-300 select-none">—</span>
                  )}
                </td>

                {/* Owner */}
                <td className="py-2.5 px-4 whitespace-nowrap">
                  {contact.owner ? (
                    <div className="flex items-center gap-1.5">
                      <Avatar name={contact.owner} size="sm" />
                      <span className="text-stone-700">{contact.owner}</span>
                    </div>
                  ) : (
                    <span className="text-stone-400 italic">Unassigned</span>
                  )}
                </td>

                {/* Labels */}
                <td className="py-2.5 px-4">
                  {contact.labels && contact.labels.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {contact.labels.slice(0, 2).map((label) => (
                        <LabelBadge key={label} label={label} />
                      ))}
                      {contact.labels.length > 2 && (
                        <span className="text-[10px] text-stone-400 font-medium self-center">
                          +{contact.labels.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-stone-300 select-none">—</span>
                  )}
                </td>

                {/* Email */}
                <td className="py-2.5 px-4 text-stone-600">
                  {contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-stone-600 hover:text-blue-600 hover:underline truncate max-w-[190px]"
                      title={contact.email}
                    >
                      <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </a>
                  ) : (
                    <span className="text-stone-300 select-none">—</span>
                  )}
                </td>

                {/* Notes */}
                <td className="py-2.5 px-4 max-w-[260px]">
                  {contact.notes ? (
                    <p
                      className="text-stone-600 text-xs line-clamp-1 truncate"
                      title={contact.notes}
                    >
                      {contact.notes}
                    </p>
                  ) : (
                    <span className="text-stone-300 italic text-[11px] select-none">
                      No notes
                    </span>
                  )}
                </td>

                {/* Action button */}
                <td className="py-2.5 px-3 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectContact(contact.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 rounded hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-all"
                    title="Open contact details"
                    aria-label={`Open details for ${contact.name}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Quick Add row at the bottom of the table */}
      <div className="border-t border-stone-200 p-2 bg-stone-50/40">
        <button
          type="button"
          onClick={onNewContact}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Contact</span>
        </button>
      </div>
    </div>
  );
};
