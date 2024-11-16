'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { BiX } from 'react-icons/bi';
import Camera from '@/components/Camera';
import ImageUploader from '@/components/ImageUploader';
import IPFSUploader from '@/components/IPFSUploader';
import ContractForm from '@/components/ContractForm';

Modal.setAppElement('#perma-create-contract');

export default function CreateContractPage() {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [ipfsHash, setIpfsHash] = useState<string>('');
	const [isUpload, setIsUpload] = useState<boolean>(false);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [contractParams, setContractParams] = useState<string | null>(null);

	const openModal = (): void => {
		setIsModalOpen(true);
	};

	const closeModal = (): void => {
		setIsModalOpen(false);
	};

	const cancelCreateContract = (): void => {
		setContractParams(null);
		setImageUrl(null);
		setIsUpload(false);
		setSelectedFiles([]);
		setIsModalOpen(false);
	};

	return (
		<div id="perma-create-contract" className="page-create-lease">
			{!contractParams ? (
				<div className="create-contract">
					<Modal
						isOpen={isModalOpen}
						onRequestClose={closeModal}
						closeTimeoutMS={200}
						overlayClassName="flex justify-center items-center"
					>
						<div className="flex flex-col h-full">
							<div className="relative">
								<p className="text-xl font-bold text-center mb-4">
									Upload images
								</p>
								<button
									className="absolute top-0 right-0"
									onClick={closeModal}
									aria-label="Close image uploader"
								>
									<BiX className="w-7 h-7" />
								</button>
							</div>
							<ImageUploader
								onImagesSelect={function (files: File[]): void {
									setSelectedFiles(files ?? []);
								}}
							/>
							<IPFSUploader
								ipfsHash={ipfsHash}
								setIpfsHash={setIpfsHash}
								selectedFiles={selectedFiles}
								setContractParams={setContractParams}
							/>
						</div>
					</Modal>

					<Camera
						imageUrl={imageUrl ?? ''}
						onPhotoTaken={(file, imageUrl) => {
							setSelectedFiles(file);
							setImageUrl(imageUrl);
						}}
						openModal={openModal}
						setIsUpload={setIsUpload}
					/>

					{imageUrl && (
						<div className="contract-preview absolute top-0 left-0 w-full h-full z-2">
							<Image
								src={imageUrl}
								alt="Uploaded image"
								fill
								className="object-cover"
							/>
							<IPFSUploader
								ipfsHash={ipfsHash}
								setIpfsHash={setIpfsHash}
								selectedFiles={selectedFiles}
								showUploadBtn={false}
								isUpload={isUpload}
								setContractParams={setContractParams}
							/>
						</div>
					)}
				</div>
			) : (
				<div className="confirm-contract">
					<div className="flex justify-between items-center gap-6 text-white bg-sky-950 rounded-bl-2xl rounded-br-2xl p-6 shadow-lg">
						<h1 className="text-xl font-bold">Confirm your lease</h1>
						<button
							className="text-sm text-red-500 border border-red-500 rounded py-1.5 px-3 transition-colors select-none hover:bg-red-500 hover:text-white"
							aria-label="Cancel create contract"
							onClick={cancelCreateContract}
						>
							Cancel
						</button>
					</div>

					<ContractForm
						contractParams={contractParams!}
						ipfsHash={ipfsHash}
						cancelCreateContract={cancelCreateContract}
					/>
				</div>
			)}
		</div>
	);
}
