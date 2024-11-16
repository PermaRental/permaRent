import React, { useState } from 'react';
import cx from 'classnames';
import LessorDeals from '@/components/LessorDeals';
import LesseeDeals from '@/components/LesseeDeals';

const Tabs: React.FC<{
	role: 'lessor' | 'lessee';
	setRole: (role: 'lessor' | 'lessee') => void;
}> = ({ role, setRole }) => {
	const handleClick = (role: 'lessor' | 'lessee') => {
		setRole(role);
	};

	return (
		<div className="flex gap-4 p-2 rounded-full bg-slate-300">
			<button
				className={cx(
					'flex-1 font-bold transition-colors px-4 py-2 rounded-full select-none',
					{
						'text-white bg-slate-500': role === 'lessor',
					}
				)}
				onClick={() => handleClick('lessor')}
			>
				Lease
			</button>
			<button
				className={cx(
					'flex-1 font-bold transition-colors px-4 py-2 rounded-full select-none',
					{
						'text-white bg-slate-500': role === 'lessee',
					}
				)}
				onClick={() => handleClick('lessee')}
			>
				Tenancy
			</button>
		</div>
	);
};

export default function DealList() {
	const [role, setRole] = useState<'lessor' | 'lessee'>('lessor');
	return (
		<>
			<Tabs role={role} setRole={setRole} />

			<div className="tab-content grid grid-cols-1 grid-row-1">
				<LessorDeals
					classNames={
						role === 'lessor'
							? 'opacity-1 pointer-events-auto'
							: 'opacity-0 pointer-events-none'
					}
				/>
				<LesseeDeals
					classNames={
						role === 'lessee'
							? 'opacity-1 pointer-events-auto'
							: 'opacity-0 pointer-events-none'
					}
				/>
			</div>
		</>
	);
}
