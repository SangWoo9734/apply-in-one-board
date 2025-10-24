import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        {/* Empty State */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100/10">
            <PlusCircle className="h-12 w-12 text-primary-100" />
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-text-100">
            첫 공고를 추가해보세요!
          </h2>
          <p className="mb-6 text-text-200">
            지원 현황을 한눈에 관리하고 추적할 수 있습니다
          </p>
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            공고 추가하기
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
