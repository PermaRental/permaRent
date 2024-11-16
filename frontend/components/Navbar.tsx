import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import {
	Address,
	Avatar,
	Identity,
	EthBalance,
} from '@coinbase/onchainkit/identity';
import {
	ConnectWallet,
	Wallet,
	WalletDropdown,
	WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiHomeAlt, BiFile, BiBell, BiUser } from 'react-icons/bi';

export default function Navbar() {
	const path = usePathname();
	const [isHidden, setIsHidden] = useState<boolean>(false);

	useEffect(() => {
		if (path === '/create-contract') {
			setIsHidden(true);
		} else {
			setIsHidden(false);
		}
	}, [path]);

	return (
		<nav
			className={cx(
				'fixed bottom-0 left-0 right-0 bg-white px-4 flex justify-around gap-4 shadow-2xl border-t border-solid border-slate-100 z-40',
				{
					hidden: isHidden,
				}
			)}
		>
			<button
				className={cx('nav-item', {
					'is-active': path === '/',
				})}
			>
				<BiHomeAlt className="w-5 h-5" />
				<Link
					href="/"
					scroll={false}
					className="absolute w-full h-full"
					aria-label="Go to homepage"
				/>
			</button>
			<button
				className={cx('nav-item', {
					'is-active': path.includes('/deals'),
				})}
			>
				<BiFile className="w-5 h-5" />
				<Link
					href="/deals"
					scroll={false}
					className="absolute w-full h-full"
					aria-label="Go to deal List"
				/>
			</button>
			<button
				className={cx('nav-item', {
					'is-active': path.includes('/activities'),
				})}
				disabled
			>
				<BiBell className="w-5 h-5" />
				<Link
					href="/activities"
					scroll={false}
					className="absolute w-full h-full"
					aria-label="Go to activities"
				/>
			</button>
			<div className="nav-item nav-wallet">
				<Wallet>
					<ConnectWallet className="nav-item bg-transparent hover:bg-transparent">
						<BiUser className="w-5 h-5" />
					</ConnectWallet>
					<WalletDropdown className="test">
						<Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
							<Avatar />
							<Address />
							<EthBalance />
						</Identity>
						<WalletDropdownDisconnect />
					</WalletDropdown>
				</Wallet>
			</div>
		</nav>
	);
}
