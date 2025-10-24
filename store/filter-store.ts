import { create } from 'zustand';

export type JobStatus =
  | 'interested'
  | 'preparing'
  | 'applied'
  | 'document_passed'
  | 'interview'
  | 'accepted'
  | 'rejected';

export type ExperienceLevel =
  | '신입'
  | '1-3년'
  | '3-5년'
  | '5년 이상'
  | '경력무관';

export type JobCategory =
  | 'Backend'
  | 'Frontend'
  | 'Fullstack'
  | 'DevOps'
  | 'Data'
  | 'Mobile';

interface FilterState {
  searchQuery: string;
  selectedStatuses: JobStatus[];
  selectedExperiences: ExperienceLevel[];
  selectedCategories: JobCategory[];
  selectedKeywords: string[];

  setSearchQuery: (query: string) => void;
  toggleStatus: (status: JobStatus) => void;
  toggleExperience: (experience: ExperienceLevel) => void;
  toggleCategory: (category: JobCategory) => void;
  toggleKeyword: (keyword: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedStatuses: [],
  selectedExperiences: [],
  selectedCategories: [],
  selectedKeywords: [],

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleStatus: (status) =>
    set((state) => ({
      selectedStatuses: state.selectedStatuses.includes(status)
        ? state.selectedStatuses.filter((s) => s !== status)
        : [...state.selectedStatuses, status],
    })),

  toggleExperience: (experience) =>
    set((state) => ({
      selectedExperiences: state.selectedExperiences.includes(experience)
        ? state.selectedExperiences.filter((e) => e !== experience)
        : [...state.selectedExperiences, experience],
    })),

  toggleCategory: (category) =>
    set((state) => ({
      selectedCategories: state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category],
    })),

  toggleKeyword: (keyword) =>
    set((state) => ({
      selectedKeywords: state.selectedKeywords.includes(keyword)
        ? state.selectedKeywords.filter((k) => k !== keyword)
        : [...state.selectedKeywords, keyword],
    })),

  clearFilters: () =>
    set({
      searchQuery: '',
      selectedStatuses: [],
      selectedExperiences: [],
      selectedCategories: [],
      selectedKeywords: [],
    }),
}));
