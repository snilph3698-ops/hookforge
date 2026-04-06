import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("ENV KEY:", process.env.OPENROUTER_API_KEY);

  const { niche, platform } = await req.json();
  if (!niche) {
  return NextResponse.json({
    result: "No niche provided",
  });
}

  const prompt = `
Generate HIGH-QUALITY viral content for niche: ${niche}
Platform: ${platform}

Return STRICT JSON ONLY (no explanation, no text before or after):

[
  {
    "idea": "clear content idea",
    "hooks": [
      "hook 1",
      "hook 2",
      "hook 3",
      "hook 4",
      "hook 5"
    ],
    "captions": [
      "caption 1",
      "caption 2",
      "caption 3",
      "caption 4",
      "caption 5"
    ],
    "content": [
      "script version 1",
      "script version 2",
      "script version 3"
    ]
  }
]

IMPORTANT:
- Return ONLY valid JSON
- Do NOT include text before or after
- Do NOT include explanation
- Ensure JSON is properly formatted
- Double check syntax before responding
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "HookForge",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return NextResponse.json({
        result: "Error: " + (data.error?.message || "Request failed"),
      });
    }
   const text = data?.choices?.[0]?.message?.content;

if (!text) {
  return NextResponse.json({
    result: "Error: No content from AI",
  });
}

let parsed;

try {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // Extract JSON using regex (more reliable)
  const match = cleaned.match(/\[\s*{[\s\S]*}\s*\]/);

  if (!match) {
    throw new Error("No JSON found");
  }

  parsed = JSON.parse(match[0]);

} catch (e) {
  console.log("RAW TEXT:", text);

  return NextResponse.json({
    result: "Error parsing AI response",
  });
}
 

    return NextResponse.json({ result: parsed });

  } catch (error) {
    return NextResponse.json({
      result: "Error: Server crashed. Check console.",
    });
  }
}