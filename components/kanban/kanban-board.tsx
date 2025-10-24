'use client';

import { useJobs, useUpdateJob } from '@/lib/hooks/use-jobs';
import { JobStatus } from '@/types/job';
import { KanbanColumn } from './kanban-column';
import { Loader2 } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import { KanbanCard } from './kanban-card';
import { useToast } from '@/hooks/use-toast';

const COLUMNS: Array<{
  id: JobStatus;
  title: string;
  color: string;
}> = [
  { id: 'interested', title: '관심있음', color: 'bg-status-interested' },
  { id: 'preparing', title: '지원 준비', color: 'bg-status-preparing' },
  { id: 'applied', title: '지원 완료', color: 'bg-status-applied' },
  {
    id: 'document_passed',
    title: '서류 합격',
    color: 'bg-status-document_passed',
  },
  { id: 'interview', title: '면접', color: 'bg-status-interview' },
  { id: 'accepted', title: '최종 합격', color: 'bg-status-accepted' },
  { id: 'rejected', title: '불합격', color: 'bg-status-rejected' },
];

export function KanbanBoard() {
  const { data: jobs, isLoading, error } = useJobs();
  const updateJob = useUpdateJob();
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-error">데이터를 불러오는데 실패했습니다</p>
      </div>
    );
  }

  // Group jobs by status
  const jobsByStatus = COLUMNS.reduce(
    (acc, column) => {
      acc[column.id] = jobs?.filter((job) => job.status === column.id) || [];
      return acc;
    },
    {} as Record<JobStatus, typeof jobs>
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const jobId = active.id as string;
    const newStatus = over.id as JobStatus;

    const job = jobs?.find((j) => j.id === jobId);
    if (!job || job.status === newStatus) {
      setActiveId(null);
      return;
    }

    try {
      await updateJob.mutateAsync({
        id: jobId,
        status: newStatus,
      });

      toast({
        title: '상태가 변경되었습니다',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '상태 변경에 실패했습니다',
      });
    }

    setActiveId(null);
  };

  const activeJob = jobs?.find((job) => job.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-bg-300 p-6">
          <h1 className="text-2xl font-bold text-text-100">칸반 보드</h1>
          <p className="mt-1 text-sm text-text-300">
            총 {jobs?.length || 0}개의 공고
          </p>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto">
          <div
            className="flex h-full gap-4 p-6"
            style={{ minWidth: 'max-content' }}
          >
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                jobs={jobsByStatus[column.id]}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && activeJob ? <KanbanCard job={activeJob} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
