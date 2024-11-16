'use client';
import { generateUUID } from '@/utils/nanoid';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { BiPlus, BiX } from 'react-icons/bi';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  onImagesSelect: (files: File[]) => void;
  maxSize?: number; // MB
  maxCount?: number;
  maxWidthOrHeight?: number;
}

export default function ImageUploader({
  onImagesSelect,
  maxSize = 1, // 默认1MB
  maxCount = 9,
  maxWidthOrHeight = 1920,
}: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 使用 browser-image-compression 压缩图片
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: maxSize,
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: true,
      fileType: file.type,
      initialQuality: 0.7,
      preserveExif: true,
    };

    try {
      const compressedBlob = await imageCompression(file, options);

      // 创建新的 File 对象，保留原始文件名和类型
      const compressedFile = new File(
        [compressedBlob],
        file.name, // 保留原始文件名
        {
          type: file.type,
          lastModified: Date.now(),
        }
      );

      return compressedFile;
    } catch (error) {
      console.error('压缩失败:', error);
      throw error;
    }
  };

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      setError('Only images are allowed');
      return false;
    }
    return true;
  };

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFilesSelect = async (files: FileList) => {
    if (images.length + files.length > maxCount) {
      setError(`The maximum number of images is ${maxCount} files`);
      return;
    }

    setLoading(true);
    setError(null);

    const newFiles: ImageFile[] = [];
    const validFiles: File[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (validateFile(file)) {
          // 压缩图片
          const compressedFile = await compressImage(file);
          const preview = await createPreview(compressedFile);

          newFiles.push({
            id: generateUUID(),
            file: compressedFile,
            preview,
          });
          validFiles.push(compressedFile);

          // 输出压缩前后的大小对比
          console.log(
            `${file.name} 压缩前: ${(file.size / 1024 / 1024).toFixed(2)}MB`
          );
          console.log(
            `${file.name} 压缩后: ${(compressedFile.size / 1024 / 1024).toFixed(
              2
            )}MB`
          );
        }
      }

      if (newFiles.length > 0) {
        const updatedImages = [...images, ...newFiles];
        setImages(updatedImages);
        onImagesSelect(updatedImages.map((img) => img.file));
      }
    } catch (err) {
      setError('Failed to process images. Please try again.');
      console.error('Error processing images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFilesSelect(files);
    }
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter((img) => img.id !== id);
    setImages(updatedImages);
    onImagesSelect(updatedImages.map((img) => img.file));
  };

  return (
    <div className='w-full max-w-3xl'>
      {error && (
        <div className='text-sm text-red-500 text-center mb-4'>{error}</div>
      )}

      {loading && (
        <div className='text-sm text-blue-500 text-center mb-4'>
          Compressing images...
        </div>
      )}

      <div className='grid grid-cols-3 gap-4 mb-4'>
        {images.map((image) => (
          <div key={image.id} className='relative aspect-square'>
            <Image
              src={image.preview}
              alt='Preview'
              fill
              style={{ objectFit: 'cover' }}
              className='w-full h-full object-cover rounded-lg'
            />
            <button
              onClick={() => removeImage(image.id)}
              className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors'
              disabled={loading}
            >
              <BiX className='w-4 h-4' />
            </button>
          </div>
        ))}

        {images.length < maxCount && (
          <div className='aspect-square'>
            <input
              ref={fileInputRef}
              type='file'
              id='image-input'
              className='hidden'
              onChange={handleInputChange}
              multiple
              accept='image/*'
              disabled={loading}
            />
            <label
              htmlFor='image-input'
              className={`flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-center cursor-pointer hover:border-gray-400 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <BiPlus className='w-6 h-6' />
              <div className='text-sm'>
                Select
                <br />({images.length}/{maxCount})
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
