import type { Meme, Stake, Transaction } from "@/types"

export const trendingMemes: Meme[] = [
  {
    id: 1,
    title: "Doge to the Moon",
    image: "/placeholder.svg?height=300&width=400",
    creator: {
      name: "CryptoMemer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bnbStaked: 45.67,
    likes: 1234,
    twitterLikes: 1234,
    trending: true,
  },
  {
    id: 2,
    title: "NFT Collector Problems",
    image: "/placeholder.svg?height=300&width=400",
    creator: {
      name: "BlockchainBro",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bnbStaked: 32.45,
    likes: 987,
    twitterLikes: 987,
    trending: true,
  },
  {
    id: 3,
    title: "When Gas Fees Hit",
    image: "/placeholder.svg?height=300&width=400",
    creator: {
      name: "EthereumElf",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bnbStaked: 28.91,
    likes: 756,
    twitterLikes: 756,
    trending: false,
  },
  {
    id: 4,
    title: "HODL Life",
    image: "/placeholder.svg?height=300&width=400",
    creator: {
      name: "DiamondHands",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bnbStaked: 67.23,
    likes: 1567,
    twitterLikes: 1567,
    trending: true,
  },
  {
    id: 5,
    title: "DeFi Summer Vibes",
    image: "/placeholder.svg?height=300&width=400",
    creator: {
      name: "YieldFarmer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bnbStaked: 23.45,
    likes: 543,
    twitterLikes: 543,
    trending: false,
  },
  {
    id: 6,
    title: "Rug Pull Survivor",
    image: "/placeholder.svg?height=300&width=400",
    creator: {
      name: "SafeMoonSailor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    bnbStaked: 19.87,
    likes: 432,
    twitterLikes: 432,
    trending: false,
  },
]

export const myMemes: Meme[] = [
  {
    id: 1,
    title: "My Epic Doge Meme",
    image: "/placeholder.svg?height=100&width=100",
    creator: { name: "You", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 23.45,
    views: 1234,
    likes: 567,
    status: "active",
    uploadDate: "2024-01-15",
  },
  {
    id: 2,
    title: "Crypto Winter Vibes",
    image: "/placeholder.svg?height=100&width=100",
    creator: { name: "You", avatar: "/placeholder.svg?height=40&width=40" },
    bnbStaked: 15.67,
    views: 890,
    likes: 234,
    status: "active",
    uploadDate: "2024-01-12",
  },
]

export const myStakes: Stake[] = [
  {
    id: 1,
    memeTitle: "HODL Life",
    image: "/placeholder.svg?height=100&width=100",
    creator: "DiamondHands",
    stakeAmount: 5.0,
    currentValue: 6.2,
    profit: 1.2,
    stakeDate: "2024-01-10",
  },
  {
    id: 2,
    memeTitle: "Doge to the Moon",
    image: "/placeholder.svg?height=100&width=100",
    creator: "CryptoMemer",
    stakeAmount: 3.5,
    currentValue: 4.1,
    profit: 0.6,
    stakeDate: "2024-01-08",
  },
]

export const transactions: Transaction[] = [
  {
    id: 1,
    type: "stake",
    amount: 5.0,
    meme: "HODL Life",
    date: "2024-01-10",
    status: "completed",
  },
  {
    id: 2,
    type: "reward",
    amount: 1.2,
    meme: "My Epic Doge Meme",
    date: "2024-01-09",
    status: "completed",
  },
  {
    id: 3,
    type: "stake",
    amount: 3.5,
    meme: "Doge to the Moon",
    date: "2024-01-08",
    status: "completed",
  },
]
