export function CyberLoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
        {/* Inner ring */}
        <div
          className="absolute inset-2 border-4 border-yellow-400 border-b-transparent rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "0.75s" }}
        ></div>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
