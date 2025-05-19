import { NextRequest } from 'next/server';
import { TokenUser } from './tokenAuth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Gets the authenticated user from either a session or an API token
 * This should be used in API routes to get the current user
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<{
  user: TokenUser | null;
  isTokenAuth: boolean;
}> {
  // First check if we have a token user from middleware
  const tokenUserHeader = req.headers.get('x-token-user');
  
  if (tokenUserHeader) {
    try {
      const tokenUser = JSON.parse(tokenUserHeader) as TokenUser;
      return { user: tokenUser, isTokenAuth: true };
    } catch (error) {
      console.error('Error parsing token user from header:', error);
    }
  }
  
  // If no token user, try to get the user from the session
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    const sessionUser: TokenUser = {
      id: session.user.id,
      role: session.user.role || 'user',
      tokenId: '', // No token ID for session users
      tokenType: 'USER', // Treat session users as USER tokens
      permissions: {
        read: true,
        write: true,
        delete: session.user.role === 'admin' // Only admins can delete
      }
    };
    
    return { user: sessionUser, isTokenAuth: false };
  }
  
  // No authenticated user found
  return { user: null, isTokenAuth: false };
}
