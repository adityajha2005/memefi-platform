import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ButtonProps } from "@/components/ui/button"

interface CustomButtonProps extends ButtonProps {
  variant?: "primary" | "secondary" | "warning" | "danger"
}

export function CustomButton({ children, className, variant = "primary", ...props }: CustomButtonProps) {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    warning: "btn-warning",
    danger:
      "bg-red-500 hover:bg-red-600 text-white border-2 border-black box-shadow-[3px_3px_0px_#000000] font-bold uppercase",
  }

  return (
    <Button className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Button>
  )
}
