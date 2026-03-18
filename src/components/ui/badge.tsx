import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-pill border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-muted text-muted-foreground",
        destructive: "border-transparent bg-status-red-bg text-status-red border-status-red/20",
        outline: "text-foreground border-border",
        green: "bg-status-green-bg text-status-green border-status-green/20",
        red: "bg-status-red-bg text-status-red border-status-red/20",
        amber: "bg-status-amber-bg text-status-amber border-status-amber/20",
        blue: "bg-status-blue-bg text-status-blue border-status-blue/20",
        gold: "bg-accent-pale text-accent border-accent-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
