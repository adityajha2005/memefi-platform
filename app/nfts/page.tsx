"use client"

import { NFTGallery } from "@/components/nft/nft-gallery"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Trophy, Sparkles, Crown } from "lucide-react"

export default function NFTsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#7FFFD4] to-[#87CEFA] text-black py-20"              >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <Crown className="h-16 w-16 mx-auto mb-4" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-6"
          >
            WINNER NFT HALL OF FAME
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl font-bold max-w-3xl mx-auto mb-8"
          >
            Exclusive NFTs minted for contest winners. Each NFT represents a victorious meme that dominated the competition.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-8 text-lg font-black"
          >
            <div className="text-center">
              <div className="text-3xl mb-1">🎨</div>
              <p>UNIQUE ART</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">🏅</div>
              <p>VICTORY PROOF</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">💎</div>
              <p>RARE COLLECTIBLES</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <Card className="p-6 border-4 border-black bg-white">
              <div className="text-center">
                <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase mb-3">CONTEST WINNERS</h3>
                <p className="text-gray-600 font-bold">
                  Each NFT is minted for the winning meme of a contest, capturing the moment of victory forever on the blockchain.
                </p>
              </div>
            </Card>

            <Card className="p-6 border-4 border-black bg-white">
              <div className="text-center">
                <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase mb-3">UNIQUE METADATA</h3>
                <p className="text-gray-600 font-bold">
                  Every NFT contains contest data, stake amounts, timestamps, and links to the original meme content.
                </p>
              </div>
            </Card>

            <Card className="p-6 border-4 border-black bg-white">
              <div className="text-center">
                <Crown className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase mb-3">PROOF OF DOMINANCE</h3>
                <p className="text-gray-600 font-bold">
                  Own an NFT that proves your meme conquered the competition and earned the community's stakes.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* NFT Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <NFTGallery 
              showUserNFTs={true}
              showAllNFTs={true}
              compact={false}
            />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black uppercase mb-6">HOW WINNER NFTS WORK</h2>
            <p className="text-xl font-bold text-gray-300 max-w-3xl mx-auto">
              Understanding the process from meme submission to NFT minting
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-yellow-400 text-black w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-black uppercase mb-3">CONTEST ENDS</h3>
              <p className="text-gray-300 font-bold">
                When a contest concludes, the meme with the highest stakes is declared the winner.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-green-400 text-black w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-black uppercase mb-3">NFT MINTED</h3>
              <p className="text-gray-300 font-bold">
                A unique Winner NFT is minted to the creator's wallet with all contest metadata embedded.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-blue-400 text-black w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-black uppercase mb-3">PERMANENT RECORD</h3>
              <p className="text-gray-300 font-bold">
                The NFT becomes a permanent blockchain record of the victory and contest details.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-purple-400 text-black w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-black uppercase mb-3">COLLECT & TRADE</h3>
              <p className="text-gray-300 font-bold">
                Winners can showcase their NFTs and potentially trade them on secondary markets.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-400 to-blue-500 text-black">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black uppercase mb-6">READY TO WIN YOUR NFT?</h2>
            <p className="text-xl font-bold mb-8 max-w-2xl mx-auto">
              Submit your memes, stake on favorites, and compete for the chance to earn your own Winner NFT!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/upload"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-8 py-4 border-4 border-black uppercase text-lg transition-colors"
              >
                SUBMIT MEME
              </motion.a>
              <motion.a
                href="/explore"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white hover:bg-gray-100 text-black font-black px-8 py-4 border-4 border-black uppercase text-lg transition-colors"
              >
                EXPLORE MEMES
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 