import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import crypto from 'crypto';

const prisma = new PrismaClient();

/**
 * POST /api/tokens/generate
 * API endpoint to generate tokens programmatically
 * Requires authentication and proper permissions
 */
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, type, targetUserId, permissions, expiresAt } = body;
    
    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Token name is required' },
        { status: 400 }
      );
    }
    
    // Check if user is allowed to create tokens for other users or CLIENT tokens
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Only admins can create CLIENT tokens
    if (type === 'CLIENT' && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can create CLIENT tokens' },
        { status: 403 }
      );
    }
    
    // Only admins can create tokens for other users
    const tokenUserId = targetUserId || userId;
    if (tokenUserId !== userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You can only create tokens for yourself' },
        { status: 403 }
      );
    }
    
    // Verify target user exists if creating for another user
    if (tokenUserId !== userId) {
      const targetUser = await prisma.user.findUnique({
        where: { id: tokenUserId }
      });
      
      if (!targetUser) {
        return NextResponse.json(
          { error: 'Target user not found' },
          { status: 404 }
        );
      }
    }
    
    // Generate a secure random token
    const tokenValue = crypto.randomBytes(32).toString('hex');
    
    // Create the token
    const token = await prisma.apiToken.create({
      data: {
        token: tokenValue,
        name,
        type: type || 'USER',
        userId: tokenUserId,
        permissions: permissions || {
          read: true,
          write: false,
          delete: false,
          rooms: []
        },
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });
    
    // Return the full token value only on creation
    return NextResponse.json({
      ...token,
      fullToken: tokenValue // Include the full token only on creation
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating token:', error);
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    );
  }
}
