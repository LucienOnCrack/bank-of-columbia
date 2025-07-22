import { UserRole } from '@/types/user';

// Role hierarchy for access control
const ROLE_HIERARCHY: UserRole[] = ['user', 'employee', 'admin'];

/**
 * Check if a user role can access a required role level
 * @param userRole Current user's role
 * @param requiredRole Required role to access resource
 * @returns true if access is allowed
 */
export function canAccess(userRole: UserRole, requiredRole: UserRole): boolean {
  const userLevel = ROLE_HIERARCHY.indexOf(userRole);
  const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
  
  return userLevel >= requiredLevel;
}

/**
 * Check if user can perform admin actions
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === 'admin';
}

/**
 * Check if user can perform employee actions
 */
export function isEmployee(userRole: UserRole): boolean {
  return canAccess(userRole, 'employee');
}

/**
 * Check if user is a regular user
 */
export function isUser(userRole: UserRole): boolean {
  return canAccess(userRole, 'user');
}

/**
 * Get allowed routes based on user role
 */
export function getAllowedRoutes(userRole: UserRole): string[] {
  const routes = ['/dashboard'];
  
  if (isEmployee(userRole)) {
    routes.push('/employee');
  }
  
  if (isAdmin(userRole)) {
    routes.push('/admin');
  }
  
  return routes;
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const allowedRoutes = getAllowedRoutes(userRole);
  return allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute));
}

/**
 * Roblox OAuth configuration
 */
export const ROBLOX_OAUTH_CONFIG = {
  clientId: process.env.ROBLOX_CLIENT_ID!,
  clientSecret: process.env.ROBLOX_CLIENT_SECRET!,
  authorizeUrl: 'https://www.roblox.com/oauth2/authorize',
  tokenUrl: 'https://www.roblox.com/oauth2/token',
  userInfoUrl: 'https://users.roblox.com/v1/users/authenticated',
  scope: 'openid profile',
  redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/callback/roblox`,
};

/**
 * Generate Roblox OAuth URL
 */
export function getRobloxOAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: ROBLOX_OAUTH_CONFIG.clientId,
    redirect_uri: ROBLOX_OAUTH_CONFIG.redirectUri,
    scope: ROBLOX_OAUTH_CONFIG.scope,
    response_type: 'code',
    state: Math.random().toString(36).substring(7), // Simple state for CSRF protection
  });
  
  return `${ROBLOX_OAUTH_CONFIG.authorizeUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}> {
  const response = await fetch(ROBLOX_OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(
        `${ROBLOX_OAUTH_CONFIG.clientId}:${ROBLOX_OAUTH_CONFIG.clientSecret}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: ROBLOX_OAUTH_CONFIG.redirectUri,
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }
  
  return response.json();
}

/**
 * Get Roblox user info using access token
 */
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
    throw new Error('Failed to get user info');
  }
  
  const userData = await response.json();
  
  return {
    id: userData.id.toString(),
    username: userData.name,
    displayName: userData.displayName,
  };
} 