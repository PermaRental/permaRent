'use client';

import { useLit } from '@/hooks/useLit';
import { PERMARENTDEAL_ABI } from '@/lib/abis/PermaRentDeal';
import { useState } from 'react';
import { usePublicClient, useWriteContract } from 'wagmi';

export default function AddEncryptValue({
  id,
  refetch,
}: {
  id: `0x${string}`;
  refetch: () => void;
}) {
  const [value, setValue] = useState('7bd0e33c');
  const { encrypt } = useLit();

  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();

  const accessControlConditions = [
    {
      contractAddress: '',
      standardContractType: '',
      chain: 'baseSepolia',
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: '0xc1fa14cFA7161a9a953Dd428c360fDD8a30A3bB9',
      },
    },
  ];

  const handleEncrypt = async (content: string) => {
    try {
      const result = await encrypt(content, accessControlConditions);
      return result;
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  async function encryptHash() {
    const encrypeedHash = await handleEncrypt(value);

    if (!encrypeedHash) {
      throw new Error('Encryption failed');
    }

    const hash = await writeContractAsync({
      address: id as `0x${string}`,
      abi: PERMARENTDEAL_ABI,
      functionName: 'setCipherKey',
      args: [[encrypeedHash?.ciphertext, encrypeedHash?.dataToEncryptHash]],
    });

    const result = await client?.waitForTransactionReceipt({ hash });

    console.log('🍊🍊🍊🍊🍊🍊🍊🍊', hash, result);

    await refetch();
  }

  return (
    <div className='field'>
      <label htmlFor='add-encrypt-value'>Add Encrypt Code</label>
      <input
        id='add-encrypt-value'
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className='button' onClick={encryptHash}>
        Set code
      </button>
    </div>
  );
}
