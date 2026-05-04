import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://api.thegranite.co.zw/api/v1';

async function handler(req: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = `${BACKEND_URL}/${path}/`;

  // Forward original headers (auth token, content-type, etc.)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const authHeader = req.headers.get('Authorization');
  if (authHeader) headers['Authorization'] = authHeader;

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
  }

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
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;