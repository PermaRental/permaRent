'use client';

import { PERMARENTDEAL_ABI } from '@/lib/abis/PermaRentDeal';
import { usePermaRentDeal } from '@/lib/perma-rent-deal';
import { useUSDCBalance, useUsdcPoints } from '@/lib/usdc';
import { sleep } from '@/utils/sleep';
import { FundButton } from '@coinbase/onchainkit/fund';
import {
  IDKitWidget,
  ISuccessResult,
  VerificationLevel,
} from '@worldcoin/idkit';
import { useMemo } from 'react';
import { decodeAbiParameters, formatUnits, parseUnits } from 'viem';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';

export default function LesseVerifyButton({
  id,
  refetch,
}: {
  id: string;
  refetch: () => void;
}) {
  const { address } = useAccount();
  const client = usePublicClient();

  const { terms } = usePermaRentDeal(id as `0x${string}`);

  const pendingPayment = useMemo(() => {
    if (!terms) {
      return BigInt(0);
    }

    // @ts-ignore
    const [rentalAmount, securityDeposit, _, totalRentalPeriods] = terms;

    return (
      Number(formatUnits(BigInt(rentalAmount), 6)) *
        Number(formatUnits(BigInt(totalRentalPeriods), 0)) +
      Number(formatUnits(securityDeposit, 6))
    );
  }, [terms]);

  const { handleUSDCApprove } = useUsdcPoints();
  const { balance } = useUSDCBalance(address as `0x${string}`);

  console.log(terms, pendingPayment);

  const { writeContractAsync } = useWriteContract();

  const handleSign = async (result: ISuccessResult) => {
    console.log('🐼🐼🐼🐼🐼🐼🐼🐼🐼🐼', result);

    const approveResult = await handleUSDCApprove(
      id as `0x${string}`,
      parseUnits(pendingPayment.toString(), 6)
    );

    const usdcReceipt = await client?.waitForTransactionReceipt({
      hash: approveResult,
    });

    console.log(usdcReceipt);

    await sleep(2000);

    const { merkle_root, nullifier_hash, proof } = result;

    // 将 proof 转换为合约需要的格式
    const decodeProof = decodeAbiParameters(
      [{ type: 'uint256[8]' }],
      proof as `0x${string}`
    )[0];

    console.log(
      '🐼🐼🐼🐼🐼🐼🐼🐼🐼🐼',
      BigInt(merkle_root),
      BigInt(nullifier_hash),
      decodeProof
    );

    const tx = await writeContractAsync(
      {
        address: id as `0x${string}`,
        abi: PERMARENTDEAL_ABI,
        functionName: 'signDealAsLessee',
        args: [BigInt(merkle_root), BigInt(nullifier_hash), decodeProof],
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

    await sleep(2000);

    await refetch();

    console.log('🐼🐼🐼🐼🐼🐼🐼🐼🐼🐼', 'WorldID verification successful', txR);
  };

  const onSuccess = async (result: ISuccessResult) => {
    await refetch();
    console.log('🍎🍎🍎 确认租赁成功');
  };

  return (
    <div className='w-full'>
      {/* 如果余额不足，需要Fund先 */}
      <div className='w-full'>
        {pendingPayment > Number(formatUnits(balance ?? BigInt(0), 6)) && (
          <FundButton className='w-full' text='Recharge needed.' />
        )}
      </div>

      {pendingPayment < Number(formatUnits(balance ?? BigInt(0), 6)) && (
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_WORLD_ID_KEY as `app_${string}`}
          action={process.env.NEXT_PUBLIC_WORLD_ID_ACTION!}
          signal={id}
          verification_level={VerificationLevel.Orb}
          onSuccess={onSuccess}
          handleVerify={handleSign}
        >
          {({ open }) => (
            <button
              onClick={open}
              className={`button w-full px-4 py-2 transition-colors bg-blue-500 hover:bg-blue-600
              text-white font-medium`}
            >
              Sign a lease agreement
            </button>
          )}
        </IDKitWidget>
      )}
    </div>
  );
}
