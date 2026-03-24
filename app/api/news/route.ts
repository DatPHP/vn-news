export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import axios from "axios";
import Parser from "rss-parser";

const parser = new Parser();

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    thumbnail: string;
    source: string;
}

// ===== FETCH RSS =====
async function fetchRSS(urls: string[], fallbackSeed: string) {
    const allItems: NewsItem[] = [];

    for (const url of urls) {
        try {
            const feed = await parser.parseURL(url);

            const items = feed.items.map((item) => {
                const raw = item.content || item.description || "";
                const imgMatch = raw.match(/src="([^"]+)"/);

                return {
                    title: item.title || "",
                    link: item.link || "",
                    pubDate: item.pubDate || new Date().toISOString(),
                    content: (item.contentSnippet || "").slice(0, 120),
                    thumbnail:
                        imgMatch?.[1] ||
                        `https://picsum.photos/seed/${fallbackSeed}/600/400`,
                    source: feed.title || "News",
                };
            });

            allItems.push(...items);
        } catch (e) {
            console.log("RSS error:", url);
        }
    }

    return allItems
        .sort((a, b) => +new Date(b.pubDate) - +new Date(a.pubDate))
        .slice(0, 10);
}

// ===== GOLD =====
async function fetchGold() {
    try {
        const res = await axios.get(
            "https://api.btmc.vn/api/v1/get-gold-price?key=demo"
        );

        return res.data.data.map((g: any) => ({
            title: `Vàng ${g.name}`,
            link: "https://btmc.vn",
            pubDate: new Date().toISOString(),
            content: `Mua: ${g.buy} - Bán: ${g.sell}`,
            thumbnail: "https://picsum.photos/seed/gold/600/400",
            source: "SJC",
        }));
    } catch {
        return [];
    }
}

// ===== MAIN API =====
export async function GET() {
    const [gold, economy, tech, travel] = await Promise.all([
        fetchGold(),
        fetchRSS(
            [
                "https://vnexpress.net/rss/kinh-doanh.rss",
                "https://tuoitre.vn/rss/kinh-doanh.rss",
            ],
            "eco"
        ),
        fetchRSS(
            [
                "https://vnexpress.net/rss/so-hoa.rss",
                "https://thanhnien.vn/rss/cong-nghe-game.rss",
            ],
            "tech"
        ),
        fetchRSS(
            [
                "https://vnexpress.net/rss/du-lich.rss",
                "https://tuoitre.vn/rss/du-lich.rss",
            ],
            "travel"
        ),
    ]);

    return NextResponse.json({
        gold,
        economy,
        tech,
        travel,
        lastUpdated: new Date().toISOString(),
    });
}