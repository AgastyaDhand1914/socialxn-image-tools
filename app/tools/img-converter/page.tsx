'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download } from "lucide-react";

const ImageConverter = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png");
  const [convertedImage, setConvertedImage] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result as string);
      setConvertedImage(null);
    };
    reader.readAsDataURL(file);
    toast.success("Image loaded");
  };

  const convertImage = () => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${format === "jpeg" ? "jpeg" : format}`;
      setConvertedImage(canvas.toDataURL(mimeType, 0.9));
      toast.success(`Converted to ${format.toUpperCase()}!`);
    };
    img.src = originalImage;
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const a = document.createElement("a");
    a.href = convertedImage;
    a.download = `converted_image.${format === "jpeg" ? "jpg" : format}`;
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="Image Converter"
      description="Convert between JPG, PNG, WebP"
    >
      <div className="space-y-6">
        {!originalImage ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <>
            {convertedImage ? (
              <ImagePreview src={convertedImage} alt="Converted" />
            ) : (
              <ImagePreview src={originalImage} alt="Original" />
            )}
            
            <div>
              <Label>Output Format</Label>
              <Select value={format} onValueChange={(val: any) => setFormat(val)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPG</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={convertImage} className="w-full">
              Convert to {format.toUpperCase()}
            </Button>

            {convertedImage && (
              <Button onClick={handleDownload} variant="secondary" className="w-full">
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

export default ImageConverter;
