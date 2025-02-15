import Replicate from "replicate";
import { NextResponse } from "next/server";
import { storage } from "../../../configs/FirebaseConfig";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import axios from "axios";
import { db } from "../../../configs/db";
import { Users } from "../../../configs/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req) {
  try {
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    const { prompt, substract, userEmail, style } = await req.json();

    const input = {
      prompt: `(${style} style) ${prompt}`,
      height: 1280,
      width: 1024,
      num_outputs: 1,
    };

    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      { input }
    );

    // Access the URL of the first output
    const imageUrl = await output[0].url();

    const base64Image =
      "data:image/png;base64," + (await ConvertImage(imageUrl));

    const fileName = "ai-generator-folder/" + Date.now() + ".png";
    const storageRef = ref(storage, fileName);

    await uploadString(storageRef, base64Image, "data_url");

    const downloadUrl = await getDownloadURL(storageRef);

    // Subtract 10 credits
    if (substract) {
      await db
        .update(Users)
        .set({ credits: sql`${Users.credits} - 10` })
        .where(eq(Users.email, userEmail));
    }

    return NextResponse.json({ result: downloadUrl });
  } catch (error) {
    console.error("Error in POST /api/your-endpoint:", error);

    // Determine the type of error and set the appropriate status code and message
    let statusCode = 500;
    let message = "Internal Server Error";

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

const ConvertImage = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const base64Image = Buffer.from(response.data).toString("base64");

    return base64Image;
  } catch (error) {
    console.log(error);
  }
};
