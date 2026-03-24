export async function summarize(text: string) {
    const res = await fetch("/api/summarize", {
        method: "POST",
        body: JSON.stringify({ text }),
    });

    const data = await res.json();
    return data.summary;
}