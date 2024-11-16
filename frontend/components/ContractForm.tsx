import { PERMARENT_ABI } from '@/lib/abis/PermaRent';
import { usePermaRent } from '@/lib/perma-rent';
import cx from 'classnames';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { parseUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import Overlay from './Overlay';

export type ContractParams = {
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
}> = ({ contractParams, ipfsHash }) => {
  const [isLoading, setIsloading] = useState(false);
  const {
    basicInfo: {
      rentalAmount,
      securityDeposit,
      paymentInterval,
      totalRentalPeriods,
    },
    timeline: { startDate, endDate },
    property: { type, description },
    // confidence: { warnings, suggestions },
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
  const client = usePublicClient();

  const { handleDeployDeal } = usePermaRent(
    process.env.NEXT_PUBLIC_PERMA_RENT_ADDRESS! as `0x${string}`
  );

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsloading(true);
      const hash = await handleDeployDeal(
        process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
        address as `0x${string}`,
        {
          rentalAmount: parseUnits(String(data.rentalAmount), 6),
          securityDeposit: parseUnits(String(data.securityDeposit), 6),
          paymentInterval: parseUnits(
            (data.paymentInterval ?? 0).toString(),
            0
          ),
          totalRentalPeriods: parseUnits(String(data?.totalRentalPeriods), 0),
          dealHash: ipfsHash,
        }
      );

      const receipt = await client!.waitForTransactionReceipt({
        hash,
      });

      console.log('🍎🍎🍎 create success', hash, receipt);
    } catch (error) {
      console.error('error', error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    const unwatch = client!.watchContractEvent({
      address: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
      abi: PERMARENT_ABI,
      eventName: 'DealCreated',
      args: { lessor: address },
      onLogs: (logs) => console.log(logs),
    });

    return () => {
      unwatch();
    };
  }, []);

  return (
    <>
      {/* {warnings?.length > 0 ? (
        <div className='flex flex-col gap-4 p-6 items-center text-center'>
          <p className='text-red-500 font-bold'>{warnings[0]}</p>
          {suggestions?.length && (
            <p className='text-gray-500 text-sm'>{suggestions[0]}</p>
          )}
          <button
            className='text-red-500 border border-red-500 rounded py-1.5 px-3 transition-colors select-none hover:bg-red-500 hover:text-white'
            aria-label='Retry create contract'
            onClick={cancelCreateContract}
          >
            Retry
          </button>
        </div>
      ) : ( */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 p-6 pb-24 overflow-y-auto'
      >
        <div
          className={cx('field', {
            'has-error': errors && errors['type'],
          })}
        >
          <label htmlFor='property-type'>Property Type</label>
          <input
            id='property-type'
            type='text'
            {...register('type', { required: true })}
          />
        </div>

        <div
          className={cx('field', {
            'has-error': errors && errors['description'],
          })}
        >
          <label htmlFor='property-type'>Property Description</label>
          <textarea
            id='property-description'
            {...register('description', { required: true })}
          />
        </div>

        <div
          className={cx('field', {
            'has-error': errors && errors['startDate'],
          })}
        >
          <label htmlFor='start-date'>Start Date</label>
          <Controller
            control={control}
            name='startDate'
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                placeholderText='Select start date'
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
          <label htmlFor='end-date'>End Date</label>
          <Controller
            control={control}
            name='endDate'
            rules={{ required: true }}
            render={({ field }) => (
              <DatePicker
                placeholderText='Select end date'
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
          <label htmlFor='rental-amount'>Rental Amount</label>
          <input
            id='rental-amount'
            type='number'
            {...register('rentalAmount', { required: true })}
          />
        </div>

        <div
          className={cx('field', {
            'has-error': errors && errors['securityDeposit'],
          })}
        >
          <label htmlFor='security-deposit'>Security Deposit</label>
          <input
            id='security-deposit'
            type='number'
            {...register('securityDeposit', { required: true })}
          />
        </div>

        <div
          className={cx('field', {
            'has-error': errors && errors['paymentInterval'],
          })}
        >
          <label htmlFor='payment-interval'>Payment Interval</label>
          <input
            id='payment-interval'
            type='number'
            {...register('paymentInterval', { required: true })}
          />
        </div>

        <div
          className={cx('field', {
            'has-error': errors && errors['totalRentalPeriods'],
          })}
        >
          <label htmlFor='total-rental-periods'>Total Rental Periods</label>
          <input
            id='total-rental-periods'
            type='number'
            {...register('totalRentalPeriods', { required: true })}
          />
        </div>

        {/* TODO: 顯示合約圖片 */}

        <div className='fixed bottom-0 left-0 right-0 bg-white p-4 flex shadow-2xl border-t border-solid border-gray-100'>
          <button type='submit' className='button w-full'>
            Deploy
          </button>
        </div>
      </form>
      {/* )} */}

      <Overlay isVisible={isLoading}>Contract deploying...</Overlay>
    </>
  );
};

export default ContractForm;
