import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { idea, platform } = await req.json();

  if (!idea) {
    return NextResponse.json({ captions: [] });
  }

  const prompt = `
Generate 5 HIGH-QUALITY captions for this content idea:
"${idea}"

Platform: ${platform}

Rules:
- Captions must be engaging and social-media ready
- Include CTA (call to action)
- Different styles (question, emotional, bold, viral)
- Keep them short and punchy
- Return ONLY JSON:

{
  "captions": [
    "caption 1",
    "caption 2",
    "caption 3",
    "caption 4",
    "caption 5"
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
      return NextResponse.json({ captions: [] });
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = cleaned.match(/{[\s\S]*}/);

    if (!match) {
      return NextResponse.json({ captions: [] });
    }

    const parsed = JSON.parse(match[0]);

    return NextResponse.json({ captions: parsed.captions || [] });

  } catch (error) {
    return NextResponse.json({ captions: [] });
  }
}