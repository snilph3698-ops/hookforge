import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { idea, platform } = await req.json();

  if (!idea) {
    return NextResponse.json({ content: [] });
  }

  const prompt = `
Generate 3 short video scripts for this idea:
"${idea}"

Platform: ${platform}

Rules:
- Each script should be 4–6 lines
- Easy to speak (creator friendly)
- Different tone/style for each
- Platform-specific:
  - TikTok → fast, punchy
  - Instagram → engaging, aesthetic
  - YouTube → storytelling
- Return ONLY JSON:

{
  "content": [
    "script 1",
    "script 2",
    "script 3"
  ]
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
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json({ content: [] });
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = cleaned.match(/{[\s\S]*}/);

    if (!match) {
      return NextResponse.json({ content: [] });
    }

    const parsed = JSON.parse(match[0]);

    return NextResponse.json({ content: parsed.content || [] });

  } catch (error) {
    return NextResponse.json({ content: [] });
  }
}