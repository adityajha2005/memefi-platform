"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"

export function HeroHeader() {
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <>
      <motion.div 
        className="mb-8 flex justify-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
      >

      </motion.div>

      <motion.h1 
        className="mb-6 text-6xl font-black tracking-tight sm:text-8xl text-black"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
      >
        {"MEMEFI".split("").map((letter, index) => (
          <motion.span
            key={index}
            variants={letterVariants}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            {letter}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p 
        className="mb-8 text-2xl font-bold text-gray-800 sm:text-3xl uppercase tracking-wide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        STAKE • MEME • WIN • REPEAT
      </motion.p>
    </>
  )
} 