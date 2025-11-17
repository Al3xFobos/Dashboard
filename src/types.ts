export type DateRangePreset = '7d' | '30d' | '90d';

export type TrafficSource = 'all' | 'organic' | 'paid' | 'referral';
export type DeviceType = 'all' | 'desktop' | 'mobile';

export interface DashboardFilters {
  dateRange: DateRangePreset;
  source: TrafficSource;
  device: DeviceType;
}

export interface KpiMetrics {
  totalVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions: number;
}

export interface TimeSeriesPoint {
  date: string; // 'YYYY-MM-DD'
  visitors: number;
  conversions: number;
}

export interface TopPage {
  path: string;
  views: number;
  conversions: number;
}

export interface DashboardData {
  kpis: KpiMetrics;
  timeSeries: TimeSeriesPoint[];
  topPages: TopPage[];
}

export interface SavedReport {
  id: string;
  name: string;
  createdAt: string;
  filters: DashboardFilters;
}
