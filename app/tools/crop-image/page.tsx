'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ToolLayout';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

const MIN_W = 50;
const MIN_H = 50;

export default function CropImage() {
  const [src, setSrc] = useState<string | null>(null);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const contRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [disp, setDisp] = useState<{ x: number; y: number; w: number; h: number; scale: number } | null>(null);

  // --- load file ---
  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setNat({ w: img.width, h: img.height });
        setSrc(url);

        const cw = Math.floor(img.width / 2);
        const ch = Math.floor(img.height / 2);
        setCrop({
          x: Math.floor((img.width - cw) / 2),
          y: Math.floor((img.height - ch) / 2),
          w: cw,
          h: ch
        });
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  // --- update displayed coordinates ---
  const updateDisp = () => {
    if (!imgRef.current || !contRef.current || !nat) return;

    const cont = contRef.current.getBoundingClientRect();
    const im = imgRef.current.getBoundingClientRect();

    const scaleX = im.width / nat.w;
    const scaleY = im.height / nat.h;
    const scale = Math.min(scaleX, scaleY); // correct uniform scaling

    setDisp({
      x: im.left - cont.left,
      y: im.top - cont.top,
      w: im.width,
      h: im.height,
      scale
    });
  };

  useEffect(() => {
    updateDisp();
    window.addEventListener("resize", updateDisp);
    return () => window.removeEventListener("resize", updateDisp);
  }, [src]);

  // --- pointer logic ---
  const action = useRef<any>(null);

  const pointerDown = (e: any, type: "move" | "resize", dir?: string) => {
    if (!crop || !disp || !nat) return;

    e.preventDefault();
    action.current = {
      type,
      dir,
      startX: e.clientX,
      startY: e.clientY,
      start: { ...crop }
    };

    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
  };

  // --- FIXED pointerMove (no recoil) ---
  const pointerMove = (e: PointerEvent) => {
    if (!action.current || !crop || !disp || !nat) return;

    const dx = (e.clientX - action.current.startX) / disp.scale;
    const dy = (e.clientY - action.current.startY) / disp.scale;

    let { x, y, w, h } = action.current.start;
    const dir = action.current.dir;

    if (action.current.type === "move") {
      x = Math.max(0, Math.min(nat.w - w, x + dx));
      y = Math.max(0, Math.min(nat.h - h, y + dy));
    }

    if (action.current.type === "resize") {
      // East
      if (dir.includes("e")) {
        const newW = w + dx;
        w = Math.min(nat.w - x, Math.max(MIN_W, newW));
      }

      // South
      if (dir.includes("s")) {
        const newH = h + dy;
        h = Math.min(nat.h - y, Math.max(MIN_H, newH));
      }

      // West
      if (dir.includes("w")) {
        let newX = x + dx;
        let newW = w - dx;

        if (newW < MIN_W) {
          newX = x + (w - MIN_W);
          newW = MIN_W;
        }
        if (newX < 0) {
          newW += newX;
          newX = 0;
        }

        x = newX;
        w = newW;
      }

      // North
      if (dir.includes("n")) {
        let newY = y + dy;
        let newH = h - dy;

        if (newH < MIN_H) {
          newY = y + (h - MIN_H);
          newH = MIN_H;
        }
        if (newY < 0) {
          newH += newY;
          newY = 0;
        }

        y = newY;
        h = newH;
      }
    }

    // --- Key fix: update start reference so next movement is smooth ---
    action.current.start = { x, y, w, h };
    action.current.startX = e.clientX;
    action.current.startY = e.clientY;

    setCrop({ x, y, w, h });
  };

  const pointerUp = () => {
    action.current = null;
    window.removeEventListener("pointermove", pointerMove);
    window.removeEventListener("pointerup", pointerUp);
  };

  // --- crop and download ---
  const download = async () => {
    if (!src || !crop) return toast.error("No image");

    const img = await new Promise<HTMLImageElement>((res) => {
      const im = new Image();
      im.onload = () => res(im);
      im.src = src;
    });

    const can = document.createElement("canvas");
    can.width = crop.w;
    can.height = crop.h;
    const ctx = can.getContext("2d")!;
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);

    can.toBlob((b) => {
      if (!b) return toast.error("Failed");
      const url = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cropped.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  if (!src) {
    return (
      <ToolLayout title="Crop Image" description="Cut and crop your images">
        <FileUpload onFileSelect={onFile} />
      </ToolLayout>
    );
  }

  return (
    <ToolLayout title="Crop Image" description="Cut and crop your images">
      <div className="space-y-6">
        <div ref={contRef} className="relative bg-muted rounded-lg h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
          <img
            ref={imgRef}
            src={src}
            onLoad={updateDisp}
            style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', margin: 'auto' }}
          />

          {disp && crop && (
            <div
              className="absolute"
              style={{
                left: disp.x + crop.x * disp.scale,
                top: disp.y + crop.y * disp.scale,
                width: crop.w * disp.scale,
                height: crop.h * disp.scale,
                border: "2px solid #3b82f6",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)",
                touchAction: "none",
                position: "absolute"
              }}
              onPointerDown={(e) => pointerDown(e, "move")}
            >
              {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map(pos => {
                const style: any = {
                  width: 14,
                  height: 14,
                  background: "white",
                  border: "2px solid #3b82f6",
                  position: "absolute",
                  transform: "translate(-50%, -50%)"
                };
                const cx = { nw: 0, n: 50, ne: 100, e: 100, se: 100, s: 50, sw: 0, w: 0 }[pos];
                const cy = { nw: 0, n: 0, ne: 0, e: 50, se: 100, s: 100, sw: 100, w: 50 }[pos];
                return (
                  <div
                    key={pos}
                    style={{
                      ...style,
                      left: `${cx}%`,
                      top: `${cy}%`,
                      cursor: `${pos}-resize`
                    }}
                    onPointerDown={(e) => { e.stopPropagation(); pointerDown(e, "resize", pos); }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <Button onClick={download} className="w-full">
          <Download className="w-4 h-4 mr-2" /> Download Cropped Image
        </Button>
      </div>
    </ToolLayout>
  );
}
