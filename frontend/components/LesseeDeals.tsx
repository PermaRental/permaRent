import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import { BiUserCircle } from 'react-icons/bi';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import dealService from '@/graph/deal-service';

export default function LesseeDeals({ classNames }: { classNames?: string }) {
	const { address } = useAccount();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { data } = useQuery({
		queryKey: ['getLesseeDeals'],
		queryFn: () => dealService.getLesseeDeals(address as `0x${string}`),
		enabled: !!address,
	});

	useEffect(() => {
		if (data?.length) {
			setIsLoading(false);
		} else {
			setIsLoading(true);
		}
	}, [data]);

	return isLoading ? (
		<div className="col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col items-center gap-2 text-sm text-center text-gray-800">
			<div className="inline-flex justify-center items-center w-20 h-20">
				<div className="loader" />
			</div>
		</div>
	) : (
		<div
			className={cx(
				'col-start-1 col-end-2 row-start-1 row-end-2 transition-opacity',
				classNames
			)}
		>
			{data?.length ? (
				<ul className="flex flex-col gap-4">
					{data?.map((item) => (
						<li
							key={item.id}
							className="border border-solid border-slate-300 rounded-lg overflow-hidden cursor-pointer"
						>
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

								<div className="flex items-center gap-1 text-xs text-white bg-slate-500 text-sm p-4 break-all">
									<BiUserCircle className=" flex-none w-5 h-5" />
									{item.lessor}
								</div>
							</Link>
						</li>
					))}
				</ul>
			) : (
				<p className="text-center">You have no tenancy</p>
			)}
		</div>
	);
}
