'use client';

import { useState, useRef } from 'react';
import { image } from '@/lib/api/posts';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

type PublishFormProps = {
  onSubmit: (data: {
    content: string;
    images: image[];
    topicNames: string[];
  }) => Promise<void>;
};

export default function PublishForm({ onSubmit }: PublishFormProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<image[]>([]);
  const [topicNames, setTopicNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxContentLength = 1000;

  // 处理图片上传
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    try {
      setIsUploading(true);
      const formData = new FormData();
      const files = Array.from(event.target.files);
      
      // 验证文件大小和类型
      for (const file of files) {
        if (file.size > maxFileSize) {
          toast.error(`文件 ${file.name} 超过5MB限制`);
          return;
        }
        if (!allowedTypes.includes(file.type)) {
          toast.error(`文件 ${file.name} 格式不支持，请上传jpg、png或gif格式`);
          return;
        }
        formData.append('files', file);
      }

      const response = await fetch('/api/qiniu/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const uploadedImages = await response.json();
      if (images.length + uploadedImages.length > 9) {
        toast.error('图片总数不能超过9张');
        return;
      }
      // 使用函数式更新确保获取最新的状态
      setImages(prevImages => [...prevImages, ...uploadedImages]);
      // 重置文件输入框，以支持重复上传
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('图片上传失败:', error);
      toast.error('图片上传失败，请重试');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setIsUploading(false);
    }
  };

  // 处理话题输入
  const handleTopicInput = (value: string) => {
    const topics = value.split(' ').filter(topic => topic.trim() !== '');
    setTopicNames(topics);
  };

  // 处理表单提交
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) {
      toast.error('请输入内容');
      return;
    }

    if (content.length > maxContentLength) {
      toast.error(`内容不能超过${maxContentLength}字`);
      return;
    }

    if (images.length > 9) {
      toast.error('最多只能上传9张图片');
      return;
    }

    if (topicNames.length > 5) {
      toast.error('最多只能添加5个话题');
      return;
    }

    if (topicNames.some(topic => topic.length > 20)) {
      toast.error('话题名称不能超过20个字符');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        content,
        images,
        topicNames
      });
      
      // 重置表单
      setContent('');
      setImages([]);
      setTopicNames([]);
      toast.success('发布成功！');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('发布失败:', error);
      toast.error('发布失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4 pb-16 sm:pb-0">
        {/* 内容输入区 */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="分享你的想法..."
            className="w-full h-28 sm:h-32 p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-base text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
            maxLength={maxContentLength}
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">{content.length}/{maxContentLength}</span>
          </div>
        </div>

        {/* 图片上传区 */}
        <div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
            id="image-upload"
            disabled={isSubmitting}
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-200 ease-in-out text-sm sm:text-base touch-manipulation"
          >
            {isUploading ? (
              <>
                <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                上传中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                上传图片
              </>
            )}
          </label>
          {/* 图片预览 */}
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{images.length}/9 张图片</p>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/80 transition-colors duration-200 opacity-70 hover:opacity-100 touch-manipulation"
                  disabled={isSubmitting}
                  aria-label="删除图片"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 话题输入区 */}
        <div>
          <input
            type="text"
            value={topicNames.join(' ')}
            onChange={(e) => handleTopicInput(e.target.value)}
            placeholder="添加话题（用空格分隔）"
            className="w-full p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out text-base text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700"
            disabled={isSubmitting}
          />
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 text-base font-medium touch-manipulation fixed bottom-4 left-0 right-0 mx-auto max-w-[calc(100%-2rem)] sm:static sm:bottom-auto sm:left-auto sm:right-auto sm:mx-0 sm:max-w-full shadow-lg sm:shadow-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? '发布中...' : '发布'}
        </button>
      </form>
    </div>
  );
}