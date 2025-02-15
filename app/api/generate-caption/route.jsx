import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req) {
  const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY,
  });

  const { audioFileUrl } = await req.json();

  const data = {
    audio: audioFileUrl,
  };

  try {
    const transcript = await client.transcripts.transcribe(data);

    return NextResponse.json({ result: transcript.words });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error });
  }
}
