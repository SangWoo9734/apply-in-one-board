'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { JobTracking } from '@/types/job';
import {
  Calendar,
  ExternalLink,
  Trash2,
  Edit,
  Briefcase,
  Tag,
  Clock,
  FileText,
} from 'lucide-react';
import { useDeleteJob } from '@/lib/hooks/use-jobs';
import { useToast } from '@/hooks/use-toast';
import { EditJobDialog } from './edit-job-dialog';

interface JobDetailDialogProps {
  job: JobTracking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_LABELS: Record<string, string> = {
  interested: '관심있음',
  preparing: '지원 준비',
  applied: '지원 완료',
  document_passed: '서류 합격',
  interview: '면접',
  accepted: '최종 합격',
  rejected: '불합격',
};

export function JobDetailDialog({
  job,
  open,
  onOpenChange,
}: JobDetailDialogProps) {
  const deleteJob = useDeleteJob();
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  if (!job) return null;

  const handleDelete = () => {
    if (!confirm('이 공고를 삭제하시겠습니까?')) return;

    onOpenChange(false);

    // Optimistic update
    deleteJob.mutate(job.id, {
      onSuccess: () => {
        toast({
          title: '공고가 삭제되었습니다',
        });
      },
      onError: () => {
        toast({
          variant: 'error',
          title: '삭제에 실패했습니다',
        });
      },
    });
  };

  const handleEdit = () => {
    onOpenChange(false);
    setEditDialogOpen(true);
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
      return { text: '마감', color: 'text-error' };
    } else if (diffDays === 0) {
      return { text: 'D-Day', color: 'text-error' };
    } else if (diffDays <= 7) {
      return { text: `D-${diffDays}`, color: 'text-warning' };
    } else {
      return { text: `D-${diffDays}`, color: 'text-text-300' };
    }
  };

  const dday = getDday();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-xl font-bold text-white">
                {job.company?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-text-100">
                  {job.company}
                </h2>
                <p className="text-sm text-text-300">{job.position}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-primary-100/10 px-3 py-1 text-sm font-medium text-primary-100">
                {STATUS_LABELS[job.status]}
              </span>
              {dday && (
                <span
                  className={`inline-flex items-center gap-1 text-sm font-medium ${dday.color}`}
                >
                  <Calendar className="h-4 w-4" />
                  {dday.text}
                </span>
              )}
            </div>

            {/* Job Details */}
            <div className="space-y-4 rounded-lg border border-bg-300 bg-bg-200 p-4">
              {/* Experience & Employment Type */}
              {(job.experience || job.employment_type) && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-text-300" />
                  <span className="text-text-200">
                    {[job.experience, job.employment_type]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>
              )}

              {/* Category */}
              {job.category && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-text-300" />
                  <span className="text-text-200">{job.category}</span>
                </div>
              )}

              {/* Deadline */}
              {job.deadline && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-text-300" />
                  <span className="text-text-200">
                    마감일: {formatDate(job.deadline)}
                  </span>
                </div>
              )}

              {/* Applied Date */}
              {job.applied_at && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-text-300" />
                  <span className="text-text-200">
                    지원일: {formatDate(job.applied_at)}
                  </span>
                </div>
              )}

              {/* Keywords */}
              {job.keywords && job.keywords.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-text-200">
                    키워드
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-accent-100/20 px-3 py-1 text-sm text-accent-100"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {job.notes && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-text-300" />
                  <p className="text-sm font-medium text-text-200">메모</p>
                </div>
                <div className="rounded-lg border border-bg-300 bg-bg-100 p-4">
                  <p className="whitespace-pre-wrap text-sm text-text-200">
                    {job.notes}
                  </p>
                </div>
              </div>
            )}

            {/* URL */}
            {job.url && (
              <div className="rounded-lg border border-bg-300 bg-bg-100 p-3">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-100 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  공고 원문 보기
                </a>
              </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-text-400">
              생성일: {formatDate(job.created_at)} · 수정일:{' '}
              {formatDate(job.updated_at)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between border-t border-bg-300 pt-4">
            <Button
              variant="ghost"
              className="text-error hover:bg-error/10"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                닫기
              </Button>
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                편집
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <EditJobDialog
        job={job}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </>
  );
}
