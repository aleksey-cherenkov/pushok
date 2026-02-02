import { getOpenAIClient } from "@/lib/ai/openai-client";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = await checkRateLimit(clientIP, 100);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          resetAt: rateLimitResult.resetAt,
        },
        { status: 429 },
      );
    }

    const { userValues } = await request.json();

    if (!userValues || userValues.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one value that matters to you." },
        { status: 400 },
      );
    }

    const openai = getOpenAIClient();

    const prompt = `You are Stela, a wise and gentle guide helping someone remember what truly matters in life.

Based on these values that matter to this person:
${userValues.map((v: string) => `- ${v}`).join("\n")}

Generate ONE short, gentle reminder message (15-25 words) that encourages them to honor these values today. 

The message should:
- Be warm and personal, like a gentle nudge from a caring friend
- Focus on BEING present, not achieving or doing
- Celebrate small moments of connection
- Never create guilt or pressure
- Be specific to their values
- Feel like wisdom from someone who truly understands

Examples of the tone:
- "The cats are purring nearby. Five minutes of stillness with them counts as much as any productivity."
- "Your kids won't remember the perfect house. They'll remember you being there, fully present."
- "That plant on your desk has been patient. Thirty seconds of care is a moment of life affirming life."

Generate a message that fits their specific values. Return ONLY the message text, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-5-nano",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
    });

    const message = completion.choices[0]?.message?.content?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "Failed to generate message. Please try again." },
        { status: 500 },
      );
    }

    // Determine category based on content
    const category = categorizeMessage(message, userValues);

    return NextResponse.json({ message, category });
  } catch (error) {
    console.error("Error generating Stela message:", error);
    return NextResponse.json(
      { error: "Failed to generate message. Please try again later." },
      { status: 500 },
    );
  }
}

function categorizeMessage(message: string, values: string[]): string {
  const lowerMessage = message.toLowerCase();
  const lowerValues = values.map((v) => v.toLowerCase()).join(" ");

  if (
    lowerMessage.includes("kid") ||
    lowerMessage.includes("child") ||
    lowerMessage.includes("family") ||
    lowerValues.includes("family") ||
    lowerValues.includes("kids")
  ) {
    return "family";
  }
  if (
    lowerMessage.includes("plant") ||
    lowerMessage.includes("garden") ||
    lowerMessage.includes("nature") ||
    lowerValues.includes("nature") ||
    lowerValues.includes("plants")
  ) {
    return "nature";
  }
  if (
    lowerMessage.includes("create") ||
    lowerMessage.includes("art") ||
    lowerMessage.includes("music") ||
    lowerValues.includes("creativity")
  ) {
    return "creativity";
  }
  if (
    lowerMessage.includes("rest") ||
    lowerMessage.includes("sleep") ||
    lowerMessage.includes("breathe") ||
    lowerValues.includes("rest")
  ) {
    return "rest";
  }
  if (
    lowerMessage.includes("call") ||
    lowerMessage.includes("reach") ||
    lowerMessage.includes("connect") ||
    lowerValues.includes("connection")
  ) {
    return "connection";
  }
  if (
    lowerMessage.includes("present") ||
    lowerMessage.includes("stillness") ||
    lowerMessage.includes("moment") ||
    lowerValues.includes("mindfulness")
  ) {
    return "mindfulness";
  }

  return "play";
}
