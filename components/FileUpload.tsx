import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export const FileUpload = ({
  onFileSelect,
  accept = "image/*",
  multiple = false,
  className
}: FileUploadProps) => {

  const onDrop = useCallback((files: File[]) => {
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple,
    maxFiles: multiple ? undefined : 1
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
        "bg-upload-bg border-upload-border",
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "hover:border-primary hover:bg-primary/5",
        className
      )}
    >
      <input {...getInputProps({ accept })} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-lg font-medium">Drop your file here</p>
      <p className="text-sm text-muted-foreground">
        or click to browse from your computer
      </p>
    </div>
  );
};
