'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

async function fetchJSON(url: string) { const r = await fetch(url); return r.json(); }

export default function InstagramAnalyticsDashboard() {
  const [overview, setOverview] = useState<any>(null);
  const [sentSeries, setSentSeries] = useState<any[]>([]);
  const [latest, setLatest] = useState<any[]>([]);

  const from = new Date(Date.now() - 27*24*3600*1000).toISOString().slice(0,10);
  const to = new Date().toISOString().slice(0,10);

  useEffect(() => {
    fetchJSON(`/api/metrics/overview?from=${from}&to=${to}`).then(setOverview);
    fetchJSON(`/api/sentiment/series?from=${from}&to=${to}`).then(setSentSeries);
    fetchJSON(`/api/mentions/latest?limit=12`).then(setLatest);
  }, []);

  const kpi = overview?.total || {mentions:0, est_reach:0, likes:0, comments:0, pos:0, neg:0, neu:0};

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Kpi title="Mentions" value={kpi.mentions} />
        <Kpi title="Est. Reach" value={kpi.est_reach} />
        <Kpi title="Likes" value={kpi.likes} />
        <Kpi title="Comments" value={kpi.comments} />
        <Kpi title="Pos/Neg" value={`${kpi.pos}/${kpi.neg}`} />
      </div>

      {/* Mentions over time */}
      <Section title="Mentions (Last 28 days)">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={overview?.series || []}>
            <XAxis dataKey="day" hide={false} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="mentions" name="Mentions" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Sentiment stacked */}
      <Section title="Sentiment">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={sentSeries}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pos" stackId="a" name="Positive" />
            <Bar dataKey="neu" stackId="a" name="Neutral" />
            <Bar dataKey="neg" stackId="a" name="Negative" />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Latest mentions */}
      <Section title="Latest Mentions">
        <div className="grid md:grid-cols-2 gap-3">
          {latest.map((x, i) => (
            <div key={i} className="border rounded-2xl p-3 shadow-sm">
              <div className="text-sm text-gray-500">{x.created_at}</div>
              <div className="font-semibold line-clamp-2">{x.caption}</div>
              <div className="text-xs text-gray-500">{x.matched_as} · ❤ {x.like_count} · 💬 {x.comment_count}</div>
              {x.permalink && <a className="text-xs underline" href={x.permalink} target="_blank">open</a>}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Kpi({title, value}:{title:string; value:any}) {
  return (
    <div className="rounded-2xl p-4 border shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
function Section({title, children}:{title:string; children:any}){
  return (
    <section className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </section>
  );
}
