import React, { useState } from 'react';
import { X, Plus, User, Building2, Briefcase, Mail, FileText } from 'lucide-react';
import { type Stage, STAGES, type Contact } from '../types/contact';
import { AVAILABLE_OWNERS, AVAILABLE_LABELS } from '../data/mockContacts';

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contact: Omit<Contact, 'id' | 'updatedAt'>) => void;
  defaultStage?: Stage;
}

export const CreateContactModal: React.FC<CreateContactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultStage = 'Lead',
}) => {
  const [name, setName] = useState('');
  const [stage, setStage] = useState<Stage>(defaultStage);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [owner, setOwner] = useState(AVAILABLE_OWNERS[0]);
  const [notes, setNotes] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      stage,
      company: company.trim(),
      role: role.trim(),
      email: email.trim(),
      owner: owner === 'Unassigned' ? '' : owner,
      notes: notes.trim(),
      labels: selectedLabels,
    });

    // Reset and close
    setName('');
    setCompany('');
    setRole('');
    setEmail('');
    setNotes('');
    setSelectedLabels([]);
    onClose();
  };

  const toggleLabel = (label: string) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden z-10 animate-fade-in">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Add New Contact</h3>
              <p className="text-[11px] text-stone-500">Record a new business contact into the shared database</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name & Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Liam Foster"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 focus:bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as Stage)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 focus:bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Company</label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 focus:bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Role</label>
              <div className="relative">
                <Briefcase className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Head of Engineering"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 focus:bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Email & Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. liam@acme.com"
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 focus:bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Owner</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-stone-50 focus:bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {AVAILABLE_OWNERS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Labels</label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_LABELS.map((label) => {
                const isSelected = selectedLabels.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleLabel(label)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected ? `✓ ${label}` : `+ ${label}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Initial context, introductory call notes, or referral source..."
              className="w-full px-3 py-2 text-xs bg-stone-50 focus:bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-stone-200 disabled:text-stone-400 shadow-xs"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
