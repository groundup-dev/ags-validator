import { NextResponse } from "next/server";

// Mailchimp API URL template
const MAILCHIMP_API_URL = `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`;

export async function POST(req: Request) {
  const { email, firstName, lastName } = await req.json();

  console.log(email, firstName, lastName);
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const apiKey = process.env.MAILCHIMP_API_KEY;

  if (!audienceId) {
    return NextResponse.json(
      { error: "Mailchimp audience ID is required" },
      { status: 500 }
    );
  }

  if (!email || !firstName || !lastName) {
    return NextResponse.json(
      { error: "Email and name are required" },
      { status: 400 }
    );
  }

  // Construct the Mailchimp API URL
  const url = `${MAILCHIMP_API_URL}/lists/${audienceId}/members`;

  // Mailchimp requires the API key to be passed as a Base64-encoded string
  const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");

  // Make the POST request to Mailchimp API
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    if (errorData.title === "Member Exists") {
      return NextResponse.json(
        { error: "User is already subscribed" },
        { status: response.status }
      );
    }
    return NextResponse.json(
      { error: "Failed to subscribe user" },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json({
    message: "User subscribed successfully",
    data,
  });
}
