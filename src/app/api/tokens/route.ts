import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import crypto from 'crypto';

const prisma = new PrismaClient();

// GET /api/tokens - Get all tokens for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Check if user is an admin or client for full access
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const isAdmin = user.role === 'admin' || user.role === 'CLIENT';
    
    // If admin/client, get all tokens; otherwise, get only user's tokens
    const tokens = await prisma.apiToken.findMany({
      where: isAdmin ? {} : { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Remove the actual token value for security
    const sanitizedTokens = tokens.map(token => ({
      ...token,
      token: token.token.substring(0, 8) + '...' // Only show first 8 chars
    }));
    
    return NextResponse.json(sanitizedTokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}

// POST /api/tokens - Create a new token
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const body = await request.json();
    const { name, type, permissions, expiresAt } = body;
    
    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Token name is required' },
        { status: 400 }
      );
    }
    
    // Any user can create CLIENT tokens
    // No role check required
    
    // Generate a secure random token
    const tokenValue = crypto.randomBytes(32).toString('hex');
    
    // Create the token
    const token = await prisma.apiToken.create({
      data: {
        token: tokenValue,
        name,
        type: type || 'USER',
        userId,
        permissions: permissions || {},
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
