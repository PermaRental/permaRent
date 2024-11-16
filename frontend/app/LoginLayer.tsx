'use client';
import LoginButton from '@/components/LoginButton';
import Navbar from '@/components/Navbar';
import { useIsMounted } from '@/hooks/useIsMounted';
import Image from 'next/image';
import { ReactNode } from 'react';
import Modal from 'react-modal';
import { useAccount } from 'wagmi';

Modal.setAppElement('#main');

export default function LoginLayer({ children }: { children: ReactNode }) {
  const account = useAccount();
  const isMounted = useIsMounted();
  const { isConnected } = account;

  return (
    <>
      {!isConnected && isMounted && account.status !== 'connecting' && (
        <div className='fixed inset-x-0 inset-y-0 flex flex-col justify-center items-center bg-sky-950 z-50'>
          {/* <h1 className='text-4xl font-bold text-center text-white'>
            PermaRental
          </h1> */}
          <div
            className='relative'
            style={{ width: '100vw', aspectRatio: '1920/1080' }}
          >
            <Image
              src='/logo.png'
              alt='perma rent'
              fill
              className='object-cover'
            />
          </div>
          <LoginButton />
        </div>
      )}
      <main id='main' className='min-h-screen'>
        <Navbar />
        {children}
      </main>
    </>
  );
}
