'use client';

import { JobStatus, JobTracking } from '@/types/job';
import { KanbanCard } from './kanban-card';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  id: JobStatus;
  title: string;
  color: string;
  jobs: JobTracking[];
}

export function KanbanColumn({ id, title, color, jobs }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const jobIds = jobs.map((job) => job.id);

  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-lg border border-bg-300 bg-bg-200">
      {/* Column Header */}
      <div className="flex items-center gap-2 border-b border-bg-300 p-4">
        <div className={`h-3 w-3 rounded-full ${color}`} />
        <h3 className="font-semibold text-text-100">{title}</h3>
        <span className="ml-auto rounded-full bg-bg-300 px-2 py-0.5 text-xs text-text-300">
          {jobs.length}
        </span>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-3 overflow-y-auto p-4 transition-colors ${
          isOver ? 'bg-primary-100/10' : ''
        }`}
      >
        <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
          {jobs.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-bg-300">
              <p className="text-sm text-text-300">비어있음</p>
            </div>
          ) : (
            jobs.map((job) => <KanbanCard key={job.id} job={job} />)
          )}
        </SortableContext>
      </div>
    </div>
  );
}
