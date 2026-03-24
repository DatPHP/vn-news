"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight, ExternalLink } from "lucide-react";
import { useState } from "react";

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    thumbnail: string;
    source: string;
}

export default function NewsCard({ item, index }: { item: NewsItem; index: number }) {
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5"
        >
            <div className="aspect-video overflow-hidden relative">
                <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${index}/600/400`;
                    }}
                />
                <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-md border border-white/10">
                        {item.source || "Tin tức"}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                    <Clock size={12} className="text-zinc-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {new Date(item.pubDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(item.pubDate).toLocaleDateString('vi-VN')}
                    </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-emerald-600 transition-colors mb-3 leading-tight">
                    {item.title}
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-6 leading-relaxed">
                    {item.content}
                </p>

                {/* AI SUMMARY SECTION */}
                <div className="mb-6">
                    <button
                        onClick={async (e) => {
                            e.preventDefault();
                            if (summary) return;
                            setLoading(true);
                            try {
                                const res = await fetch("/api/summarize", {
                                    method: "POST",
                                    body: JSON.stringify({ text: item.content }),
                                });
                                const data = await res.json();
                                setSummary(data.summary);
                            } catch (err) {
                                console.error(err);
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] transition-colors"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">⌛ Tóm tắt...</span>
                        ) : summary ? (
                            <span className="flex items-center gap-2">✅ Đã tóm tắt</span>
                        ) : (
                            <span className="flex items-center gap-2">🤖 Tóm tắt nhanh</span>
                        )}
                    </button>
                    
                    <AnimatePresence>
                        {summary && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden"
                            >
                                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                                    {summary}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Đọc tiếp <ChevronRight size={10} />
                    </span>
                    <ExternalLink size={14} className="text-zinc-300 dark:text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                </div>
            </div>
        </motion.a>
    );
}