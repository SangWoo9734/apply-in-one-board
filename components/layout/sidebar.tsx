'use client';

import { Home, LayoutGrid, Filter, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r border-bg-300 bg-bg-100 transition-transform duration-200 lg:translate-x-0',
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

      {/* Status Summary */}
      <div className="mt-6 border-t border-bg-300 p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-200">
          진행 현황
        </h3>
        <div className="space-y-2">
          <StatusItem label="관심 있음" count={5} color="bg-status-interested" />
          <StatusItem label="지원 준비" count={3} color="bg-status-preparing" />
          <StatusItem label="지원 완료" count={4} color="bg-status-applied" />
          <StatusItem label="면접 대기" count={2} color="bg-status-interview" />
        </div>
      </div>
    </aside>
  );
}

function StatusItem({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <div className={cn('h-2 w-2 rounded-full', color)} />
        <span className="text-text-200">{label}</span>
      </div>
      <span className="font-medium text-text-100">{count}</span>
    </div>
  );
}
