import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { publishPost, publishPostInputs } from "@/lib/api/posts";

export async function POST(request: NextRequest) {
  try {
    // 从cookie中获取用户ID
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    if (!userId) {
      return NextResponse.json({ error: "用户未登录" }, { status: 401 });
    }

    // 解析请求体
    const { content, images, topicNames } = await request.json();

    // 验证必要字段
    if (!content) {
      return NextResponse.json({ error: "内容不能为空" }, { status: 400 });
    }

    // 准备发布参数
    const postData: publishPostInputs = {
      user_id: userId,
      content,
      images: images || [],
      topicNames: topicNames || [],
      site_id: 1,
    };

    // 调用发布函数
    const result = await publishPost(postData);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("发布帖子失败:", error);
    return NextResponse.json(
      { error: error.message || "发布帖子失败" },
      { status: 500 }
    );
  }
}
