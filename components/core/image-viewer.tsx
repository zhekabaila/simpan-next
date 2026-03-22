'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ZoomIn, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageViewerProps {
  src: string
  alt: string
  fileName: string
  className?: string
  width?: number
  height?: number
  children?: React.ReactNode
  onImageLoad?: () => void
  hideOverlay?: boolean
}

const ImageViewer = ({
  src,
  alt,
  fileName,
  className,
  width = 1000,
  height = 1000,
  children,
  onImageLoad,
  hideOverlay = false
}: ImageViewerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(false)

    const img = new window.Image()
    img.src = src
    img.onload = () => {
      setIsLoaded(true)
    }
    img.onerror = () => {
      setIsLoaded(true)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  // Separate effect for callback to avoid infinite loops
  useEffect(() => {
    if (isLoaded) {
      onImageLoad?.()
    }
  }, [isLoaded, onImageLoad])

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div className={cn('cursor-pointer group/image relative', className)} onClick={() => setIsOpen(true)}>
        {children ? (
          children
        ) : (
          <>
            {!isLoaded && <div className="w-full aspect-[9/16] bg-muted animate-pulse rounded" />}
            <img
              src={src}
              alt={alt}
              className={cn(
                'w-full h-auto object-contain transition-transform duration-200 group-hover/image:scale-[1.02]',
                !isLoaded && 'hidden'
              )}
            />
          </>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-200 rounded flex items-center justify-center">
          <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          hideCloseButton={hideOverlay}
          className="max-w-[95vw] z-[9999999] max-h-[95vh] w-auto h-auto p-0 border-none bg-white shadow-none overflow-auto">
          <DialogTitle className="sr-only">{alt}</DialogTitle>

          {!hideOverlay && (
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:text-white hover:bg-black/40 bg-black/70 rounded-lg backdrop-blur-sm"
                onClick={handleClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div
            className="flex items-center justify-center w-full h-full overflow-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleClose()
              }
            }}>
            <div className="relative transition-transform duration-200 ease-out">
              <Image
                src={src}
                alt={alt}
                width={1200}
                height={800}
                className="min-w-[600px] max-h-[85vh] w-full h-auto object-contain aspect-auto rounded-lg shadow-2xl"
                unoptimized
                priority
              />
            </div>
          </div>

          {!hideOverlay && (
            <div className="absolute bottom-4 right-4 z-50">
              <div className="bg-black/70 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                <span className="text-white text-xs truncate max-w-[200px] block">{fileName}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ImageViewer
