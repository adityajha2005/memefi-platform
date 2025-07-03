export const CONTRACTS = {
  MEME_STAKING: "0x79593ac71642f42bdbde4eb5d1e8260c0019e4f7",
  TWITTER_ENGAGEMENT: "0x6A94bE0044A41B59dD072Ef232e9efC5747E331D",
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

// Contract ABIs (imported using require)
export const MemeStakingABI = require('./abi/MemeStaking.json');
export const MemeNFTABI = require('./abi/MemeNFT.json');
export const TwitterEngagementABI = require('./abi/TwitterEngagement.json');

export interface ContractConfig {
  address: string;
  abi: any[];
}

export const CONTRACT_CONFIGS: Record<string, ContractConfig> = {
  MemeStaking: {
    address: CONTRACTS.MEME_STAKING,
    abi: MemeStakingABI,
  },
  MemeNFT: {
    address: CONTRACTS.MEME_NFT,
    abi: MemeNFTABI,
  },
  TwitterEngagement: {
    address: CONTRACTS.TWITTER_ENGAGEMENT,
    abi: TwitterEngagementABI,
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