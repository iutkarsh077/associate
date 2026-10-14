import { useState, useMemo, useCallback } from 'react';
import type { Contact, Stage, ViewMode, SortField, SortDirection, FilterOptions } from '../types/contact';
import { INITIAL_CONTACTS } from '../data/mockContacts';

const STORAGE_KEY = 'associate_contacts_v1';

function getInitialContacts(): Contact[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read from localStorage, using initial dataset', e);
  }
  return INITIAL_CONTACTS;
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>(getInitialContacts);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    stageFilter: 'all',
    ownerFilter: 'all',
  });

  const [sorting, setSorting] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'name',
    direction: 'asc',
  });

  // Save to localStorage whenever contacts change
  const persistContacts = useCallback((updated: Contact[]) => {
    setContacts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, []);

  // Reset to initial mock dataset
  const resetToDefault = useCallback(() => {
    persistContacts(INITIAL_CONTACTS);
    setFilters({ search: '', stageFilter: 'all', ownerFilter: 'all' });
  }, [persistContacts]);

  // Update a single contact
  const updateContact = useCallback(
    (id: string, updates: Partial<Contact>) => {
      persistContacts(
        contacts.map((contact) =>
          contact.id === id
            ? { ...contact, ...updates, updatedAt: new Date().toISOString() }
            : contact
        )
      );
    },
    [contacts, persistContacts]
  );

  // Quick stage update (e.g. for drag and drop or board column move)
  const updateContactStage = useCallback(
    (id: string, newStage: Stage) => {
      updateContact(id, { stage: newStage });
    },
    [updateContact]
  );

  // Add contact
  const addContact = useCallback(
    (newContactData: Omit<Contact, 'id' | 'updatedAt'>) => {
      const newContact: Contact = {
        ...newContactData,
        id: `cnt-${Date.now()}`,
        updatedAt: new Date().toISOString(),
      };
      persistContacts([newContact, ...contacts]);
      return newContact.id;
    },
    [contacts, persistContacts]
  );

  // Delete contact
  const deleteContact = useCallback(
    (id: string) => {
      persistContacts(contacts.filter((c) => c.id !== id));
      if (selectedContactId === id) {
        setSelectedContactId(null);
      }
    },
    [contacts, selectedContactId, persistContacts]
  );

  // Selected contact object
  const selectedContact = useMemo(() => {
    return contacts.find((c) => c.id === selectedContactId) || null;
  }, [contacts, selectedContactId]);

  // Filtered and sorted contacts
  const filteredContacts = useMemo(() => {
    let result = [...contacts];

    // Search query matching multiple fields
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      result = result.filter((contact) => {
        const nameMatch = contact.name.toLowerCase().includes(query);
        const companyMatch = contact.company?.toLowerCase().includes(query) ?? false;
        const emailMatch = contact.email?.toLowerCase().includes(query) ?? false;
        const roleMatch = contact.role?.toLowerCase().includes(query) ?? false;
        const notesMatch = contact.notes?.toLowerCase().includes(query) ?? false;
        const ownerMatch = contact.owner?.toLowerCase().includes(query) ?? false;
        const labelsMatch = contact.labels.some((l) => l.toLowerCase().includes(query));
        return nameMatch || companyMatch || emailMatch || roleMatch || notesMatch || ownerMatch || labelsMatch;
      });
    }

    // Stage filter
    if (filters.stageFilter !== 'all') {
      result = result.filter((c) => c.stage === filters.stageFilter);
    }

    // Owner filter
    if (filters.ownerFilter !== 'all') {
      result = result.filter((c) => (c.owner || 'Unassigned') === filters.ownerFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let valA = '';
      let valB = '';

      switch (sorting.field) {
        case 'name':
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        case 'company':
          valA = (a.company || '').toLowerCase();
          valB = (b.company || '').toLowerCase();
          break;
        case 'stage':
          valA = a.stage;
          valB = b.stage;
          break;
        case 'owner':
          valA = (a.owner || '').toLowerCase();
          valB = (b.owner || '').toLowerCase();
          break;
        case 'updatedAt':
          valA = a.updatedAt;
          valB = b.updatedAt;
          break;
        default:
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
      }

      if (valA < valB) return sorting.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sorting.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [contacts, filters, sorting]);

  // Board columns group mapping
  const boardGroups = useMemo(() => {
    const groups: Record<Stage, Contact[]> = {
      Lead: [],
      Prospect: [],
      Qualified: [],
      Customer: [],
    };

    // Filter contacts that pass current search/filters
    filteredContacts.forEach((contact) => {
      if (groups[contact.stage]) {
        groups[contact.stage].push(contact);
      }
    });

    return groups;
  }, [filteredContacts]);

  const toggleSort = useCallback((field: SortField) => {
    setSorting((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { field, direction: 'asc' };
    });
  }, []);

  return {
    contacts,
    filteredContacts,
    boardGroups,
    viewMode,
    setViewMode,
    selectedContactId,
    setSelectedContactId,
    selectedContact,
    filters,
    setFilters,
    sorting,
    setSorting,
    toggleSort,
    updateContact,
    updateContactStage,
    addContact,
    deleteContact,
    resetToDefault,
  };
}
