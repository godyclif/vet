import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Animal from '@/lib/models/Animal';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const animals = await Animal.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      animals,
    });
  } catch (error) {
    console.error('Error fetching animals:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch animals' },
      { status: 500 }
    );
  }
}
