"use client";

import useSWR from "swr";
import NewsCard from "@/components/NewsCard";
import ThemeToggle from "@/components/ThemeToggle";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Page() {
  const { data, mutate } = useSWR("/api/news", fetcher, {
    refreshInterval: 300000,
    revalidateOnFocus: false,
  });

  if (!data) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">VN NEWS</h1>
        <ThemeToggle />
      </div>

      <button onClick={() => mutate()}>Refresh</button>

      <div className="grid grid-cols-4 gap-6 mt-6">
        {data.economy.map((item: any, i: number) => (
          <NewsCard key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}