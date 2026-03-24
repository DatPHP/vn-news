"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    MapPin,
    Cpu,
    Globe,
    ChevronRight,
    Coins,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import NewsCard from "@/components/NewsCard";
import ThemeToggle from "@/components/ThemeToggle";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    thumbnail: string;
    source: string;
}

interface NewsData {
    gold: NewsItem[];
    travel: NewsItem[];
    tech: NewsItem[];
    economy: NewsItem[];
    lastUpdated: string | null;
}

export default function Page() {
    const [activeTab, setActiveTab] = useState<'gold' | 'travel' | 'tech' | 'economy'>('economy');

    const { data, isLoading, isError, refetch, isFetching } = useQuery<NewsData>({
        queryKey: ['news'],
        queryFn: async () => {
            const res = await fetch(`/api/news?nocache=${Date.now()}`, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
        refetchInterval: 10 * 60 * 1000,
    });

    const tabs = [
        { id: 'economy', label: 'Kinh tế & Chính trị', icon: Globe, color: 'emerald' },
        { id: 'tech', label: 'Công nghệ & Xu hướng', icon: Cpu, color: 'blue' },
        { id: 'travel', label: 'Du lịch & Ẩm thực', icon: MapPin, color: 'orange' },
        { id: 'gold', label: 'Giá vàng & Tài chính', icon: Coins, color: 'yellow' },
    ] as const;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="relative">
                    <RefreshCw className="animate-spin text-emerald-500" size={48} />
                    <div className="absolute inset-0 blur-xl bg-emerald-500/20 animate-pulse rounded-full" />
                </div>
                <div className="text-center">
                    <p className="text-zinc-900 dark:text-zinc-100 font-extrabold text-xl tracking-tighter uppercase">Đang đồng bộ dữ liệu...</p>
                    <p className="text-zinc-400 text-xs font-medium mt-1">Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-red-500" size={32} />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">KHÔNG THỂ KẾT NỐI MÁY CHỦ</h2>
                    <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto">
                        Hệ thống đang gặp sự cố khi lấy tin tức mới nhất. Vui lòng thử lại sau.
                    </p>
                </div>
                <button
                    onClick={() => refetch()}
                    className="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-extrabold uppercase tracking-widest rounded-full hover:bg-emerald-600 transition-all shadow-lg shadow-zinc-200 dark:shadow-none"
                >
                    Thử lại ngay
                </button>
            </div>
        );
    }

    const currentNews = data?.[activeTab] || [];

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900 selection:text-emerald-900 dark:selection:text-emerald-100">
            <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
                <header className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded">
                                Hệ thống cập nhật thời gian thực
                            </span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 leading-[0.9]">
                            VN NEWS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">TRENDINGS</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-sm mt-6 font-medium leading-relaxed">
                            Nền tảng tổng hợp tin tức thông minh, tự động phân tích và cập nhật từ các nguồn báo chí hàng đầu Việt Nam.
                        </p>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-4">
                        <div className="flex items-center gap-4">
                            {data?.lastUpdated && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                        Cập nhật: {new Date(data.lastUpdated).toLocaleTimeString('vi-VN')}
                                    </span>
                                </div>
                            )}
                            <ThemeToggle />
                        </div>
                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="group flex items-center gap-3 px-6 py-3 bg-zinc-900 dark:bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-xl shadow-zinc-200 dark:shadow-none disabled:opacity-50"
                        >
                            <RefreshCw size={14} className={cn(isFetching && "animate-spin")} />
                            Làm mới dữ liệu
                        </button>
                    </div>
                </header>

                <nav className="flex flex-wrap gap-2 md:gap-3 mb-12 sticky top-4 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-2 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-500/5 dark:shadow-none">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all",
                                    isActive
                                        ? "bg-zinc-900 dark:bg-emerald-600 text-white shadow-xl shadow-zinc-300 dark:shadow-none scale-105"
                                        : "bg-transparent text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                )}
                            >
                                <Icon size={16} />
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className="sm:hidden">{tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode="wait">
                        {currentNews.length > 0 ? (
                            currentNews.map((item, idx) => (
                                <NewsCard key={`${item.link}-${idx}`} item={item} index={idx} />
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Chưa có dữ liệu mới cho mục này</p>
                                <p className="text-zinc-300 dark:text-zinc-600 text-xs mt-2">Vui lòng quay lại sau ít phút</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                <footer className="mt-32 pt-12 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
                        <span>© 2026 VN NEWS TRENDINGS</span>
                        <span className="text-zinc-300 dark:text-zinc-600 italic">Powered by AI Analytics</span>
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-emerald-600 transition-colors">Về chúng tôi</a>
                        <a href="#" className="hover:text-emerald-600 transition-colors">Điều khoản</a>
                        <a href="#" className="hover:text-emerald-600 transition-colors">Liên hệ</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}