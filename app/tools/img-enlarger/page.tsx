'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";

const ImageEnlarger = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
    toast.success("Image loaded");
  };

  const upscaleImage = (scale: number) => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      setProcessedImage(canvas.toDataURL());
      toast.success(`Image upscaled ${scale}x!`);
    };
    img.src = originalImage;
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const a = document.createElement("a");
    a.href = processedImage;
    a.download = "upscaled_image.png";
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="Image Enlarger"
      description="Upscale images 2× or 4×"
    >
      <div className="space-y-6">
        {!originalImage ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <>
            {processedImage ? (
              <ImagePreview src={processedImage} alt="Upscaled" />
            ) : (
              <ImagePreview src={originalImage} alt="Original" />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => upscaleImage(2)}>
                Upscale 2×
              </Button>
              <Button onClick={() => upscaleImage(4)}>
                Upscale 4×
              </Button>
            </div>

            {processedImage && (
              <Button onClick={handleDownload} className="w-full">
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

export default ImageEnlarger;
