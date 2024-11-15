'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';
import { baseSepolia } from 'wagmi/chains'; // add baseSepolia for testing

import { useWagmiConfig } from '@/hooks/useWagmiconfig';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

export default function Providers(props: {
	children: ReactNode;
	initialState?: State;
}) {
	const config = useWagmiConfig();
	const [queryClient] = useState(() => new QueryClient());

	return (
		<WagmiProvider config={config} initialState={props.initialState}>
			<QueryClientProvider client={queryClient}>
				<OnchainKitProvider
					apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
					projectId={process.env.NEXT_PUBLIC_CDP_PROJECT_ID}
					chain={baseSepolia} // add baseSepolia for testing
				>
					<RainbowKitProvider modalSize="compact" initialChain={baseSepolia}>
						{props.children}
					</RainbowKitProvider>
				</OnchainKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
