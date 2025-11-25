'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";

const CollageMaker = () => {
  const [images, setImages] = useState<string[]>([]);
  const [collageImage, setCollageImage] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImages(prev => [...prev, reader.result as string]);
      toast.success("Image added");
    };
    reader.readAsDataURL(file);
  };

  const createCollage = async () => {
    if (images.length < 2) {
      toast.error("Please add at least 2 images");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const cols = Math.ceil(Math.sqrt(images.length));
    const rows = Math.ceil(images.length / cols);
    const cellWidth = 400;
    const cellHeight = 400;

    canvas.width = cellWidth * cols;
    canvas.height = cellHeight * rows;

    const imageElements = await Promise.all(
      images.map(src => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        });
      })
    );

    imageElements.forEach((img, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      ctx.drawImage(img, col * cellWidth, row * cellHeight, cellWidth, cellHeight);
    });

    setCollageImage(canvas.toDataURL());
    toast.success("Collage created!");
  };

  const handleDownload = () => {
    if (!collageImage) return;
    const a = document.createElement("a");
    a.href = collageImage;
    a.download = "collage.png";
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="Collage Maker"
      description="Create collages from multiple images"
    >
      <div className="space-y-6">
        {!collageImage && <FileUpload onFileSelect={handleFileSelect} multiple />}

        {images.length > 0 && !collageImage && (
          <>
            <p className="text-sm text-muted-foreground">
              {images.length} image(s) added
            </p>
            <Button onClick={createCollage} className="w-full">
              Create Collage
            </Button>
          </>
        )}

        {collageImage && (
          <>
            <img src={collageImage} alt="Collage" className="rounded-lg max-w-full" />
            <Button onClick={handleDownload} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Collage
            </Button>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default CollageMaker;
