import cx from 'classnames';
import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { useAccount } from 'wagmi';
import { usePermaRent } from '@/lib/perma-rent';
import 'react-datepicker/dist/react-datepicker.css';

type ContractParams = {
	basicInfo: {
		rentalAmount: number;
		securityDeposit: number;
		paymentInterval: number;
		totalRentalPeriods: number;
	};
	parties: {
		lessor: string;
		lessee: string;
	};
	timeline: {
		startDate: string;
		endDate: string;
	};
	property: {
		type: string;
		description: string;
	};
	confidence: {
		level: string;
		warnings: string[];
		suggestions: string[];
	};
};

type Inputs = {
	rentalAmount: number;
	securityDeposit: number;
	paymentInterval: number;
	totalRentalPeriods: number;
	startDate: string;
	endDate: string;
	type: string;
	description: string;
};

const ContractForm: React.FC<{
	contractParams: ContractParams;
	ipfsHash: string;
	cancelCreateContract: () => void;
}> = ({ contractParams, ipfsHash, cancelCreateContract }) => {
	const {
		basicInfo: {
			rentalAmount,
			securityDeposit,
			paymentInterval,
			totalRentalPeriods,
		},
		timeline: { startDate, endDate },
		property: { type, description },
		confidence: { warnings, suggestions },
	} = contractParams;
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			rentalAmount,
			securityDeposit,
			paymentInterval,
			totalRentalPeriods,
			startDate,
			endDate,
			type,
			description,
		},
	});
	const { address } = useAccount();

	const { handleDeployDeal } = usePermaRent(
		process.env.NEXT_PUBLIC_PERMA_RENT_ADDRESS! as `0x${string}`
	);

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		handleDeployDeal(
			process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
			address as `0x${string}`,
			{
				rentalAmount: BigInt(data.rentalAmount),
				securityDeposit: BigInt(data.securityDeposit),
				paymentInterval: BigInt(data.paymentInterval),
				totalRentalPeriods: BigInt(data.totalRentalPeriods),
				dealHash: ipfsHash,
			}
		);

		// TODO: 如何知道正在上傳 & 完成?
	};

	return (
		<>
			{warnings?.length > 0 ? (
				<div className="flex flex-col gap-4 p-6 items-center text-center">
					<p className="text-red-500 font-bold">{warnings[0]}</p>
					{suggestions?.length && (
						<p className="text-gray-500 text-sm">{suggestions[0]}</p>
					)}
					<button
						className="text-red-500 border border-red-500 rounded py-1.5 px-3 transition-colors select-none hover:bg-red-500 hover:text-white"
						aria-label="Retry create contract"
						onClick={cancelCreateContract}
					>
						Retry
					</button>
				</div>
			) : (
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4 p-6 pb-24 overflow-y-auto"
				>
					<div
						className={cx('field', {
							'has-error': errors && errors['type'],
						})}
					>
						<label htmlFor="property-type">Property Type</label>
						<input
							id="property-type"
							type="text"
							{...register('type', { required: true })}
						/>
					</div>

					<div
						className={cx('field', {
							'has-error': errors && errors['description'],
						})}
					>
						<label htmlFor="property-type">Property Description</label>
						<textarea
							id="property-description"
							{...register('description', { required: true })}
						/>
					</div>

					<div
						className={cx('field', {
							'has-error': errors && errors['startDate'],
						})}
					>
						<label htmlFor="start-date">Start Date</label>
						<Controller
							control={control}
							name="startDate"
							rules={{ required: true }}
							render={({ field }) => (
								<DatePicker
									placeholderText="Select start date"
									onChange={(date) => field.onChange(date)}
									selected={
										field.value ? new Date(field.value) : new Date(startDate)
									}
								/>
							)}
						/>
					</div>

					<div
						className={cx('field', {
							'has-error': errors && errors['endDate'],
						})}
					>
						<label htmlFor="end-date">End Date</label>
						<Controller
							control={control}
							name="endDate"
							rules={{ required: true }}
							render={({ field }) => (
								<DatePicker
									placeholderText="Select end date"
									onChange={(date) => field.onChange(date)}
									selected={
										field.value ? new Date(field.value) : new Date(endDate)
									}
								/>
							)}
						/>
					</div>

					<div
						className={cx('field', {
							'has-error': errors && errors['rentalAmount'],
						})}
					>
						<label htmlFor="rental-amount">Rental Amount</label>
						<input
							id="rental-amount"
							type="number"
							{...register('rentalAmount', { required: true })}
						/>
					</div>

					<div
						className={cx('field', {
							'has-error': errors && errors['securityDeposit'],
						})}
					>
						<label htmlFor="security-deposit">Security Deposit</label>
						<input
							id="security-deposit"
							type="number"
							{...register('securityDeposit', { required: true })}
						/>
					</div>

					<div
						className={cx('field', {
							'has-error': errors && errors['paymentInterval'],
						})}
					>
						<label htmlFor="payment-interval">Payment Interval</label>
						<input
							id="payment-interval"
							type="number"
							{...register('paymentInterval', { required: true })}
						/>
					</div>

					<div
						className={cx('field', {
							'has-error': errors && errors['totalRentalPeriods'],
						})}
					>
						<label htmlFor="total-rental-periods">Total Rental Periods</label>
						<input
							id="total-rental-periods"
							type="number"
							{...register('totalRentalPeriods', { required: true })}
						/>
					</div>

					{/* TODO: 顯示合約圖片 */}

					<div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex shadow-2xl border-t border-solid border-gray-100">
						<button type="submit" className="button w-full">
							Deploy
						</button>
					</div>
				</form>
			)}
		</>
	);
};

export default ContractForm;
