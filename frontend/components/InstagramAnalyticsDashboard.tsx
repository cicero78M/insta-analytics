"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Link as LinkIcon,
  Users,
  Smile,
  Frown,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Small helpers
const cls = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

function StatDelta({ value }: { value: string }) {
  const isNeg = value.trim().startsWith("-");
  return (
    <span
      className={cls(
        "ml-2 rounded-full px-2 py-0.5 text-xs font-medium",
        isNeg ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
      )}
    >
      {value}
    </span>
  );
}

function KPI({ title, value, delta, Icon, accent }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div
          className={cls(
            "grid h-10 w-10 place-items-center rounded-xl",
            accent || "bg-indigo-50 text-indigo-600"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm text-neutral-500 capitalize">{title}</div>
          <div className="flex items-baseline gap-1">
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            {delta && <StatDelta value={delta} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Card({ title, right, children }: any) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h3 className="text-sm font-semibold text-neutral-700">{title}</h3>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Tabs({ tabs, current, onChange }: any) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map((t: any) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={cls(
            "rounded-full border px-3 py-1 text-sm",
            current === t.key
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-white text-neutral-700 hover:bg-neutral-50"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

const days = [
  "2 Sep",
  "3 Sep",
  "4 Sep",
  "5 Sep",
  "6 Sep",
  "7 Sep",
  "8 Sep",
  "9 Sep",
  "10 Sep",
  "11 Sep",
  "12 Sep",
  "13 Sep",
  "14 Sep",
  "15 Sep",
  "16 Sep",
  "17 Sep",
  "18 Sep",
  "19 Sep",
  "20 Sep",
  "21 Sep",
  "22 Sep",
  "23 Sep",
];

function useChartData() {
  return useMemo(() => {
    return days.map((d, i) => {
      // fake but plausible numbers
      const web = Math.round(20 + (i % 7) * 8 + (i % 3) * 5);
      const social = Math.round(50 + ((i * 7) % 17) * 6);
      return {
        day: d,
        all: web + social,
        web,
        social,
      };
    });
  }, []);
}

function useSentimentData() {
  return useMemo(() => {
    return days.map((d, i) => {
      const positive = 300 + ((i * 13) % 8) * 50;
      const negative = 200 + ((i * 11) % 5) * 60;
      const neutral = 120 + ((i * 7) % 6) * 30;
      return { day: d, positive, negative, neutral };
    });
  }, []);
}

function MoodChip({ mood }: { mood: "positive" | "negative" | "neutral" }) {
  const map: Record<string, any> = {
    positive: { Icon: Smile, cls: "bg-emerald-50 text-emerald-700" },
    negative: { Icon: Frown, cls: "bg-red-50 text-red-700" },
    neutral: { Icon: Smile, cls: "bg-amber-50 text-amber-700" },
  };
  const { Icon, cls: klass } = map[mood];
  return (
    <span
      className={cls(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
        klass
      )}
    >
      <Icon className="h-3.5 w-3.5" /> {mood}
    </span>
  );
}

const latestMentions = [
  {
    avatar: "JV",
    title: "RT @JChVerro: CognitiveSEO Keyword Tool Review https://t.co/wl…",
    site: "twitter.com",
    performance: 50,
    time: "15:45PM",
    mood: "neutral",
  },
  {
    avatar: "SE",
    title: "How to Improve Your Website Navigation: 7 Essential Best Practice",
    site: "seotoday.com",
    performance: 50,
    time: "15:45PM",
    mood: "positive",
  },
  {
    avatar: "BM",
    title: "Brand mentions weekly roundup and insights",
    site: "blog.brand.io",
    performance: 44,
    time: "16:10PM",
    mood: "negative",
  },
];

const latestBacklinks = [
  { site: "example.com", path: "/post/seo-roundup", perf: 62, time: "14:20PM" },
  { site: "news.io", path: "/tech/brand-mentions", perf: 48, time: "12:05PM" },
];

const influencers = [
  { name: "Dyson Ambassador", handle: "@dysonambassador", followers: "473k", mentions: 14 },
  { name: "Home Electronics", handle: "@home.electronics", followers: "37k", mentions: 12 },
  { name: "Eco Clean", handle: "@ecocleanasia", followers: "25k", mentions: 9 },
];

export default function InstagramAnalyticsDashboard() {
  const data = useChartData();
  const sentiment = useSentimentData();
  const [tab, setTab] = useState<"all" | "web" | "social">("all");

  const KPIs = [
    {
      title: "mentions",
      value: "10.1K",
      delta: "+11%",
      Icon: MessageSquare,
      accent: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "backlinks",
      value: "1.7K",
      delta: "+6%",
      Icon: LinkIcon,
      accent: "bg-violet-50 text-violet-600",
    },
    {
      title: "reach",
      value: "5.8K",
      delta: "-12%",
      Icon: Users,
      accent: "bg-sky-50 text-sky-600",
    },
    {
      title: "positive mentions",
      value: "6.3K",
      delta: "-7%",
      Icon: Smile,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "negative mentions",
      value: "3.7K",
      delta: "-2%",
      Icon: Frown,
      accent: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {KPIs.map((k) => (
          <KPI key={k.title} {...k} />
        ))}
      </div>

      {/* Main row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          title={
            <div className="flex items-center gap-2">
              <span>All Mentions 350</span>
            </div>
          }
          right={
            <Tabs
              tabs={[
                { key: "all", label: "All" },
                { key: "web", label: "Web 40" },
                { key: "social", label: "Social 310" },
              ]}
              current={tab}
              onChange={setTab}
            />
          }
        >
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={data} margin={{ left: 4, right: 4 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} interval={2} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                {tab === "all" && (
                  <Bar dataKey="all" name="All Mentions" radius={[6, 6, 0, 0]} />
                )}
                {tab === "web" && (
                  <Bar dataKey="web" name="Web" radius={[6, 6, 0, 0]} />
                )}
                {tab === "social" && (
                  <Bar dataKey="social" name="Social" radius={[6, 6, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Sentiment"
          right={
            <button className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs hover:bg-neutral-50">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          }
        >
          <div className="h-72 w-full">
            <ResponsiveContainer>
              <BarChart data={sentiment} stackOffset="expand" margin={{ left: 4, right: 4 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} interval={2} />
                <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                <Tooltip formatter={(v: any) => Math.round(v * 100) + "%"} />
                <Legend />
                <Bar dataKey="positive" stackId="a" name="positive" radius={[6, 6, 0, 0]} />
                <Bar dataKey="negative" stackId="a" name="negative" />
                <Bar dataKey="neutral" stackId="a" name="neutral" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="h-2 w-6 rounded bg-emerald-400" /> positive
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-6 rounded bg-rose-400" /> negative
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-6 rounded bg-amber-400" /> neutral
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          title={
            <div className="flex items-center gap-3">
              <MessageSquare className="h-4 w-4 text-violet-600" />
              <span>Latest Mentions</span>
            </div>
          }
          right={
            <div className="flex gap-2">
              <button
                className="rounded-full border px-3 py-1 text-xs hover:bg-neutral-50"
                onClick={() => setTab("all")}
              >
                Mentions
              </button>
              <button className="rounded-full border px-3 py-1 text-xs hover:bg-neutral-50">
                Latest Backlinks
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {latestMentions.map((m, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700">
                    {m.avatar}
                  </div>
                  <div>
                    <div className="text-sm text-neutral-800">{m.title}</div>
                    <div className="text-xs text-neutral-500">{m.site}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                  <div className="hidden sm:block">{m.performance}</div>
                  <div className="hidden sm:block">{m.time}</div>
                  <MoodChip mood={m.mood as any} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title={
            <div className="flex items-center gap-3">
              <LinkIcon className="h-4 w-4 text-indigo-600" />
              <span>Latest Backlinks</span>
            </div>
          }
        >
          <div className="space-y-4">
            {latestBacklinks.map((b, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-neutral-800">{b.site}</div>
                  <div className="text-xs text-neutral-500">{b.path}</div>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-600">
                  <span>{b.perf}</span>
                  <span>{b.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Top Influencers">
          <div className="space-y-4">
            {influencers.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 text-sm font-semibold text-neutral-700">
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-800">{p.name}</div>
                    <div className="text-xs text-neutral-500">
                      {p.handle} · {p.followers} followers
                    </div>
                  </div>
                </div>
                <div className="text-sm text-neutral-600">{p.mentions} mentions</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
