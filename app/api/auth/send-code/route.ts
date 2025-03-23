import { NextResponse } from 'next/server';
import { sendVerificationCode } from '@/lib/api/verication_codes';

export async function POST(request: Request) {
  try {
    const { mobile } = await request.json();
    
    if (!mobile || mobile.length !== 11) {
      return NextResponse.json(
        { message: '请输入正确的手机号' },
        { status: 400 }
      );
    }

    const result = await sendVerificationCode(mobile);
    
    return NextResponse.json(
      { message: '验证码发送成功', data: { mobile: result.mobile } },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('发送验证码失败:', error);
    return NextResponse.json(
      { message: error.message || '发送验证码失败' },
      { status: 500 }
    );
  }
}