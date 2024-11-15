'use client';
import WalletWrapper from './WalletWarpper';

export default function LoginButton() {
	return (
		<WalletWrapper
			className="button"
			text="Connect Wallet"
			withWalletAggregator={true}
		/>
	);
}
