'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RotateCcw, RotateCw, Download } from "lucide-react";

const RotateImage = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result as string);
      setProcessedImage(null);
      setRotation(0);
    };
    reader.readAsDataURL(file);
    toast.success("Image loaded");
  };

  const rotateImage = (degrees: number) => {
    if (!originalImage) return;

    const newRotation = rotation + degrees;
    setRotation(newRotation);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      const radians = (newRotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));

      canvas.width = img.width * cos + img.height * sin;
      canvas.height = img.width * sin + img.height * cos;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      setProcessedImage(canvas.toDataURL());
      toast.success("Image rotated!");
    };
    img.src = originalImage;
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const a = document.createElement("a");
    a.href = processedImage;
    a.download = "rotated_image.png";
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout title="Rotate Image" description="Rotate images 90° left or right">
      <div className="space-y-6">
        {!originalImage ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <>
            {processedImage ? (
              <ImagePreview src={processedImage} alt="Rotated" />
            ) : (
              <ImagePreview src={originalImage} alt="Original" />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => rotateImage(-90)}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Rotate Left 90°
              </Button>
              <Button onClick={() => rotateImage(90)}>
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate Right 90°
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

export default RotateImage;
