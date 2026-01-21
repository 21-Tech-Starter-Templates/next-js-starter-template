import { auth } from '@/auth';

export async function instance(multipart?: boolean) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('No authentication token found');
  }

  const accessToken = session.accessToken;

  if (!accessToken) {
    throw new Error('Session expired. Please login again.');
  }

  // Build headers with optional session ID for activity tracking
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    ...(multipart ? {} : { 'Content-Type': 'application/json' })
  };

  // Add session ID header if available (for Redis session activity tracking)
  if (session.sessionId) {
    headers['x-session-id'] = session.sessionId;
  }

  return headers;
}
