import { PERMAREPUTATIONPOINTS_ABI } from '@/lib/abis/PermaReputationPoints';
import {
  useReadContract,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';

export const useReputationPoints = (contractAddress: `0x${string}`) => {
  const { writeContractAsync } = useWriteContract();

  // 转账
  const handleTransfer = async (to: `0x${string}`, amount: bigint) => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: PERMAREPUTATIONPOINTS_ABI,
        functionName: 'transfer',
        args: [to, amount],
      });
      return hash;
    } catch (error) {
      console.error('Transfer failed:', error);
      throw error;
    }
  };

  // 授权
  const handleApprove = async (spender: `0x${string}`, amount: bigint) => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: PERMAREPUTATIONPOINTS_ABI,
        functionName: 'approve',
        args: [spender, amount],
      });
      return hash;
    } catch (error) {
      console.error('Approve failed:', error);
      throw error;
    }
  };

  // 铸造代币（仅owner）
  const handleMint = async (to: `0x${string}`, amount: bigint) => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: PERMAREPUTATIONPOINTS_ABI,
        functionName: 'mint',
        args: [to, amount],
      });
      return hash;
    } catch (error) {
      console.error('Mint failed:', error);
      throw error;
    }
  };

  // 销毁代币（仅owner）
  const handleBurn = async (from: `0x${string}`, amount: bigint) => {
    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: PERMAREPUTATIONPOINTS_ABI,
        functionName: 'burn',
        args: [from, amount],
      });
      return hash;
    } catch (error) {
      console.error('Burn failed:', error);
      throw error;
    }
  };

  // 监听 Transfer 事件
  useWatchContractEvent({
    address: contractAddress,
    abi: PERMAREPUTATIONPOINTS_ABI,
    eventName: 'Transfer',
    onLogs(logs) {
      console.log('Transfer event:', logs);
    },
  });

  return {
    handleTransfer,
    handleApprove,
    handleMint,
    handleBurn,
  };
};

// 查询余额
export const useUserBalance = (address: `0x${string}`) => {
  const { data, isError, isLoading } = useReadContract({
    address: process.env.NEXT_PUBLIC_PERMA_REPUTATION_POINTS as `0x${string}`,
    abi: PERMAREPUTATIONPOINTS_ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  return {
    balance: data,
    isError,
    isLoading,
  };
};

// 查询授权额度
export const useAllowanceBalance = (
  owner: `0x${string}`,
  spender: `0x${string}`,
  contractAddress: `0x${string}`
) => {
  const { data, isError, isLoading } = useReadContract({
    address: contractAddress,
    abi: PERMAREPUTATIONPOINTS_ABI,
    functionName: 'allowance',
    args: [owner, spender],
  });

  return {
    allowance: data,
    isError,
    isLoading,
  };
};
