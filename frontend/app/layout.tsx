import './globals.css';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import LoginLayer from './LoginLayer';
import Providers from './Providers';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'PermaRental',
	description: 'GPTs Blockchain Rental System',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<LoginLayer>{children}</LoginLayer>
				</Providers>
			</body>
		</html>
	);
}
