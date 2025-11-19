import { create } from 'zustand';
import type { DashboardData } from '../types';

type DataSourceMode = 'mock' | 'file';

interface DataSourceState {
  mode: DataSourceMode;
  fileData: DashboardData | null;
  setFileData: (data: DashboardData) => void;
  resetToMock: () => void;
}

export const useDataSourceStore = create<DataSourceState>((set) => ({
  mode: 'mock',
  fileData: null,
  setFileData: (data) => set({ mode: 'file', fileData: data }),
  resetToMock: () => set({ mode: 'mock', fileData: null }),
}));
