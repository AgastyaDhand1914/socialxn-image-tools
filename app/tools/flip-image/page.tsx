'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FlipHorizontal, FlipVertical, Download } from "lucide-react";

const FlipImage = () => {
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

  const flipImage = (direction: "horizontal" | "vertical") => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.save();
      if (direction === "horizontal") {
        ctx.scale(-1, 1);
        ctx.drawImage(img, -img.width, 0);
      } else {
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, -img.height);
      }
      ctx.restore();

      setProcessedImage(canvas.toDataURL());
      toast.success("Image flipped!");
    };
    img.src = originalImage;
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const a = document.createElement("a");
    a.href = processedImage;
    a.download = "flipped_image.png";
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="Flip Image"
      description="Flip images horizontally or vertically"
    >
      <div className="space-y-6">
        {!originalImage ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <>
            {processedImage ? (
              <ImagePreview src={processedImage} alt="Flipped" />
            ) : (
              <ImagePreview src={originalImage} alt="Original" />
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => flipImage("horizontal")}>
                <FlipHorizontal className="w-4 h-4 mr-2" />
                Flip Horizontal
              </Button>
              <Button onClick={() => flipImage("vertical")}>
                <FlipVertical className="w-4 h-4 mr-2" />
                Flip Vertical
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

export default FlipImage;
