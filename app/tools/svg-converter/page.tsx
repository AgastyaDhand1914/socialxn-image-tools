'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download } from "lucide-react";

const SvgConverter = () => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [convertedImage, setConvertedImage] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSvgContent(reader.result as string);
      setConvertedImage(null);
    };
    reader.readAsText(file);
    toast.success("SVG loaded");
  };

  const convertSvg = () => {
    if (!svgContent) return;

    const img = new Image();
    const svg = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svg);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width || 800;
      canvas.height = img.height || 600;
      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${format}`;
      setConvertedImage(canvas.toDataURL(mimeType, 0.9));
      toast.success(`SVG converted to ${format.toUpperCase()}!`);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const a = document.createElement("a");
    a.href = convertedImage;
    a.download = `converted.${format}`;
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="SVG Converter"
      description="Convert SVG to PNG or JPG"
    >
      <div className="space-y-6">
        {!svgContent ? (
          <FileUpload onFileSelect={handleFileSelect} accept=".svg,image/svg+xml" />
        ) : (
          <>
            {convertedImage && <ImagePreview src={convertedImage} alt="Converted" />}
            
            <div>
              <Label>Output Format</Label>
              <Select value={format} onValueChange={(val: any) => setFormat(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={convertSvg} className="w-full">
              Convert to {format.toUpperCase()}
            </Button>

            {convertedImage && (
              <Button onClick={handleDownload} variant="secondary" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default SvgConverter;
