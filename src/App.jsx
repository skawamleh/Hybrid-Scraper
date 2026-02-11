import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Info, TrendingUp, ShieldCheck, Clock, Users, Workflow, DollarSign, Gauge } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

const lanes = ['Enterprise', 'Product & Engineering', 'Shared Services & Operations', 'Customer Enablement', 'Supply Chain'];

const formatMoney = (n) => (!Number.isFinite(n) ? '–' : n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${n.toFixed(0)}`);
const formatPct = (p) => (!Number.isFinite(p) ? '–' : `${(p * 100).toFixed(1)}%`);
const formatDays = (d) => (!Number.isFinite(d) ? '–' : `${Math.round(d)}d`);
const formatX = (x) => (!Number.isFinite(x) ? '–' : `${x.toFixed(1)}x`);

function KpiTile({ title, value, sub, icon: Icon, badge, hint, onClick }) {
  return (
    <Card className="rounded-2xl" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ height: 36, width: 36, borderRadius: 12, background: '#f1f5f9', display: 'grid', placeItems: 'center' }}><Icon size={18} /></div>
            <div>
              <CardTitle>{title}</CardTitle>
              {hint && <div className="muted" style={{ fontSize: 12, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Info size={12} />{hint}</div>}
            </div>
          </div>
          {badge && <Badge>{badge}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
        {sub && <div className="muted" style={{ fontSize: 14 }}>{sub}</div>}
      </CardContent>
    </Card>
  );
}

function TargetBar({ label, current, target, fmt, footnote }) {
  const pct = target > 0 ? (current / target) * 100 : 0;
  return (
    <Card>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
            <div className="muted" style={{ fontSize: 12 }}>{footnote}</div>
          </div>
          <div className="muted" style={{ fontSize: 13 }}><b style={{ color: '#0f172a' }}>{fmt(current)}</b> / {fmt(target)}</div>
        </div>
        <div style={{ marginTop: 10 }}><Progress value={pct} /></div>
      </CardContent>
    </Card>
  );
}

export default function ExecutiveAiKpiDashboard() {
  const [lane, setLane] = useState('Enterprise');
  const [period, setPeriod] = useState('Last 12 weeks');
  const [impactOpen, setImpactOpen] = useState(false);

  const mock = useMemo(() => ({
    now: {
      Enterprise: { verifiedRunRate: 24000000, verifiedYTD: 62000000, investmentRunRate: 7500000, activeDoers: 1488, eligible: 12400, ttvApprovalToBenefitDays: 38, taskSuccess: 0.86, rewiredCount: 12, priorityWorkflows: 35 },
      'Product & Engineering': { verifiedRunRate: 10500000, verifiedYTD: 21000000, investmentRunRate: 3200000, activeDoers: 510, eligible: 3800, ttvApprovalToBenefitDays: 42, taskSuccess: 0.84, rewiredCount: 4, priorityWorkflows: 12 },
      'Shared Services & Operations': { verifiedRunRate: 4200000, verifiedYTD: 8100000, investmentRunRate: 1900000, activeDoers: 240, eligible: 1900, ttvApprovalToBenefitDays: 47, taskSuccess: 0.83, rewiredCount: 2, priorityWorkflows: 8 },
      'Customer Enablement': { verifiedRunRate: 6800000, verifiedYTD: 12200000, investmentRunRate: 2400000, activeDoers: 410, eligible: 2900, ttvApprovalToBenefitDays: 31, taskSuccess: 0.88, rewiredCount: 3, priorityWorkflows: 10 },
      'Supply Chain': { verifiedRunRate: 2500000, verifiedYTD: 6700000, investmentRunRate: 1150000, activeDoers: 328, eligible: 2900, ttvApprovalToBenefitDays: 35, taskSuccess: 0.87, rewiredCount: 3, priorityWorkflows: 15 },
    },
    series: {
      Enterprise: [{ week: 'W-4', runRate: 22, doers: 1375, success: 0.85, rewiredPct: 0.3 }, { week: 'W-3', runRate: 23, doers: 1420, success: 0.86, rewiredPct: 0.32 }, { week: 'W-2', runRate: 23.5, doers: 1455, success: 0.86, rewiredPct: 0.33 }, { week: 'W-1', runRate: 24, doers: 1488, success: 0.86, rewiredPct: 0.34 }],
      'Product & Engineering': [{ week: 'W-4', runRate: 8.2, doers: 440, success: 0.82, rewiredPct: 0.26 }, { week: 'W-1', runRate: 10.5, doers: 510, success: 0.84, rewiredPct: 0.33 }],
      'Shared Services & Operations': [{ week: 'W-4', runRate: 3.2, doers: 185, success: 0.8, rewiredPct: 0.15 }, { week: 'W-1', runRate: 4.2, doers: 240, success: 0.83, rewiredPct: 0.25 }],
      'Customer Enablement': [{ week: 'W-4', runRate: 5.6, doers: 350, success: 0.85, rewiredPct: 0.23 }, { week: 'W-1', runRate: 6.8, doers: 410, success: 0.88, rewiredPct: 0.3 }],
      'Supply Chain': [{ week: 'W-4', runRate: 2.1, doers: 290, success: 0.84, rewiredPct: 0.16 }, { week: 'W-1', runRate: 2.5, doers: 328, success: 0.87, rewiredPct: 0.2 }],
    },
  }), []);

  const current = mock.now[lane];
  const trend = mock.series[lane];
  const adoptionRate = current.activeDoers / current.eligible;
  const rewiredPct = current.rewiredCount / current.priorityWorkflows;
  const roiRunRate = current.verifiedRunRate / current.investmentRunRate;

  const laneBreakdown = lanes.map((l) => ({ lane: l, runRateM: mock.now[l].verifiedRunRate / 1e6, adoption: mock.now[l].activeDoers / mock.now[l].eligible, success: mock.now[l].taskSuccess, rewired: mock.now[l].rewiredCount / mock.now[l].priorityWorkflows }));

  return (
    <div style={{ minHeight: '100vh', padding: 24 }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <h1 style={{ margin: 0 }}>Executive AI KPI Dashboard</h1>
        <p className="muted" style={{ marginTop: 8 }}>Board-ready view of value, adoption, speed, quality, and workflow rewiring.</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
          {lanes.map((l) => <Button key={l} size="sm" variant={l === lane ? 'default' : 'secondary'} onClick={() => setLane(l)}>{l}</Button>)}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {['Last 12 weeks', 'This quarter', 'YTD'].map((p) => <Button key={p} size="sm" variant={p === period ? 'default' : 'secondary'} onClick={() => setPeriod(p)}>{p}</Button>)}
        </div>

        <Separator className="my-6" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          <KpiTile title="Value Realized" value={formatMoney(current.verifiedRunRate)} sub={`Run-rate • ${formatMoney(current.verifiedYTD)} YTD`} icon={DollarSign} badge="Finance-verified" hint="Cost savings • revenue" onClick={() => setImpactOpen(true)} />
          <KpiTile title="Weekly Active AI-doers" value={current.activeDoers.toLocaleString()} sub={`${formatPct(adoptionRate)} of eligible`} icon={Users} badge="WAU" hint="Real work execution" />
          <KpiTile title="Time-to-Value" value={formatDays(current.ttvApprovalToBenefitDays)} sub="Approval→verified benefit" icon={Clock} badge="Median" hint="Speed to measurable impact" />
          <KpiTile title="Task Success Rate" value={formatPct(current.taskSuccess)} sub="Fixed evaluation sets" icon={ShieldCheck} badge="Quality" hint="Stability metric" />
          <KpiTile title="Workflow Rewiring" value={formatPct(rewiredPct)} sub={`${current.rewiredCount}/${current.priorityWorkflows} workflows`} icon={Workflow} badge="E2E" hint="Closed-loop transformation" />
          <KpiTile title="ROI Multiple" value={formatX(roiRunRate)} sub="Run-rate impact / investment" icon={TrendingUp} badge="ROI" hint="Finance-defined scope" />
          <KpiTile title="Adoption + Quality" value={formatPct((adoptionRate + current.taskSuccess) / 2)} sub="Composite signal" icon={Gauge} badge="Composite" hint="Leading health index" />
        </div>

        <Dialog open={impactOpen} onOpenChange={setImpactOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Value Realized breakdown ({lane})</DialogTitle></DialogHeader>
            <p className="muted">Detailed value composition and finance reconciliation would appear here.</p>
            <Button variant="secondary" onClick={() => setImpactOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 12, marginTop: 16 }}>
          <TargetBar label="Verified $ impact run-rate" current={current.verifiedRunRate} target={30000000} fmt={formatMoney} footnote="Run-rate as of latest close." />
          <TargetBar label="Rewired workflows" current={rewiredPct} target={0.4} fmt={formatPct} footnote="E2E + embedded + measurable." />
        </div>

        <div style={{ marginTop: 24 }}>
          <Tabs defaultValue="trends" className="w-full">
            <TabsList>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="lanes">Lane Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="trends">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 12 }}>
                <Card><CardHeader><CardTitle>Verified run-rate trend (M$)</CardTitle></CardHeader><CardContent style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%"><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="week" /><YAxis /><Tooltip /><Line dataKey="runRate" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
                </CardContent></Card>
                <Card><CardHeader><CardTitle>Adoption vs quality vs rewiring</CardTitle></CardHeader><CardContent style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%"><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="week" /><YAxis /><Tooltip /><Legend /><Line dataKey="doers" strokeWidth={2} dot={false} /><Line dataKey="success" strokeWidth={2} dot={false} /><Line dataKey="rewiredPct" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
                </CardContent></Card>
              </div>
            </TabsContent>

            <TabsContent value="lanes">
              <Card><CardHeader><CardTitle>Lane comparison</CardTitle></CardHeader><CardContent style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%"><BarChart data={laneBreakdown}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="lane" /><YAxis /><Tooltip /><Legend /><Bar dataKey="runRateM" /><Bar dataKey="adoption" /><Bar dataKey="success" /><Bar dataKey="rewired" /></BarChart></ResponsiveContainer>
              </CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
