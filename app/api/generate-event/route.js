import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemPrompt = `You are an event planning assistant. Generate event details based on the user's description.

CRITICAL: Return ONLY valid JSON with properly escaped strings. No newlines in string values - use spaces instead.

Return this exact JSON structure:
{
  "title": "Event title (catchy and professional, single line)",
  "description": "Detailed event description in a single paragraph. Use spaces instead of line breaks. Make it 2-3 sentences describing what attendees will learn and experience.",
  "category": "One of: tech, music, sports, art, food, business, health, education, gaming, networking, outdoor, community",
  "suggestedCapacity": 50,
  "suggestedTicketType": "free"
}

User's event idea: ${prompt.trim()}

Rules:
- Return ONLY the JSON object, no markdown, no explanation
- All string values must be on a single line with no line breaks
- Use spaces instead of \\n or line breaks in description
- Make title catchy and under 80 characters
- Description should be 2-3 sentences, informative, single paragraph
- suggestedTicketType should be either "free" or "paid"
`;

    const result = await model.generateContent(systemPrompt);

    const response = await result.response;
    const text = response.text();

    // Clean the response (remove markdown code blocks if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    console.log(cleanedText);

    let eventData;
    try {
      eventData = JSON.parse(cleanedText);
    } catch {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("AI response was not valid JSON");
      }
      eventData = JSON.parse(jsonMatch[0]);
    }

    if (
      !eventData?.title ||
      !eventData?.description ||
      !eventData?.category ||
      eventData?.suggestedCapacity == null ||
      !eventData?.suggestedTicketType
    ) {
      throw new Error("AI returned incomplete event details");
    }

    return NextResponse.json(eventData);
  } catch (error) {
    console.error("Error generating event:", error);
    const status = error.message?.includes("429") || error.message?.includes("Quota exceeded") ? 429 : 500;
    const errorMessage = status === 429 
      ? "AI Usage Limit Exceeded. Please try again in a few minutes." 
      : `Failed to generate event: ${error.message}`;

    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}
