export const CONTRACTS = {
  MEME_STAKING: "0xBC1D7C1B312a40c38D069071EE5618E25A6701fC",
  TWITTER_ENGAGEMENT: "0x6F8a4C7c48F6f82A9E2c41bB1627BdEadBFEe0bE",
  MEME_NFT: "0x1486cF91b47D3055512E58D40f414F445EFB134E",
  
  NETWORK: {
    chainId: 97,
    name: "BNB Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    blockExplorer: "https://testnet.bscscan.com",
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18,
    },
  },
  
  // Deployer Information
  DEPLOYER: "0xc8263C178F141e6c8F30455b1113971dFB470a51",
  
  // Contract Settings
  SETTINGS: {
    memeStakeDelay: 30, // seconds
    contestDuration: 86400, // seconds (24 hours)
    contestEndGracePeriod: 3600, // seconds (1 hour)
    minStakeAmount: "0.001", // ETH
    maxStakersPerMeme: 50,
    maxMemesPerContest: 100,
    rewardBatchSize: 25,
  },
} as const;

// Contract ABIs (imported from generated files)
export { default as MemeStakingABI } from './abi/MemeStaking.json';
export { default as MemeNFTABI } from './abi/MemeNFT.json';
export { default as TwitterEngagementABI } from './abi/TwitterEngagement.json';

export interface ContractConfig {
  address: string;
  abi: any[];
}

export const CONTRACT_CONFIGS: Record<string, ContractConfig> = {
  MemeStaking: {
    address: CONTRACTS.MEME_STAKING,
    abi: [], // Will be populated by importing the ABI
  },
  MemeNFT: {
    address: CONTRACTS.MEME_NFT,
    abi: [], // Will be populated by importing the ABI
  },
  TwitterEngagement: {
    address: CONTRACTS.TWITTER_ENGAGEMENT,
    abi: [], // Will be populated by importing the ABI
  },
};

// Helper function to get contract config
export function getContractConfig(contractName: keyof typeof CONTRACT_CONFIGS) {
  return CONTRACT_CONFIGS[contractName];
}

// Export all addresses for quick access
export const ADDRESSES = {
  MEME_STAKING: CONTRACTS.MEME_STAKING,
  TWITTER_ENGAGEMENT: CONTRACTS.TWITTER_ENGAGEMENT,
  MEME_NFT: CONTRACTS.MEME_NFT,
} as const; 