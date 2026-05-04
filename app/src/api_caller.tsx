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

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined. Check your environment variables.');
  }

  let res: Response;

  try {
    res = await fetch(`${baseUrl}${mapping}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'follow',
    });
  } catch (networkError) {
    // Catches fetch failures: no internet, DNS failure, backend unreachable (e.g. localhost on Vercel)
    console.error('Network error — is NEXT_PUBLIC_API_BASE_URL reachable?', networkError);
    throw new Error(
      'Could not reach the server. Make sure NEXT_PUBLIC_API_BASE_URL is set correctly in Vercel environment variables.'
    );
  }

  // Handle non-JSON responses (HTML error pages, proxy errors, CORS failures, etc.)
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text();
    console.error(`Non-JSON response [${res.status}]:`, text);
    throw new Error(
      `Server returned a non-JSON response (status ${res.status}). Check your backend URL and CORS settings.`
    );
  }

  const data = await res.json();

  // Handle HTTP errors AFTER parsing JSON (so we can surface backend error messages)
  if (!res.ok) {
    console.error(`API error [${res.status}]:`, data);
    throw new Error(data?.message || data?.detail || data?.error || `API request failed with status ${res.status}`);
  }

  return data;
}