'use client';
import { useUserBalance } from '@/lib/reputation-points';
import { Address, Avatar, EthBalance } from '@coinbase/onchainkit/identity';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { BiSolidStar } from 'react-icons/bi';
import { useAccount } from 'wagmi';

export default function Account() {
  const { address } = useAccount();
  const { balance } = useUserBalance(address!);

  console.log(balance);

  return (
    <div
      className='w-full flex justify-center bg-sky-950 rounded-bl-2xl rounded-br-2xl px-6 py-8 shadow-lg
'
    >
      <Wallet>
        <ConnectWallet className='perma-account flex bg-transparent text-2xl pointer-events-none hover:bg-transparent'>
          <Avatar className='h-24 w-24' />
          <Address className='pointer-events-auto' />
          <EthBalance />
          {/* TODO: Deal point */}
          <div className='perma-account-point text-base flex gap-1 items-center rounded-full bg-sky-900 px-3 py-1 opacity-80'>
            <BiSolidStar />
            <div className='text-sm leading-none pt-px'>
              {balance ? String(balance) : 0}
            </div>
          </div>
        </ConnectWallet>
      </Wallet>
    </div>
  );
}
