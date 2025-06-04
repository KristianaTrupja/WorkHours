import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";

// GET: Fetch work hours
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const filters: any = {
      userId: parseInt(userId),
    };

    if (month && year) {
      const start = new Date(parseInt(year), parseInt(month) - 1, 1);
      const end = new Date(parseInt(year), parseInt(month), 0);
      filters.date = {
        gte: start,
        lte: end,
      };
    }

    const workhours = await db.workHours.findMany({
      where: filters,
      select: {
        id: true,
        date: true,
        hours: true,
        note: true,
        userId: true,
        projectId: true,
      },
    });

    return NextResponse.json({ workhours }, { status: 200 });
  } catch (error) {
    console.error("Error fetching work hours:", error);
    return NextResponse.json({ error: "Failed to fetch work hours" }, { status: 500 });
  }
}

// POST: Create new work entry
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, hours, note, userId, projectId } = body;

  if (!date || !hours || !userId || !projectId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const entry = await db.workHours.create({
      data: {
        date: new Date(date),
        hours,
        note,
        userId,
        projectId,
      },
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Error creating workHours:", error);
    return NextResponse.json({ error: "Could not create work entry" }, { status: 400 });
  }
}

// PUT: Update hours or note for existing entry
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { date, userId, projectId, hours, note } = body;

  if (!date || !userId || !projectId || typeof hours !== 'number') {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const updated = await db.workHours.upsert({
      where: {
        userId_date_projectId: {
          userId,
          date: new Date(date),
          projectId,
        },
      },
      update: {
        hours,
        note,
      },
      create: {
        userId,
        date: new Date(date),
        projectId,
        hours,
        note,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Could not update work entry' }, { status: 500 });
  }
}

// DELETE: Remove a work entry
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');
  const projectId = searchParams.get('projectId');

  if (!userId || !date || !projectId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await db.workHours.delete({
      where: {
        userId_date_projectId: {
          userId: parseInt(userId),
          date: new Date(date),
          projectId: parseInt(projectId),
        },
      },
    });

    return NextResponse.json({ message: 'Work entry deleted successfully' });
  } catch (error) {
    console.error("Error deleting work entry:", error);
    return NextResponse.json({ error: 'Could not delete work entry' }, { status: 500 });
  }
}