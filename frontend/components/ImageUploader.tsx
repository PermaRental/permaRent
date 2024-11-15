'use client';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { BiPlus, BiX } from 'react-icons/bi';
import { generateUUID } from '@/utils/nanoid';

interface ImageFile {
	id: string;
	file: File;
	preview: string;
}

interface ImageUploaderProps {
	onImagesSelect: (files: File[]) => void;
	maxSize?: number; // MB
	maxCount?: number;
}

export default function ImageUploader({
	onImagesSelect,
	maxSize = 5,
	maxCount = 9,
}: ImageUploaderProps) {
	const [images, setImages] = useState<ImageFile[]>([]);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const validateFile = (file: File): boolean => {
		if (file.size > maxSize * 1024 * 1024) {
			setError(`The maximum file size is ${maxSize}MB`);
			return false;
		}

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

		const newFiles: ImageFile[] = [];
		const validFiles: File[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (validateFile(file)) {
				const preview = await createPreview(file);
				newFiles.push({
					id: generateUUID(),
					file,
					preview,
				});
				validFiles.push(file);
			}
		}

		if (newFiles.length > 0) {
			const updatedImages = [...images, ...newFiles];
			setImages(updatedImages);
			onImagesSelect(updatedImages.map((img) => img.file));
			setError(null);
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
		<div className="w-full max-w-3xl">
			{error && (
				<div className="text-sm text-red-500 text-center mb-4">{error}</div>
			)}

			<div className="grid grid-cols-3 gap-4 mb-4">
				{images.map((image) => (
					<div key={image.id} className="relative aspect-square">
						<Image
							src={image.preview}
							alt="Preview"
							fill
							style={{ objectFit: 'cover' }}
							className="w-full h-full object-cover rounded-lg"
						/>
						<button
							onClick={() => removeImage(image.id)}
							className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
						>
							<BiX className="w-4 h-4" />
						</button>
					</div>
				))}

				{images.length < maxCount && (
					<div className="aspect-square">
						<input
							ref={fileInputRef}
							type="file"
							id="image-input"
							className="hidden"
							onChange={handleInputChange}
							// Allow selecting from gallery and taking photos directly
							multiple
							accept="image/*"
							capture="environment"
						/>
						<label
							htmlFor="image-input"
							className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-center cursor-pointer hover:border-gray-400 transition-colors"
						>
							<BiPlus className="w-6 h-6" />
							<div className="text-sm">
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
