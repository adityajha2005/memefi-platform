import { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  href?: string
}

export function CustomButton({ 
  children, 
  className, 
  variant = "primary",
  href,
  ...props 
}: CustomButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 font-black text-sm uppercase tracking-wider transition-all duration-200 ease-in-out"
  const variantStyles = {
    primary: "bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black",
    secondary: "bg-black hover:bg-gray-800 text-white border-2 border-black",
    outline: "bg-transparent hover:bg-gray-100 text-black border-2 border-black"
  }

  const buttonClasses = cn(
    baseStyles,
    variantStyles[variant],
    className
  )

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  )
}
