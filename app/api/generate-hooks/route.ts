import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { idea, platform } = await req.json();

  if (!idea) {
    return NextResponse.json({ hooks: [] });
  }

  const prompt = `
Generate 5 viral hooks for this idea:
"${idea}"

Platform: ${platform}

Rules:
- Hooks must be scroll-stopping
- Short and punchy
- Different styles (curiosity, emotional, bold)
- Return ONLY JSON:

{
  "hooks": ["hook 1", "hook 2", "hook 3", "hook 4", "hook 5"]
}
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json({ hooks: [] });
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = cleaned.match(/{[\s\S]*}/);

    if (!match) {
      return NextResponse.json({ hooks: [] });
    }

    const parsed = JSON.parse(match[0]);

    return NextResponse.json({ hooks: parsed.hooks || [] });

  } catch (error) {
    return NextResponse.json({ hooks: [] });
  }
}