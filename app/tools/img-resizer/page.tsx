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
  const [lockAspect, setLockAspect] = useState<boolean>(false);

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

  const handleWidthChange = (val: string) => {
    // allow free typing (keep as string). Only compute counterpart if parsed number is valid.
    setWidth(val);
    const parsed = parseInt(val, 10);
    if (lockAspect && originalDimensions && !isNaN(parsed) && parsed > 0 && originalDimensions.width > 0) {
      const newH = Math.round((parsed * originalDimensions.height) / originalDimensions.width);
      setHeight(newH.toString());
    }
  };

  const handleHeightChange = (val: string) => {
    // allow free typing (keep as string). Only compute counterpart if parsed number is valid.
    setHeight(val);
    const parsed = parseInt(val, 10);
    if (lockAspect && originalDimensions && !isNaN(parsed) && parsed > 0 && originalDimensions.height > 0) {
      const newW = Math.round((parsed * originalDimensions.width) / originalDimensions.height);
      setWidth(newW.toString());
    }
  };

  const handleResize = () => {
    if (!originalImage) {
      toast.error("Please provide an image");
      return;
    }

    const parsedW = parseInt(width, 10);
    const parsedH = parseInt(height, 10);
    if (isNaN(parsedW) || isNaN(parsedH) || parsedW <= 0 || parsedH <= 0) {
      toast.error("Please provide valid numeric width and height");
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 10000;
      const w = Math.max(1, Math.min(maxDim, parsedW));
      const h = Math.max(1, Math.min(maxDim, parsedH));
      if (w !== parsedW || h !== parsedH) {
        toast('Dimensions adjusted to safe limits');
      }
      // reflect clamped values back into inputs so user sees final values
      setWidth(w.toString());
      setHeight(h.toString());
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        try {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setResizedImage(canvas.toDataURL("image/png"));
          toast.success("Image resized successfully!");
        } catch (err) {
          toast.error('Failed to draw image on canvas (maybe too large)');
        }
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
                    onChange={(e) => handleWidthChange(e.target.value)}
                    placeholder="Width"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    placeholder="Height"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  id="lock-aspect"
                  type="checkbox"
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: 'hsl(var(--primary))' }}
                />
                <Label htmlFor="lock-aspect">Lock aspect ratio</Label>
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
