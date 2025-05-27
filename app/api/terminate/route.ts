
import { NextRequest } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { creditClientId } = await req.json();

    if (!creditClientId) {
      return new Response(
        JSON.stringify({ status: "error", message: "Missing creditClientId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call external API to terminate the token
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/creditTokens/${creditClientId}/terminate`,
      {},
      {
        auth: {
          username: process.env.NEXT_PUBLIC_API_USERNAME!,
          password: process.env.NEXT_PUBLIC_API_PASSWORD!,
        },
        headers: {
          "Content-Type": "application/json",
           "Cache-Control": "no-cache, no-store, must-revalidate"
        },
      }
    );

    if (response.status === 204) {
      // Successfully terminated
      return new Response(
        JSON.stringify({
          status: "success",
          message: "Credit token terminated successfully",
        }),
        { status: 200, headers: { "Content-Type": "application/json" , "Cache-Control": "no-cache, no-store, must-revalidate"} }
      );
    } else {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Failed to terminate token",
          data: response.data,
        }),
        { status: 500, headers: { "Content-Type": "application/json" ,  "Cache-Control": "no-cache, no-store, must-revalidate"} }
      );
    }
  } catch (error) {
    let message = "Unknown error";

    if (axios.isAxiosError(error) && error.response) {
      // Axios error response
      switch (error.response.status) {
        case 401:
          message = "Unauthorized. Check credentials.";
          break;
        case 404:
          message = "Credit token not found.";
          break;
        case 422:
          message = "Invalid creditClientId.";
          break;
        case 500:
        case 503:
          message = "Server error. Try again later.";
          break;
        default:
          message = error.response.data?.message || "Unexpected error occurred.";
      }
    } else if (axios.isAxiosError(error) && error.request) {
      message = "No response received from server.";
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Unknown error";
    }

    return new Response(
      JSON.stringify({ status: "error", message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
