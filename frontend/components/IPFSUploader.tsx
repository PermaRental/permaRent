import React, { useEffect, useState } from 'react';
import { PinataSDK } from 'pinata-web3';
import { useMutation } from '@tanstack/react-query';

const pinata = new PinataSDK({
	pinataJwt: `${process.env.NEXT_PUBLIC_PINATA_JWT}`,
	pinataGateway: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}`,
});

// Define the props type
type IPFSUploaderProps = {
	ipfsHash: string;
	selectedFiles: File[];
	showUploadBtn?: boolean;
	isUpload?: boolean;
	setIpfsHash: (ipfsHash: string) => void;
	setContractParams: (contractParams: string) => void;
};

const IPFSUploader: React.FC<IPFSUploaderProps> = ({
	ipfsHash,
	selectedFiles,
	showUploadBtn = true,
	isUpload = false,
	setIpfsHash,
	setContractParams,
}) => {
	const uploadFileToPinataMutate = useMutation({
		mutationKey: ['update-files-to-pinata', selectedFiles],
		mutationFn: async () => {
			const keyRequest = await fetch('/api/key');
			const keyData = await keyRequest.json();
			const upload = await pinata.upload
				.fileArray(selectedFiles)
				.addMetadata({
					name: `${selectedFiles.map((ele) => ele.name)?.join('|')}`,
					keyValues: {
						fileNames: `${selectedFiles.map((ele) => ele.name)?.join('|')}`,
					},
				})
				.key(keyData.JTW);

			setIpfsHash(upload.IpfsHash);

			return {
				jwt: keyData.JWT,
				result: upload,
			};
		},
		onError(error) {
			console.error(error);
		},
	});

	const extractFilesInfoMutate = useMutation({
		mutationKey: ['extract-files-info', ipfsHash],
		mutationFn: async () => {
			if (!ipfsHash) {
				throw new Error('Please upload your file first!');
			}

			// [base64_image1, base64_image2, ...]
			const imageDatas = (await getImageInfoFromIpfs(ipfsHash)) as string[];

			const result = await extractImageInfo(imageDatas);

			setContractParams(result);

			return result;
		},
		onError(error) {
			console.error(error);
		},
	});

	async function getImageInfoFromIpfs(hash: string) {
		const response = await fetch(`/api/extract-image-data?hash=${hash}`);
		const results = await response.json();
		return results?.results?.map((ele: { value: string }) => ele.value);
	}

	async function extractImageInfo(images: string[]) {
		try {
			const response = await fetch('/api/extract-contract', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					images: images,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to extract information');
			}

			return await response.json();
		} catch (error) {
			console.error('Error extracting info:', error);
			throw error;
		}
	}

	useEffect(() => {
		if (isUpload) {
			uploadFileToPinataMutate.mutate();
		}
	}, [isUpload]);

	return (
		<>
			{/* Upload to IPFS */}
			{!!selectedFiles?.length && (
				<>
					{showUploadBtn && (
						<button
							className="button mt-auto"
							onClick={() => uploadFileToPinataMutate.mutate()}
						>
							Upload files to IPFS
						</button>
					)}

					{(uploadFileToPinataMutate.isPending ||
						uploadFileToPinataMutate.data?.result) && (
						<div className="fixed inset-x-0 inset-y-0 w-screen h-screen flex flex-col justify-center items-center gap-4 bg-black bg-opacity-80 text-white z-50 p-6">
							{(uploadFileToPinataMutate.isPending ||
								extractFilesInfoMutate.isPending) && (
								<div className="flex flex-col items-center gap-2 text-sm text-center text-gray-400">
									<div className="inline-flex justify-center items-center w-20 h-20">
										<div className="loader" />
									</div>
									{uploadFileToPinataMutate.isPending && (
										<span>Uploading to IPFS</span>
									)}
									{extractFilesInfoMutate.isPending && (
										<span>Extracting file content</span>
									)}
								</div>
							)}

							{uploadFileToPinataMutate.data?.result &&
								!extractFilesInfoMutate.isPending && (
									<code className="w-10/12 whitespace-pre-wrap break-all text-xs bg-gray-400 rounded-md p-4 bg-opacity-50">
										{JSON.stringify(
											uploadFileToPinataMutate.data?.result!,
											null,
											'\r'
										)
											.replace('{', '')
											.replace('}', '')
											.trim()}
									</code>
								)}

							{/* Extract IPFS results */}
							{ipfsHash && !extractFilesInfoMutate.isPending && (
								<div>
									<button
										onClick={() => extractFilesInfoMutate.mutate()}
										className="button"
									>
										Extract IPFS data result
									</button>
								</div>
							)}
						</div>
					)}
				</>
			)}
		</>
	);
};

export default IPFSUploader;
