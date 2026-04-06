"use client";

import { useState } from "react";

export default function Home() {
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [platform, setPlatform] = useState("tiktok");

  const handleGenerate = async () => {
    if (!niche.trim()) {
      alert("Please enter a niche");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ niche, platform }),
      });

      const data = await res.json();

      if (Array.isArray(data.result)) {
        setResult(data.result);
      } else {
        setResult([]);
        alert(data.result);
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 1500);
  };

  const regenerateHooks = async (index: number) => {
  const idea = result[index].idea;

  const res = await fetch("/api/generate-hooks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idea, platform }),
  });

  const data = await res.json();

  if (Array.isArray(data.hooks)) {
    const updated = [...result];
    updated[index].hooks = data.hooks;
    setResult(updated);
  } else {
    alert("Failed to regenerate hooks");
  }
};

const regenerateCaptions = async (index: number) => {
  const idea = result[index].idea;

  const res = await fetch("/api/generate-captions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idea, platform }),
  });

  const data = await res.json();

  if (Array.isArray(data.captions)) {
    const updated = [...result];
    updated[index].captions = data.captions;
    setResult(updated);
  } else {
    alert("Failed to regenerate captions");
  }
};
const regenerateContent = async (index: number) => {
  const idea = result[index].idea;

  const res = await fetch("/api/generate-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idea, platform }),
  });

  const data = await res.json();

  if (Array.isArray(data.content)) {
    const updated = [...result];
    updated[index].content = data.content;
    setResult(updated);
  } else {
    alert("Failed to regenerate content");
  }
};

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-6">
          HookForge 🔥
        </h1>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter your niche (e.g. fitness, finance)"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        {/* Premium Glassy Platform Toggle */}
          <div className="relative flex mb-4 p-1 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-inner">

            {["tiktok", "instagram", "youtube"].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`flex-1 py-2 text-sm capitalize rounded-full transition-all duration-300 ${
                  platform === p
                    ? "bg-gradient-to-r from-black to-gray-800 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-black hover:bg-white/30"
                }`}
              >
                {p}
              </button>
            ))}

</div>

        {/* Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-black text-white px-5 py-3 rounded-lg w-full hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>

        {/* Output */}
        {result.length > 0 && (
          <div className="mt-8 space-y-6">
            {result.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition space-y-4"
              >

                {/* IDEA */}
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-lg">💡 {item.idea}</h2>
                    <button
                      onClick={() => handleCopy(item.idea, `idea-${index}`)}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {copied === `idea-${index}` ? "Copied ✅" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* HOOKS */}
                <div>
                  <div className="flex justify-between mb-2">
                      <h3 className="font-medium">🔥 Hooks</h3>

                      <div className="flex gap-2">
                        <button
                          onClick={() => regenerateHooks(index)}
                          className="px-3 py-1 text-xs rounded-full bg-white/40 backdrop-blur-md border border-gray-200 hover:bg-white/60 transition bg-white/30 hover:bg-white/50 shadow-sm hover:shadow-md"
                        >
                          🔄
                        </button>

                        <button
                          onClick={() =>
                            handleCopy(item.hooks.join("\n"), `hooks-${index}`)
                          }
                          className="px-3 py-1 text-xs rounded-full bg-white/40 backdrop-blur-md border border-gray-200 hover:bg-white/60 transition"
                        >
                          {copied === `hooks-${index}` ? "✅" : "📋"}
                        </button>
                      </div>
                    </div>
                  <ul className="space-y-2 text-sm">
                      {item.hooks.map((hook: string, i: number) => (
                        <li
                          key={i}
                          className="flex justify-between items-center bg-white/40 backdrop-blur-md px-3 py-2 rounded-lg border border-gray-200"
                        >
                          <span>{hook}</span>

                          <button
                            onClick={() => handleCopy(hook, `hook-${index}-${i}`)}
                            className="ml-3 px-2 py-1 text-xs rounded-full bg-white/50 hover:bg-white/70 transition"
                          >
                            {copied === `hook-${index}-${i}` ? "✅" : "📋"}
                          </button>
                        </li>
                      ))}
                    </ul>
                </div>

                {/* CAPTIONS */}
                <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">📝 Captions</h3>

                      <div className="flex gap-2">
                        <button
                          onClick={() => regenerateCaptions(index)}
                          className="px-3 py-1 text-xs rounded-full bg-white/30 backdrop-blur-md border border-gray-200 hover:bg-white/50 shadow-sm hover:shadow-md transition"
                        >
                          🔄
                        </button>

                        <button
                          onClick={() =>
                            handleCopy(item.captions.join("\n\n"), `captions-${index}`)
                          }
                          className="px-3 py-1 text-xs rounded-full bg-white/30 backdrop-blur-md border border-gray-200 hover:bg-white/50 shadow-sm hover:shadow-md transition"
                        >
                          {copied === `captions-${index}` ? "✅" : "📋"}
                        </button>
                      </div>
                    </div>
                  <ul className="space-y-2 text-sm">
                      {item.captions.map((cap: string, i: number) => (
                        <li
                          key={i}
                          className="flex justify-between items-center bg-white/40 backdrop-blur-md px-3 py-2 rounded-lg border border-gray-200"
                        >
                          <span>{cap}</span>

                          <button
                            onClick={() => handleCopy(cap, `caption-${index}-${i}`)}
                            className="ml-3 px-2 py-1 text-xs rounded-full bg-white/50 hover:bg-white/70 transition"
                          >
                            {copied === `caption-${index}-${i}` ? "✅" : "📋"}
                          </button>
                        </li>
                      ))}
                    </ul>
                </div>
                   <div>
                        <div className="flex justify-between mb-2">
                            <h3 className="font-medium">🎬 Content</h3>

                            <div className="flex gap-2">
                              <button
                                onClick={() => regenerateContent(index)}
                                className="px-3 py-1 text-xs rounded-full bg-white/30 backdrop-blur-md border border-gray-200 hover:bg-white/50 shadow-sm hover:shadow-md transition"
                              >
                                🔄
                              </button>

                              <button
                                onClick={() =>
                                  handleCopy(item.content.join("\n\n"), `content-${index}`)
                                }
                                className="px-3 py-1 text-xs rounded-full bg-white/30 backdrop-blur-md border border-gray-200 hover:bg-white/50 shadow-sm hover:shadow-md transition"
                              >
                                {copied === `content-${index}` ? "✅" : "📋"}
                              </button>
                            </div>
                          </div>

                      <ul className="space-y-2 text-sm">
                          {item.content.map((c: string, i: number) => (
                            <li
                              key={i}
                              className="flex justify-between items-start bg-white/40 backdrop-blur-md px-3 py-2 rounded-lg border border-gray-200"
                            >
                              <span className="whitespace-pre-wrap">{c}</span>

                              <button
                                onClick={() => handleCopy(c, `content-${index}-${i}`)}
                                className="ml-3 px-2 py-1 text-xs rounded-full bg-white/50 hover:bg-white/70 transition"
                              >
                                {copied === `content-${index}-${i}` ? "✅" : "📋"}
                              </button>
                            </li>
                          ))}
                        </ul>
                    </div>
                
                  </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}