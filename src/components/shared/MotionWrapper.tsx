"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface MotionWrapperProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
  staggerChildren?: number
}

const variants = {
  up: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  },
  down: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
  },
  left: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  right: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function MotionDiv({ 
  children, 
  className = "", 
  style,
  delay = 0, 
  duration = 0.6, 
  direction = "up",
  staggerChildren 
}: MotionWrapperProps) {
  return (
    <motion.div
      className={`${className} block visible`}
      style={{ ...style, display: 'block', visibility: 'visible' }}
      initial="hidden"
      animate="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerChildren ? containerVariants : variants[direction]}
      transition={{ 
        duration, 
        delay,
        ease: "easeOut",
        ...(staggerChildren && { staggerChildren })
      }}
    >
      {children}
    </motion.div>
  )
}

export function MotionButton({ 
  children, 
  className = "", 
  style,
  delay = 0,
  onClick
}: MotionWrapperProps & { onClick?: () => void }) {
  return (
    <motion.button
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.3, 
        delay,
        ease: "easeOut"
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}

export function MotionSection({ 
  children, 
  className = "", 
  style,
  staggerChildren = 0.1 
}: MotionWrapperProps) {
  return (
    <motion.section
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      transition={{ staggerChildren }}
    >
      {children}
    </motion.section>
  )
}

export function FloatingElement({ 
  children, 
  className = "",
  delay = 0
}: MotionWrapperProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

export function GlowingElement({ 
  children, 
  className = "" 
}: MotionWrapperProps) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          "0 0 20px rgba(128, 180, 140, 0.3)",
          "0 0 40px rgba(128, 180, 140, 0.6)",
          "0 0 20px rgba(128, 180, 140, 0.3)"
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

export default MotionDiv
