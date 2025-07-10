"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { OptimizedImage } from "@/components/BLOGS COMPONENTS/optimized-image"
import { RichTextRenderer } from "@/components/BLOGS COMPONENTS/rich-text-renderer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, ArrowLeft, Share2, Clock } from "lucide-react"
import { SEOHead } from "@/components/BLOGS COMPONENTS/seo-head"
import { Breadcrumbs } from "@/components/BLOGS COMPONENTS/breadcrumbs"
import { BlogDetailSkeleton } from "@/components/BLOGS COMPONENTS/blog-skeleton"
import pocketbase from "@/lib/pocketbase"
import Image from "next/image"
import { Navbar } from "@/components/Navbar"

export default function BlogDetailPage() {
  const params = useParams()
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (params.id) {
      fetchBlog()
    }
  }, [params.id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      setError(null)

      // Extract ID from slug
      const parts = params.id.split("-")
      const blogId = parts[parts.length - 1]

      const result = await pocketbase.getBlogById(blogId)

      if (result.success) {
        setBlog(result.blog)
        console.log("Fetched blog detail:", result.blog)
        // Fetch related blogs by category
        if (result.blog.category) {
          const relatedResult = await pocketbase.getBlogsByCategory(result.blog.category, 1, 4)
          if (relatedResult.success) {
            // Filter out current blog from related blogs
            const filtered = relatedResult.blogs.items.filter((b) => b.id !== blogId)
            setRelatedBlogs(filtered.slice(0, 3))
          }
        }
      } else {
        setError("Blog not found")
      }
    } catch (error) {
      console.error("Error fetching blog:", error)
      setError("Failed to load blog")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = useMemo(() => {
    return (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }, [])

  const estimateReadingTime = useMemo(() => {
    return (content) => {
      const wordsPerMinute = 200
      const textContent = content.replace(/<[^>]*>/g, "")
      const wordCount = textContent.split(/\s+/).length
      const readingTime = Math.ceil(wordCount / wordsPerMinute)
      return readingTime
    }
  }, [])

  const createBlogSlug = useMemo(() => {
    return (title, id) => {
      return pocketbase.createSlug(title, id)
    }
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert("Link copied to clipboard!")
      } catch (error) {
        console.log("Failed to copy link")
      }
    }
  }

  // Generate breadcrumbs
  const breadcrumbItems = useMemo(() => {
    if (!blog) return []
    return [
      { label: "Blog", href: "/blog" },
      { label: blog.title, href: null },
    ]
  }, [blog])

  // Generate structured data for SEO
  const structuredData = useMemo(() => {
    if (!blog) return null

    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.content.replace(/<[^>]*>/g, "").substring(0, 160),
      image: pocketbase.getBlogImageUrl(blog),
      author: {
        "@type": "Person",
        name: blog.author || "Conference Alert Team",
      },
      publisher: {
        "@type": "Organization",
        name: "Conference Alert",
        logo: {
          "@type": "ImageObject",
          url: "https://conference-alert.com/logo.png",
        },
      },
      datePublished: blog.created,
      dateModified: blog.updated,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://conference-alert.com/blog/${params.id}`,
      },
    }
  }, [blog, params.id])

  if (loading) {
    return (
      <>
        <SEOHead title="Loading..." />
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-600 mr-2" />
                    <h1 className="text-2xl font-bold text-gray-900">Conference Alert</h1>
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <BlogDetailSkeleton />
        </div>
      </>
    )
  }

  if (error || !blog) {
    return (
      <>
        <SEOHead title="Blog Not Found" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The blog post you're looking for doesn't exist."}</p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </>
    )
  }

  const imageUrl = pocketbase.getBlogImageUrl(blog)
  const description = blog.content.replace(/<[^>]*>/g, "").substring(0, 160)

  console.log(`Blog detail ${blog.id} - Image URL: ${imageUrl}`)

  return (
    <>
      <SEOHead
        title={blog.title}
        description={description}
        image={imageUrl}
        url={`/blog/${params.id}`}
        type="article"
        publishedTime={blog.created}
        modifiedTime={blog.updated}
        author={blog.author}
        tags={blog.tags ? [blog.tags] : []}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Navbar/>

        {/* Blog Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbItems} />

          {/* Back Button */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Blog Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className="text-sm">
                {blog.category}
              </Badge>
              {blog.tags && (
                <Badge variant="outline" className="text-sm">
                  {blog.tags}
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">{blog.title}</h1>

            <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time dateTime={blog.created}>{formatDate(blog.created)}</time>
                </div>
                {blog.author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {blog.author}
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {estimateReadingTime(blog.content)} min read
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {blog.featured_image && (
            <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={`https://conference-alert.pockethost.io/api/files/blogs/${blog.id}/${blog.featured_image}`}
                alt={blog.title}
                fill
                className="rounded-lg"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
            <RichTextRenderer content={blog.content} />
          </div>

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => {
                  const relatedSlug = createBlogSlug(relatedBlog.title, relatedBlog.id)
                  const relatedImageUrl = pocketbase.getBlogImageUrl(relatedBlog)

                  return (
                    <Card key={relatedBlog.id} className="hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-32 w-full">
                        <OptimizedImage
                          src={relatedImageUrl}
                          alt={relatedBlog.title}
                          fill
                          className="rounded-t-lg"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="text-xs mb-2">
                          {relatedBlog.category}
                        </Badge>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-blue-600">
                          <Link href={`/blog/${relatedSlug}`}>{relatedBlog.title}</Link>
                        </h3>
                        <p className="text-xs text-gray-500">
                          <time dateTime={relatedBlog.created}>{formatDate(relatedBlog.created)}</time>
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          )}
        </article>
      </div>
    </>
  )
}

