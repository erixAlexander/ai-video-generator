import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../../../configs/FirebaseConfig";

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {
  const { text, id } = await req.json();
  const storageRef = ref(storage, "ai-generator-folder/" + id + ".mp3");

  // Construct the request
  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };

  // Performs the text-to-speech request
  try {
    const [response] = await client.synthesizeSpeech(request);
    const audioBuffer = Buffer.from(response.audioContent, "binary");
    await uploadBytes(storageRef, audioBuffer, { contentType: "audio/mp3" });
    const downloadUrl = await getDownloadURL(storageRef);
    return NextResponse.json({ result: downloadUrl });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ result: `error: ${error}` });
  }
}
