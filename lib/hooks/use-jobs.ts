import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { JobTracking } from '@/types/job';

// Fetch all jobs
export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await fetch('/api/jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const result = await response.json();
      return result.data as JobTracking[];
    },
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 보관
  });
}

// Create new job
interface CreateJobData {
  url: string;
  company: string;
  position: string;
  experience?: string;
  keywords?: string[];
  deadline?: string;
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateJobData) => {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create job');
      }

      const result = await response.json();
      return result.data as JobTracking;
    },
    onSuccess: (newJob) => {
      // Optimistic update: 새 공고를 캐시에 즉시 추가
      queryClient.setQueryData<JobTracking[]>(['jobs'], (old) => {
        if (!old) return [newJob];
        return [newJob, ...old];
      });
    },
  });
}

// Update job
interface UpdateJobData {
  id: string;
  [key: string]: any;
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateJobData) => {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update job');
      }

      const result = await response.json();
      return result.data as JobTracking;
    },
    onMutate: async ({ id, ...updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['jobs'] });

      // Snapshot previous value
      const previousJobs = queryClient.getQueryData<JobTracking[]>(['jobs']);

      // Optimistically update
      queryClient.setQueryData<JobTracking[]>(['jobs'], (old) => {
        if (!old) return old;
        return old.map((job) =>
          job.id === id ? { ...job, ...updates } : job
        );
      });

      return { previousJobs };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs'], context.previousJobs);
      }
    },
    onSuccess: (updatedJob) => {
      // Update with server response
      queryClient.setQueryData<JobTracking[]>(['jobs'], (old) => {
        if (!old) return [updatedJob];
        return old.map((job) => (job.id === updatedJob.id ? updatedJob : job));
      });
    },
  });
}

// Delete job
export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete job');
      }

      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] });

      const previousJobs = queryClient.getQueryData<JobTracking[]>(['jobs']);

      // Optimistically remove
      queryClient.setQueryData<JobTracking[]>(['jobs'], (old) => {
        if (!old) return old;
        return old.filter((job) => job.id !== id);
      });

      return { previousJobs };
    },
    onError: (err, id, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs'], context.previousJobs);
      }
    },
  });
}

// Scrape URL
export function useScrapeUrl() {
  return useMutation({
    mutationFn: async (url: string) => {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to scrape URL');
      }

      const result = await response.json();
      return result.data;
    },
  });
}
