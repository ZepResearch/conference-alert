"use client"

import { useState, useEffect } from "react"

export function DebugImage({ blog, pocketbase }) {
  const [debugInfo, setDebugInfo] = useState(null)

  useEffect(() => {
    if (blog && blog.featured_image) {
      const imageUrl = pocketbase.getFileUrl(blog, blog.featured_image)
      setDebugInfo({
        blogId: blog.id,
        featuredImage: blog.featured_image,
        generatedUrl: imageUrl,
        fullBlog: blog,
      })
      console.log("Debug Info:", {
        blogId: blog.id,
        featuredImage: blog.featured_image,
        generatedUrl: imageUrl,
        fullBlog: blog,
      })
    }
  }, [blog, pocketbase])

  if (!debugInfo) return null

  return (
    <div className="bg-yellow-100 border border-yellow-400 p-4 rounded mb-4 text-xs">
      <h4 className="font-bold">Debug Info:</h4>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  )
}
