import { NextResponse } from 'next/server';

export default function middleware(request: Request) {
  const requestHeaders = new Headers(request.headers);
  const { pathname } = new URL(request.url);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
