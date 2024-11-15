export const PERMARENT_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_signProtocol',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_spHook',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_prpToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_worldVerifier',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: '_approvedSchemaId',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '_setKeySchemaId',
        type: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'deal',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'paymentToken',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lessor',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'rentalAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'securityDeposit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'paymentInterval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalRentalPeriods',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'dealHash',
            type: 'string',
          },
        ],
        indexed: false,
        internalType: 'struct PermaRentDeal.DealTerms',
        name: 'terms',
        type: 'tuple',
      },
    ],
    name: 'DealCreated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_paymentToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_lessor',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'rentalAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'securityDeposit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'paymentInterval',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalRentalPeriods',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'dealHash',
            type: 'string',
          },
        ],
        internalType: 'struct PermaRentDeal.DealTerms',
        name: '_terms',
        type: 'tuple',
      },
    ],
    name: 'deployDeal',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
