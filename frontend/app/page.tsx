'use client';
import Account from '@/components/Account';
import Actions from '@/components/Actions';

export default function Home() {
	return (
		<div className="page-home">
			<Account />
			<div className="py-6 pt-12 pb-20">
				<Actions />
			</div>
		</div>
	);
}
