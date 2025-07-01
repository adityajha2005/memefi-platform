export interface Meme {
  id: number
  title: string
  image: string
  creator: {
    name: string
    avatar: string
  }
  bnbStaked: number
  likes?: number
  twitterLikes?: number
  views?: number
  trending?: boolean
  status?: string
  uploadDate?: string
}

export interface User {
  name: string
  avatar: string
}

export interface Stake {
  id: number
  memeTitle: string
  image: string
  creator: string
  stakeAmount: number
  currentValue: number
  profit: number
  stakeDate: string
}

export interface Transaction {
  id: number
  type: "stake" | "reward" | "upload"
  amount: number
  meme: string
  date: string
  status: "completed" | "pending" | "failed"
}

export interface Stats {
  totalMemes: number
  bnbStaked: number
  activeUsers: number
}
