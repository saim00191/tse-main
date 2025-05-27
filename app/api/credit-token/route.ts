

import { NextResponse } from 'next/server';
import axios from 'axios';

const VENDOR_USERNAME = process.env.NEXT_PUBLIC_API_USERNAME;
const VENDOR_PASSWORD = process.env.NEXT_PUBLIC_API_PASSWORD;

export async function POST(request: Request) {
  const body = await request.json();
  const { metadata, state, validProductTypes } = body;

  const authHeader =
    'Basic ' + Buffer.from(`${VENDOR_USERNAME}:${VENDOR_PASSWORD}`).toString('base64');

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/creditTokens`,
      {
        metadata,
        state,
        validProductTypes,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
      }
    );

    return NextResponse.json(response.data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Swissbit API Error:', error.response?.data || error.message);
      return NextResponse.json(
        { error: error.response?.data || error.message },
        { status: error.response?.status || 500 }
      );
    }

    // fallback for unknown non-Axios errors
    console.error('❌ Unexpected Error:', error);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 , headers:{ 'Cache-Control': 'no-cache, no-store, must-revalidate',} });
  }
}
