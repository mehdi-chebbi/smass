import { NextRequest, NextResponse } from 'next/server';
const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';
async function proxy(req: NextRequest, id: string, method: string) {
  const url = `${BACKEND}/api/map/layers/${id}`;
  const headers: Record<string,string> = {};
  const auth = req.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;
  if (!['GET','HEAD'].includes(method)) headers['Content-Type'] = 'application/json';
  const body = ['GET','HEAD'].includes(method) ? undefined : await req.text();
  const res = await fetch(url, { method, headers, body });
  return new NextResponse(await res.text(), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxy(req, id, 'GET');
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxy(req, id, 'PUT');
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxy(req, id, 'DELETE');
}
