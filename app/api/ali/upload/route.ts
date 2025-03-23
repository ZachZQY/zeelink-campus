import { NextRequest, NextResponse } from "next/server";
import { uploadFiles } from "@/lib/ali/aliOss";

// 处理文件上传
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // 确保所有文件都是File类型
    const validFiles = files.filter(
      (file): file is File => file instanceof File
    );

    if (validFiles.length === 0) {
      return NextResponse.json(
        { error: "Invalid file format" },
        { status: 400 }
      );
    }

    const uploadResults = await uploadFiles(validFiles);
    return NextResponse.json(uploadResults);
  } catch (error) {
    console.error("处理上传请求失败:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process upload";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
export const config = {
  api: {
    bodyParser: false,
  },
};
