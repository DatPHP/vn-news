export async function POST(req: Request) {
    const { text } = await req.json();

    // DEMO: fake AI (sau này thay OpenAI)
    const summary = text.slice(0, 120) + "...";

    return Response.json({ summary });
}