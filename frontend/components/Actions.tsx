import React from 'react';
import Link from 'next/link';
import { BiPlusCircle, BiScan } from 'react-icons/bi';

const ActionItem = ({
	url,
	icon,
	title,
	ariaLabel,
}: {
	url: string;
	icon: React.ReactNode;
	title: string;
	ariaLabel: string;
}) => {
	return (
		<Link
			href={url}
			aria-label={ariaLabel}
			className="flex flex-col gap-2 items-center"
			scroll={false}
		>
			<div className="button-icon">{icon}</div>
			<span className="text-gray-500 text-sm">{title}</span>
		</Link>
	);
};

export default function Actions() {
	return (
		<div className="flex justify-center gap-10 py">
			<ActionItem
				url="/create-contract"
				icon={<BiPlusCircle />}
				title="Create"
				ariaLabel="Create a contract"
			/>
			<ActionItem
				url="/scan-contract"
				icon={<BiScan />}
				title="Scan"
				ariaLabel="Scan a contract"
			/>
		</div>
	);
}
