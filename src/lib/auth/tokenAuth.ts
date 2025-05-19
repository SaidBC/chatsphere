import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export interface TokenUser {
  id: string;
  role: string;
  tokenId: string;
  tokenType: 'USER' | 'CLIENT';
  permissions: any;
}

/**
 * Extracts the API token from the request headers
 */
export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Validates an API token and returns the associated user if valid
 */
export async function validateApiToken(token: string): Promise<TokenUser | null> {
  if (!token) return null;
  
  try {
    // Find the token in the database
    const apiToken = await prisma.apiToken.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            role: true
          }
        }
      }
    });
    
    // Check if token exists and is not revoked
    if (!apiToken || apiToken.isRevoked) {
      return null;
    }
    
    // Check if token has expired
    if (apiToken.expiresAt && new Date(apiToken.expiresAt) < new Date()) {
      return null;
    }
    
    // Update lastUsedAt
    await prisma.apiToken.update({
      where: { id: apiToken.id },
      data: { lastUsedAt: new Date() }
    });
    
    // Return the user associated with the token
    return {
      id: apiToken.user.id,
      role: apiToken.user.role,
      tokenId: apiToken.id,
      tokenType: apiToken.type,
      permissions: apiToken.permissions
    };
  } catch (error) {
    console.error('Error validating API token:', error);
    return null;
  }
}

/**
 * Middleware to authenticate API requests using tokens
 */
export async function authenticateApiRequest(req: NextRequest): Promise<TokenUser | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  
  return await validateApiToken(token);
}

/**
 * Checks if a token user has the required permission
 */
export function hasPermission(
  tokenUser: TokenUser, 
  permission: 'read' | 'write' | 'delete',
  resourceId?: string
): boolean {
  // CLIENT tokens have full access
  if (tokenUser.tokenType === 'CLIENT' || tokenUser.role === 'admin') {
    return true;
  }
  
  const permissions = tokenUser.permissions || {};
  
  // Check if the user has the specific permission
  if (!permissions[permission]) {
    return false;
  }
  
  // If a resourceId is provided (like a roomId), check if the user has access to it
  if (resourceId && permissions.rooms && Array.isArray(permissions.rooms)) {
    // If rooms array is empty, user has access to all their rooms
    if (permissions.rooms.length === 0) {
      return true;
    }
    
    // Check if the resourceId is in the allowed rooms
    return permissions.rooms.includes(resourceId);
  }
  
  return true;
}
