import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { User } from '@/types/user';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development';
const TOKEN_EXPIRY = '7d'; // 7 days

export const ROBLOX_OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_ROBLOX_CLIENT_ID!,
  clientSecret: process.env.ROBLOX_CLIENT_SECRET!,
  authorizeUrl: 'https://apis.roblox.com/oauth/v1/authorize',
  tokenUrl: 'https://apis.roblox.com/oauth/v1/token',
  userInfoUrl: 'https://apis.roblox.com/oauth/v1/userinfo',
  scope: 'openid',
  redirectUri: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback`,
};

// Generate Roblox OAuth URL
export function getRobloxAuthUrl(): string {
  const state = Math.random().toString(36).substring(2);
  const params = new URLSearchParams({
    client_id: ROBLOX_OAUTH_CONFIG.clientId,
    redirect_uri: ROBLOX_OAUTH_CONFIG.redirectUri,
    scope: ROBLOX_OAUTH_CONFIG.scope,
    response_type: 'code',
    state,
  });
  
  return `${ROBLOX_OAUTH_CONFIG.authorizeUrl}?${params.toString()}`;
}

// Exchange OAuth code for access token
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}> {
  const response = await fetch(ROBLOX_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: ROBLOX_OAUTH_CONFIG.clientId,
      client_secret: ROBLOX_OAUTH_CONFIG.clientSecret,
      grant_type: 'authorization_code',
      code,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Token exchange failed:', response.status, errorText);
    throw new Error(`Failed to exchange code for token: ${response.status}`);
  }

  return response.json();
}

// Get Roblox user info
export async function getRobloxUser(accessToken: string): Promise<{
  id: string;
  username: string;
  displayName: string;
}> {
  const response = await fetch(ROBLOX_OAUTH_CONFIG.userInfoUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('User info failed:', response.status, errorText);
    throw new Error(`Failed to get user info: ${response.status}`);
  }

  const userData = await response.json();

  return {
    id: userData.sub,
    username: userData.preferred_username || `User_${userData.sub}`,
    displayName: userData.name || `User ${userData.sub}`,
  };
}

// Create JWT session token
export function createSessionToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      robloxId: user.roblox_id,
      username: user.roblox_name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// Verify and decode JWT session token
export function verifySessionToken(token: string): {
  userId: string;
  robloxId: string;
  username: string;
  role: string;
} | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      robloxId: decoded.robloxId,
      username: decoded.username,
      role: decoded.role,
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Get current user from session (server-side)
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

// Get current user from request (middleware/API routes)
export function getCurrentUserFromRequest(request: NextRequest): {
  userId: string;
  robloxId: string;
  username: string;
  role: string;
} | null {
  const token = request.cookies.get('session-token')?.value;
  
  if (!token) {
    return null;
  }
  
  return verifySessionToken(token);
}

// Role-based access control
export function hasRole(userRole: string, requiredRole: string): boolean {
  const hierarchy = ['user', 'employee', 'admin'];
  const userIndex = hierarchy.indexOf(userRole);
  const requiredIndex = hierarchy.indexOf(requiredRole);
  
  return userIndex !== -1 && requiredIndex !== -1 && userIndex >= requiredIndex;
}

// Check if user can access route
export function canAccess(userRole: string, requiredRole: string): boolean {
  return hasRole(userRole, requiredRole);
} 