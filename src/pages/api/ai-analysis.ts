import type { NextApiRequest, NextApiResponse } from "next";

interface CampInfo {
  name: string;
  score: number;
  fullScore: number;
}

interface AnalysisResult {
  commonGround: string;
  bridgeOpportunities: { text: string }[];
  keyTensions: { label: string; text: string }[];
}

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

  const { topicName, statement, camps } = req.body as {
    topicName: string;
    statement: string;
    camps: CampInfo[];
  };

  if (!topicName || !camps?.length) {
    return res.status(400).json({ error: "topicName and camps are required" });
  }

  const campList = camps
    .map(
      (c, i) =>
        `${i + 1}. "${c.name}" — score: ${c.score.toFixed(2)} / ${c.fullScore.toFixed(2)}`
    )
    .join("\n");

  const prompt = `You are an AI analyst for Canonizer, a platform where people find common ground on important topics through structured debate. Each topic has multiple "camps" (positions) that people support, with scores reflecting the level of support.

Analyze this topic and its positions to find common ground, bridge opportunities, and key tensions.

Topic: "${topicName}"

Agreement Statement: "${statement || "No statement provided."}"

Positions (camps) with support scores:
${campList}

Respond with ONLY valid JSON in this exact format — no markdown, no code fences, no commentary:
{
  "commonGround": "A 1-2 sentence summary of what all or most positions seem to agree on, based on the topic and camp names.",
  "bridgeOpportunities": [
    { "text": "An observation about where <em>N positions</em> might find <em>compromise</em>. Use <em> tags for emphasis on key phrases." },
    { "text": "Another bridge opportunity." }
  ],
  "keyTensions": [
    { "label": "Short label:", "text": "Description of the tension between positions" },
    { "label": "Another tension:", "text": "Description" }
  ]
}

Generate 2-3 bridge opportunities and 2-3 key tensions. Make the analysis specific to this topic and its actual positions — do not be generic.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Anthropic API error:", response.status, errorBody);
      return res
        .status(502)
        .json({ error: "Failed to get AI analysis", details: errorBody });
    }

    const data = await response.json();
    let text = data.content?.[0]?.text || "";

    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?\s*```\s*$/i, "").trim();

    const parsed: AnalysisResult = JSON.parse(text);

    return res.status(200).json(parsed);
  } catch (error: any) {
    console.error("AI analysis error:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate analysis", message: error.message });
  }
}
