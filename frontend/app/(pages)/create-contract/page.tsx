'use client';
import ContractForm, { ContractParams } from '@/components/ContractForm';
import ImageUploader from '@/components/ImageUploader';
import IPFSUploader from '@/components/IPFSUploader';
import Link from 'next/link';
import { useState } from 'react';
import { BiX } from 'react-icons/bi';

export default function CreateContractPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string>('');
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [contractParams, setContractParams] = useState<ContractParams | null>(
    null
  );

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
    <div className='page-create-contract'>
      {!contractParams ? (
        <div className='flex flex-col h-full p-4'>
          <div className='relative'>
            <p className='text-xl font-bold text-center mb-4'>Upload images</p>
            <Link href='/'>
              <button
                className='absolute top-0 right-0'
                onClick={closeModal}
                aria-label='Close image uploader'
              >
                <BiX className='w-7 h-7' />
              </button>
            </Link>
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
      ) : (
        <div className='confirm-contract'>
          <div className='page-header'>
            <h1>Confirm your lease</h1>
            <button
              className='text-sm text-red-500 border border-red-500 rounded py-1.5 px-3 transition-colors select-none hover:bg-red-500 hover:text-white'
              aria-label='Cancel create contract'
              onClick={cancelCreateContract}
            >
              Cancel
            </button>
          </div>

          <div className='page-body'>
            <ContractForm
              contractParams={contractParams!}
              ipfsHash={ipfsHash}
              cancelCreateContract={cancelCreateContract}
            />
          </div>
        </div>
      )}
    </div>
  );
}
