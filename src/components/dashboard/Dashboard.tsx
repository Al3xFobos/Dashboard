import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  BarChart,
  Bar,
} from 'recharts';

import { useDashboardStore } from '../../store/dashboardStore';
import { useDataSourceStore } from '../../store/dataSourceStore';
import { fetchDashboardData } from '../../services/mockApi';
import type {
  DashboardData,
  DashboardFilters,
  DateRangePreset,
  DeviceType,
  TrafficSource,
} from '../../types';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select } from '../ui/select';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';

const chartGridColor = 'var(--chart-grid)';
const chartAxisColor = 'var(--muted-foreground)';
const chartTooltipBg = 'var(--card)';
const chartTooltipBorder = 'var(--border)';
const chartTooltipText = 'var(--foreground)';
const chartLinePrimary = 'var(--chart-line-primary)';
const chartLineSecondary = 'var(--chart-line-secondary)';
const chartBarColor = 'var(--chart-bar)';

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
    num,
  );
}

interface FilterOption<T> {
  value: T;
  label: string;
}

const dateRangeOptions: FilterOption<DateRangePreset>[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

const sourceOptions: FilterOption<TrafficSource>[] = [
  { value: 'all', label: 'All sources' },
  { value: 'organic', label: 'Organic' },
  { value: 'paid', label: 'Paid' },
  { value: 'referral', label: 'Referral' },
];

const deviceOptions: FilterOption<DeviceType>[] = [
  { value: 'all', label: 'All devices' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' },
];

interface FilterBarProps {
  filters: DashboardFilters;
  setFilters: (partial: Partial<DashboardFilters>) => void;
}

export function Dashboard() {
  const {
    filters,
    setFilters,
    savedReports,
    saveCurrentReport,
    loadReport,
    deleteReport,
  } = useDashboardStore();

  const { mode, fileData } = useDataSourceStore();

  const [reportName, setReportName] = useState('');
  const [activeUsers, setActiveUsers] = useState<number>(() =>
    Math.round(50 + Math.random() * 150),
  );

  const {
    data: apiData,
    isLoading: apiLoading,
    isFetching,
  } = useQuery<DashboardData>({
    queryKey: ['dashboard', filters],
    queryFn: () => fetchDashboardData(filters),
    refetchInterval: 10_000,
  });

  const data = mode === 'file' && fileData ? fileData : apiData;
  const isLoading = mode === 'file' ? !fileData : apiLoading;

  useEffect(() => {
    const id = setInterval(() => {
      setActiveUsers((prev) => {
        let next = prev + (Math.random() - 0.4) * 20;
        if (next < 10) next = 10;
        if (next > 400) next = 400;
        return Math.round(next);
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const handleSaveReport = () => {
    if (!reportName.trim()) return;
    saveCurrentReport(reportName.trim());
    setReportName('');
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* main column */}
      <div className="flex-1 space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Analytics Overview</h1>
            <p className="text-sm text-muted-foreground">
              Filters, charts, drilldown, and real-time activity.
            </p>
          </div>
          {mode === 'mock' && isFetching && <Badge>Refreshing data…</Badge>}
          {mode === 'file' && (
            <Badge className="text-xs">Data source: Excel file</Badge>
          )}
        </header>

        <FilterBar filters={filters} setFilters={setFilters} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Total visitors"
            value={data ? formatNumber(data.kpis.totalVisitors) : undefined}
            loading={isLoading}
          />
          <KpiCard
            label="Conversions"
            value={data ? formatNumber(data.kpis.conversions) : undefined}
            loading={isLoading}
          />
          <KpiCard
            label="Bounce rate"
            value={data ? `${data.kpis.bounceRate.toFixed(1)}%` : undefined}
            loading={isLoading}
          />
          <KpiCard
            label="Avg. session"
            value={data ? `${data.kpis.avgSessionDuration}s` : undefined}
            loading={isLoading}
          />
        </div>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Traffic over time</CardTitle>
            <Badge className="text-xs">
              Brush to zoom · Hover for tooltips
            </Badge>
          </CardHeader>
          <CardContent className="h-72">
            {isLoading || !data ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeSeries}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={chartGridColor}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: chartAxisColor }}
                    stroke={chartGridColor}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: chartAxisColor }}
                    stroke={chartGridColor}
                  />
                  <Tooltip
                    contentStyle={{
                      background: chartTooltipBg,
                      border: `1px solid ${chartTooltipBorder}`,
                      borderRadius: 8,
                      color: chartTooltipText,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke={chartLinePrimary}
                    strokeWidth={2}
                    dot={false}
                    name="Visitors"
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke={chartLineSecondary}
                    strokeWidth={2}
                    dot={false}
                    name="Conversions"
                  />
                  <Brush dataKey="date" height={20} stroke={chartLinePrimary} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Top pages</CardTitle>
              <span className="text-xs text-muted-foreground">
                Click row to drill down into the bar chart.
              </span>
            </CardHeader>
            <CardContent>
              {isLoading || !data ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <TopPagesTable data={data} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active users (live)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-semibold">{activeUsers}</p>
              <p className="text-xs text-muted-foreground">
                Simulated real-time metric, updates every few seconds.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* sidebar */}
      <aside className="hidden w-full flex-shrink-0 flex-col gap-3 lg:w-72 lg:flex">
        <Card>
          <CardHeader>
            <CardTitle>Save current report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <input
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              placeholder="Name…"
              className="h-9 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground"
            />
            <button
              className="inline-flex h-8 w-full items-center justify-center rounded-md border border-border bg-background text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
              onClick={handleSaveReport}
              disabled={!reportName}
            >
              Save report
            </button>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Saved reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {savedReports.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Saved reports will appear here. Use them as quick presets for
                filters.
              </p>
            )}
            <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
              {savedReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between rounded-md border border-border bg-card px-2 py-1 text-xs"
                >
                  <button
                    className="flex flex-col items-start text-left"
                    onClick={() => loadReport(report.id)}
                  >
                    <span className="font-medium">{report.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </button>
                  <button
                    className="text-[10px] text-red-500 hover:underline"
                    onClick={() => deleteReport(report.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function KpiCard({
  label,
  value,
  loading,
}: {
  label: string;
  value?: string;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="space-y-1 py-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        {loading ? (
          <Skeleton className="h-6 w-20" />
        ) : (
          <p className="text-lg font-semibold">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}

function FilterBar({ filters, setFilters }: FilterBarProps) {
  return (
    <Card className="relative z-20">
      <CardContent className="flex flex-wrap items-center gap-3 py-3">
        <div className="w-full space-y-1 sm:w-auto">
          <p className="text-xs font-medium text-muted-foreground">Date range</p>
          <Select
            className="relative z-30 w-full sm:w-40"
            value={filters.dateRange}
            onChange={(e) =>
              setFilters({ dateRange: e.target.value as DateRangePreset })
            }
          >
            {dateRangeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-full space-y-1 sm:w-auto">
          <p className="text-xs font-medium text-muted-foreground">Source</p>
          <Select
            className="relative z-30 w-full sm:w-40"
            value={filters.source}
            onChange={(e) =>
              setFilters({ source: e.target.value as TrafficSource })
            }
          >
            {sourceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-full space-y-1 sm:w-auto">
          <p className="text-xs font-medium text-muted-foreground">Device</p>
          <Select
            className="relative z-30 w-full sm:w-40"
            value={filters.device}
            onChange={(e) =>
              setFilters({ device: e.target.value as DeviceType })
            }
          >
            {deviceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function TopPagesTable({ data }: { data: DashboardData }) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const pages = data.topPages;
  const drilldownData = pages.map((p) => ({
    path: p.path,
    views: p.views,
  }));

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px] table-fixed border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="px-2 py-1 font-medium">Page</th>
              <th className="px-2 py-1 font-medium text-right">Views</th>
              <th className="hidden px-2 py-1 text-right font-medium sm:table-cell">
                Conversions
              </th>
              <th className="hidden px-2 py-1 text-right font-medium sm:table-cell">
                CR%
              </th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => {
              const cr = p.views ? (p.conversions / p.views) * 100 : 0;
              const active = selectedPath === p.path;
              return (
                <tr
                  key={p.path}
                  className={`cursor-pointer border-b border-border last:border-0 hover:bg-muted/60 ${
                    active ? 'bg-muted' : ''
                  }`}
                  onClick={() =>
                    setSelectedPath((prev) => (prev === p.path ? null : p.path))
                  }
                >
                  <td className="truncate px-2 py-1">{p.path}</td>
                  <td className="px-2 py-1 text-right">
                    {formatNumber(p.views)}
                  </td>
                  <td className="hidden px-2 py-1 text-right sm:table-cell">
                    {formatNumber(p.conversions)}
                  </td>
                  <td className="hidden px-2 py-1 text-right sm:table-cell">
                    {cr.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={drilldownData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={chartGridColor}
            />
            <XAxis dataKey="path" hide />
            <YAxis
              tick={{ fontSize: 10, fill: chartAxisColor }}
              stroke={chartGridColor}
            />
            <Tooltip
              contentStyle={{
                background: chartTooltipBg,
                border: `1px solid ${chartTooltipBorder}`,
                borderRadius: 8,
                color: chartTooltipText,
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="views"
              fill={chartBarColor}
              radius={[4, 4, 0, 0]}
              name="Views"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Drilldown: click a row to highlight it in the bar chart.
      </p>
    </div>
  );
}
