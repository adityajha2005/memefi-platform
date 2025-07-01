import { TrendingUp, Coins } from "lucide-react"
import type { Transaction } from "@/types"

interface TransactionItemProps {
  transaction: Transaction
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border-2 border-black bg-white">
      <div className="flex items-center gap-4">
        <div
          className={`h-12 w-12 flex items-center justify-center border-2 border-black ${
            transaction.type === "stake" ? "bg-yellow-400" : transaction.type === "reward" ? "bg-green-400" : "bg-blue-400"
          }`}
        >
          {transaction.type === "stake" ? (
            <TrendingUp className="h-6 w-6 text-black" />
          ) : (
            <Coins className="h-6 w-6 text-black" />
          )}
        </div>
        <div>
          <p className="font-black text-lg uppercase tracking-tight">{transaction.type}</p>
          <p className="text-sm font-bold text-gray-600 uppercase">{transaction.meme}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-black text-xl ${transaction.type === "reward" ? "text-green-600" : "text-black"}`}>
          {transaction.type === "reward" ? "+" : "-"}
          {transaction.amount} BNB
        </p>
        <p className="text-sm font-bold text-gray-500 uppercase">
          {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
} 