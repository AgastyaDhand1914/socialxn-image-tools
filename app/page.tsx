"use client";

import { tools } from "@/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { Input } from "@/components/ui/input";
import { Search, Image } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const editTools = filteredTools.filter(tool => tool.category === "Edit");
  const convertTools = filteredTools.filter(tool => tool.category === "Convert");

  return (
    <div className="min-h-screen bg-background">
      
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Image className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                SocialXN Image Tools
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Fast, browser-based image editing
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-11 sm:h-12 text-base sm:text-lg"
            />
          </div>
        </div>

        {/* Edit Tools */}
        {editTools.length > 0 && (
          <section className="mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Image Editing Tools
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {editTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Convert Tools */}
        {convertTools.length > 0 && (
          <section className="mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              Image Conversion Tools
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {convertTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Not Found */}
        {filteredTools.length === 0 && (
          <div className="text-center py-10 sm:py-12">
            <p className="text-muted-foreground text-base sm:text-lg">
              No tools found matching "{searchQuery}"
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12 sm:mt-16">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center text-xs sm:text-sm text-muted-foreground">
          <p>All processing happens in the browser.</p>
        </div>
      </footer>

    </div>
  );
}
