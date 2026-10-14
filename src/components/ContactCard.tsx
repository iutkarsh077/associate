import React, { useState } from 'react';
import {
  Building2,
  FileText,
  GripVertical,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { type Contact, type Stage, STAGES } from '../types/contact';
import { LabelBadge } from './Badge';
import { Avatar } from './Avatar';

interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onStageChange: (id: string, newStage: Stage) => void;
  onDragStart: (e: React.DragEvent, contactId: string) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  isSelected,
  onSelect,
  onStageChange,
  onDragStart,
}) => {
  const [showStageMenu, setShowStageMenu] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, contact.id)}
      onClick={() => onSelect(contact.id)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(contact.id);
        }
      }}
      className={`group relative bg-white rounded-lg border p-3.5 shadow-2xs hover:shadow-sm transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/50 ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20'
          : 'border-stone-200/90 hover:border-stone-300'
      }`}
      aria-label={`Contact card for ${contact.name}`}
    >
      {/* Top row: Name & Quick Stage menu */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <Avatar name={contact.name} size="sm" />
          <div>
            <h4 className="text-xs font-bold text-stone-900 group-hover:text-blue-600 transition-colors">
              {contact.name}
            </h4>
            {contact.role ? (
              <p className="text-[11px] text-stone-500 truncate max-w-[170px]" title={contact.role}>
                {contact.role}
              </p>
            ) : null}
          </div>
        </div>

        {/* Drag handle & Quick Move menu */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          {/* Quick Stage Change button */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowStageMenu(!showStageMenu);
              }}
              className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Move to another stage"
              aria-label="Move to another stage"
              aria-expanded={showStageMenu}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showStageMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStageMenu(false);
                  }}
                />
                <div
                  className="absolute right-0 top-full mt-1 w-36 bg-white border border-stone-200 rounded-lg shadow-lg z-40 py-1 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2.5 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    Move to Stage
                  </div>
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={s.id === contact.stage}
                      onClick={() => {
                        onStageChange(contact.id, s.id);
                        setShowStageMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 flex items-center justify-between text-xs transition-colors ${
                        s.id === contact.stage
                          ? 'bg-stone-50 text-stone-400 cursor-default'
                          : 'hover:bg-blue-50 text-stone-700 hover:text-blue-600'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        <span>{s.label}</span>
                      </span>
                      {s.id !== contact.stage && <ArrowRight className="w-3 h-3 opacity-60" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div
            className="p-1 text-stone-400 cursor-grab active:cursor-grabbing hover:text-stone-600"
            title="Drag to reposition or change stage"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Company row if available */}
      {contact.company && (
        <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mb-2 truncate">
          <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="truncate">{contact.company}</span>
        </div>
      )}

      {/* Labels row */}
      {contact.labels && contact.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {contact.labels.map((label) => (
            <LabelBadge key={label} label={label} />
          ))}
        </div>
      )}

      {/* Notes snippet preview if available */}
      {contact.notes ? (
        <div className="bg-stone-50 rounded p-2 mb-2.5 border border-stone-100">
          <div className="flex items-start gap-1.5">
            <FileText className="w-3 h-3 text-stone-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
              {contact.notes}
            </p>
          </div>
        </div>
      ) : null}

      {/* Footer: Owner and missing info hints */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500">
        <div className="flex items-center gap-1.5">
          {contact.owner ? (
            <>
              <Avatar name={contact.owner} size="sm" />
              <span className="truncate max-w-[110px] text-stone-700">{contact.owner}</span>
            </>
          ) : (
            <span className="text-stone-400 italic">Unassigned</span>
          )}
        </div>

        {/* Optional field status dot if any required contact method is present */}
        {contact.email ? (
          <span className="text-[10px] text-stone-400 truncate max-w-[120px]" title={contact.email}>
            {contact.email}
          </span>
        ) : (
          <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            No email
          </span>
        )}
      </div>
    </div>
  );
};
