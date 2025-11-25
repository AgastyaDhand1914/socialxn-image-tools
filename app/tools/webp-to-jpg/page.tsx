'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";

const WebpToJpg = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result as string);
      convertToJpg(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.success("Image loaded");
  };

  const convertToJpg = (src: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      setConvertedImage(canvas.toDataURL("image/jpeg", 0.9));
      toast.success("Converted to JPG!");
    };
    img.src = src;
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const a = document.createElement("a");
    a.href = convertedImage;
    a.download = "converted.jpg";
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="WebP to JPG"
      description="Convert WebP images to JPG"
    >
      <div className="space-y-6">
        {!originalImage ? (
          <FileUpload onFileSelect={handleFileSelect} accept=".webp,image/webp" />
        ) : (
          <>
            <ImagePreview src={convertedImage || originalImage} alt="Converted" />
            <Button onClick={handleDownload} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download JPG
            </Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default WebpToJpg;
