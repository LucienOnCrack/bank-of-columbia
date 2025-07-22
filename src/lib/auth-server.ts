import { cookies } from 'next/headers';
import { verifySessionToken } from './auth';

// Get current user from session (server-side only)
export async function getCurrentUser(): Promise<{
  userId: string;
  robloxId: string;
  username: string;
  role: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session-token')?.value;
  
  if (!token) {
    return null;
  }
  
  return verifySessionToken(token);
} 