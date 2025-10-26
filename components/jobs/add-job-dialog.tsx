'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Link2, Loader2 } from 'lucide-react';
import { useCreateJob, useScrapeUrl } from '@/lib/hooks/use-jobs';
import { useToast } from '@/hooks/use-toast';

interface AddJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddJobDialog({ open, onOpenChange }: AddJobDialogProps) {
  const [url, setUrl] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [deadline, setDeadline] = useState('');
  const [keywords, setKeywords] = useState('');

  const { toast } = useToast();
  const createJob = useCreateJob();
  const scrapeUrl = useScrapeUrl();

  const handleScrape = async () => {
    if (!url) {
      toast({
        variant: 'error',
        title: 'URL을 입력해주세요',
      });
      return;
    }

    try {
      const data = await scrapeUrl.mutateAsync(url);

      if (data.company) setCompany(data.company);
      if (data.position) setPosition(data.position);
      if (data.deadline) setDeadline(data.deadline);
      if (data.keywords?.length > 0) setKeywords(data.keywords.join(', '));

      toast({
        title: '정보를 가져왔습니다',
        description: '정보를 확인하고 수정해주세요',
      });
    } catch (error) {
      toast({
        variant: 'error',
        title: '정보를 가져오지 못했습니다',
        description: '직접 입력해주세요',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !company || !position) {
      toast({
        variant: 'error',
        title: '필수 정보를 입력해주세요',
        description: 'URL, 회사명, 포지션은 필수입니다',
      });
      return;
    }

    try {
      await createJob.mutateAsync({
        url,
        company,
        position,
        deadline: deadline || undefined,
        keywords: keywords ? keywords.split(',').map((k) => k.trim()) : [],
      });

      toast({
        title: '공고가 추가되었습니다',
      });

      // Reset form
      setUrl('');
      setCompany('');
      setPosition('');
      setDeadline('');
      setKeywords('');
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'error',
        title: '공고 추가에 실패했습니다',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>공고 추가</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-200">
              공고 URL <span className="text-error">*</span>
            </label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleScrape}
                disabled={scrapeUrl.isPending || !url}
              >
                {scrapeUrl.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="mt-1 text-xs text-text-300">
              URL을 입력하고 버튼을 클릭하면 자동으로 정보를 가져옵니다
            </p>
          </div>

          {/* Company Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-200">
              회사명 <span className="text-error">*</span>
            </label>
            <Input
              type="text"
              placeholder="예: 카카오"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          {/* Position Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-200">
              포지션 <span className="text-error">*</span>
            </label>
            <Input
              type="text"
              placeholder="예: 프론트엔드 개발자"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>

          {/* Deadline Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-200">
              마감일
            </label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Keywords Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-200">
              키워드
            </label>
            <Input
              type="text"
              placeholder="React, TypeScript, Next.js (쉼표로 구분)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <p className="mt-1 text-xs text-text-300">
              쉼표(,)로 구분하여 입력해주세요
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button type="submit" disabled={createJob.isPending}>
              {createJob.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  추가 중...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  추가하기
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
