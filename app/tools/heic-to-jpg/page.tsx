'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import heic2any from "heic2any";
import { Download } from "lucide-react";

const HeicToJpg = () => {
  const [convertedImage, setConvertedImage] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      const url = URL.createObjectURL(convertedBlob as Blob);
      setConvertedImage(url);
      toast.success("HEIC converted to JPG!");
    } catch (error) {
      toast.error("Failed to convert HEIC");
    }
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
      title="HEIC to JPG"
      description="Convert HEIC images to JPG"
    >
      <div className="space-y-6">
        {!convertedImage ? (
          <FileUpload onFileSelect={handleFileSelect} accept=".heic,.heif" />
        ) : (
          <>
            <ImagePreview src={convertedImage} alt="Converted" />
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

export default HeicToJpg;
