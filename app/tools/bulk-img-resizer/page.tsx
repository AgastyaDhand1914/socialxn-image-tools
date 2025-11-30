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
  // keep as strings to allow free typing (no immediate clamping)
  const [width, setWidth] = useState<string>('800');
  const [height, setHeight] = useState<string>('600');
  const [processing, setProcessing] = useState(false);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(false);
  const [primaryDimension, setPrimaryDimension] = useState<'width' | 'height'>('width');

  const handleFilesSelect = (file: File) => {
    setImages(prev => [...prev, file]);
    toast.success("Image added");
  };

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        try {
          // parse width/height from strings; fallback to defaults
          const parsedW = parseInt(width as unknown as string, 10);
          const parsedH = parseInt(height as unknown as string, 10);
          const defaultW = 800;
          const defaultH = 600;
          const safeW = (!isNaN(parsedW) && parsedW > 0) ? parsedW : defaultW;
          const safeH = (!isNaN(parsedH) && parsedH > 0) ? parsedH : defaultH;

          let targetW = Math.max(1, Math.min(10000, safeW));
          let targetH = Math.max(1, Math.min(10000, safeH));

          if (maintainAspect && img.width > 0 && img.height > 0) {
            if (primaryDimension === 'width') {
              targetW = Math.max(1, Math.min(10000, safeW));
              targetH = Math.max(1, Math.round((img.height * targetW) / img.width));
            } else {
              targetH = Math.max(1, Math.min(10000, safeH));
              targetW = Math.max(1, Math.round((img.width * targetH) / img.height));
            }
          }

          canvas.width = targetW;
          canvas.height = targetH;
          ctx.drawImage(img, 0, 0, targetW, targetH);

          canvas.toBlob((blob) => {
            // ensure blob exists; fallback to dataURL conversion
            if (blob) {
              resolve(blob);
            } else {
              try {
                const dataUrl = canvas.toDataURL(file.type || 'image/png');
                // convert dataURL to blob
                const arr = dataUrl.split(',');
                const mime = arr[0].match(/:(.*?);/)?.[1] || (file.type || 'image/png');
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                  u8arr[n] = bstr.charCodeAt(n);
                }
                resolve(new Blob([u8arr], { type: mime }));
              } catch (err) {
                reject(err);
              }
            }
          }, file.type || 'image/png');
        } finally {
          // release object URL
          URL.revokeObjectURL(objectUrl);
        }
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(objectUrl);
        reject(e);
      };
      img.src = objectUrl;
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
      try {
        const resizedBlob = await resizeImage(images[i]);
        zip.file(`resized_${i + 1}_${images[i].name}`, resizedBlob);
      } catch (err) {
        console.error('Failed to resize', images[i].name, err);
        toast.error(`Failed to resize ${images[i].name}`);
      }
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
                  onChange={(e) => {
                    setWidth(e.target.value);
                    if (maintainAspect) setPrimaryDimension('width');
                  }}
                />
              </div>
              <div>
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                    if (maintainAspect) setPrimaryDimension('height');
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="maintain-aspect"
                type="checkbox"
                checked={maintainAspect}
                onChange={(e) => setMaintainAspect(e.target.checked)}
                className="w-4 h-4"
                style={{ accentColor: 'hsl(var(--primary))' }}
              />
              <Label htmlFor="maintain-aspect">Maintain aspect ratio (per image) - edit either width or height</Label>
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
