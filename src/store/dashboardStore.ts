import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DashboardFilters, SavedReport } from '../types';

interface DashboardState {
  filters: DashboardFilters;
  savedReports: SavedReport[];
  setFilters: (partial: Partial<DashboardFilters>) => void;
  saveCurrentReport: (name: string) => void;
  loadReport: (id: string) => void;
  deleteReport: (id: string) => void;
}

const defaultFilters: DashboardFilters = {
  dateRange: '7d',
  source: 'all',
  device: 'all',
};

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      filters: defaultFilters,
      savedReports: [],
      setFilters: (partial) =>
        set((state) => ({
          filters: { ...state.filters, ...partial },
        })),
      saveCurrentReport: (name) => {
        const { filters, savedReports } = get();
        const newReport: SavedReport = {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date().toISOString(),
          filters: { ...filters },
        };
        set({ savedReports: [newReport, ...savedReports] });
      },
      loadReport: (id) => {
        const report = get().savedReports.find((r) => r.id === id);
        if (report) {
          set({ filters: report.filters });
        }
      },
      deleteReport: (id) => {
        set((state) => ({
          savedReports: state.savedReports.filter((r) => r.id !== id),
        }));
      },
    }),
    {
      name: 'analytics-dashboard-store',
    },
  ),
);
