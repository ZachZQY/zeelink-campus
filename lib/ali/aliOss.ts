
import OSS from 'ali-oss';

const ossConfig = {
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAI5t9mottuz2BGYE4NneBq',
  accessKeySecret: 'b8Nwd5RKiEk8ywOYvrg6NLDSDBJFvg',
  bucket: 'campus-weweknow-com',
};



const downloadPathConfig = {
  baseUrl: 'https://campus-weweknow-com.oss-cn-shanghai.aliyuncs.com',
  basePath: 'zeelink-campus/'
};

// 创建OSS客户端
const client = new OSS(ossConfig);

// 生成唯一的文件名
function generateKey(
  filename: string,
  basePath: string = downloadPathConfig.basePath
) {
  const ext = filename.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${basePath}${timestamp}-${random}.${ext}`;
}

// 上传单个文件
export async function uploadFile(
  file: File,
  basePath: string = downloadPathConfig.basePath
): Promise<{ name?: string; path: string; type: string; url: string }> {
  try {
    // 生成文件名
    const key = generateKey(file.name, basePath);

    // 转换文件为 Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 上传文件
    const result = await client.put(key, buffer);

    return {
      name: file.name,
      path: key,
      type: file.type,
      url: result.url || `${downloadPathConfig.baseUrl}/${key}`
    };
  } catch (error) {
    console.error('上传失败:', error);
    throw new Error('上传失败');
  }
}

// 批量上传文件
export async function uploadFiles(files: File[], basePath: string = downloadPathConfig.basePath) {
  const results = await Promise.all(
    files.map((file) => uploadFile(file, basePath))
  );
  return results;
}