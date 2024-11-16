import cx from 'classnames';
import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import dealService from '@/graph/deal-service';
import AddEncyptValue from './add-encypt-value';
import MakePayment from './make-payment';

export default function LessorDeals({ classNames }: { classNames?: string }) {
	const { address } = useAccount();

	const { data } = useQuery({
		queryKey: ['getLessorDeals'],
		queryFn: () => dealService.getLessorDeals(address as `0x${string}`),
		enabled: !!address,
	});

	return (
		<div
			className={cx(
				'col-start-1 col-end-2 row-start-1 row-end-2 transition-opacity',
				classNames
			)}
		>
			{data?.length ? (
				<ul className="flex flex-col gap-4">
					{data?.map((item) => (
						<li className="border border-solid border-slate-300 rounded-lg overflow-hidden cursor-pointer">
							<Link href={`/deals/${item.id}`} scroll={false}>
								<div className="p-4">
									<div className="flex flex-col items-start gap-1">
										<div className="text-xs bg-slate-400 text-white font-bold px-1 py-px rounded">
											Contract address
										</div>
										<div className="text-sm font-semibold break-all">
											{item.id}
										</div>
									</div>
								</div>
								<div className="text-xs text-white bg-slate-500 text-sm p-4 break-all">
									{item.finalLessee}
								</div>
							</Link>
						</li>
					))}
				</ul>
			) : (
				<p className="text-center">You have no lease</p>
			)}
		</div>
	);
}
