import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const chartGridColor = 'var(--chart-grid)';
const chartAxisColor = 'var(--muted-foreground)';
const chartTooltipBg = 'var(--card)';
const chartTooltipBorder = 'var(--border)';
const chartTooltipText = 'var(--foreground)';
const chartBarColor = 'var(--chart-bar)';

const funnelData = [
  { stage: 'Visited site', users: 12000 },
  { stage: 'Viewed product', users: 7800 },
  { stage: 'Added to cart', users: 4200 },
  { stage: 'Checkout started', users: 2500 },
  { stage: 'Purchased', users: 1600 },
];

export function FunnelsPage() {
  const totalTop = funnelData[0].users;

  const dataWithRate = funnelData.map((s) => ({
    ...s,
    rate: (s.users / totalTop) * 100,
  }));

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Funnels</h1>
          <p className="text-sm text-muted-foreground">
            Drop-off between funnel stages and conversion efficiency.
          </p>
        </div>
        <Badge>Sample e-commerce funnel</Badge>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Funnel performance</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataWithRate} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 10, fill: chartAxisColor }}
                  stroke={chartGridColor}
                />
                <YAxis
                  type="category"
                  dataKey="stage"
                  width={100}
                  tick={{ fontSize: 11, fill: chartAxisColor }}
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
                  formatter={(value: any, name: any) => {
                    if (name === 'rate') return [`${value.toFixed(1)}%`, 'Conversion'];
                    return [value, 'Users'];
                  }}
                />
                <Bar
                  dataKey="rate"
                  fill={chartBarColor}
                  radius={[4, 4, 4, 4]}
                  name="Conversion"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stage breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {dataWithRate.map((stage, idx) => (
              <div
                key={stage.stage}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
              >
                <div>
                  <p className="font-medium">
                    {idx + 1}. {stage.stage}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stage.users.toLocaleString()} users · {stage.rate.toFixed(1)}% of top
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
