import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/Components/ui/tooltip";
import { Toaster } from "sonner";

export default function AppProvider({ children }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <TooltipProvider>
                {children}
                <Toaster richColors position="top-right" />
            </TooltipProvider>
        </ThemeProvider>
    );
}
