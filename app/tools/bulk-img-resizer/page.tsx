'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import JSZip from "jszip";
import { Download } from "lucide-react";

const BulkImageResizer = () => {
  const [images, setImages] = useState<File[]>([]);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [processing, setProcessing] = useState(false);

  const handleFilesSelect = (file: File) => {
    setImages(prev => [...prev, file]);
    toast.success("Image added");
  };

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      img.onload = () => {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob!), file.type);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleBulkResize = async () => {
    if (images.length === 0) {
      toast.error("Please add images first");
      return;
    }

    setProcessing(true);
    const zip = new JSZip();

    for (let i = 0; i < images.length; i++) {
      const resizedBlob = await resizeImage(images[i]);
      zip.file(`resized_${i + 1}_${images[i].name}`, resizedBlob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resized_images.zip";
    a.click();
    
    setProcessing(false);
    toast.success("Images resized and downloaded!");
  };

  return (
    <ToolLayout
      title="Bulk Image Resizer"
      description="Resize multiple images at once"
    >
      <div className="space-y-6">
        <FileUpload onFileSelect={handleFilesSelect} multiple />

        {images.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {images.length} image(s) selected
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
            </div>

            <Button
              onClick={handleBulkResize}
              disabled={processing}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {processing ? "Processing..." : "Resize & Download ZIP"}
            </Button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default BulkImageResizer;
