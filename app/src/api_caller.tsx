/*
api_caller.tsx
method corresponds to the request type: GET, POST, PUT, PATCH
mapping -> API endpoint path
headers -> optional request headers
body -> optional request payload
*/
import { getToken } from './auth';

export default async function API_Caller(
  method: string,
  headers: any,
  mapping: string,
  body?: any
) {
  const authToken = await getToken();

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  };

  if (authToken && !requestHeaders['Authorization']) {
    requestHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  // Handles both relative (/api/proxy) and absolute (https://...) base URLs
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const isRelative = baseUrl.startsWith('/');
  const fullUrl = isRelative
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/proxy${mapping}`
    : `${baseUrl}${mapping}`;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined.');
  }

  let res: Response;

  try {
    res = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'follow',
    });
  } catch (networkError) {
    console.error('Network error:', networkError);
    throw new Error('Could not reach the server.');
  }

  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text();
    console.error(`Non-JSON response [${res.status}]:`, text);
    throw new Error(`Server returned a non-JSON response (status ${res.status}).`);
  }

  const data = await res.json();

  if (!res.ok) {
    console.error(`API error [${res.status}]:`, data);
    throw new Error(data?.message || data?.detail || data?.error || `API request failed with status ${res.status}`);
  }

  return data;
}