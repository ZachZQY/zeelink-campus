import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // 删除userId cookie
    cookieStore.delete('userId');
    
    return NextResponse.json(
      { message: '退出登录成功' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('退出登录失败:', error);
    return NextResponse.json(
      { message: error.message || '退出登录失败' },
      { status: 500 }
    );
  }
}