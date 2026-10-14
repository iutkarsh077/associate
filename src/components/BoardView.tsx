import React, { useState } from 'react';
import { type Stage, type Contact, STAGES } from '../types/contact';
import { BoardColumn } from './BoardColumn';

interface BoardViewProps {
  boardGroups: Record<Stage, Contact[]>;
  selectedContactId: string | null;
  onSelectContact: (id: string) => void;
  onStageChange: (id: string, newStage: Stage) => void;
  onAddContactToStage: (stage: Stage) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  boardGroups,
  selectedContactId,
  onSelectContact,
  onStageChange,
  onAddContactToStage,
}) => {
  const [draggedContactId, setDraggedContactId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, contactId: string) => {
    setDraggedContactId(contactId);
    e.dataTransfer.setData('text/plain', contactId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropContact = (targetStage: Stage) => {
    if (!draggedContactId) return;
    onStageChange(draggedContactId, targetStage);
    setDraggedContactId(null);
  };

  return (
    <div className="w-full overflow-x-auto pb-8 pt-4 px-4 sm:px-6">
      <div className="flex items-start gap-4 min-w-[1180px]">
        {STAGES.map((s) => (
          <BoardColumn
            key={s.id}
            stage={s.id}
            contacts={boardGroups[s.id] || []}
            selectedContactId={selectedContactId}
            onSelectContact={onSelectContact}
            onStageChange={onStageChange}
            onDragStart={handleDragStart}
            onDropContact={handleDropContact}
            onAddContactToStage={onAddContactToStage}
          />
        ))}
      </div>
    </div>
  );
};
