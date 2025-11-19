import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select } from '../components/ui/select';

type Segment = 'all' | 'power' | 'casual' | 'churn-risk';

interface UserRow {
  id: number;
  name: string;
  email: string;
  lastSeenDays: number;
  sessionsLast30d: number;
}

const users: UserRow[] = [
  { id: 1, name: 'Alice Brown', email: 'alice@example.com', lastSeenDays: 1, sessionsLast30d: 38 },
  { id: 2, name: 'Michael Green', email: 'michael@example.com', lastSeenDays: 3, sessionsLast30d: 29 },
  { id: 3, name: 'John Doe', email: 'john@example.com', lastSeenDays: 12, sessionsLast30d: 9 },
  { id: 4, name: 'Sarah Lee', email: 'sarah@example.com', lastSeenDays: 25, sessionsLast30d: 3 },
  { id: 5, name: 'Daniel Kim', email: 'daniel@example.com', lastSeenDays: 5, sessionsLast30d: 21 },
  { id: 6, name: 'Emma Wilson', email: 'emma@example.com', lastSeenDays: 18, sessionsLast30d: 7 },
  { id: 7, name: 'Oliver Jones', email: 'oliver@example.com', lastSeenDays: 2, sessionsLast30d: 33 },
  { id: 8, name: 'Sophia Davis', email: 'sophia@example.com', lastSeenDays: 9, sessionsLast30d: 14 },
];

function getSegment(u: UserRow): Segment {
  if (u.sessionsLast30d >= 25 && u.lastSeenDays <= 3) return 'power';
  if (u.sessionsLast30d <= 5 || u.lastSeenDays >= 21) return 'churn-risk';
  if (u.sessionsLast30d <= 12) return 'casual';
  return 'all';
}

function segmentLabel(segment: Segment) {
  switch (segment) {
    case 'power':
      return 'Power users';
    case 'casual':
      return 'Casual users';
    case 'churn-risk':
      return 'Churn risk';
    case 'all':
    default:
      return 'All users';
  }
}

export function UserPage() {
  const [segment, setSegment] = useState<Segment>('all');

  const enriched = useMemo(
    () =>
      users.map((u) => ({
        ...u,
        segment: getSegment(u),
      })),
    [],
  );

  const filtered = useMemo(
    () =>
      enriched.filter((u) => (segment === 'all' ? true : u.segment === segment)),
    [enriched, segment],
  );

  const powerCount = enriched.filter((u) => u.segment === 'power').length;
  const riskCount = enriched.filter((u) => u.segment === 'churn-risk').length;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">User activity</h1>
          <p className="text-sm text-muted-foreground">
            Segments based on recency and engagement in the last 30 days.
          </p>
        </div>
        <Badge>
          {powerCount} power · {riskCount} churn risk
        </Badge>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Segment filter</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 py-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Segment</p>
            <Select
              value={segment}
              onChange={(e) => setSegment(e.target.value as Segment)}
            >
              <option value="all">All users</option>
              <option value="power">Power users</option>
              <option value="casual">Casual users</option>
              <option value="churn-risk">Churn risk</option>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Segment is derived from last seen days and number of sessions.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{segmentLabel(segment)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-2 py-1 font-medium">Name</th>
<th className="hidden px-2 py-1 font-medium sm:table-cell">Email</th>
<th className="px-2 py-1 font-medium text-right">Last seen</th>
<th className="px-2 py-1 font-medium text-right">Sessions (30d)</th>
<th className="hidden px-2 py-1 font-medium text-right sm:table-cell">
  Segment
</th>

                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="px-2 py-1 text-xs font-medium">{u.name}</td>
<td className="hidden px-2 py-1 text-xs text-muted-foreground sm:table-cell">
  {u.email}
</td>
...
<td className="hidden px-2 py-1 text-xs text-right sm:table-cell">
  <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
    {segmentLabel(u.segment)}
  </span>
</td>

                    <td className="px-2 py-1 text-xs text-right">
                      {u.sessionsLast30d}
                    </td>
                    <td className="px-2 py-1 text-xs text-right">
                      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                        {segmentLabel(u.segment as Segment)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              No users in this segment for now.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
