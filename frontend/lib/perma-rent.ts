// types/contract.ts
export interface DealTerms {
  rentalAmount: bigint;
  securityDeposit: bigint;
  paymentInterval: bigint;
  totalRentalPeriods: bigint;
  dealHash: string;
}

// hooks/usePermaRent.ts
import { useWatchContractEvent, useWriteContract } from 'wagmi';
import { PERMARENT_ABI } from './abis/PermaRent';

export const usePermaRent = (contractAddress: `0x${string}`) => {
  const { writeContractAsync } = useWriteContract();

  const handleDeployDeal = async (
    paymentToken: `0x${string}`,
    lessor: `0x${string}`,
    terms: DealTerms
  ) => {
    try {
      const hash = await {
        address: contractAddress,
        abi: PERMARENT_ABI,
        functionName: 'deployDeal',
        args: [paymentToken, lessor, terms],
      };
      return hash;
    } catch (error) {
      console.error('Deploy deal failed:', error);
      throw error;
    }
  };

  // 监听 DealCreated 事件
  useWatchContractEvent({
    address: contractAddress,
    abi: PERMARENT_ABI,
    eventName: 'DealCreated',
    onLogs(logs) {
      console.log('Deal created:', logs);
    },
  });

  return {
    handleDeployDeal,
  };
};
