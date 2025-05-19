import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// Define session type with user properties
interface CustomSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username: string;
    role: string;
    bio?: string | null;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as CustomSession | null;

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const roomId = params.roomId;

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: {
        id: roomId
      }
    });

    if (!room) {
      return NextResponse.json(
        { message: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if user has access to private room
    if (room.isPrivate) {
      const isMember = await prisma.roomMember.findFirst({
        where: {
          roomId,
          userId: session.user.id
        }
      });

      if (!isMember) {
        return NextResponse.json(
          { message: 'Access denied to private room' },
          { status: 403 }
        );
      }
    }

    // Get messages for the room
    const messages = await prisma.message.findMany({
      where: {
        roomId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as CustomSession | null;

    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const roomId = params.roomId;
    const { content } = await request.json();

    // Validate input
    if (!content) {
      return NextResponse.json(
        { message: 'Message content is required' },
        { status: 400 }
      );
    }

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: {
        id: roomId
      }
    });

    if (!room) {
      return NextResponse.json(
        { message: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if user has access to private room
    if (room.isPrivate) {
      const isMember = await prisma.roomMember.findFirst({
        where: {
          roomId,
          userId: session.user.id
        }
      });

      if (!isMember) {
        return NextResponse.json(
          { message: 'Access denied to private room' },
          { status: 403 }
        );
      }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        roomId,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Message creation error:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating message' },
      { status: 500 }
    );
  }
}
