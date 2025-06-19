import { run } from '@/lib/mongodb';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await run();

    const testUser = await User.create({
      id: '1',
      email: 'test@example.com',
      name: 'Thg khánh ngu',
      age: 20,
      gender: 'male',
      weight: 90,
      height: 165,
    });

    return NextResponse.json({
      message: "Test user created successfully!",
      user: testUser,
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json({ error: "Failed to create test data" }, { status: 500 });
  }
}