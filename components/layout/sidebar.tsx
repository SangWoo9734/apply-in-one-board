'use client';

import { Home, LayoutGrid, Filter, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useJobs } from '@/lib/hooks/use-jobs';
import { useFilterStore } from '@/store/filter-store';
import { JobStatus } from '@/types/job';

interface SidebarProps {
  className?: string;
}

const navItems = [
  {
    title: '대시보드',
    icon: Home,
    href: '/',
    count: null,
  },
  {
    title: '칸반 보드',
    icon: LayoutGrid,
    href: '/kanban',
    count: 12,
  },
  {
    title: '필터',
    icon: Filter,
    href: '/filter',
    count: null,
  },
  {
    title: '설정',
    icon: Settings,
    href: '/settings',
    count: null,
  },
];

const statusItems: Array<{
  status: JobStatus;
  label: string;
  color: string;
}> = [
  { status: 'interested', label: '관심있음', color: 'bg-status-interested' },
  { status: 'preparing', label: '지원 준비', color: 'bg-status-preparing' },
  { status: 'applied', label: '지원 완료', color: 'bg-status-applied' },
  {
    status: 'document_passed',
    label: '서류 합격',
    color: 'bg-status-document_passed',
  },
  { status: 'interview', label: '면접', color: 'bg-status-interview' },
  { status: 'accepted', label: '최종 합격', color: 'bg-status-accepted' },
  { status: 'rejected', label: '불합격', color: 'bg-status-rejected' },
];

export function Sidebar({ className }: SidebarProps) {
  const { data: jobs } = useJobs();
  const { selectedStatuses, toggleStatus } = useFilterStore();

  // Calculate counts by status
  const statusCounts = statusItems.reduce(
    (acc, item) => {
      acc[item.status] = jobs?.filter((job) => job.status === item.status).length || 0;
      return acc;
    },
    {} as Record<JobStatus, number>
  );

  return (
    <aside
      className={cn(
        'z-30 flex-1 w-64 border-r border-bg-300 bg-bg-100 transition-transform duration-200 lg:translate-x-0 overflow-y-auto w-[300px]',
        className
      )}
    >
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center justify-between rounded-lg px-4 py-3 text-text-200 transition-colors hover:bg-bg-200 hover:text-text-100"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </div>
              {item.count !== null && (
                <span className="rounded-full bg-bg-300 px-2 py-0.5 text-xs text-text-200">
                  {item.count}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Status Filter */}
      <div className="mt-6 border-t border-bg-300 p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-200">상태 필터</h3>
        <div className="space-y-2">
          {statusItems.map((item) => (
            <button
              key={item.status}
              onClick={() => toggleStatus(item.status)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                selectedStatuses.includes(item.status)
                  ? 'bg-primary-100/10 text-text-100'
                  : 'text-text-200 hover:bg-bg-200'
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn('h-2 w-2 rounded-full', item.color)} />
                <span>{item.label}</span>
              </div>
              <span className="font-medium">{statusCounts[item.status]}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

