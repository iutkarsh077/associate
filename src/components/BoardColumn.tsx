import React, { useState } from 'react';
import { Plus, Inbox } from 'lucide-react';
import { type Contact, type Stage, STAGES } from '../types/contact';
import { ContactCard } from './ContactCard';

interface BoardColumnProps {
  stage: Stage;
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
  onStageChange: (id: string, newStage: Stage) => void;
  onDragStart: (e: React.DragEvent, contactId: string) => void;
  onDropContact: (targetStage: Stage) => void;
  onAddContactToStage: (stage: Stage) => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({
  stage,
  contacts,
  selectedContactId,
  onSelectContact,
  onStageChange,
  onDragStart,
  onDropContact,
  onAddContactToStage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const meta = STAGES.find((s) => s.id === stage) || STAGES[0];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropContact(stage);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col bg-stone-100/70 rounded-xl p-3 border transition-all duration-150 min-w-[280px] w-full max-w-sm ${
        isDragOver
          ? 'border-blue-400 bg-blue-50/50 shadow-md ring-2 ring-blue-400/20'
          : 'border-stone-200/80 hover:border-stone-300'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
          <h3 className="text-xs font-bold text-stone-800 tracking-tight">{stage}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              contacts.length > 0
                ? 'bg-white text-stone-700 border border-stone-200 shadow-2xs'
                : 'bg-stone-200/70 text-stone-500'
            }`}
          >
            {contacts.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddContactToStage(stage)}
          className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          title={`Add contact to ${stage}`}
          aria-label={`Add contact to ${stage}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards container */}
      <div className="flex-1 flex flex-col gap-2.5 min-h-[160px]">
        {contacts.length === 0 ? (
          /* Empty board group state as requested in prompt */
          <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300/80 rounded-lg text-center bg-white/40">
            <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-2">
              <Inbox className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-semibold text-stone-700 mb-0.5">
              No contacts in {stage}
            </h4>
            <p className="text-[11px] text-stone-400 max-w-[200px] mb-3 leading-relaxed">
              Drag cards here from other columns or update stage in the details panel.
            </p>
            <button
              type="button"
              onClick={() => onAddContactToStage(stage)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 shadow-2xs transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add to {stage}</span>
            </button>
          </div>
        ) : (
          contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isSelected={contact.id === selectedContactId}
              onSelect={onSelectContact}
              onStageChange={onStageChange}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>

      {/* Quick Add footer button if column is not empty */}
      {contacts.length > 0 && (
        <button
          type="button"
          onClick={() => onAddContactToStage(stage)}
          className="mt-2.5 py-1.5 px-2 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Contact</span>
        </button>
      )}
    </div>
  );
};
