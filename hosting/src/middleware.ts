import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers)

  // 現在URL
  requestHeaders.set('x-url', req.url)

  // 認証トークン
  const authIdToken = req.cookies.get('authIdToken')?.value;
  if (authIdToken) {
    requestHeaders.set('Authorization', `Bearer ${authIdToken}`);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  })
}

