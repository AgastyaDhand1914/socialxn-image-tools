'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "sonner";

const ImageResizer = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(e.target?.result as string);
        setFileName(file.name);
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width.toString());
        setHeight(img.height.toString());
        setResizedImage(null);
        toast.success("Image loaded successfully!");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleResize = () => {
    if (!originalImage || !width || !height) {
      toast.error("Please provide both width and height");
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = parseInt(width);
      canvas.height = parseInt(height);
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setResizedImage(canvas.toDataURL("image/png"));
        toast.success("Image resized successfully!");
      }
    };
    img.src = originalImage;
  };

  const handleDownload = () => {
    if (!resizedImage) return;
    
    const link = document.createElement("a");
    link.href = resizedImage;
    link.download = `resized-${fileName || "image.png"}`;
    link.click();
    toast.success("Image downloaded!");
  };

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize your images to any dimension"
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
                    setResizedImage(null);
                    setWidth("");
                    setHeight("");
                  }}
                />
                {originalDimensions && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    {originalDimensions.width} × {originalDimensions.height} px
                  </p>
                )}
              </div>
              
              {resizedImage && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">Resized Image</h3>
                  <ImagePreview src={resizedImage} />
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    {width} × {height} px
                  </p>
                </div>
              )}
            </div>

            <Card className="p-6 bg-card">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Resize Settings</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="Width"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Height"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleResize} className="flex-1">
                  Resize Image
                </Button>
                {resizedImage && (
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

export default ImageResizer;
