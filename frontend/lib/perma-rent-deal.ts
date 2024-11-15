// types/contract.ts
export interface DealTerms {
  rentalAmount: bigint;
  securityDeposit: bigint;
  paymentInterval: bigint;
  totalRentalPeriods: bigint;
  dealHash: string;
}

export interface LesseeInfo {
  signed: boolean;
  approved: boolean;
}

// hooks/usePermaRentDeal.ts
import {
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';
import { PERMARENTDEAL_ABI } from './abis/PermaRentDeal';

export const usePermaRentDeal = (contractAddress: `0x${string}`) => {
  const { writeContractAsync } = useWriteContract();

  // 读取合约状态
  const { data: terms } = useReadContract({
    address: contractAddress,
    abi: PERMARENTDEAL_ABI,
    functionName: 'terms',
  });

  const { data: isDealActive } = useReadContract({
    address: contractAddress,
    abi: PERMARENTDEAL_ABI,
    functionName: 'isDealActive',
  });

  const { data: currentPeriod } = useReadContract({
    address: contractAddress,
    abi: PERMARENTDEAL_ABI,
    functionName: 'currentPeriod',
  });

  // 承租人登记
  const handleSignDeal = async (
    root: bigint,
    nullifierHash: bigint,
    proof: bigint[]
  ) => {
    console.log(contractAddress, root, nullifierHash, proof);

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: PERMARENTDEAL_ABI,
        functionName: 'signDealAsLessee',
        args: [root, nullifierHash, proof],
      });
      return hash;
    } catch (error) {
      console.error('Sign deal failed:', error);
      throw error;
    }
  };

  // 出租人同意
  const handleApproveDeal = async (
    lesseeAddress: `0x${string}`,
    root: bigint,
    nullifierHash: bigint,
    proof: bigint[]
  ) => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: PERMARENTDEAL_ABI,
        functionName: 'approveDealForLessee',
        args: [lesseeAddress, root, nullifierHash, proof],
      });
      return hash;
    } catch (error) {
      console.error('Approve deal failed:', error);
      throw error;
    }
  };

  // 支付租金
  const handleMakePayment = async () => {
    try {
      const hash = await writeContractAsync(
        {
          address: contractAddress,
          abi: PERMARENTDEAL_ABI,
          functionName: 'makePayment',
        },
        {
          onSuccess: () => {
            console.log('success');
          },
          onError: (error) => {
            console.log('error', error.message);
          },
        }
      );
      return hash;
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  };

  // 设置密钥
  const handleSetCipherKey = async (cipherKey: string) => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: PERMARENTDEAL_ABI,
        functionName: 'setCipherKey',
        args: [cipherKey],
      });
      return hash;
    } catch (error) {
      console.error('Set cipher key failed:', error);
      throw error;
    }
  };

  // 设置押金退还金额
  const handleSetDepositRefund = async (refundAmount: bigint) => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: PERMARENTDEAL_ABI,
        functionName: 'setDepositRefund',
        args: [refundAmount],
      });
      return hash;
    } catch (error) {
      console.error('Set deposit refund failed:', error);
      throw error;
    }
  };

  // 申领退还的押金
  const handleClaimRefund = async () => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: PERMARENTDEAL_ABI,
        functionName: 'claimRefund',
      });
      return hash;
    } catch (error) {
      console.error('Claim refund failed:', error);
      throw error;
    }
  };

  // 终止合约
  const handleTerminateDeal = async () => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: PERMARENTDEAL_ABI,
        functionName: 'terminateDeal',
      });
      return hash;
    } catch (error) {
      console.error('Terminate deal failed:', error);
      throw error;
    }
  };

  // 事件监听
  useWatchContractEvent({
    address: contractAddress,
    abi: PERMARENTDEAL_ABI,
    eventName: 'DealSignedByLessee',
    onLogs(logs) {
      console.log('Deal signed:', logs);
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: PERMARENTDEAL_ABI,
    eventName: 'DealApprovedByLessor',
    onLogs(logs) {
      console.log('Deal approved:', logs);
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: PERMARENTDEAL_ABI,
    eventName: 'PaymentMade',
    onLogs(logs) {
      console.log('Payment made:', logs);
    },
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: PERMARENTDEAL_ABI,
    eventName: 'CipherKeySet',
    onLogs(logs) {
      console.log('Cipher key set:', logs);
    },
  });

  return {
    // 状态读取
    terms,
    isDealActive,
    currentPeriod,

    // 方法调用
    handleSignDeal, // 承租人登记
    handleApproveDeal, // 出租人同意
    handleMakePayment, // 支付租金
    handleSetCipherKey, // 设置密钥
    handleSetDepositRefund, // 设置押金退还
    handleClaimRefund, // 申领退还押金
    handleTerminateDeal, // 终止合约
  };
};
