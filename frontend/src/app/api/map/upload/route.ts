import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

// Proxy POST /api/map/upload → Express backend /api/map/upload  
export async function POST(req: NextRequest) {
  const url = `${BACKEND}/api/map/upload`;
  try {
    const auth = req.headers.get('authorization');
    const formData = await req.formData();
    const headers: Record<string, string> = {};
    if (auth) headers['Authorization'] = auth;
    // Do NOT set Content-Type — fetch sets it automatically for FormData (with boundary)
    const res = await fetch(url, { method: 'POST', headers, body: formData });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }
}
