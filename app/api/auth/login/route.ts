import { NextResponse } from "next/server";
import { authWithMoblieCode, authWithPassword } from "@/lib/api/users";

export async function POST(request: Request) {
  try {
    const { mobile, loginType, code, password } = await request.json();

    if (!mobile || mobile.length !== 11) {
      return NextResponse.json(
        { message: "请输入正确的手机号" },
        { status: 400 }
      );
    }

    let user;

    if (loginType === "code") {
      if (!code) {
        return NextResponse.json({ message: "请输入验证码" }, { status: 400 });
      }
      user = await authWithMoblieCode({ mobile, code });
    } else if (loginType === "password") {
      if (!password) {
        return NextResponse.json({ message: "请输入密码" }, { status: 400 });
      }
      user = await authWithPassword({ mobile, password });
    } else {
      return NextResponse.json({ message: "无效的登录方式" }, { status: 400 });
    }

    const response = NextResponse.json(
      { message: "登录成功", data: { user } },
      { status: 200 }
    );

    const expiresIn = 60 * 24 * 60 * 60 * 1000; // 60天的毫秒数
    const expiryDate = new Date(Date.now() + expiresIn);

    response.cookies.set({
      name: "userId",
      value: user.id,
      expires: expiryDate,
      path: "/",
      httpOnly: true,
      // 在宝塔环境下，可能需要禁用secure标志，除非确定使用了HTTPS
      secure: false, // 修改为false，避免HTTP环境下的cookie问题
      sameSite: "lax",
    });
    return response;
  } catch (error: any) {
    console.error("登录失败:", error);
    return NextResponse.json(
      { message: error.message || "登录失败" },
      { status: 500 }
    );
  }
}
