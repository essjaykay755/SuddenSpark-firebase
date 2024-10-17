import { NextResponse } from "next/server";
import { checkContentWithGemini } from "@/lib/gemini";

export async function POST(request: Request) {
  const { content } = await request.json();

  if (!content) {
    return NextResponse.json(
      { isValid: false, reason: "No content provided." },
      { status: 400 }
    );
  }

  try {
    const result = await checkContentWithGemini(content);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking content:", error);
    return NextResponse.json(
      {
        isValid: false,
        reason:
          "An error occurred while checking the content. Please try again.",
      },
      { status: 500 }
    );
  }
}
