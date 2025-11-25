import { 
  Maximize, 
  Minimize, 
  Crop, 
  Repeat,
  FlipHorizontal,
  RotateCw,
  ImageUp,
  Pipette,
  Smile,
  FileType,
  FileDown,
  Image,
  Grid,
  FileCode
} from "lucide-react";

export type Tool = {
  id: string;
  name: string;
  description: string;
  category: "Edit" | "Convert";
  icon: any;
  path: string;
};

export const tools: Tool[] = [
  //Edit Tools

  {
    id: "resize",
    name: "Image Resizer",
    description: "Resize images by width and height",
    category: "Edit",
    icon: Maximize,
    path: "/tools/img-resizer"
  },
  {
    id: "bulk-resize",
    name: "Bulk Image Resizer",
    description: "Resize multiple images at once",
    category: "Edit",
    icon: Repeat,
    path: "/tools/bulk-img-resizer"
  },
  {
    id: "compress",
    name: "Image Compressor",
    description: "Reduce file size with quality control",
    category: "Edit",
    icon: Minimize,
    path: "/tools/img-compressor"
  },
  {
    id: "collage",
    name: "Collage Maker",
    description: "Create collages from multiple images",
    category: "Edit",
    icon: Grid,
    path: "/tools/collage-maker"
  },
  {
    id: "crop",
    name: "Crop Image",
    description: "Cut and crop your images",
    category: "Edit",
    icon: Crop,
    path: "/tools/crop-image"
  },
  {
    id: "flip",
    name: "Flip Image",
    description: "Flip images horizontally or vertically",
    category: "Edit",
    icon: FlipHorizontal,
    path: "/tools/flip-image"
  },
  {
    id: "rotate",
    name: "Rotate Image",
    description: "Rotate images 90° left or right",
    category: "Edit",
    icon: RotateCw,
    path: "/tools/rotate-img"
  },
  {
    id: "upscale",
    name: "Image Enlarger",
    description: "Upscale images 2× or 4×",
    category: "Edit",
    icon: ImageUp,
    path: "/tools/img-enlarger"
  },
  {
    id: "color-picker",
    name: "Color Picker",
    description: "Extract colors from images",
    category: "Edit",
    icon: Pipette,
    path: "/tools/color-picker"
  },
  {
    id: "meme",
    name: "Meme Generator",
    description: "Add text to create memes",
    category: "Edit",
    icon: Smile,
    path: "/tools/meme-generator"
  },


  //Convert Tools

  {
    id: "convert",
    name: "Image Converter",
    description: "Convert between JPG, PNG, WebP",
    category: "Convert",
    icon: FileType,
    path: "/tools/img-converter"
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert PDF first page to JPG",
    category: "Convert",
    icon: FileDown,
    path: "/tools/pdf-to-jpg"
  },
  {
    id: "webp-to-jpg",
    name: "WebP to JPG",
    description: "Convert WebP images to JPG",
    category: "Convert",
    icon: Image,
    path: "/tools/webp-to-jpg"
  },
  {
    id: "png-to-jpg",
    name: "PNG to JPG",
    description: "Convert PNG images to JPG",
    category: "Convert",
    icon: Image,
    path: "/tools/png-to-jpg"
  },
  {
    id: "jpg-to-png",
    name: "JPG to PNG",
    description: "Convert JPG images to PNG",
    category: "Convert",
    icon: Image,
    path: "/tools/jpg-to-png"
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    description: "Convert PDF first page to PNG",
    category: "Convert",
    icon: FileDown,
    path: "/tools/pdf-to-png"
  },
  {
    id: "heic-to-jpg",
    name: "HEIC to JPG",
    description: "Convert HEIC images to JPG",
    category: "Convert",
    icon: Image,
    path: "/tools/heic-to-jpg"
  },
  {
    id: "svg-converter",
    name: "SVG Converter",
    description: "Convert SVG to PNG or JPG",
    category: "Convert",
    icon: FileCode,
    path: "/tools/svg-converter"
  },
  {
    id: "png-to-svg",
    name: "PNG to SVG",
    description: "Convert PNG to SVG (trace)",
    category: "Convert",
    icon: FileCode,
    path: "/tools/png-to-svg"
  },
];
