export const PERMARENTDEAL_ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_signProtocol',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_prpToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_paymentToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_worldVerifier',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_lessor',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: '_schemaId',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '_setKeySchemaId',
        type: 'uint64',
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
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
    ],
    name: 'StringsInsufficientHexLength',
    type: 'error',
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
        name: 'lessee',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'cipherKey',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'keyHash',
        type: 'string',
      },
    ],
    name: 'CipherKeySet',
    type: 'event',
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
        name: 'lessor',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'lessee',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startDate',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'attestationId',
        type: 'uint256',
      },
    ],
    name: 'DealApprovedByLessor',
    type: 'event',
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
        name: 'lessee',
        type: 'address',
      },
    ],
    name: 'DealSignedByLessee',
    type: 'event',
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
        name: 'initiator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'DealTerminated',
    type: 'event',
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
        name: 'lessor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'refundAmount',
        type: 'uint256',
      },
    ],
    name: 'DepositRefundSetted',
    type: 'event',
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
        name: 'lessee',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'refundAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'remainingDeposit',
        type: 'uint256',
      },
    ],
    name: 'DepositRefunded',
    type: 'event',
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
        name: 'lessee',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'period',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'PaymentFailed',
    type: 'event',
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
        name: 'payer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'period',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'PaymentMade',
    type: 'event',
  },
  {
    inputs: [],
    name: 'agreedRefundAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'lesseeAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'root',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nullifierHash',
        type: 'uint256',
      },
      {
        internalType: 'uint256[8]',
        name: 'proof',
        type: 'uint256[8]',
      },
    ],
    name: 'approveDealForLessee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'approvedAttestationId',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimRefund',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentPeriod',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'failedPayments',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'finalLessee',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isDealActive',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'key',
    outputs: [
      {
        internalType: 'string',
        name: 'cipherKey',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'keyHash',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'keySetAttestationId',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'lessees',
    outputs: [
      {
        internalType: 'bool',
        name: 'signed',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lessor',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'makePayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paymentToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'prpToken',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'refundClaimed',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'schemaId',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'cipherKey',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'keyHash',
            type: 'string',
          },
        ],
        internalType: 'struct PermaRentDeal.Key',
        name: '_cipherKey',
        type: 'tuple',
      },
    ],
    name: 'setCipherKey',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'refundAmount',
        type: 'uint256',
      },
    ],
    name: 'setDepositRefund',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'setKeySchemaId',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'root',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nullifierHash',
        type: 'uint256',
      },
      {
        internalType: 'uint256[8]',
        name: 'proof',
        type: 'uint256[8]',
      },
    ],
    name: 'signDealAsLessee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'signProtocol',
    outputs: [
      {
        internalType: 'contract ISP',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startDate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'terminateDeal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'terms',
    outputs: [
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
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'worldVerifier',
    outputs: [
      {
        internalType: 'contract IWorldVerifier',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
