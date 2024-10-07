import { FC } from "react";
import { cn } from "@/lib/utils"; // utility from shadcn for merging classNames

interface SpinnerProps {
  size?: "sm" | "md" | "lg"; // Optional sizes: small, medium, large
}

const Spinner: FC<SpinnerProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <div
      className={cn(
        "inline-block border-4 border-black/50 border-t-transparent rounded-full animate-spin",
        sizeClasses[size]
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
