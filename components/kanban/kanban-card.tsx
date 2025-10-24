'use client';

import { JobTracking } from '@/types/job';
import { Calendar, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteJob } from '@/lib/hooks/use-jobs';
import { useToast } from '@/hooks/use-toast';

interface KanbanCardProps {
  job: JobTracking;
}

export function KanbanCard({ job }: KanbanCardProps) {
  const deleteJob = useDeleteJob();
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('이 공고를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteJob.mutateAsync(job.id);
      toast({
        title: '공고가 삭제되었습니다',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: '삭제에 실패했습니다',
      });
    }
  };

  const handleCardClick = () => {
    if (job.url) {
      window.open(job.url, '_blank');
    }
  };

  // Calculate D-day
  const getDday = () => {
    if (!job.deadline) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(job.deadline);
    deadline.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="text-error">마감</span>;
    } else if (diffDays === 0) {
      return <span className="text-error">D-Day</span>;
    } else if (diffDays <= 7) {
      return <span className="text-warning">D-{diffDays}</span>;
    } else {
      return <span className="text-text-300">D-{diffDays}</span>;
    }
  };

  return (
    <div
      className="group relative rounded-lg border border-bg-300 bg-bg-100 p-4 transition-all hover:border-primary-200 hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Company Avatar */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-lg font-bold text-white">
          {job.company?.[0]?.toUpperCase() || '?'}
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {job.url && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                window.open(job.url, '_blank');
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-error hover:bg-error/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Company & Position */}
      <h4 className="mb-1 font-semibold text-text-100">{job.company}</h4>
      <p className="mb-3 text-sm text-text-200">{job.position}</p>

      {/* Keywords */}
      {job.keywords && job.keywords.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {job.keywords.slice(0, 3).map((keyword, index) => (
            <span
              key={index}
              className="rounded bg-accent-100/20 px-2 py-0.5 text-xs text-accent-100"
            >
              {keyword}
            </span>
          ))}
          {job.keywords.length > 3 && (
            <span className="rounded bg-bg-300 px-2 py-0.5 text-xs text-text-300">
              +{job.keywords.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Deadline */}
      {job.deadline && (
        <div className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          {getDday()}
        </div>
      )}

      {/* Memo Indicator */}
      {job.memo && (
        <div className="mt-2 truncate text-xs text-text-300">
          메모: {job.memo}
        </div>
      )}
    </div>
  );
}
