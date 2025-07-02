import { Address } from 'viem';
import MemeStakingABI from '../abi/MemeStaking.json';
import MemeNFTABI from '../abi/MemeNFT.json';
import TwitterEngagementABI from '../abi/TwitterEngagement.json';

export const CONTRACT_ADDRESSES = {
  MEME_STAKING: '0xBC1D7C1B312a40c38D069071EE5618E25A6701fC' as Address,
  TWITTER_ENGAGEMENT: '0x6F8a4C7c48F6f82A9E2c41bB1627BdEadBFEe0bE' as Address,
  MEME_NFT: '0x1486cF91b47D3055512E58D40f414F445EFB134E' as Address,
} as const;

export const CONTRACT_ABIS = {
  MEME_STAKING: MemeStakingABI,
  MEME_NFT: MemeNFTABI,
  TWITTER_ENGAGEMENT: TwitterEngagementABI,
} as const;

export const NETWORK_CONFIG = {
  chainId: 97,
  name: 'BNB Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    name: 'Test BNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    },
    public: {
      http: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BscScan',
      url: 'https://testnet.bscscan.com',
    },
  },
  testnet: true,
} as const;

export const MEME_STAKING_CONTRACT = {
  address: CONTRACT_ADDRESSES.MEME_STAKING,
  abi: CONTRACT_ABIS.MEME_STAKING,
} as const;

export const MEME_NFT_CONTRACT = {
  address: CONTRACT_ADDRESSES.MEME_NFT,
  abi: CONTRACT_ABIS.MEME_NFT,
} as const;

export const TWITTER_ENGAGEMENT_CONTRACT = {
  address: CONTRACT_ADDRESSES.TWITTER_ENGAGEMENT,
  abi: CONTRACT_ABIS.TWITTER_ENGAGEMENT,
} as const;

// Platform settings from deployment
export const PLATFORM_SETTINGS = {
  memeStakeDelay: 30, // seconds
  contestDuration: 86400, // seconds (24 hours)
  contestEndGracePeriod: 3600, // seconds (1 hour)
  minStakeAmount: '0.001', // ETH
  maxStakersPerMeme: 50,
  maxMemesPerContest: 100,
  rewardBatchSize: 25,
  deployerAddress: '0xc8263C178F141e6c8F30455b1113971dFB470a51' as Address,
} as const;

export interface MemeData {
  id: bigint;
  creator: Address;
  totalStaked: bigint;
  timestamp: bigint;
  ipfsHash: string;
  exists: boolean;
  rewardDistributed: boolean;
  engagementScore: bigint;
  tweetId: string;
}

export interface ContestData {
  contestId: bigint;
  startTime: bigint;
  endTime: bigint;
  ended: boolean;
  memeIds: bigint[];
  winningMemeId: bigint;
  totalPrizePool: bigint;
}

export interface WinnerNFTData {
  winner: Address;
  totalStaked: bigint;
  contestId: bigint;
  memeId: bigint;
  timestamp: bigint;
  originalMemeHash: string;
}

export function getContractConfig(contractName: 'MEME_STAKING' | 'MEME_NFT' | 'TWITTER_ENGAGEMENT') {
  switch (contractName) {
    case 'MEME_STAKING':
      return MEME_STAKING_CONTRACT;
    case 'MEME_NFT':
      return MEME_NFT_CONTRACT;
    case 'TWITTER_ENGAGEMENT':
      return TWITTER_ENGAGEMENT_CONTRACT;
    default:
      throw new Error(`Unknown contract: ${contractName}`);
  }
}

export default {
  addresses: CONTRACT_ADDRESSES,
  abis: CONTRACT_ABIS,
  network: NETWORK_CONFIG,
  settings: PLATFORM_SETTINGS,
  contracts: {
    memeStaking: MEME_STAKING_CONTRACT,
    memeNFT: MEME_NFT_CONTRACT,
    twitterEngagement: TWITTER_ENGAGEMENT_CONTRACT,
  },
}; 