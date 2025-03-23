import { NextRequest, NextResponse } from "next/server";
import { uploadFiles } from "@/lib/qiniu/qiniuOss";

// 处理文件上传
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadResults = await uploadFiles(files);
    return NextResponse.json(uploadResults);
  } catch (error) {
    console.error("处理上传请求失败:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
