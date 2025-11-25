"use client";

import { useEffect, useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const PdfToJpg = () => {
  const [pdfjs, setPdfjs] = useState<any>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);

  // Wait for CDN script to load
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js";

        setPdfjs(window.pdfjsLib);
        clearInterval(interval);
      }
    }, 200);
  }, []);

  const handleFileSelect = async (file: File) => {
    if (!pdfjs) {
      toast.error("PDF engine not ready yet.");
      return;
    }

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: bytes }).promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: ctx,
        viewport
      }).promise;

      const jpg = canvas.toDataURL("image/jpeg", 0.9);

      setConvertedImage(jpg);
      toast.success("Converted!");
    } catch (e) {
      console.error(e);
      toast.error("Conversion failed");
    }
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const a = document.createElement("a");
    a.href = convertedImage;
    a.download = "converted.jpg";
    a.click();
  };

  return (
    <ToolLayout title="PDF to JPG" description="Convert first page of PDF to JPG">
      <div className="space-y-6">
        {!convertedImage ? (
          <FileUpload accept="application/pdf" onFileSelect={handleFileSelect} />
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

export default PdfToJpg;
