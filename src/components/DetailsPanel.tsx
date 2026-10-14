import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Building2,
  Mail,
  User,
  Briefcase,
  Tag,
  Check,
  AlertCircle,
  FileText,
  Trash2,
} from 'lucide-react';
import { type Contact, type Stage, STAGES } from '../types/contact';
import { AVAILABLE_OWNERS, AVAILABLE_LABELS } from '../data/mockContacts';
import { Avatar } from './Avatar';

interface DetailsPanelProps {
  contact: Contact | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Contact>) => void;
  onDelete?: (id: string) => void;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({
  contact,
  onClose,
  onSave,
  onDelete,
}) => {
  // Form draft state
  const [draftName, setDraftName] = useState('');
  const [draftStage, setDraftStage] = useState<Stage>('Lead');
  const [draftNotes, setDraftNotes] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [draftCompany, setDraftCompany] = useState('');
  const [draftRole, setDraftRole] = useState('');
  const [draftOwner, setDraftOwner] = useState('');
  const [draftLabels, setDraftLabels] = useState<string[]>([]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Sync draft state with contact prop whenever selected contact changes
  useEffect(() => {
    if (contact) {
      setDraftName(contact.name || '');
      setDraftStage(contact.stage);
      setDraftNotes(contact.notes || '');
      setDraftEmail(contact.email || '');
      setDraftCompany(contact.company || '');
      setDraftRole(contact.role || '');
      setDraftOwner(contact.owner || 'Unassigned');
      setDraftLabels(contact.labels || []);
      setSavedSuccess(false);
      setShowDiscardConfirm(false);
    }
  }, [contact]);

  // Compute dirty state
  const isDirty = Boolean(
    contact &&
      (draftName !== (contact.name || '') ||
        draftStage !== contact.stage ||
        draftNotes !== (contact.notes || '') ||
        draftEmail !== (contact.email || '') ||
        draftCompany !== (contact.company || '') ||
        draftRole !== (contact.role || '') ||
        draftOwner !== (contact.owner || 'Unassigned') ||
        JSON.stringify(draftLabels) !== JSON.stringify(contact.labels || []))
  );

  // Keyboard shortcut listener (Esc to close, Ctrl/Cmd + Enter to save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!contact) return;

      if (e.key === 'Escape') {
        if (showDiscardConfirm) {
          setShowDiscardConfirm(false);
        } else if (isDirty) {
          setShowDiscardConfirm(true);
        } else {
          onClose();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contact, isDirty, showDiscardConfirm, draftName, draftStage, draftNotes, draftEmail, draftCompany, draftRole, draftOwner, draftLabels]);

  if (!contact) return null;

  const handleSave = () => {
    onSave(contact.id, {
      name: draftName.trim() || contact.name,
      stage: draftStage,
      notes: draftNotes,
      email: draftEmail.trim(),
      company: draftCompany.trim(),
      role: draftRole.trim(),
      owner: draftOwner === 'Unassigned' ? '' : draftOwner,
      labels: draftLabels,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  const handleCancel = () => {
    // Reset drafts back to contact values
    setDraftName(contact.name || '');
    setDraftStage(contact.stage);
    setDraftNotes(contact.notes || '');
    setDraftEmail(contact.email || '');
    setDraftCompany(contact.company || '');
    setDraftRole(contact.role || '');
    setDraftOwner(contact.owner || 'Unassigned');
    setDraftLabels(contact.labels || []);
    setShowDiscardConfirm(false);
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const toggleLabel = (label: string) => {
    if (draftLabels.includes(label)) {
      setDraftLabels(draftLabels.filter((l) => l !== label));
    } else {
      setDraftLabels([...draftLabels, label]);
    }
  };

  const currentStageMeta = STAGES.find((s) => s.id === draftStage) || STAGES[0];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/30 backdrop-blur-[2px] z-40 transition-opacity animate-fade-in"
        onClick={handleCloseAttempt}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-details-title"
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-stone-200 shadow-2xl z-50 flex flex-col animate-slide-in-right overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Contact Record
            </span>
            {isDirty && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved changes
              </span>
            )}
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Check className="w-3 h-3 text-emerald-600" />
                Saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
                    onDelete(contact.id);
                  }
                }}
                className="p-1.5 rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete Contact"
                aria-label="Delete Contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleCloseAttempt}
              className="p-1.5 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="Close panel (Esc)"
              aria-label="Close details panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Discard Confirmation Banner */}
        {showDiscardConfirm && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You have unsaved changes. Discard them?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="px-2.5 py-1 rounded bg-white border border-amber-300 font-medium hover:bg-amber-100/50"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  handleCancel();
                  onClose();
                }}
                className="px-2.5 py-1 rounded bg-amber-600 text-white font-medium hover:bg-amber-700"
              >
                Discard & Close
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Header Title with Avatar & Name input */}
          <div className="flex items-start gap-3">
            <Avatar name={draftName || contact.name} size="lg" className="mt-1" />
            <div className="flex-1">
              <label htmlFor="contact-name-input" className="sr-only">Contact Name</label>
              <input
                id="contact-name-input"
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Full Name"
                className="text-xl font-bold text-stone-900 w-full border-b border-transparent hover:border-stone-200 focus:border-blue-500 focus:outline-none py-0.5 transition-colors"
              />
              <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                <span>Last updated {new Date(contact.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Primary Fields (Stage & Notes first as highlighted in requirements) */}
          <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200/80 space-y-4">
            {/* Stage Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${currentStageMeta.dot}`} />
                  Stage (Kanban Column)
                </label>
                <span className="text-[11px] text-stone-400">Determines board placement</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STAGES.map((s) => {
                  const isSelected = draftStage === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setDraftStage(s.id)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border text-xs font-medium transition-all ${
                        isSelected
                          ? `${s.bg} ${s.border} ${s.text} font-bold ring-2 ring-blue-500/20 shadow-xs`
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100 hover:border-stone-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes Field (Multi-line text) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="contact-notes-input"
                  className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-stone-400" />
                  Notes
                </label>
                <span className="text-[11px] text-stone-400">Plain text field</span>
              </div>
              <textarea
                ref={notesTextareaRef}
                id="contact-notes-input"
                rows={4}
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                placeholder="Add meeting notes, call summaries, or deal context..."
                className="w-full text-xs text-stone-800 bg-white border border-stone-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 leading-relaxed placeholder-stone-400 resize-y transition-colors"
              />
            </div>
          </div>

          {/* Additional Contact Properties */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Profile Details
            </h4>

            {/* Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  Company
                </label>
                <input
                  type="text"
                  value={draftCompany}
                  onChange={(e) => setDraftCompany(e.target.value)}
                  placeholder="e.g. Acme Corp (or leave empty)"
                  className="w-full text-xs text-stone-800 bg-stone-50/50 hover:bg-white focus:bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-stone-400" />
                  Role
                </label>
                <input
                  type="text"
                  value={draftRole}
                  onChange={(e) => setDraftRole(e.target.value)}
                  placeholder="e.g. VP Engineering (or leave empty)"
                  className="w-full text-xs text-stone-800 bg-stone-50/50 hover:bg-white focus:bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Email & Owner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  Email
                </label>
                <input
                  type="email"
                  value={draftEmail}
                  onChange={(e) => setDraftEmail(e.target.value)}
                  placeholder="e.g. name@company.com (or empty)"
                  className="w-full text-xs text-stone-800 bg-stone-50/50 hover:bg-white focus:bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  Account Owner
                </label>
                <select
                  value={draftOwner}
                  onChange={(e) => setDraftOwner(e.target.value)}
                  className="w-full text-xs text-stone-800 bg-stone-50/50 hover:bg-white focus:bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                >
                  {AVAILABLE_OWNERS.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Labels Multi-Select */}
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-stone-400" />
                Labels & Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_LABELS.map((label) => {
                  const isTagged = draftLabels.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleLabel(label)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                        isTagged
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                          : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                      }`}
                    >
                      {isTagged ? `✓ ${label}` : `+ ${label}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Clear Sticky Action Footer (Save & Cancel) */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="text-[11px] text-stone-400">
            <span className="hidden sm:inline">Shortcuts: </span>
            <kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-[10px] text-stone-500">Esc</kbd>
            <span className="text-stone-400 mx-1">cancel</span>
            <span className="text-stone-300">•</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-[10px] text-stone-500 ml-1">Ctrl+Enter</kbd>
            <span className="text-stone-400 ml-1">save</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!isDirty}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                isDirty
                  ? 'border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
                  : 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
              title="Reset unsaved edits to previous state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                isDirty
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-98'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
              title="Save all changes to contact record"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
