'use client';
import AddEncryptValue from '@/components/AddEncryptValue';
import Overlay from '@/components/Overlay';
import VerifyButton from '@/components/VerifyButton';
import dealService from '@/graph/deal-service';
import { usePermaRentDeal } from '@/lib/perma-rent-deal';
import { useUserBalance } from '@/lib/reputation-points';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { BiLinkExternal, BiSolidStar } from 'react-icons/bi';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import ImageList from './image-list';
import LesseVerifyButton from './lesse-verify-button';
import ShareDeal from './share-deal';

function truncateAddress(address: string, startLength = 8, endLength = 5) {
  if (!address || address.length <= startLength + endLength) {
    return address;
  }
  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);
  return `${start}...${end}`;
}

export default function DealDetailPage() {
  const params = useParams();
  const id = params.id;
  const { address } = useAccount();
  const [selectedLessee, setSelectedLessee] = useState<string>('');
  const { isDealActive } = usePermaRentDeal(id as `0x${string}`);

  const { data, refetch, isPending } = useQuery({
    queryKey: ['getDealDetail', id],
    queryFn: async () => {
      const deal = await dealService.getDealDetail(id as string);
      console.log(
        '🍎🍎🍎',
        deal,
        address?.toLowerCase(),
        data?.lessor?.toLowerCase()
      );

      if (!!data?.lessees.length) {
        setSelectedLessee(data?.lessees[0]);
      }

      return deal;
    },
    enabled: !!id && !!address,
  });

  const isLessee = useMemo(() => {
    if (!address || !data) {
      return false;
    }
    if (address.toLowerCase() !== data.lessor) {
      return true;
    }

    return false;
  }, [address, data]);

  const isLessor = useMemo(() => {
    if (!address || !data) {
      return false;
    }
    if (address.toLowerCase() === data.lessor) {
      return true;
    }

    return false;
  }, [address, data]);

  const { balance: lessorBalance } = useUserBalance(
    data?.lessor! as `0x${string}`
  );
  const { balance: lesseeBalance } = useUserBalance(
    data?.finalLessee! as `0x${string}`
  );

  const handleChange = (value: string) => {
    setSelectedLessee(value);
  };

  return (
    <div className='page-deals'>
      <div className='page-header z-40'>
        <h1>{truncateAddress(data?.id!)}</h1>
        <Link
          href={`https://base-sepolia.blockscout.com/address/${data?.id}`}
          target='_blank'
          className='flex items-center gap-1 text-xs text-yellow-500 border border-yellow-500 rounded-md py-1 px-2 transition-colors select-none hover:bg-yellow-500 hover:text-white'
        >
          View onchain
          <BiLinkExternal className='w-3 h-3' />
        </Link>
      </div>

      <div className='page-body'>
        <ShareDeal />
        {data?.id && isLessor && !!data?.lessees?.length && !isDealActive && (
          <div className='flex flex-col gap-4 pb-6 border-b border-solid border-slate-500'>
            <div className='flex items-center gap-1'>
              {data.lessees.map((lessee, index) => (
                <>
                  <input
                    type='radio'
                    id={`lessee-${index}`}
                    name='lessee'
                    value={lessee}
                    checked={selectedLessee === lessee}
                    onChange={() => handleChange(lessee)}
                  />
                  <label htmlFor={`lessee-${index}`}>
                    {truncateAddress(lessee, 12)}
                  </label>
                </>
              ))}
            </div>
            <VerifyButton
              id={data.id}
              lesseeAddress={selectedLessee as `0x${string}`}
              refetch={refetch}
            />
          </div>
        )}
        {data?.id &&
          isLessee &&
          !isDealActive &&
          !data?.lessees?.includes(address?.toLowerCase()!) && (
            <div className='flex flex-col gap-4 pb-6 border-b border-solid border-slate-500'>
              <LesseVerifyButton
                id={data.id as `0x${string}`}
                refetch={refetch}
              />
            </div>
          )}
        {data?.id &&
          isLessee &&
          address?.toLowerCase() === data.finalLessee?.toLowerCase() &&
          !data.cipherKey && (
            <div className='flex flex-col gap-4 pb-6 border-b border-solid border-slate-500'>
              <AddEncryptValue
                id={data.id as `0x${string}`}
                refetch={refetch}
              />
            </div>
          )}
        <div className='field mt-4'>
          <label htmlFor='lessor' className='flex gap-2 items-center'>
            Lessor
            {lessorBalance !== '' && (
              <div className='text-xs flex gap-1 items-center rounded-full border border-solid border-sky-900 px-1.5 py-0.5 opacity-80'>
                <BiSolidStar />
                <div className='leading-none pt-px'>
                  {lessorBalance ? String(lessorBalance) : 0}
                </div>
              </div>
            )}
          </label>
          <input
            id='lessor'
            type='text'
            value={truncateAddress(data?.lessor!, 24)}
            readOnly
          />
        </div>
        <div className='field'>
          <label htmlFor='final-lessee' className='flex gap-2 items-center'>
            Lessee
            {lessorBalance !== '' && (
              <div className='text-xs flex gap-1 items-center rounded-full border border-solid border-sky-900 px-1.5 py-0.5 opacity-80'>
                <BiSolidStar />
                <div className='leading-none pt-px'>
                  {lesseeBalance ? String(lesseeBalance) : 0}
                </div>
              </div>
            )}
          </label>
          <input
            id='final-lessee'
            type='text'
            value={truncateAddress(data?.finalLessee!, 24)}
            readOnly
          />
        </div>
        <div className='field'>
          <label htmlFor='rental-amount'>Rental Amount</label>
          <input
            id='rental-amount'
            type='number'
            value={formatUnits(BigInt(data?.rentalAmount ?? 0), 6)}
            readOnly
          />
        </div>
        <div className='field'>
          <label htmlFor='security-deposit'>Security Deposit</label>
          <input
            id='security-deposit'
            type='number'
            value={formatUnits(BigInt(data?.securityDeposit ?? 0), 6)}
            readOnly
          />
        </div>
        <div className='field'>
          <label htmlFor='payment-interval'>Payment Interval</label>
          <input
            id='payment-interval'
            type='number'
            value={formatUnits(BigInt(data?.paymentInterval ?? 0), 0)}
            readOnly
          />
        </div>
        <div className='field'>
          <label htmlFor='total-rental-periods'>Total Rental Periods</label>
          <input
            id='total-rental-periods'
            type='number'
            value={data?.totalRentalPeriods}
            readOnly
          />
        </div>

        {data?.id && <ImageList hash={data?.dealHash} />}
      </div>
      <Overlay isVisible={isPending} />
    </div>
  );
}
