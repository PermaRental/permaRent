'use client';
import React from 'react';
import DealList from '@/components/DealList';

export default function Deals() {
	return (
		<div className="page-deals">
			<div className="page-header">
				<h1>Deals</h1>
			</div>

			<div className="page-body">
				<DealList />
			</div>
		</div>
	);
}
