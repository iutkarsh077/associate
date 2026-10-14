import React, { useState } from 'react';
import { useContacts } from './hooks/useContacts';
import { Header } from './components/Header';
import { TableView } from './components/TableView';
import { BoardView } from './components/BoardView';
import { DetailsPanel } from './components/DetailsPanel';
import { CreateContactModal } from './components/CreateContactModal';
import type { Stage } from './types/contact';

export const App: React.FC = () => {
  const {
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
    toggleSort,
    updateContact,
    updateContactStage,
    addContact,
    deleteContact,
    resetToDefault,
  } = useContacts();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDefaultStage, setCreateDefaultStage] = useState<Stage>('Lead');

  const handleOpenCreateModal = (defaultStage: Stage = 'Lead') => {
    setCreateDefaultStage(defaultStage);
    setIsCreateModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      stageFilter: 'all',
      ownerFilter: 'all',
    });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.stageFilter !== 'all' ||
    filters.ownerFilter !== 'all';

  return (
    <div className="min-h-screen bg-[#fafaf9] text-stone-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Application Navigation & Database Header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalContacts={contacts.length}
        filteredCount={filteredContacts.length}
        search={filters.search}
        onSearchChange={(search) => setFilters((prev) => ({ ...prev, search }))}
        stageFilter={filters.stageFilter}
        onStageFilterChange={(stageFilter) =>
          setFilters((prev) => ({ ...prev, stageFilter }))
        }
        ownerFilter={filters.ownerFilter}
        onOwnerFilterChange={(ownerFilter) =>
          setFilters((prev) => ({ ...prev, ownerFilter }))
        }
        onNewContact={() => handleOpenCreateModal('Lead')}
        onResetData={resetToDefault}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-6 py-4">
        {viewMode === 'table' ? (
          <TableView
            contacts={filteredContacts}
            selectedContactId={selectedContactId}
            onSelectContact={setSelectedContactId}
            sorting={sorting}
            onToggleSort={toggleSort}
            onNewContact={() => handleOpenCreateModal('Lead')}
            onClearFilters={handleClearFilters}
            isFiltered={isFiltered}
          />
        ) : (
          <BoardView
            boardGroups={boardGroups}
            selectedContactId={selectedContactId}
            onSelectContact={setSelectedContactId}
            onStageChange={updateContactStage}
            onAddContactToStage={(stage) => handleOpenCreateModal(stage)}
          />
        )}
      </main>

      {/* Details Side-Drawer Panel (Preserves user view underneath) */}
      <DetailsPanel
        contact={selectedContact}
        onClose={() => setSelectedContactId(null)}
        onSave={(id, updates) => {
          updateContact(id, updates);
        }}
        onDelete={(id) => {
          deleteContact(id);
        }}
      />

      {/* New Contact Dialog */}
      <CreateContactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(newContactData) => {
          const newId = addContact(newContactData);
          // Automatically open newly created contact in details panel
          setSelectedContactId(newId);
        }}
        defaultStage={createDefaultStage}
      />

      {/* Subtle Notion footer notes */}
      <footer className="border-t border-stone-200/60 py-3 px-6 text-center text-xs text-stone-400 bg-white/40">
        <p>
          Notion-inspired contact table & board prototype • Press <kbd className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] text-stone-600 font-mono">Enter</kbd> on a row to inspect or <kbd className="px-1 py-0.5 bg-stone-100 border border-stone-200 rounded text-[10px] text-stone-600 font-mono">Esc</kbd> to close panel.
        </p>
      </footer>
    </div>
  );
};

export default App;
