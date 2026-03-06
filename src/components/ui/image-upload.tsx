"use client";

import { useState, useEffect } from "react";
import { ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setPreview(data.url);
      onChange(data.url);
    } catch (err) {
      console.error("Image upload failed:", err);
      setPreview(undefined);
      onChange(undefined);
    } finally {
      setUploading(false);
    }
  }

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPreview(undefined);
    onChange(undefined);
  }

  return (
    <label
      className={cn(
        "flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors relative",
        "min-h-[160px] p-4",
        className
      )}
    >
      {preview ? (
        <div className="w-full h-full relative">
          <img src={preview} alt="Dish" className="w-full h-full object-cover rounded-lg" />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg">
              <Loader2 size={24} className="animate-spin text-indigo-500" />
            </div>
          )}
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white rounded-full shadow"
            >
              <X size={14} className="text-gray-600" />
            </button>
          )}
        </div>
      ) : (
        <>
          <ImageIcon size={36} className="text-gray-300" />
          <span className="text-sm text-indigo-600 font-medium">Upload an image here</span>
          <span className="text-xs text-gray-400">or click to browse for a file</span>
        </>
      )}
      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </label>
  );
}
