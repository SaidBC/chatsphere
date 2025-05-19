import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/tokens/[id] - Get a specific token
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is properly handled
    const { id } = params;
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const tokenId = id;
    
    // Check if user is an admin or client
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
    
    // Get the token
    const token = await prisma.apiToken.findUnique({
      where: { id: tokenId },
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
      }
    });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }
    
    // Check if user has permission to view this token
    if (!isAdmin && token.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Mask the token for security
    const sanitizedToken = {
      ...token,
      token: token.token.substring(0, 8) + '...' // Only show first 8 chars
    };
    
    return NextResponse.json(sanitizedToken);
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token' },
      { status: 500 }
    );
  }
}

// PUT /api/tokens/[id] - Update a token (e.g., revoke, update name)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is properly handled
    const { id } = params;
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const tokenId = id;
    const body = await request.json();
    const { name, isRevoked } = body;
    
    // Check if token exists and belongs to user
    const token = await prisma.apiToken.findUnique({
      where: { id: tokenId },
      include: { user: true }
    });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }
    
    // Check if user has permission to update this token
    const isAdmin = session.user.role === 'admin';
    if (!isAdmin && token.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Update the token
    const updatedToken = await prisma.apiToken.update({
      where: { id: tokenId },
      data: {
        name: name !== undefined ? name : token.name,
        isRevoked: isRevoked !== undefined ? isRevoked : token.isRevoked,
        ...(isRevoked ? { lastUsedAt: new Date() } : {})
      }
    });
    
    // Mask the token for security
    const sanitizedToken = {
      ...updatedToken,
      token: updatedToken.token.substring(0, 8) + '...' // Only show first 8 chars
    };
    
    return NextResponse.json(sanitizedToken);
  } catch (error) {
    console.error('Error updating token:', error);
    return NextResponse.json(
      { error: 'Failed to update token' },
      { status: 500 }
    );
  }
}

// DELETE /api/tokens/[id] - Delete a token
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params is properly handled
    const { id } = params;
    
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const tokenId = id;
    
    // Check if token exists and belongs to user
    const token = await prisma.apiToken.findUnique({
      where: { id: tokenId }
    });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }
    
    // Check if user has permission to delete this token
    const isAdmin = session.user.role === 'admin';
    if (!isAdmin && token.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Delete the token
    await prisma.apiToken.delete({
      where: { id: tokenId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting token:', error);
    return NextResponse.json(
      { error: 'Failed to delete token' },
      { status: 500 }
    );
  }
}
