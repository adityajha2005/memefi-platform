import { TransactionItem } from "./transaction-item"
import type { Transaction } from "@/types"

interface TransactionHistoryTabProps {
  transactions: Transaction[]
}

export function TransactionHistoryTab({ transactions }: TransactionHistoryTabProps) {
  return (
    <div className="space-y-4">
      <div className="meme-card p-6">
        <h3 className="font-black text-2xl mb-6 uppercase tracking-tight">TRANSACTION HISTORY</h3>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      </div>
    </div>
  )
} 