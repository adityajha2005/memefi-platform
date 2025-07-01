"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info, Zap } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
  onClose: () => void
}

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: Zap,
  }

  const colors = {
    success: "bg-green-400 text-black border-green-600",
    error: "bg-red-400 text-white border-red-600",
    info: "bg-blue-400 text-white border-blue-600",
    warning: "bg-yellow-400 text-black border-yellow-600",
  }

  const Icon = icons[type]

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      <div className={`${colors[type]} p-4 border-4 border-black retro-border min-w-80 max-w-md`}>
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 flex-shrink-0" />
          <p className="font-black uppercase text-sm flex-1">{message}</p>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="hover:scale-110 transition-transform"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: "success" | "error" | "info" | "warning" }>
  >([])

  const showToast = (message: string, type: "success" | "error" | "info" | "warning") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )

  return { showToast, ToastContainer }
}
