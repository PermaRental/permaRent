import { GraphQLClient, gql } from 'graphql-request';

// 类型定义
export interface Deal {
  id: string;
  paymentToken: string;
  lessor: string;
  rentalAmount: string;
  securityDeposit: string;
  paymentInterval: string;
  totalRentalPeriods: string;
  dealHash: string;
  lessees: string[];
  finalLessee?: string;
  approvedTimestamp?: string;
  approvalAttestationId?: string;
  lastPaymentTimestamp?: string;
  currentPeriod?: string;
  failedPaymentCount: string;
  refundAmount?: string;
  remainingDeposit?: string;
  terminatedTimestamp?: string;
  cipherKey?: string;
  refundSettledAmount: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

// 查询响应类型
interface LesseeDealsResponse {
  deals: Deal[];
}

interface LessorDealsResponse {
  deals: Deal[];
}

interface DealDetailResponse {
  deal: Deal;
}

// 获取lesse所有的deal
const GET_LESSEE_DEALS = gql`
  query getDealsByLessee($lesseeAddress: Bytes!) {
    deals(where: { lessees_contains: [$lesseeAddress] }) {
      id
      paymentToken
      lessor
      rentalAmount
      securityDeposit
      paymentInterval
      totalRentalPeriods
      dealHash
      lessees
      finalLessee
      approvedTimestamp
      approvalAttestationId
      lastPaymentTimestamp
      currentPeriod
      failedPaymentCount
      refundAmount
      remainingDeposit
      terminatedTimestamp
      cipherKey
      refundSettledAmount
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// 获取lessor所有的deal
const GET_LESSOR_DEALS = gql`
  query GetLessorDeals($address: String!) {
    deals(where: { lessor: $address }) {
      id
      approvalAttestationId
      approvedTimestamp
      blockNumber
      blockTimestamp
      cipherKey
      currentPeriod
      dealHash
      failedPaymentCount
      finalLessee
      lastPaymentTimestamp
      lessees
      lessor
      paymentInterval
      paymentToken
      refundAmount
      refundSettledAmount
      remainingDeposit
      rentalAmount
      securityDeposit
      terminatedTimestamp
      totalRentalPeriods
      transactionHash
    }
  }
`;

// 根据id获取 deal 的详情
const GET_DEAL_DETAIL = gql`
  query GetDealDetail($id: ID!) {
    deal(id: $id) {
      id
      paymentToken
      lessor
      rentalAmount
      securityDeposit
      paymentInterval
      totalRentalPeriods
      dealHash
      lessees
      finalLessee
      approvedTimestamp
      approvalAttestationId
      lastPaymentTimestamp
      currentPeriod
      failedPaymentCount
      refundAmount
      remainingDeposit
      terminatedTimestamp
      cipherKey
      refundSettledAmount
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

const GET_DEAL_BY_HASH = `
  query getDealByHash($dealHash: String!) {
    deals(where: { dealHash: $dealHash }) {
      id
      paymentToken
      lessor
      rentalAmount
      securityDeposit
      paymentInterval
      totalRentalPeriods
      dealHash
      lessees
      finalLessee
      approvedTimestamp
      approvalAttestationId
      lastPaymentTimestamp
      currentPeriod
      failedPaymentCount
      refundAmount
      remainingDeposit
      terminatedTimestamp
      cipherKey
      refundSettledAmount
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

export class DealService {
  private client: GraphQLClient;

  constructor(endpoint: string) {
    this.client = new GraphQLClient(endpoint);
  }

  // 1. 获取承租人的所有交易
  async getLesseeDeals(address: string): Promise<Deal[]> {
    try {
      const data = await this.client.request<LesseeDealsResponse>(
        GET_LESSEE_DEALS,
        { lesseeAddress: address }
      );
      return data.deals;
    } catch (error) {
      console.error('Error fetching lessee deals:', error);
      throw error;
    }
  }

  // 2. 获取出租人的所有交易
  async getLessorDeals(address: string): Promise<Deal[]> {
    try {
      const data = await this.client.request<LessorDealsResponse>(
        GET_LESSOR_DEALS,
        { address: address.toLowerCase() }
      );
      return data.deals;
    } catch (error) {
      console.error('Error fetching lessor deals:', error);
      throw error;
    }
  }

  // 3. 获取交易详情
  async getDealDetail(dealId: string): Promise<Deal> {
    try {
      const data = await this.client.request<DealDetailResponse>(
        GET_DEAL_DETAIL,
        { id: dealId }
      );
      return data.deal;
    } catch (error) {
      console.error('Error fetching deal detail:', error);
      throw error;
    }
  }

  // 根据ipfshash 获取deal详情
  async getDealDetailByHash(hash: string): Promise<Deal> {
    try {
      const data = await this.client.request<LessorDealsResponse>(
        GET_DEAL_BY_HASH,
        {
          dealHash: hash,
        }
      );
      const deals = data?.deals;

      if (deals && deals?.length) {
        return deals?.[0];
      }
      throw new Error('No deal found');
    } catch (error) {
      console.error('Error fetching deal detail:', error);
      throw error;
    }
  }
}

export default new DealService(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT_URL!);
