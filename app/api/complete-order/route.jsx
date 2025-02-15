import axios from "axios";
import { NextResponse } from "next/server";
import getPaypalAccessToken from "../../../lib/getPaypalAccessToken";
import { db } from "../../../configs/db";
import { Users } from "../../../configs/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req) {
  const paypalUrl = process.env.PAYPAL_URL;
  try {
    const { orderId, userEmail } = await req.json();
    const accessToken = await getPaypalAccessToken();

    const response = await axios({
      method: "post",
      url: paypalUrl + `/v2/checkout/orders/${orderId}/capture`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(response.data.purchase_units[0].payments.captures[0].amount);

    if (response.data.status === "COMPLETED") {
      await db
        .update(Users)
        .set({ credits: sql`${Users.credits} + 50` })
        .where(eq(Users.email, userEmail));
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      "🚨 PayPal Capture Error:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: error.response?.data || "PayPal capture failed" },
      { status: error.response?.status || 500 }
    );
  }
}
