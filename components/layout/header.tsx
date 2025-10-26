'use client';

import { useState } from 'react';
import { Search, Menu, LogOut, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/store/filter-store';
import { useAuthStore } from '@/store/auth-store';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { AddJobDialog } from '@/components/jobs/add-job-dialog';
import Image from 'next/image'

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { searchQuery, setSearchQuery } = useFilterStore();
  const { user, clearUser } = useAuthStore();
  const router = useRouter();
  const [addJobOpen, setAddJobOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearUser();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-bg-300 bg-bg-100">
      <div className="flex h-16 justify-between items-center gap-4 px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo, left section */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary-100 font-brand">
            지원한판
          </h1>
          <Image alt='loog' src='@/app/logo.svg' width={200} height={50}/>
        </div>

        {/* center section */}
        <div className="flex-1 flex gap-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-300" />
            <Input
              placeholder="회사명, 포지션 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-full"
            />
          </div>

          <Button variant="default" size="sm" onClick={() => setAddJobOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            공고 추가
          </Button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">

          {user && (
            <div className="flex items-center gap-2 border-l border-bg-300 pl-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="로그아웃"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-white">
                {user.email?.[0].toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>

      <AddJobDialog open={addJobOpen} onOpenChange={setAddJobOpen} />
    </header>
  );
}
