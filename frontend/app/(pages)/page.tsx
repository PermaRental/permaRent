'use client';
import Account from '@/components/Account';
import Actions from '@/components/Actions';
import DealList from '@/components/DealList';

export default function Home() {
	return (
		<div className="page-home">
			<Account />
			<div className="page-body !gap-12 !pt-12">
				<Actions />
				<div className="flex flex-col gap-6">
					<DealList />
				</div>
			</div>
		</div>
	);
}
