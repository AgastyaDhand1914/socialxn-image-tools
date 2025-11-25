'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "sonner";

const ImageCompressor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [quality, setQuality] = useState<number[]>([80]);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setFileName(file.name);
      setOriginalSize(file.size);
      setCompressedImage(null);
      toast.success("Image loaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const handleCompress = () => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const compressed = canvas.toDataURL("image/jpeg", quality[0] / 100);
        setCompressedImage(compressed);
        
        // Estimate compressed size
        const base64Length = compressed.length - "data:image/jpeg;base64,".length;
        const estimatedSize = (base64Length * 3) / 4;
        setCompressedSize(estimatedSize);
        
        toast.success("Image compressed successfully!");
      }
    };
    img.src = originalImage;
  };

  const handleDownload = () => {
    if (!compressedImage) return;
    
    const link = document.createElement("a");
    link.href = compressedImage;
    link.download = `compressed-${fileName || "image.jpg"}`;
    link.click();
    toast.success("Image downloaded!");
  };

  return (
    <ToolLayout
      title="Image Compressor"
      description="Reduce file size while maintaining quality"
    >
      <div className="space-y-6">
        {!originalImage ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Original Image</h3>
                <ImagePreview 
                  src={originalImage} 
                  onRemove={() => {
                    setOriginalImage(null);
                    setCompressedImage(null);
                  }}
                />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Size: {formatFileSize(originalSize)}
                </p>
              </div>
              
              {compressedImage && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Compressed Image</h3>
                  <ImagePreview src={compressedImage} />
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Size: {formatFileSize(compressedSize)} ({Math.round((1 - compressedSize / originalSize) * 100)}% smaller)
                  </p>
                </div>
              )}
            </div>

            <Card className="p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Compression Settings</h3>
              <div className="space-y-4 mb-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Quality: {quality[0]}%</Label>
                  </div>
                  <Slider
                    value={quality}
                    onValueChange={setQuality}
                    min={1}
                    max={100}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Lower quality = smaller file size
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCompress} className="flex-1">
                  Compress Image
                </Button>
                {compressedImage && (
                  <Button onClick={handleDownload} variant="secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default ImageCompressor;
