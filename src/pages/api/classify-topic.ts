import type { NextApiRequest, NextApiResponse } from "next";

const CATEGORIES = [
  "Philosophy",
  "Politics & Government",
  "Science & Nature",
  "Technology",
  "Health & Medicine",
  "Culture & Society",
  "Economics & Finance",
  "Education",
  "Religion & Spirituality",
  "Sports & Recreation",
] as const;
type CategoryName = (typeof CATEGORIES)[number];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  const { topicName, note } = req.body as {
    topicName?: string;
    note?: string;
  };

  if (!topicName || typeof topicName !== "string") {
    return res.status(400).json({ error: "topicName is required" });
  }

  const list = CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join("\n");
  const prompt =
    `You are classifying a Canonizer topic into exactly one category.\n\n` +
    `Topic: "${topicName}"\n` +
    (note ? `Description: ${note.slice(0, 1500)}\n` : "") +
    `\nCategories (pick the single best fit):\n${list}\n\n` +
    `Respond with ONLY the category name, exactly as written above. No explanation, no punctuation, no quotes.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 30,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!r.ok) {
      const body = await r.text();
      console.error("classify-topic upstream", r.status, body);
      return res.status(502).json({ error: "Classifier upstream failed" });
    }

    const data = await r.json();
    const raw = (data.content?.[0]?.text || "").trim();
    const matched = CATEGORIES.find(
      (c) => c.toLowerCase() === raw.toLowerCase()
    ) as CategoryName | undefined;

    return res.status(200).json({ category: matched ?? null, raw });
  } catch (e: any) {
    console.error("classify-topic error", e);
    return res
      .status(500)
      .json({ error: "Classifier failed", message: e?.message });
  }
}
