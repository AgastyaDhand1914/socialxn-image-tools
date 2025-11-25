import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image } from "lucide-react";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const ToolLayout = ({ title, description, children }: ToolLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center items-start gap-3 sm:gap-4">
            
            {/* Back Button */}
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>

            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Image className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>

              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-6 py-6 sm:py-8 max-w-5xl">
        {children}
      </main>

    </div>
  );
};

