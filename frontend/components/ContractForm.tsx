import cx from 'classnames';
import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import DatePicker from 'react-datepicker';
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
};

const ContractForm: React.FC<{ contractParams: ContractParams }> = ({
	contractParams,
}) => {
	const {
		basicInfo: {
			rentalAmount,
			securityDeposit,
			paymentInterval,
			totalRentalPeriods,
		},
		timeline: { startDate, endDate },
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
		},
	});
	const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 p-6 overflow-y-auto"
			>
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

				<div className="fixed bottom-0 left-0 right-0 bg-white rounded-tl-2xl rounded-tr-2xl p-4 flex justify-center shadow-2xl">
					<button type="submit" className="button">
						Deploy
					</button>
				</div>
			</form>
		</>
	);
};

export default ContractForm;
