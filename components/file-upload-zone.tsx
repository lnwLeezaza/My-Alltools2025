"use client"

import type React from "react"

import { useCallback } from "react"
import { Upload, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  acceptedTypes?: string[]
  maxSize?: number // in MB
  selectedFile?: File | null
  className?: string
}

export function FileUploadZone({
  onFileSelect,
  acceptedTypes = [],
  maxSize = 10,
  selectedFile,
  className,
}: FileUploadZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) {
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed rounded-lg p-4 sm:p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptedTypes.join(",")}
          onChange={handleFileInput}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
          <p className="text-xs sm:text-sm font-medium mb-1">Drop your file here or click to browse</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {acceptedTypes.length > 0 && `Accepted: ${acceptedTypes.join(", ")} • `}
            Max size: {maxSize}MB
          </p>
        </label>
      </div>

      {selectedFile && (
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
          <File className="h-8 w-8 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
