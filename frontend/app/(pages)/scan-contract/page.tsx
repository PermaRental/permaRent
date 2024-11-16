'use client';
import Link from 'next/link';
import { BiArrowBack } from 'react-icons/bi';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function ScanContractPage() {
	return (
		<div className="page-scan-contract">
			<div className="absolute top-0 right-0 bottom-0 left-0 bg-black z-50 flex flex-col items-center justify-center">
				<Link
					href="/"
					aria-label="Go to homepage"
					className="fixed top-6 left-6 text-2xl text-white z-20"
					scroll={false}
				>
					<BiArrowBack />
				</Link>
				<div className="w-[90vw] h-[90vw]">
					<Scanner
						onScan={(result) =>
							result?.[0]?.rawValue &&
							window.location.assign(result?.[0]?.rawValue)
						}
					/>
				</div>
			</div>
		</div>
	);
}
