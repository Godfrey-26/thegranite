/*
method corresponds to the request type: GET, POST, PUT, PATCH
mapping -> API endpoint path
headers -> optional request headers
body -> optional request payload
*/

import { getToken } from './auth';

export default async function API_Caller(method: string, headers: any, mapping: string, body: any) {
  const authToken = await getToken(); // safer if async

  const requestHeaders: any = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  };

  if (authToken && !requestHeaders.Authorization) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }
  

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${mapping}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'follow'
  });

  //  HANDLE NON-JSON RESPONSES
  const contentType = res.headers.get("content-type");

if (!contentType || !contentType.includes("application/json")) {
  const text = await res.text();
  console.error("NON-JSON RESPONSE:", text);
  throw new Error("Server did not return JSON");
}

const data = await res.json();
  //  HANDLE HTTP ERRORS
  if (!res.ok) {
    console.error("API error:", data);
    throw new Error(data?.message || "API request failed");
  }

  return data;
}