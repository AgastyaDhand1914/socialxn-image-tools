'use client';

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";

const ColorPicker = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [color, setColor] = useState<{ hex: string; rgb: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      // set the data URL first so the canvas is mounted by the render
      const dataUrl = reader.result as string;
      setImageSrc(dataUrl);
    };
    reader.readAsDataURL(file);
    toast.success("Click on the image to pick a color");
  };

  // When imageSrc changes and the canvas is available, draw the image onto it.
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return; // canvas not mounted yet

      // set canvas size to image size (or limit if needed)
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageSrc;
    // cleanup not necessary for Image element
  }, [imageSrc]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const ctx = canvas.getContext("2d")!;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
    const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

    setColor({ hex, rgb });
    toast.success("Color picked!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <ToolLayout
      title="Color Picker"
      description="Extract colors from images"
    >
      <div className="space-y-6">
        {!imageSrc ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-w-full cursor-crosshair rounded-lg border"
              style={{ maxHeight: "500px" }}
            />

            {color && (
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-lg border"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">{color.hex}</code>
                      <Button size="icon" variant="outline" onClick={() => copyToClipboard(color.hex)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">{color.rgb}</code>
                      <Button size="icon" variant="outline" onClick={() => copyToClipboard(color.rgb)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default ColorPicker;
