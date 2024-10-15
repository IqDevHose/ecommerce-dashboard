import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 px-2 py-1",
        blue: "bg-blue-100 text-blue-800 hover:bg-blue-800/80 border-none px-2 py-1",
        success: "bg-green-100 text-green-800 hover:bg-green-800/80 border-none px-2 py-1",
        warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-800/80 border-none px-2 py-1",
        done: "bg-blue-100 text-blue-800 hover:bg-blue-800/80 border-none px-2 py-1",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1",
        destructive:
          "bg-red-100 text-red-800 hover:bg-red-800/80 border-none px-2 py-1",
        outline: "text-foreground px-2 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
