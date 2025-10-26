'use client';

import { JobStatus, JobTracking } from '@/types/job';
import { KanbanCard } from './kanban-card';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useMemo } from 'react';

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

  const parentRef = useRef<HTMLDivElement>(null);

  // Memoize job IDs
  const jobIds = useMemo(() => jobs.map((job) => job.id), [jobs]);

  // Virtual scrolling for large lists
  const rowVirtualizer = useVirtualizer({
    count: jobs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180, // 카드 예상 높이 (px)
    overscan: 5, // 뷰포트 밖 5개씩 미리 렌더링
  });

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
        className={`flex-1 overflow-y-auto transition-colors ${
          isOver ? 'bg-primary-100/10' : ''
        }`}
      >
        <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
          {jobs.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-bg-300 m-4">
              <p className="text-sm text-text-300">비어있음</p>
            </div>
          ) : (
            <div ref={parentRef} className="h-full overflow-auto p-4">
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const job = jobs[virtualItem.index];
                  return (
                    <div
                      key={job.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      className="pb-3"
                    >
                      <KanbanCard job={job} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
