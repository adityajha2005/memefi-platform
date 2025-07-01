"use client"
import { CustomButton } from "@/components/ui/custom-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Eye, Heart, TrendingUp, ArrowUpRight } from "lucide-react"
import Image from "next/image"

const myMemes = [
  {
    id: 1,
    title: "My Epic Doge Meme",
    image: "/placeholder.svg?height=100&width=100",
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
    bnbStaked: 15.67,
    views: 890,
    likes: 234,
    status: "active",
    uploadDate: "2024-01-12",
  },
]

const myStakes = [
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

const transactions = [
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

export function DashboardTabs() {
  return (
    <div className="max-w-6xl mx-auto">
      <Tabs defaultValue="memes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8 bg-black border-4 border-black">
          <TabsTrigger
            value="memes"
            className="font-black uppercase text-white data-[state=active]:bg-green-400 data-[state=active]:text-black"
          >
            MY MEMES
          </TabsTrigger>
          <TabsTrigger
            value="stakes"
            className="font-black uppercase text-white data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
          >
            MY STAKES
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="font-black uppercase text-white data-[state=active]:bg-red-400 data-[state=active]:text-black"
          >
            HISTORY
          </TabsTrigger>
        </TabsList>

        <TabsContent value="memes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myMemes.map((meme) => (
              <div key={meme.id} className="meme-card p-4">
                <div className="flex items-start gap-4 mb-4">
                  <Image
                    src={meme.image || "/placeholder.svg"}
                    alt={meme.title}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover border-2 border-black"
                  />
                  <div className="flex-1">
                    <h3 className="font-black text-lg mb-2 uppercase tracking-tight">{meme.title}</h3>
                    <div className="bg-green-400 text-black px-2 py-1 border-2 border-black font-black text-xs uppercase mb-2 inline-block">
                      {meme.status}
                    </div>
                    <p className="text-sm font-bold text-gray-600 uppercase">
                      UPLOADED {new Date(meme.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 bg-yellow-400 text-black px-2 py-1 border-2 border-black font-black mb-1">
                      <Coins className="h-4 w-4" />
                      <span>{meme.bnbStaked}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase">BNB STAKED</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 bg-blue-400 text-white px-2 py-1 border-2 border-black font-black mb-1">
                      <Eye className="h-4 w-4" />
                      <span>{meme.views}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase">VIEWS</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 bg-red-400 text-white px-2 py-1 border-2 border-black font-black mb-1">
                      <Heart className="h-4 w-4" />
                      <span>{meme.likes}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase">LIKES</span>
                  </div>
                </div>

                <CustomButton variant="secondary" className="w-full">
                  VIEW DETAILS
                </CustomButton>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stakes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myStakes.map((stake) => (
              <div key={stake.id} className="meme-card p-4">
                <div className="flex items-start gap-4 mb-4">
                  <Image
                    src={stake.image || "/placeholder.svg"}
                    alt={stake.memeTitle}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover border-2 border-black"
                  />
                  <div className="flex-1">
                    <h3 className="font-black text-lg mb-1 uppercase tracking-tight">{stake.memeTitle}</h3>
                    <p className="text-sm font-bold text-gray-600 mb-2 uppercase">BY {stake.creator}</p>
                    <p className="text-xs font-bold text-gray-500 uppercase">
                      STAKED {new Date(stake.stakeDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-600 uppercase">INITIAL STAKE</span>
                    <span className="font-black text-lg">{stake.stakeAmount} BNB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-600 uppercase">CURRENT VALUE</span>
                    <span className="font-black text-lg">{stake.currentValue} BNB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-600 uppercase">PROFIT/LOSS</span>
                    <span
                      className={`font-black text-lg flex items-center gap-1 ${
                        stake.profit > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <ArrowUpRight className="h-4 w-4" />+{stake.profit} BNB
                    </span>
                  </div>
                </div>

                <CustomButton variant="primary" className="w-full mt-4">
                  MANAGE STAKE
                </CustomButton>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="meme-card p-6">
            <h3 className="font-black text-2xl mb-6 uppercase tracking-tight">TRANSACTION HISTORY</h3>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border-2 border-black bg-white">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 flex items-center justify-center border-2 border-black ${
                        tx.type === "stake" ? "bg-yellow-400" : "bg-green-400"
                      }`}
                    >
                      {tx.type === "stake" ? (
                        <TrendingUp className="h-6 w-6 text-black" />
                      ) : (
                        <Coins className="h-6 w-6 text-black" />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-lg uppercase tracking-tight">{tx.type}</p>
                      <p className="text-sm font-bold text-gray-600 uppercase">{tx.meme}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-xl ${tx.type === "reward" ? "text-green-600" : "text-black"}`}>
                      {tx.type === "reward" ? "+" : "-"}
                      {tx.amount} BNB
                    </p>
                    <p className="text-sm font-bold text-gray-500 uppercase">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
