import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

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

    // Get room details
    const room = await prisma.room.findUnique({
      where: {
        id: roomId
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

    return NextResponse.json(room);
  } catch (error) {
    console.error('Room fetch error:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching room' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const { name, description, isPrivate } = await request.json();

    // Validate input
    if (!name) {
      return NextResponse.json(
        { message: 'Room name is required' },
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

    // Check if user is admin of the room
    const member = await prisma.roomMember.findFirst({
      where: {
        roomId,
        userId: session.user.id,
        role: 'ADMIN'
      }
    });

    if (!member) {
      return NextResponse.json(
        { message: 'Only room admins can update room details' },
        { status: 403 }
      );
    }

    // Update room
    const updatedRoom = await prisma.room.update({
      where: {
        id: roomId
      },
      data: {
        name,
        description,
        isPrivate
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

    return NextResponse.json(updatedRoom);
  } catch (error) {
    console.error('Room update error:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating room' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if user is admin of the room or the creator
    const member = await prisma.roomMember.findFirst({
      where: {
        roomId,
        userId: session.user.id,
        role: 'ADMIN'
      }
    });

    if (!member && room.createdBy !== session.user.id) {
      return NextResponse.json(
        { message: 'Only room admins or creator can delete the room' },
        { status: 403 }
      );
    }

    // Delete room
    await prisma.room.delete({
      where: {
        id: roomId
      }
    });

    return NextResponse.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Room deletion error:', error);
    return NextResponse.json(
      { message: 'An error occurred while deleting room' },
      { status: 500 }
    );
  }
}
