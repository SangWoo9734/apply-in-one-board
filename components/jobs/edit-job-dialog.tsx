'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Loader2 } from 'lucide-react';
import { useUpdateJob } from '@/lib/hooks/use-jobs';
import { useToast } from '@/hooks/use-toast';
import { JobTracking } from '@/types/job';

interface EditJobDialogProps {
  job: JobTracking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditJobDialog({ job, open, onOpenChange }: EditJobDialogProps) {
  const [memo, setMemo] = useState('');
  const [deadline, setDeadline] = useState('');

  const { toast } = useToast();
  const updateJob = useUpdateJob();

  useEffect(() => {
    if (job) {
      setMemo(job.memo || '');
      setDeadline(job.deadline || '');
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job) return;

    try {
      await updateJob.mutateAsync({
        id: job.id,
        memo: memo || null,
        deadline: deadline || null,
      });

      toast({
        title: '변경사항이 저장되었습니다',
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '저장에 실패했습니다',
      });
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border border-bg-300 bg-bg-200 p-6 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-text-100">공고 편집</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company & Position (Read-only) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-200">
              회사명 / 포지션
            </label>
            <p className="text-text-100">
              {job.company} - {job.position}
            </p>
          </div>

          {/* Deadline */}
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

          {/* Memo */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-200">
              메모
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모를 입력하세요..."
              className="min-h-[120px] w-full rounded-lg border border-bg-300 bg-bg-100 px-4 py-2 text-text-100 placeholder:text-text-300 focus:border-primary-100 focus:outline-none"
              rows={5}
            />
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
            <Button type="submit" disabled={updateJob.isPending}>
              {updateJob.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
