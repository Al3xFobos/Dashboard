import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const cohorts = [
  { label: 'Week 1', values: [100, 62, 48, 35, 29] },
  { label: 'Week 2', values: [100, 58, 44, 32, 25] },
  { label: 'Week 3', values: [100, 60, 46, 34, 27] },
  { label: 'Week 4', values: [100, 55, 40, 30, 23] },
];

const periods = ['Signup', 'Week 1', 'Week 2', 'Week 3', 'Week 4'];

function getColor(value: number) {
  // простая шкала интенсивности для фона
  if (value >= 70) return 'bg-emerald-700 text-emerald-50';
  if (value >= 50) return 'bg-emerald-600 text-emerald-50';
  if (value >= 35) return 'bg-emerald-500 text-emerald-50';
  if (value >= 20) return 'bg-emerald-400 text-emerald-950';
  return 'bg-emerald-200 text-emerald-950';
}

export function CohortsPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Cohorts</h1>
          <p className="text-sm text-muted-foreground">
            Retention by signup week across subsequent weeks.
          </p>
        </div>
        <Badge>Simulated retention matrix</Badge>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Weekly retention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left text-muted-foreground">Cohort</th>
                  {periods.map((p) => (
                    <th
                      key={p}
                      className="px-2 py-1 text-center text-[11px] font-medium text-muted-foreground"
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map((cohort) => (
                  <tr key={cohort.label}>
                    <td className="px-2 py-1 text-xs font-medium text-foreground">
                      {cohort.label}
                    </td>
                    {cohort.values.map((value, idx) => (
                      <td key={idx} className="px-1 py-1 text-center">
                        <div
                          className={`mx-auto flex h-8 w-12 items-center justify-center rounded-md text-[11px] ${getColor(
                            value,
                          )}`}
                        >
                          {value}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Each row represents a signup week, columns show retention percentage in each
            subsequent week.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
