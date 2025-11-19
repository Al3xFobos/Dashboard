import { NavLink, Route, Routes } from 'react-router-dom';
import { useRef } from 'react';
import type { ChangeEvent } from 'react'; // ← правильный импорт

import * as XLSX from 'xlsx';

import { useThemeStore } from './store/themeStore';
import { useDataSourceStore } from './store/dataSourceStore';

import { Button } from './components/ui/button';
import { OverviewPage } from './pages/OverviewPage';
import { FunnelsPage } from './pages/FunnelsPage';
import { CohortsPage } from './pages/CohortsPage';
import { UserPage } from './pages/UserPage';
import type { DashboardData, TimeSeriesPoint, TopPage } from './types';


function App() {
  const { theme, toggleTheme } = useThemeStore();
  const { mode, setFileData, resetToMock } = useDataSourceStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<any>(sheet);

      if (!rows.length) {
        alert('Excel file is empty or not readable.');
        return;
      }

      const timeSeries: TimeSeriesPoint[] = [];
      const pageMap = new Map<string, { views: number; conversions: number }>();

      for (const row of rows) {
        const date = row.Date ?? row.date;
        const visitorsRaw =
          row.Visitors ?? row.visitors ?? row.Visits ?? row.visits;
        const conversionsRaw =
          row.Conversions ?? row.conversions ?? row.Conv ?? row.conv;

        const visitors = Number(visitorsRaw ?? 0);
        const conversions = Number(conversionsRaw ?? 0);

        if (date && !Number.isNaN(visitors)) {
          timeSeries.push({
            date: String(date), // лучше в Excel сразу давать yyyy-MM-dd
            visitors,
            conversions: Number.isNaN(conversions) ? 0 : conversions,
          });
        }

        const page = row.Page ?? row.page ?? row.Path ?? row.path;
        if (page) {
          const viewsRaw =
            row.PageViews ??
            row.pageViews ??
            row.Views ??
            row.views ??
            visitors;
          const pageConvRaw =
            row.PageConversions ??
            row.pageConversions ??
            row.PageConv ??
            conversions;

          const views = Number(viewsRaw ?? 0);
          const pageConv = Number(pageConvRaw ?? 0);

          const current = pageMap.get(page) ?? { views: 0, conversions: 0 };
          current.views += Number.isNaN(views) ? 0 : views;
          current.conversions += Number.isNaN(pageConv) ? 0 : pageConv;
          pageMap.set(page, current);
        }
      }

      if (!timeSeries.length) {
        alert(
          'No valid rows found. Expected columns like Date, Visitors, Conversions.',
        );
        return;
      }

      const totalVisitors = timeSeries.reduce(
        (sum, p) => sum + p.visitors,
        0,
      );
      const totalConversions = timeSeries.reduce(
        (sum, p) => sum + p.conversions,
        0,
      );

      const convRate = totalVisitors
        ? (totalConversions / totalVisitors) * 100
        : 0;
      const bounceRate = Math.max(10, Math.min(90, 60 - convRate));
      const avgSessionDuration = 180;

      let topPages: TopPage[] = [];

      if (pageMap.size) {
        topPages = Array.from(pageMap.entries()).map(([path, stats]) => ({
          path,
          views: stats.views,
          conversions: stats.conversions,
        }));
      } else {
        topPages = [
          {
            path: '/from-excel',
            views: totalVisitors,
            conversions: totalConversions,
          },
        ];
      }

      const dashboardData: DashboardData = {
        kpis: {
          totalVisitors,
          bounceRate: Number(bounceRate.toFixed(1)),
          avgSessionDuration,
          conversions: totalConversions,
        },
        timeSeries,
        topPages,
      };

      setFileData(dashboardData);
    } catch (err) {
      console.error(err);
      alert('Failed to read Excel file. Please check the format.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background text-xs font-bold">
              BI
            </div>
            <div>
              <div className="text-sm font-semibold">InsightBoard</div>
              <div className="text-[11px] text-muted-foreground">
                Analytics Dashboard
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">
              React · TS · Zustand · React Query · Recharts
            </span>

            {/* Upload Excel */}
            <Button variant="outline" size="sm" onClick={handleUploadClick}>
              Upload Excel
            </Button>

            {/* Back to mock data when file is active */}
            {mode === 'file' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToMock}
                title="Back to demo data"
              >
                Use mock data
              </Button>
            )}

            {/* Theme toggle */}
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? 'Dark' : 'Light'}
            </Button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Navigation */}
<nav className="border-t border-border bg-background">
  <div className="mx-auto max-w-6xl px-4 py-2 text-xs">
    <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
      <NavLinkTab to="/" label="Overview" />
      <NavLinkTab to="/funnels" label="Funnels" />
      <NavLinkTab to="/cohorts" label="Cohorts" />
      <NavLinkTab to="/users" label="Users" />
    </div>
  </div>
</nav>

      </header>

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/funnels" element={<FunnelsPage />} />
            <Route path="/cohorts" element={<CohortsPage />} />
            <Route path="/users" element={<UserPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

interface NavLinkTabProps {
  to: string;
  label: string;
}

function NavLinkTab({ to, label }: NavLinkTabProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'inline-flex items-center rounded-full px-3 py-1',
          'text-[11px] font-medium transition-colors',
          isActive
            ? 'bg-foreground text-background'
            : 'text-muted-foreground hover:bg-muted',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  );
}

export default App;
