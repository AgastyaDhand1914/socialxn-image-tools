'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";

const PngToSvg = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImageSrc(src);
      convertToSvg(src);
    };
    reader.readAsDataURL(file);
    toast.success("Image loaded");
  };

  const convertToSvg = (src: string) => {
    const img = new Image();
    img.onload = () => {
      // Simple bitmap to SVG embedding (not true vectorization)
      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}">
  <image width="${img.width}" height="${img.height}" xlink:href="${src}"/>
</svg>`;
      
      setSvgContent(svg);
      toast.success("Converted to SVG (embedded bitmap)");
    };
    img.src = src;
  };

  const handleDownload = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.svg";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="PNG to SVG"
      description="Convert PNG to SVG (trace)"
    >
      <div className="space-y-6">
        {!imageSrc ? (
          <FileUpload onFileSelect={handleFileSelect} accept=".png,image/png" />
        ) : (
          <>
            <img src={imageSrc} alt="Original" className="max-w-full rounded-lg" />
            {svgContent && (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Note: This creates an SVG with an embedded bitmap. For true vectorization,
                    use specialized software.
                  </p>
                </div>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download SVG
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default PngToSvg;
