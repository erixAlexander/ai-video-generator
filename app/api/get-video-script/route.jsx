import { NextResponse } from "next/server";
import { chatSession } from "../../../configs/AiModel";
import { db } from "../../../configs/db";
import { Users } from "../../../configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { prompt, userEmail } = await req.json();

    // Fetch the user by email
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.email, userEmail));

    if (user.length === 0) {
      return NextResponse.json({ result: "User not found" });
    }

    const currentCredits = user[0].credits;

    if (currentCredits < 10) {
      return NextResponse.json({ result: "Not enough credits" });
    }

    // Proceed with the chat session
    const result = await chatSession.sendMessage(prompt);
    return NextResponse.json({ result: JSON.parse(result.response.text()) });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
