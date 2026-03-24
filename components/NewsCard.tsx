"use client";

import { motion } from "framer-motion";
import { Clock, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function NewsCard({ item, index }: any) {
    const [summary, setSummary] = useState("");



    return (
        <motion.a
            href={item.link}
            target="_blank"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all"
        >
            <div className="aspect-video overflow-hidden">
                <img
                    src={item.thumbnail}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Clock size={12} />
                    {new Date(item.pubDate).toLocaleString("vi-VN")}
                </div>

                <h3 className="font-bold mt-2 line-clamp-2 group-hover:text-emerald-500">
                    {item.title}
                </h3>

                <p className="text-sm text-zinc-500 line-clamp-3 mt-2">
                    {item.content}
                </p>

                {/* AI BUTTON */}
                <button
                    onClick={async (e) => {
                        e.preventDefault(); // 👈 tránh mở link
                        const res = await fetch("/api/summarize", {
                            method: "POST",
                            body: JSON.stringify({ text: item.content }),
                        });
                        const data = await res.json();
                        setSummary(data.summary);
                    }}
                    className="text-xs mt-2 text-blue-500 hover:underline"
                >
                    🤖 Tóm tắt
                </button>

                {/* RESULT */}
                {summary && (
                    <p className="text-xs text-emerald-500 mt-2">
                        {summary}
                    </p>
                )}

                <div className="mt-auto flex justify-between items-center pt-3">
                    <span className="text-xs text-emerald-500 flex items-center gap-1">
                        Đọc tiếp <ChevronRight size={12} />
                    </span>
                    <ExternalLink size={14} />
                </div>
            </div>
        </motion.a>

    );
}