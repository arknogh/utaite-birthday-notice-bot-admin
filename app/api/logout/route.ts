import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.cookies.set('auth', '', { httpOnly: true, maxAge: -1 });
    return response;
}