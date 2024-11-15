'use client';
import cx from 'classnames';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { BiArrowBack, BiSolidCamera, BiImages } from 'react-icons/bi';
import { HiOutlineArrowPath } from 'react-icons/hi2';

interface CameraProps {
	imageUrl: string;
	onPhotoTaken: (file: File[], imageUrl: string) => void;
	openModal: () => void;
	setIsUpload: (isUpload: boolean) => void;
}

const Camera: React.FC<CameraProps> = ({
	imageUrl,
	onPhotoTaken,
	openModal,
	setIsUpload,
}) => {
	const [isStreaming, setIsStreaming] = useState<boolean>(false);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
		'environment'
	);

	const startCamera = async (): Promise<void> => {
		try {
			const constraints: MediaStreamConstraints = {
				video: { facingMode },
			};

			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current
					.play()
					.catch((e) => console.error('Error playing video:', e));

				streamRef.current = stream;

				setIsStreaming(true);
			}
		} catch (error) {
			console.error('Error accessing camera:', error);
			alert('Cannot access camera');
		}
	};

	const stopCamera = (): void => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			setIsStreaming(false);
			streamRef.current = null;
		}
	};

	const capturePhoto = (): void => {
		if (!videoRef.current) return;

		const canvas = document.createElement('canvas');
		const video = videoRef.current;

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		const context = canvas.getContext('2d');
		if (!context) return;

		context.drawImage(video, 0, 0);
		canvas.toBlob((blob) => {
			if (blob) {
				const url = URL.createObjectURL(blob);

				const file = new File([blob], `camera_${Date.now()}.jpg`, {
					type: 'image/jpeg',
				});

				onPhotoTaken?.([file], url);
			}
		}, 'image/jpeg');
	};

	const confirmPhoto = (): void => {
		if (!capturedImage) return;

		setIsUpload(true);
	};

	const cancelPhoto = (): void => {
		setCapturedImage(null);
		onPhotoTaken([], '');
	};

	const toggleCamera = (): void => {
		stopCamera();
		setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
	};

	useEffect(() => {
		if (isStreaming) {
			startCamera();
		}
	}, [facingMode]);

	useEffect(() => {
		return () => {
			stopCamera();
		};
	}, []);

	useEffect(() => {
		if (imageUrl) setCapturedImage(imageUrl);
	}, [imageUrl]);

	return (
		<div className="perma-camera overflow-hidden bg-black">
			<Link
				href="/"
				aria-label="Go to homepage"
				className="fixed top-6 left-6 text-2xl text-white z-20"
				scroll={false}
			>
				<BiArrowBack />
			</Link>

			<video
				ref={videoRef}
				className={cx('relative w-screen h-screen object-cover z-10', {
					'opacity-0 pointer-events-none': capturedImage,
				})}
			/>

			{/* Action Buttons */}
			<div className="perma-camera-actions fixed -translate-x-2/4 left-1/2 bottom-10 flex gap-10 justify-center z-20">
				{!capturedImage ? (
					isStreaming ? (
						<>
							<button
								className="text-white text-3xl focus:outline-none"
								onClick={openModal}
								aria-label="Open image uploader"
							>
								<BiImages />
							</button>
							<button
								className="relative flex-none w-16 h-16 bg-transparent border-4 border-white rounded-full after:content-[''] after:block after:w-12 after:h-12 after:bg-white after:rounded-full after:absolute after:top-1 after:left-1"
								onClick={capturePhoto}
								aria-label="Take a photo"
							/>
							<button
								className="text-white text-3xl focus:outline-none"
								onClick={toggleCamera}
								aria-label="Switch camera"
							>
								<HiOutlineArrowPath />
							</button>
						</>
					) : (
						<button
							className="button-icon"
							onClick={startCamera}
							aria-label="Open Camera"
						>
							<BiSolidCamera />
						</button>
					)
				) : (
					<>
						<button className="button-cancel" onClick={cancelPhoto}>
							Cancel
						</button>
						<button className="button" onClick={confirmPhoto}>
							Upload
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default Camera;
