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
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    ...(headers || {}),
  };

  if (authToken && !requestHeaders['Authorization']) {
    requestHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined.');
  }

  // Cache bust GET requests with a timestamp param
  const cacheBuster = method === 'GET' ? `${mapping.includes('?') ? '&' : '?'}_t=${Date.now()}` : '';
  const fullUrl = `${baseUrl}${mapping}${cacheBuster}`;

  let res: Response;

  try {
    res = await fetch(fullUrl, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'follow',
      cache: 'no-store',
    });
  } catch (networkError: any) {
    console.error('Network error:', networkError);
    throw new Error(`Could not reach the server. ${networkError.message}`);
  }

  // Treat 304 as an error since our proxy should have prevented it
  if (res.status === 304) {
    throw new Error('Received 304 Not Modified - unexpected caching issue.');
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