import axios from "axios";
import { NextResponse } from "next/server";
import getPaypalAccessToken from "../../../lib/getPaypalAccessToken";

export async function POST(req) {
  const paypalUrl = process.env.PAYPAL_URL;
  try {
    const accessToken = await getPaypalAccessToken();

    const response = await axios({
      method: "post",
      url: paypalUrl + "/v2/checkout/orders",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      data: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            items: [
              {
                name: "40 Credits",
                description: "40 Credits for videos",
                quantity: 1,
                unit_amount: {
                  currency_code: "USD",
                  value: "1.00",
                },
              },
            ],
            amount: {
              currency_code: "USD",
              value: "1.00",
              breakdown: {
                item_total: { currency_code: "USD", value: "1.00" },
              },
            },
          },
        ],
        application_context: {
          return_url: process.env.MY_BASE_URL + "/dashboard/complete-order",
          cancel_url: process.env.MY_BASE_URL + "/dashboard/upgrade",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          brand_name: "AI-Generator Video",
        },
      }),
    });

    const acceptLink = response.data.links.find(
      (link) => link.rel === "approve"
    ).href;

    return NextResponse.json({ link: acceptLink });
  } catch (error) {
    console.error("PayPal API Error:", error.message);

    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      return NextResponse.json(
        {
          error:
            error.response?.data ||
            "An error occurred while processing the PayPal request.",
        },
        { status: error.response?.status || 500 }
      );
    }

    // General error handling
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
