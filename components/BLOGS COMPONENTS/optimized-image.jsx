"use client"

import { useState } from "react"
import Image from "next/image"

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  fill = false,
  sizes,
  priority = false,
  ...props
}) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = (e) => {
    console.log("Image failed to load:", src)
    console.log("Error details:", e)
    setImageError(true)
    setIsLoading(false)
  }

  const handleLoad = (e) => {
    console.log("Image loaded successfully:", src)
    setIsLoading(false)
  }

  // Show fallback if no src or error occurred
  if (!src || imageError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className} ${fill ? "absolute inset-0" : "w-full h-full"}`}
      >
        <div className="text-gray-400 text-center p-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${fill ? "" : className}`}>
      {isLoading && (
        <div
          className={`${fill ? "absolute inset-0" : "absolute inset-0"} bg-gray-200 animate-pulse rounded-lg flex items-center justify-center z-10`}
        >
          <div className="text-gray-400">Loading...</div>
        </div>
      )}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300 ${fill ? "object-cover" : ""} ${fill ? className : ""}`}
        sizes={sizes}
        priority={priority}
        onError={handleError}
        onLoad={handleLoad}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        {...props}
      />
    </div>
  )
}
