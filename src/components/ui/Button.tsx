import * as React from "react"
import { cn } from "@/utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'luxury' | 'golden'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
          {
            "bg-gradient-to-r from-primary to-gold text-primary-foreground shadow-luxury hover:shadow-golden hover:scale-105 active:scale-95": variant === "default",
            "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-red-500/25 hover:scale-105": variant === "destructive",
            "border border-gold/50 bg-card/50 backdrop-blur-sm text-gold hover:bg-gold hover:text-navy hover:shadow-golden": variant === "outline",
            "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:scale-105": variant === "secondary",
            "hover:bg-navy-light hover:text-gold transition-colors": variant === "ghost",
            "text-gold hover:text-gold-light underline-offset-4 hover:underline": variant === "link",
            "bg-luxury-gradient border border-gold/30 text-gold shadow-luxury hover:shadow-golden hover:scale-105 hover:border-gold/50": variant === "luxury",
            "bg-gold text-navy font-semibold shadow-golden hover:bg-gold-light hover:scale-105 active:scale-95": variant === "golden",
          },
          {
            "h-10 px-6 py-2 text-sm": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-12 rounded-xl px-8 text-base": size === "lg",
            "h-10 w-10 rounded-lg": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        {/* Content */}
        <span className="relative z-10">
          {props.children}
        </span>
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }