import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://api.thegranite.co.zw/api/v1';

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const url = `${BACKEND_URL}/${path.join('/')}/`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
  };

  // Forward auth header
  const authHeader = req.headers.get('Authorization');
  if (authHeader) headers['Authorization'] = authHeader;

  // Strip cache validation headers so backend never returns 304
  // DO NOT forward: If-None-Match, If-Modified-Since, If-Match, If-Unmodified-Since

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
  }

  try {
    const backendRes = await fetch(url, {
      method: req.method,
      headers,  // clean headers, no cache validators
      body,
      redirect: 'follow',
      cache: 'no-store', // tells Next.js fetch to never cache this
    });

    // Handle 304 explicitly - should never happen now but just in case
    if (backendRes.status === 304) {
      return NextResponse.json(
        { message: 'Unexpected 304 from backend - cache headers stripped incorrectly' },
        { status: 500 }
      );
    }

    const contentType = backendRes.headers.get('content-type') || '';
    const responseBody = await backendRes.text();

    return new NextResponse(responseBody, {
      status: backendRes.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate', // tell browser never to cache
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to reach backend server.',
        detail: error.message,
        cause: error.cause?.message || null,
      },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;