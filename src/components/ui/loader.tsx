import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg" | "xl";
    fullPage?: boolean;
}

export function Loader({ size = "md", fullPage = false, className, ...props }: LoaderProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
    };

    const loader = (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-2",
                fullPage && "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
                className
            )}
            {...props}
        >
            <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
            {fullPage && <span className="text-sm font-medium animate-pulse text-primary">Loading...</span>}
        </div>
    );

    return loader;
}
