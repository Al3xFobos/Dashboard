import { NavLink, Route, Routes } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import { Button } from './components/ui/button';
import { OverviewPage } from './pages/OverviewPage';
import { FunnelsPage } from './pages/FunnelsPage';
import { CohortsPage } from './pages/CohortsPage';
import { UsersPage } from '../src/pages/UserPage';

function App() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
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
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden sm:inline">
              React · TS · Zustand · React Query · Recharts
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-border bg-background">
          <div className="mx-auto flex max-w-6xl gap-3 px-4 py-2 text-xs">
            <NavLinkTab to="/" label="Overview" />
            <NavLinkTab to="/funnels" label="Funnels" />
            <NavLinkTab to="/cohorts" label="Cohorts" />
            <NavLinkTab to="/users" label="Users" />
          </div>
        </nav>
      </header>

      <main className="flex-1 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/funnels" element={<FunnelsPage />} />
            <Route path="/cohorts" element={<CohortsPage />} />
            <Route path="/users" element={<UsersPage />} />
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
