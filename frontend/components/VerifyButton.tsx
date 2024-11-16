'use client';
import { PERMARENTDEAL_ABI } from '@/lib/abis/PermaRentDeal';
import {
  IDKitWidget,
  ISuccessResult,
  VerificationLevel,
} from '@worldcoin/idkit';
import cx from 'classnames';
import { useState } from 'react';
import { decodeAbiParameters } from 'viem';
import { usePublicClient, useWriteContract } from 'wagmi';

export default function VerifyButton({
  id,
  lesseeAddress,
  refetch,
}: {
  id: string;
  lesseeAddress: `0x${string}`;
  refetch: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const client = usePublicClient();

  const { writeContractAsync } = useWriteContract();

  const handleSign = async (result: ISuccessResult) => {
    setIsLoading(true);
    setError(null);

    try {
      const { merkle_root, nullifier_hash, proof } = result;

      const decodeProof = decodeAbiParameters(
        [{ type: 'uint256[8]' }],
        proof as `0x${string}`
      )[0];

      const tx = await writeContractAsync(
        {
          address: id as `0x${string}`,
          abi: PERMARENTDEAL_ABI,
          functionName: 'approveDealForLessee',
          args: [
            lesseeAddress,
            BigInt(merkle_root),
            BigInt(nullifier_hash),
            decodeProof,
          ],
        },
        {
          onSuccess: () => {
            console.log('success');
          },
          onError: (error) => {
            console.log('error', error);
          },
        }
      );

      const txR = await client?.waitForTransactionReceipt({
        hash: tx,
      });

      console.log('交易成功', txR);
      await refetch();
    } catch (error) {
      console.error('Sign deal failed:', error);

      if (error instanceof Error) {
        if (error.message.includes('user rejected')) {
          setError('You rejected the transaction');
        } else if (error.message.includes('insufficient funds')) {
          setError('Insufficient funds to complete transaction');
        } else {
          setError(`Failed to verify: ${error.message}`);
        }
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSuccess = () => {
    console.log('WorldID verification successful');
  };

  return (
    <div className='space-y-4'>
      {error && (
        <div className='text-red-500 text-sm p-2 bg-red-50 rounded'>
          {error}
        </div>
      )}

      <IDKitWidget
        app_id={process.env.NEXT_PUBLIC_WORLD_ID_KEY as `app_${string}`}
        action={process.env.NEXT_PUBLIC_WORLD_ID_ACTION!}
        signal={id}
        verification_level={VerificationLevel.Orb}
        handleVerify={handleSign}
        onSuccess={onSuccess}
      >
        {({ open }) => (
          <button
            onClick={open}
            disabled={isLoading}
            className={cx('button w-full', {
              '!cursor-not-allowed': isLoading,
            })}
          >
            Confirm lease
          </button>
        )}
      </IDKitWidget>
    </div>
  );
}
