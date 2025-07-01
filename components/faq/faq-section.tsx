"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FAQItem } from "./faq-item"
import { faqData, type FAQData } from "@/data/faq-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle, Wallet, TrendingUp, Gift } from "lucide-react"

const categoryIcons = {
  general: HelpCircle,
  wallet: Wallet,
  staking: TrendingUp,
  rewards: Gift,
}

const categoryLabels = {
  general: "General",
  wallet: "Wallet",
  staking: "Staking", 
  rewards: "Rewards",
}

export function FAQSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("general")

  const filteredFAQs = faqData.filter(
    (faq) => selectedCategory === "all" || faq.category === selectedCategory
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl font-black text-black mb-4 uppercase tracking-tight">
          ❓ FREQUENTLY ASKED QUESTIONS
        </h2>
        <p className="text-xl font-bold text-gray-700 uppercase tracking-wide">
          EVERYTHING YOU NEED TO KNOW ABOUT MEMEFI
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8 bg-black border-4 border-black">
            {Object.entries(categoryLabels).map(([key, label]) => {
              const Icon = categoryIcons[key as keyof typeof categoryIcons]
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  onClick={() => setSelectedCategory(key)}
                  className="font-black uppercase text-white data-[state=active]:bg-green-400 data-[state=active]:text-black flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {Object.keys(categoryLabels).map((category) => (
            <TabsContent key={category} value={category}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {faqData
                  .filter((faq) => faq.category === category)
                  .map((faq, index) => (
                    <FAQItem
                      key={faq.id}
                      question={faq.question}
                      answer={faq.answer}
                      isDefault={index === 0} // First item in each category is open by default
                    />
                  ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mt-12"
      >
        <div className="meme-card p-8 max-w-2xl mx-auto">
          <h3 className="font-black text-2xl mb-4 uppercase tracking-tight">
            STILL HAVE QUESTIONS? 🤔
          </h3>
          <p className="text-gray-700 font-bold mb-6">
            Join our community on Discord or Twitter for live support and updates!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#"
              className="btn-primary px-6 py-3 font-black uppercase text-center inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              JOIN DISCORD
            </motion.a>
            <motion.a
              href="#"
              className="btn-secondary px-6 py-3 font-black uppercase text-center inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              FOLLOW TWITTER
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  )
} 