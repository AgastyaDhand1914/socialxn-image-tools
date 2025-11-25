'use client';

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download } from "lucide-react";

const MemeGenerator = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [memeImage, setMemeImage] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.success("Image loaded");
  };

  const generateMeme = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const fontSize = Math.floor(canvas.width / 15);
      ctx.font = `bold ${fontSize}px Impact`;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = fontSize / 15;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      if (topText) {
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, fontSize / 2);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, fontSize / 2);
      }

      if (bottomText) {
        ctx.textBaseline = "bottom";
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - fontSize / 2);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - fontSize / 2);
      }

      setMemeImage(canvas.toDataURL());
      toast.success("Meme generated!");
    };
    img.src = imageSrc;
  };

  const handleDownload = () => {
    if (!memeImage) return;
    const a = document.createElement("a");
    a.href = memeImage;
    a.download = "meme.png";
    a.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="Meme Generator"
      description="Add text to create memes"
    >
      <div className="space-y-6">
        {!imageSrc ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <>
            {memeImage ? (
              <img src={memeImage} alt="Meme" className="max-w-full rounded-lg" />
            ) : (
              <img src={imageSrc} alt="Original" className="max-w-full rounded-lg" />
            )}

            <div className="space-y-4">
              <div>
                <Label>Top Text</Label>
                <Input
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Enter top text"
                />
              </div>
              <div>
                <Label>Bottom Text</Label>
                <Input
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Enter bottom text"
                />
              </div>

              <Button onClick={generateMeme} className="w-full">
                Generate Meme
              </Button>

              {memeImage && (
                <Button onClick={handleDownload} variant="secondary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Meme
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default MemeGenerator;
