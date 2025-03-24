import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要登录才能访问的路径
const protectedPaths = [
  '/posts/publish',
  '/posts'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查当前路径是否需要登录
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  );
  console.log('isProtectedPath：', isProtectedPath);
  if (isProtectedPath) {
    // 获取userId cookie
    const userId = request.cookies.get('userId')?.value;
    console.log('userId：', userId);
    // 如果没有userId，重定向到登录页面
    if (!userId) {
      const loginUrl = new URL('/login', request.nextUrl.origin);
      // 添加原始URL作为重定向参数，登录后可以返回
      //loginUrl.searchParams.set('redirect', pathname);
      console.log('origin：', request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// 配置中间件匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有需要保护的路径
     */
    '/posts/publish/:path*',
    '/posts/:path*',
  ],
};