import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

async function proxy(request: NextRequest, backendPath: string, method: string) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();
  const url = `${BACKEND}${backendPath}${query ? '?' + query : ''}`;
  const headers: Record<string, string> = {};
  const auth = request.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;
  
  const isJson = request.headers.get('content-type')?.includes('application/json');
  if (isJson) headers['Content-Type'] = 'application/json';

  const body = ['GET', 'HEAD'].includes(method) ? undefined : await request.text();
  
  const res = await fetch(url, { method, headers, body: body || undefined });
  const data = await res.text();
  
  return new NextResponse(data, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' }
  });
}

export async function GET(request: NextRequest) { return proxy(request, '/api/tenders', 'GET'); }
export async function POST(request: NextRequest) { return proxy(request, '/api/tenders', 'POST'); }
export async function PUT(request: NextRequest) { return proxy(request, '/api/tenders', 'PUT'); }
export async function DELETE(request: NextRequest) { return proxy(request, '/api/tenders', 'DELETE'); }
