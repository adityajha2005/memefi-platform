"use client"

import { Clock, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface Transaction {
  id: string
  type: "stake" | "reward" | "withdrawal" | "submission"
  amount?: number
  memeTitle?: string
  timestamp: string
  txHash: string
  status: "completed" | "pending" | "failed"
}

export function HistoryTab() {
  // Mock data - replace with actual transaction data from contracts
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "reward",
      amount: 2.5,
      memeTitle: "Doge Moon Landing",
      timestamp: "2024-01-15T10:30:00Z",
      txHash: "0x742d35Cc6000C4E5d6c0d6C3d95F5100E09a0a2F",
      status: "completed"
    },
    {
      id: "2", 
      type: "stake",
      amount: 0.5,
      memeTitle: "Pepe's Adventure",
      timestamp: "2024-01-14T15:20:00Z", 
      txHash: "0x8ba1f109551bD432803012645Hac136c95.5",
      status: "completed"
    },
    {
      id: "3",
      type: "submission",
      memeTitle: "Cats vs Dogs Meme War",
      timestamp: "2024-01-13T09:15:00Z",
      txHash: "0x123f456a789b012c345d678e901f234a567b890c",
      status: "completed"
    }
  ]

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'reward':
      case 'withdrawal':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case 'stake':
      case 'submission':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'reward':
        return 'text-green-600'
      case 'stake':
        return 'text-red-600'
      case 'withdrawal':
        return 'text-blue-600'
      case 'submission':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black uppercase">TRANSACTION HISTORY</h3>
        <div className="text-sm font-bold text-gray-300">
          {transactions.length} TRANSACTIONS
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="meme-card p-8 text-center">
          <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-black uppercase mb-2">NO TRANSACTIONS YET</h3>
          <p className="text-gray-300 font-bold">
            Start staking on memes or submit your own to see your activity here!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="meme-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getTransactionIcon(tx.type)}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-black uppercase text-sm ${getTransactionColor(tx.type)}`}>
                        {tx.type}
                      </span>
                      {tx.amount && (
                        <span className="font-black text-yellow-400">
                          {tx.amount} BNB
                        </span>
                      )}
                    </div>
                    
                    {tx.memeTitle && (
                      <div className="font-bold text-gray-300 text-sm mb-1">
                        {tx.memeTitle}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                      <span>{formatDate(tx.timestamp)}</span>
                      <a 
                        href={`https://bscscan.com/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-yellow-400 transition-colors"
                      >
                        {formatAddress(tx.txHash)}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <div className={`px-2 py-1 border-2 border-black font-black text-xs ${
                    tx.status === 'completed' ? 'bg-green-400 text-black' :
                    tx.status === 'pending' ? 'bg-yellow-400 text-black' :
                    'bg-red-400 text-black'
                  }`}>
                    {tx.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 