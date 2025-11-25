import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onRemove?: () => void;
  className?: string;
}

export const ImagePreview = ({ 
  src, 
  alt = "Preview", 
  onRemove,
  className 
}: ImagePreviewProps) => {
  return (
    <Card className="relative p-4 bg-card">
      {onRemove && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={onRemove}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      <div className={className}>
        <img 
          src={src} 
          alt={alt}
          className="max-w-full max-h-[500px] mx-auto rounded-lg"
        />
      </div>
    </Card>
  );
};
