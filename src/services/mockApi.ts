import type { DashboardData, DashboardFilters, TimeSeriesPoint, TopPage } from '../types';
import { addDays, format } from 'date-fns';

function getRangeDays(range: '7d' | '30d' | '90d'): number {
  switch (range) {
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '90d':
      return 90;
  }
}

function randomInRange(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

function generateTimeSeries(filters: DashboardFilters): TimeSeriesPoint[] {
  const days = getRangeDays(filters.dateRange);
  const today = new Date();
  const start = addDays(today, -days + 1);

  const baseVisitors =
    filters.dateRange === '7d' ? 800 : filters.dateRange === '30d' ? 600 : 400;

  return Array.from({ length: days }).map((_, idx) => {
    const date = addDays(start, idx);
    const visitors = randomInRange(baseVisitors * 0.7, baseVisitors * 1.3);
    const conversions = Math.round(visitors * (0.02 + Math.random() * 0.03));

    return {
      date: format(date, 'yyyy-MM-dd'),
      visitors,
      conversions,
    };
  });
}

function generateTopPages(_filters: DashboardFilters): TopPage[] {
  const base: TopPage[] = [
    { path: '/home', views: 0, conversions: 0 },
    { path: '/pricing', views: 0, conversions: 0 },
    { path: '/blog/getting-started', views: 0, conversions: 0 },
    { path: '/blog/advanced-analytics', views: 0, conversions: 0 },
    { path: '/signup', views: 0, conversions: 0 },
  ];

  return base.map((p, idx) => {
    const multiplier = 1 - idx * 0.1 + Math.random() * 0.2;
    const views = randomInRange(500, 2000) * multiplier;
    const conversions = Math.round(views * (0.03 + Math.random() * 0.04));
    return { ...p, views: Math.round(views), conversions };
  });
}

export async function fetchDashboardData(
  filters: DashboardFilters,
): Promise<DashboardData> {
  // имитация сети
  await new Promise((res) => setTimeout(res, 500 + Math.random() * 500));

  const timeSeries = generateTimeSeries(filters);
  const totalVisitors = timeSeries.reduce((sum, p) => sum + p.visitors, 0);
  const totalConversions = timeSeries.reduce((sum, p) => sum + p.conversions, 0);

  const bounceRate = 40 + Math.random() * 20;
  const avgSessionDuration = 120 + Math.random() * 180;

  const topPages = generateTopPages(filters);

  return {
    kpis: {
      totalVisitors,
      bounceRate: Number(bounceRate.toFixed(1)),
      avgSessionDuration: Math.round(avgSessionDuration),
      conversions: totalConversions,
    },
    timeSeries,
    topPages,
  };
}
