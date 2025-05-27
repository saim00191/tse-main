import { NextRequest, NextResponse } from 'next/server';
import pRetry from 'p-retry';

export async function POST(req: NextRequest) {
  try {
    const { metadata, productType, clientId, clientSecret } = await req.json();

    if (!clientId || !clientSecret || !productType) {
      return NextResponse.json(
        { error: 'Missing required fields: clientId, clientSecret, and productType are required' },
        {
          status: 400, 
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
         }
      );
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await pRetry(
      () =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tses`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ metadata, productType }),
        }),
      { retries: 3, minTimeout: 1000 }
    );

    const data = await response.json();

    if (!response.ok) {
      let errorMessage = 'Unknown error';
      if (data && typeof data === 'object') {
        if (data.message) errorMessage = data.message;
        else if (data.error) {
          if (typeof data.error === 'string') errorMessage = data.error;
          else if (data.error.message) errorMessage = data.error.message;
          else if (data.error.errors && Array.isArray(data.error.errors)) {
            errorMessage = data.error.errors.join(', ');
          } else {
            errorMessage = JSON.stringify(data.error, null, 2);
          }
        } else if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.join(', ');
        } else if (data.details) errorMessage = data.details;
        else errorMessage = JSON.stringify(data, null, 2);
      }
      console.error('External API error response:', data);
      return NextResponse.json({ error: errorMessage }, {
        status: response.status,
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
      });
    }

    return NextResponse.json({
      creationId: data.creationId || data.id || `TSE-${Date.now()}`,
    },{
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
  } catch (err) {
    console.error('Server error in create-tse:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json({ error: `Server error: ${errorMessage}` }, { status: 500 });
  }
}