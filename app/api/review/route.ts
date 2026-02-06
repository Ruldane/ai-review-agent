import { NextResponse } from "next/server";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/ai";
import { addLineNumbers } from "@/lib/lines";
import type { ReviewRequest } from "@/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReviewRequest;

    if (!body.code || body.code.trim().length < 10) {
      return NextResponse.json(
        { error: "Code must be at least 10 characters" },
        { status: 400 }
      );
    }

    const { numbered } = addLineNumbers(body.code);
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(
      numbered,
      body.language || "plaintext",
      body.mode || "code",
      body.focus || ["bug", "security", "performance", "style"],
      body.context || "",
      body.strictness || "medium"
    );

    const apiKey = process.env.ZAI_API_KEY;
    const baseUrl = process.env.ZAI_BASE_URL || "https://api.z.ai/api/anthropic";

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${baseUrl}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "glm-4.7",
        max_tokens: 4096,
        stream: true,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `AI API error: ${response.status}`, details: errorText },
        { status: 502 }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
