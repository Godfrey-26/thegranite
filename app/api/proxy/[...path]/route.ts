import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://api.thegranite.co.zw/api/v1';

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }  // params is now a Promise in Next.js 15
) {
  const { path } = await params;  // must await params
  const url = `${BACKEND_URL}/${path.join('/')}/`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authHeader = req.headers.get('Authorization');
  if (authHeader) headers['Authorization'] = authHeader;

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
  }

  try {
    const backendRes = await fetch(url, {
      method: req.method,
      headers,
      body,
      redirect: 'follow',
    });

    const contentType = backendRes.headers.get('content-type') || '';
    const responseBody = await backendRes.text();

    return new NextResponse(responseBody, {
      status: backendRes.status,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Failed to reach backend server.' },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;