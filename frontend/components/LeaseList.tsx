import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import dealService from '@/graph/deal-service';
import AddEncyptValue from './add-encypt-value';
import MakePayment from './make-payment';

export default function LeaseList() {
	const { address } = useAccount();

	const { data } = useQuery({
		queryKey: ['getLesseeDeals'],
		queryFn: () => dealService.getLesseeDeals(address as `0x${string}`),
		enabled: !!address,
	});

	if (!data?.length) return null;

	return (
		<ul className="flex flex-col gap-4">
			{data.map((item) => (
				<li className="border border-solid border-slate-300 rounded-lg overflow-hidden cursor-pointer">
					<Link href={`/deals/${item.id}`} scroll={false}>
						<div className="p-4">
							<div className="flex flex-col items-start gap-1">
								<div className="text-xs bg-slate-400 text-white font-bold px-1 py-px rounded">
									Contract address
								</div>
								<div className="text-sm font-semibold break-all">{item.id}</div>
							</div>
						</div>
						<div className="text-xs text-white bg-slate-500 text-sm p-4 break-all">
							{item.finalLessee}
						</div>
					</Link>
				</li>
			))}
		</ul>
	);
}
