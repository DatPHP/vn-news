"use client";

import useSWR from "swr";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Page() {
  const [tab, setTab] = useState("economy");

  const { data, isLoading, mutate } = useSWR("/api/news", fetcher, {
    refreshInterval: 5 * 60 * 1000,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (isLoading) return <div>Loading...</div>;

  const news = data?.[tab] || [];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">VN NEWS</h1>

      {/* Tabs */}
      <div className="flex gap-3 my-6">
        {["economy", "tech", "travel", "gold"].map((t) => (
          <button key={t} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Refresh */}
      <button onClick={() => mutate()}>Làm mới</button>

      {/* News */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {news.map((item: any) => (
          <a href={item.link} target="_blank" key={item.link}>
            <img src={item.thumbnail} />
            <h3>{item.title}</h3>
          </a>
        ))}
      </div>
    </div>
  );
}