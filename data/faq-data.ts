export interface FAQData {
  id: number
  question: string
  answer: string
  category: "general" | "wallet" | "staking" | "rewards"
}

export const faqData: FAQData[] = [
  {
    id: 1,
    question: "What is MEMEFI and how does it work?",
    answer: "MEMEFI is a Web3 meme contest platform where users can upload, stake on, and compete with memes using blockchain technology. You can earn BNB rewards by staking on winning memes or creating popular content that others stake on.",
    category: "general"
  },
  {
    id: 2,
    question: "How do I connect my wallet to MEMEFI?",
    answer: "Click the 'Connect Wallet' button in the top right corner. You'll need MetaMask installed in your browser. Once you approve the connection, your wallet address will be displayed and you can start staking on memes.",
    category: "wallet"
  },
  {
    id: 3,
    question: "What is staking and how does it work?",
    answer: "Staking means putting BNB tokens behind a meme you think will perform well. If the meme becomes popular and gets high engagement, you earn rewards proportional to your stake. The more you stake early on winning memes, the more you can earn.",
    category: "staking"
  },
  {
    id: 4,
    question: "How are rewards calculated and distributed?",
    answer: "Rewards are calculated based on meme performance metrics like likes, views, and total stakes. Weekly contests distribute BNB rewards to top performing memes and their stakers. The earlier you stake on a winning meme, the higher your reward multiplier.",
    category: "rewards"
  },
  {
    id: 5,
    question: "Can I upload my own memes?",
    answer: "Yes! Go to the Upload page to submit your memes. Make sure they're original, high-quality, and follow our community guidelines. Popular memes that attract stakes can earn you significant BNB rewards.",
    category: "general"
  },
  {
    id: 6,
    question: "Is MetaMask required or can I use other wallets?",
    answer: "Currently, MEMEFI is optimized for MetaMask, but we're working on supporting other Web3 wallets like WalletConnect, Coinbase Wallet, and Trust Wallet. MetaMask provides the best experience for now.",
    category: "wallet"
  },
  {
    id: 7,
    question: "What happens if I stake on a meme that doesn't perform well?",
    answer: "Staking involves risk - if a meme doesn't gain traction, you may not earn rewards on that particular stake. However, you can diversify by staking on multiple memes to spread your risk and increase your chances of backing winners.",
    category: "staking"
  },
  {
    id: 8,
    question: "Are there any fees for using MEMEFI?",
    answer: "MEMEFI doesn't charge platform fees for basic usage. You'll only pay standard blockchain gas fees for transactions like staking or claiming rewards. We keep costs minimal to maximize your earning potential.",
    category: "general"
  },
  {
    id: 9,
    question: "How often are contests held and when are rewards distributed?",
    answer: "We run weekly meme contests with different themes and categories. Rewards are calculated and distributed every Sunday night. You can track your earnings in real-time on your dashboard.",
    category: "rewards"
  },
  {
    id: 10,
    question: "Can I unstake my BNB before a contest ends?",
    answer: "Once you stake on a meme, your BNB is locked until the contest period ends. This ensures fair competition and prevents manipulation. Plan your stakes carefully and only use funds you can afford to lock up for the contest duration.",
    category: "staking"
  }
] 