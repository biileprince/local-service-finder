import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#f97316] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[#f97316] text-white shadow-lg hover:bg-[#ea580c] hover:shadow-xl active:bg-[#c2410c] border border-[#ea580c]",
        secondary:
          "bg-gray-900 text-white shadow-lg hover:bg-gray-800 active:bg-gray-950 border border-gray-800",
        outline:
          "border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-[#f97316] hover:text-[#f97316] active:bg-gray-100",
        ghost:
          "text-gray-900 hover:bg-gray-100 hover:text-[#f97316] active:bg-gray-200",
        success:
          "bg-green-600 text-white shadow-lg hover:bg-green-700 active:bg-green-800 border border-green-700",
        danger:
          "bg-red-600 text-white shadow-lg hover:bg-red-700 active:bg-red-800 border border-red-700",
        link: "text-[#f97316] underline-offset-4 hover:underline hover:text-[#ea580c]",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-sm",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-3.5 text-base",
        xl: "h-16 px-10 py-4 text-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
