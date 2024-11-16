'use client';

import { PERMARENTDEAL_ABI } from '@/lib/abis/PermaRentDeal';
import { useWriteContract } from 'wagmi';

export default function MakePayment({ id }: { id: `0x${string}` }) {
	const { writeContractAsync, isPending } = useWriteContract();

	const handlePayment = async () => {
		const tx = await writeContractAsync(
			{
				address: id as `0x${string}`,
				abi: PERMARENTDEAL_ABI,
				functionName: 'makePayment',
				args: [],
			},
			{
				onSuccess: () => {
					console.log('success');
				},
				onError: (error) => {
					console.log('error', error);
				},
			}
		);

		console.log(tx);
	};

	return (
		<button
			className="button !bg-red-600 !hover:bg-red-500"
			onClick={handlePayment}
			disabled={isPending}
		>
			{isPending ? 'Loading' : 'Make Payment'}
		</button>
	);
}
