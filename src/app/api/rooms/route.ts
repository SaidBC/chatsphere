import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUser } from '@/lib/auth/getTokenUser';
import { hasPermission } from '@/lib/auth/tokenAuth';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get authenticated user from either session or token
    const { user, isTokenAuth } = await getAuthenticatedUser(request as any);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if token has read permission
    if (isTokenAuth && !hasPermission(user, 'read')) {
      return NextResponse.json(
        { error: 'Forbidden: Token does not have read permission' },
        { status: 403 }
      );
    }

    // Get all rooms (public rooms and private rooms the user is a member of)
    const rooms = await prisma.room.findMany({
      where: {
        OR: [
          { isPrivate: false },
          {
            isPrivate: true,
            members: {
              some: {
                userId: user.id
              }
            }
          }
        ]
      },
      include: {
        _count: {
          select: {
            messages: true,
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Rooms fetch error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching rooms' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get authenticated user from either session or token
    const { user, isTokenAuth } = await getAuthenticatedUser(request as any);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if token has write permission
    if (isTokenAuth && !hasPermission(user, 'write')) {
      return NextResponse.json(
        { error: 'Forbidden: Token does not have write permission' },
        { status: 403 }
      );
    }

    const { name, description, isPrivate } = await request.json();

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    // Create room
    const room = await prisma.room.create({
      data: {
        name,
        description: description || '',
        isPrivate: isPrivate || false,
        createdBy: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN'
          }
        }
      },
      include: {
        _count: {
          select: {
            messages: true,
            members: true
          }
        }
      }
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    console.error('Room creation error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating room' },
      { status: 500 }
    );
  }
}
