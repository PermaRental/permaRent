import React, { useState } from 'react';
import cx from 'classnames';
import LeaseList from '@/components/LeaseList';

const Tabs: React.FC<{
	activeItem: 'lessor' | 'lessee';
	setActiveItem: (role: 'lessor' | 'lessee') => void;
}> = ({ activeItem, setActiveItem }) => {
	const handleClick = (role: 'lessor' | 'lessee') => {
		setActiveItem(role);
	};

	return (
		<div className="flex gap-4 p-2 rounded-full bg-slate-300">
			<button
				className={cx(
					'flex-1 font-bold transition-colors px-4 py-2 rounded-full select-none',
					{
						'text-white bg-slate-500': activeItem === 'lessor',
					}
				)}
				onClick={() => handleClick('lessor')}
			>
				Lessor
			</button>
			<button
				className={cx(
					'flex-1 font-bold transition-colors px-4 py-2 rounded-full select-none',
					{
						'text-white bg-slate-500': activeItem === 'lessee',
					}
				)}
				onClick={() => handleClick('lessee')}
			>
				Rental
			</button>
		</div>
	);
};

export default function DealList() {
	const [role, setRole] = useState<'lessor' | 'lessee'>('lessor');
	return (
		<>
			<Tabs activeItem={role} setActiveItem={setRole} />

			<div className="tab-content">
				<LeaseList />
			</div>
		</>
	);
}
