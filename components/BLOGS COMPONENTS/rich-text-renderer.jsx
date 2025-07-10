"use client"

import { useMemo } from "react"

import { RichTextStyles } from "./rich-text-styles"

export function RichTextRenderer({ content, className = "" }) {
  const sanitizedContent = useMemo(() => {
    if (!content) return ""

    // Basic HTML sanitization
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
  }, [content])

  return (
    <>
      <RichTextStyles />
      <div className={`rich-text-content ${className}`} dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </>
  )
}
