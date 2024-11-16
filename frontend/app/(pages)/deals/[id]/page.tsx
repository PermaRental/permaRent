'use client';
import React, { useEffect, useState } from 'react';
import { BiLinkExternal, BiSolidStar } from 'react-icons/bi';
import Link from 'next/link';
import dealService from '@/graph/deal-service';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useUserBalance } from '@/lib/reputation-points';
import { useAccount } from 'wagmi';
import AddEncryptValue from '@/components/AddEncryptValue';
import MakePayment from '@/components/MakePayment';
import VerifyButton from '@/components/VerifyButton';

function truncateAddress(address, startLength = 8, endLength = 5) {
	if (!address || address.length <= startLength + endLength) {
		return address;
	}
	const start = address.slice(0, startLength);
	const end = address.slice(-endLength);
	return `${start}...${end}`;
}

export default function DealDetailPage() {
	const params = useParams();
	const id = params.id;
	const { address } = useAccount();
	const [isLessor, setIsLessor] = useState<boolean>(false);
	const [isLessee, setIsLessee] = useState<boolean>(false);
	const [selectedLessee, setSelectedLessee] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { data } = useQuery({
		queryKey: ['getDealDetail', id],
		queryFn: () => dealService.getDealDetail(id as string),
		enabled: !!id,
	});

	const { balance: lessorBalance } = useUserBalance(data?.lessor!);
	const { balance: lesseeBalance } = useUserBalance(data?.finalLessee!);

	const handleChange = (value: string) => {
		setSelectedLessee(value);
	};

	useEffect(() => {
		if (data?.id) {
			setIsLoading(false);
		} else {
			setIsLoading(true);
		}

		if (address?.toLocaleLowerCase() === data?.lessor?.toLocaleLowerCase()) {
			setIsLessor(true);
		} else {
			setIsLessor(false);
		}

		if (
			address?.toLocaleLowerCase() == data?.finalLessee?.toLocaleLowerCase()
		) {
			setIsLessee(true);
		} else {
			setIsLessee(false);
		}

		if (!!data?.lessees.length) {
			setSelectedLessee(data?.lessees[0]);
		}
	}, [address, data]);

	return (
		<div className="page-deals">
			<div className="page-header">
				<h1>Contract Detail</h1>
			</div>

			<div className="page-body">
				{isLoading ? (
					<div className="flex flex-col items-center gap-2 text-sm text-center text-gray-800">
						<div className="inline-flex justify-center items-center w-20 h-20">
							<div className="loader" />
						</div>
						<span>Loading...</span>
					</div>
				) : (
					<>
						{data?.id && isLessor && !!data?.lessees?.length && (
							<div className="flex flex-col gap-4 pb-6 border-b border-solid border-slate-500">
								<div className="flex items-center gap-1">
									{data.lessees.map((lessee, index) => (
										<>
											<input
												type="radio"
												id={`lessee-${index}`}
												name="lessee"
												value={lessee}
												checked={selectedLessee === lessee}
												onChange={() => handleChange(lessee)}
											/>
											<label htmlFor={`lessee-${index}`}>
												{truncateAddress(lessee, 12)}
											</label>
										</>
									))}
								</div>
								<VerifyButton
									id={data.id}
									lesseeAddress={selectedLessee as `0x${string}`}
								/>
							</div>
						)}
						{data?.id && isLessee && (
							<div className="flex flex-col gap-4 pb-6 border-b border-solid border-slate-500">
								<MakePayment id={data.id as `0x${string}`} />
								<AddEncryptValue id={data.id as `0x${string}`} />
							</div>
						)}
						<div className="field">
							<label
								htmlFor="contract"
								className="flex justify-between gap-2 items-center"
							>
								Contract Address
								<Link
									href={`https://base-sepolia.blockscout.com/address/${data?.id}`}
									target="_blank"
									className="flex items-center gap-1 text-xs text-sky-500 border border-sky-500 rounded-md py-1 px-2 transition-colors select-none hover:bg-yellow-500 hover:text-white"
								>
									View onchain
									<BiLinkExternal className="w-3 h-3" />
								</Link>
							</label>
							<div className="w-full whitespace-pre-wrap break-all rounded-md px-2.5 py-2 border border-solid border-slate-300">
								{data?.id}
							</div>
						</div>
						<div className="field">
							<label htmlFor="lessor" className="flex gap-2 items-center">
								Lessor
								{lessorBalance !== '' && (
									<div className="text-xs flex gap-1 items-center rounded-full border border-solid border-sky-900 px-1.5 py-0.5 opacity-80">
										<BiSolidStar />
										<div className="leading-none pt-px">
											{lessorBalance ? String(lessorBalance) : 0}
										</div>
									</div>
								)}
							</label>
							<input
								id="lessor"
								type="text"
								value={truncateAddress(data?.lessor, 24)}
								readOnly
							/>
						</div>
						<div className="field">
							<label htmlFor="final-lessee" className="flex gap-2 items-center">
								Lessee
								{lessorBalance !== '' && (
									<div className="text-xs flex gap-1 items-center rounded-full border border-solid border-sky-900 px-1.5 py-0.5 opacity-80">
										<BiSolidStar />
										<div className="leading-none pt-px">
											{lesseeBalance ? String(lesseeBalance) : 0}
										</div>
									</div>
								)}
							</label>
							<input
								id="final-lessee"
								type="text"
								value={truncateAddress(data?.finalLessee, 24)}
								readOnly
							/>
						</div>
						<div className="field">
							<label htmlFor="rental-amount">Rental Amount</label>
							<input
								id="rental-amount"
								type="number"
								value={data?.rentalAmount}
								readOnly
							/>
						</div>
						<div className="field">
							<label htmlFor="security-deposit">Security Deposit</label>
							<input
								id="security-deposit"
								type="number"
								value={data?.securityDeposit}
								readOnly
							/>
						</div>
						<div className="field">
							<label htmlFor="payment-interval">Payment Interval</label>
							<input
								id="payment-interval"
								type="number"
								value={data?.paymentInterval}
								readOnly
							/>
						</div>
						<div className="field">
							<label htmlFor="total-rental-periods">Total Rental Periods</label>
							<input
								id="total-rental-periods"
								type="number"
								value={data?.totalRentalPeriods}
								readOnly
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
