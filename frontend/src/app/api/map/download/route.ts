import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

// Proxy GET /api/map/download → Express backend /api/map/download
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const qs = searchParams.toString();
  const url = `${BACKEND}/api/map/download${qs ? '?' + qs : ''}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    // If backend returns a file, pass it through
    const ct = res.headers.get('Content-Type') || 'application/json';
    const cd = res.headers.get('Content-Disposition');
    const body = await res.arrayBuffer();
    const headers: Record<string, string> = { 'Content-Type': ct };
    if (cd) headers['Content-Disposition'] = cd;
    return new NextResponse(body, { status: res.status, headers });
  } catch {
    return NextResponse.json({ error: 'Backend unreachable' }, { status: 502 });
  }
}
