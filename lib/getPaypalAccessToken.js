import axios from "axios";

const clientId = process.env.CLIENT_ID_PAYPAL;
const clientSecret = process.env.CLIENT_SECRET_PAYPAL;
const paypalUrl = process.env.PAYPAL_URL;

export default async function getPaypalAccessToken() {
  const response = await axios({
    method: "post",
    url: paypalUrl + "/v1/oauth2/token",
    data: "grant_type=client_credentials",
    auth: {
      username: clientId,
      password: clientSecret,
    },
  });

  return response.data.access_token;
}
