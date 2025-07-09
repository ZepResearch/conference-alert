"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import pocketbase from "@/lib/pocketbase"
import { useToast } from "@/hooks/use-toast"

// Simple Rich Text Editor Component
function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || ""
    }
  }, [])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current.focus()
    handleInput()
  }

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText("bold")}
          className="px-2 py-1 text-xs"
        >
          <strong>B</strong>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText("italic")}
          className="px-2 py-1 text-xs"
        >
          <em>I</em>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText("underline")}
          className="px-2 py-1 text-xs"
        >
          <u>U</u>
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText("formatBlock", "h2")}
          className="px-2 py-1 text-xs"
        >
          H2
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText("formatBlock", "h3")}
          className="px-2 py-1 text-xs"
        >
          H3
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText("insertUnorderedList")}
          className="px-2 py-1 text-xs"
        >
          • List
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => formatText("insertOrderedList")}
          className="px-2 py-1 text-xs"
        >
          1. List
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const url = prompt("Enter URL:")
            if (url) formatText("createLink", url)
          }}
          className="px-2 py-1 text-xs"
        >
          Link
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[300px] focus:outline-none"
        style={{ minHeight: "300px" }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  )
}

export default function CreateBlogPage() {
  const { user, isAuthenticated, loading, isInitialized } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    category: "",
    tags: "",
    status: "draft",
    featured_image: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Only redirect if not loading and definitely not authenticated
    if (!loading && !isAuthenticated && isInitialized) {
      console.log("Redirecting to login from create-blog page")
      router.push("/login")
    }
  }, [isAuthenticated, loading, isInitialized, router])

  // Check if user is superuser
  useEffect(() => {
    if (isAuthenticated && user && !pocketbase.isSuperUser()) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, user, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setFormData((prev) => ({
        ...prev,
        slug: slug,
      }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        featured_image: file,
      }))
    }
  }

  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content: content,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    // Basic validation
    if (!formData.title || !formData.content || !formData.category) {
      setError("Please fill in the required fields: Title, Content, and Category")
      setSubmitting(false)
      return
    }

    // Check authentication and superuser status
    if (!user || !isAuthenticated || !pocketbase.isSuperUser()) {
      setError("You must be an administrator to create blog posts.")
      setSubmitting(false)
      return
    }

    try {
      const result = await pocketbase.createBlog(formData)

      if (result.success) {
        toast({
          title: "Blog post created successfully",
          description: "Your blog post has been created.",
        })
        router.push("/dashboard")
      } else {
        console.error("Blog creation failed:", result.error)
        setError(result.error)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      setError("An unexpected error occurred. Please try again.")
    }

    setSubmitting(false)
  }

  // Show loading only while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Only show redirect message if we're definitely not authenticated
  if (isInitialized && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Check if user is superuser
  if (isAuthenticated && user && !pocketbase.isSuperUser()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">Only administrators can create blog posts.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const categories = [
    "Tech",
    "Business",
    "Lifestyle",
    "Education",
    "Entertainment",
    "Health",
    "Travel",
    "Food",
    "Sports",
    "Other",
  ]

  const tags = [
    "technology",
    "programming",
    "web-development",
    "mobile",
    "design",
    "business",
    "tutorial",
    "news",
    "review",
    "opinion",
  ]

  const statuses = ["draft", "published", "archived"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Conference Alert</h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
            <CardDescription>Write and publish a new blog article</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter blog post title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="url-friendly-slug"
                    required
                  />
                  <p className="text-sm text-gray-600">This will be used in the URL. Auto-generated from title.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Select onValueChange={(value) => handleSelectChange("tags", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {tags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select onValueChange={(value) => handleSelectChange("status", value)} value={formData.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_image">Featured Image</Label>
                  <Input id="featured_image" type="file" accept="image/*" onChange={handleFileChange} />
                  <p className="text-sm text-gray-600">Upload a featured image for your blog post (JPG, PNG, GIF)</p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Content</h3>
                <div className="space-y-2">
                  <Label>Content *</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your blog post content here..."
                  />
                  <p className="text-sm text-gray-600">Use the toolbar to format your content</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Blog Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
