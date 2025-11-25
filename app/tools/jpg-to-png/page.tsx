'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";

const JpgToPng = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result as string);
      convertToPng(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.success("Image loaded");
  };

  const convertToPng = (src: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      setConvertedImage(canvas.toDataURL("image/png"));
      toast.success("Converted to PNG!");
    };
    img.src = src;
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const a = document.createElement("a");
    a.href = convertedImage;
    a.download = "converted.png";
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="JPG to PNG"
      description="Convert JPG images to PNG"
    >
      <div className="space-y-6">
        {!originalImage ? (
          <FileUpload onFileSelect={handleFileSelect} accept=".jpg,.jpeg,image/jpeg" />
        ) : (
          <>
            <ImagePreview src={convertedImage || originalImage} alt="Converted" />
            <Button onClick={handleDownload} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download PNG
            </Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default JpgToPng;
