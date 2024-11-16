'use client';
import { ReactNode } from 'react';
import Modal from 'react-modal';
import { useAccount } from 'wagmi';
import { useIsMounted } from '@/hooks/useIsMounted';
import LoginButton from '@/components/LoginButton';
import Navbar from '@/components/Navbar';

Modal.setAppElement('#main');

export default function LoginLayer({ children }: { children: ReactNode }) {
	const account = useAccount();
	const isMounted = useIsMounted();
	const { isConnected } = account;

	return (
		<>
			{!isConnected && isMounted && account.status !== 'connecting' && (
				<div className="fixed inset-x-0 inset-y-0 flex flex-col justify-center items-center gap-6 bg-sky-950 z-50">
					<h1 className="text-4xl font-bold text-center text-white">
						PermaRental
					</h1>
					<LoginButton />
				</div>
			)}
			<main id="main" className="min-h-screen">
				<Navbar />
				{children}
			</main>
		</>
	);
}
