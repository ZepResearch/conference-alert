"use client"

import { useState, useEffect } from "react"
import { DebugImage } from "@/components/BLOGS COMPONENTS/debug-image"
import pocketbase from "@/lib/pocketbase"

export default function BlogDebugPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const result = await pocketbase.getBlogs(1, 5)
        if (result.success) {
          setBlogs(result.blogs.items)
          console.log("Fetched blogs:", result.blogs.items)
        }
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) return <div>Loading debug info...</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Blog Debug Page</h1>

      {blogs.map((blog) => (
        <div key={blog.id} className="mb-8 border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">{blog.title}</h2>
          <DebugImage blog={blog} pocketbase={pocketbase} />

          <div className="mt-4">
            <h3 className="font-semibold">Raw Blog Data:</h3>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">{JSON.stringify(blog, null, 2)}</pre>
          </div>

          {blog.featured_image && (
            <div className="mt-4">
              <h3 className="font-semibold">Image Test:</h3>
              <img
                src={pocketbase.getFileUrl(blog, blog.featured_image) || "/placeholder.svg"}
                alt={blog.title}
                className="w-32 h-32 object-cover border"
                onError={(e) => {
                  console.error("Image failed to load:", e.target.src)
                  e.target.style.border = "2px solid red"
                }}
                onLoad={(e) => {
                  console.log("Image loaded successfully:", e.target.src)
                  e.target.style.border = "2px solid green"
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
