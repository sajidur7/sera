/** A small CRM home built only from Sera parts — delete it and start your own. */
import { useState } from "react";
import {
  AppShell, BrandMark, SideNav, NavItem, NavGroup, WorkspaceSwitcher, Button, IconButton, InputGroup, Keys, StatRow, Stat,
  Card, LineChart, Legend, DataTable, Tag, Avatar, ToastProvider, useToast, ThemeToggle, SegmentedControl,
  TaskList, Grid, Sparkline, type Column,
} from "./sera";

type Deal = { id: string; name: string; stage: string; owner: string; value: number };
const deals: Deal[] = [
  { id: "1", name: "Halden Freight", stage: "Negotiation", owner: "Maya Okafor", value: 84000 },
  { id: "2", name: "Mira Labs", stage: "Proposal", owner: "Leo Brandt", value: 52000 },
  { id: "3", name: "Oakline", stage: "Stalled", owner: "Sana Iqbal", value: 40000 },
  { id: "4", name: "Brightwater", stage: "Qualified", owner: "Theo Marsh", value: 126000 },
];
const tone = { Negotiation: "violet", Proposal: "blue", Stalled: "sand", Qualified: "sky" } as const;
const columns: Column<Deal>[] = [
  { key: "name", header: "Company", sortable: true, render: (d) => <b style={{ fontWeight: 500 }}>{d.name}</b> },
  { key: "stage", header: "Stage", render: (d) => <Tag tone={tone[d.stage as keyof typeof tone]}>{d.stage}</Tag> },
  { key: "owner", header: "Owner", render: (d) => <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar name={d.owner} size="xs" tint="c2" />{d.owner}</span> },
  { key: "value", header: "Value", numeric: true, sortable: true, render: (d) => `$${d.value.toLocaleString()}` },
];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Home() {
  const toast = useToast();
  const [range, setRange] = useState("Month");
  return (
    <AppShell
      sidebar={<SideNav>
        <WorkspaceSwitcher logo={<BrandMark icon="layers" />} name="Lumen" handle="@halden" />
        <div style={{ height: 10 }} />
        <NavItem icon="home" label="Home" current /><NavItem icon="inbox" label="Inbox" count={8} /><NavItem icon="box" label="Deals" count={48} /><NavItem icon="users" label="People" />
        <NavGroup label="Pipelines"><NavItem dot="#a988ee" label="Enterprise" /><NavItem dot="#6d8cff" label="Mid-market" /></NavGroup>
      </SideNav>}
      title="Good morning, Maya"
      actions={<><InputGroup icon="search" placeholder="Search" end={<Keys keys={["cmd", "K"]} />} /><ThemeToggle /><IconButton icon="bell" label="Notifications" /><Button variant="primary" icon="plus" onClick={() => toast({ title: "Deal created", body: "Halden Freight · $84,000" })}>New deal</Button></>}
    >
      <StatRow>{[
        <Stat key="a" icon="dollar" label="Pipeline" value="$1.24M" delta={12} sub="48 open deals" />,
        <Stat key="b" icon="check-c" label="Won · 30d" value="$212k" delta={8} trend={<Sparkline data={[3, 5, 4, 7, 6, 9, 11]} width={70} height={26} />} />,
        <Stat key="c" icon="target" label="Win rate" value="34%" delta={6} />,
        <Stat key="d" icon="clock" label="Cycle" value="41" unit="days" delta={-9} />,
      ]}</StatRow>
      <Grid columns={3} minWidth={300}>
        <div style={{ gridColumn: "span 2" }}>
          <Card title="Revenue" actions={<SegmentedControl size="sm" options={["Month", "Quarter", "Year"]} value={range} onChange={setRange} />}>
            <Legend items={[{ label: "2026", color: "c1", value: "$612k" }, { label: "2025", color: "c3", value: "$498k" }]} />
            <LineChart pre="$" labels={months} series={[{ data: [40, 46, 44, 52, 58, 55, 63, 70, 68, 76, 82, 88] }, { data: [30, 32, 35, 33, 38, 41, 40, 44, 47, 46, 50, 52], color: "c3", dashed: true }]} />
          </Card>
        </div>
        <Card title="Agent run" subtitle="Stale deal clean-up">
          <TaskList tasks={[{ label: "Find idle deals", state: "done" }, { label: "Read activity", state: "done" }, { label: "Propose changes", state: "running" }, { label: "Notify owners", state: "waiting" }]} />
        </Card>
      </Grid>
      <DataTable columns={columns} rows={deals} selectable selectionActions={(ids, clear) => <Button size="sm" variant="ghost" icon="archive" onClick={() => { toast({ title: `${ids.length} archived` }); clear(); }}>Archive</Button>} />
    </AppShell>
  );
}

export default function App() {
  return <ToastProvider><Home /></ToastProvider>;
}
