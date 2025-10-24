'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { KanbanBoard } from '@/components/kanban/kanban-board';

export default function KanbanPage() {
  return (
    <MainLayout>
      <div className="h-full">
        <KanbanBoard />
      </div>
    </MainLayout>
  );
}
