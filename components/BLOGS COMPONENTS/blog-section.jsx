"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight, BookOpen, FileText, Sparkles } from 'lucide-react'
import { BlogCardSkeleton } from "./blog-skeleton"
import pocketbase from "@/lib/pocketbase"
import Image from "next/image"

export function BlogSection() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const result = await pocketbase.getBlogs(1, 6) // Get 6 latest blogs for home page
        if (result.success) {
          setBlogs(result.blogs.items)
          console.log("Fetched blogs for section:", result.blogs.items)
        } else {
          setError(result.error)
        }
      } catch (error) {
        console.error("Error fetching blogs:", error)
        setError("Failed to load blogs")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const formatDate = useMemo(() => {
    return (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }, [])

  const truncateContent = useMemo(() => {
    return (content, maxLength = 150) => {
      // Remove HTML tags for preview
      const textContent = content.replace(/<[^>]*>/g, "")
      return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent
    }
  }, [])

  const createBlogSlug = useMemo(() => {
    return (title, id) => {
      return pocketbase.createSlug(title, id)
    }
  }, [])

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  // Loading skeleton component
  const ModernBlogSkeleton = () => (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>
        <div className="h-10 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  )

  if (error) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-slate-50/50 to-gray-100/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-12 max-w-md mx-auto"
          >
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-3">Unable to Load Blog Posts</h3>
            <p className="text-gray-600 font-light">Please try again later.</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-slate-50/50 to-gray-100/30" />

      {/* Floating decorative elements - minimal and subtle */}
      <motion.div variants={floatingVariants} animate="float" className="absolute top-20 left-16 w-12 h-12 opacity-8">
        <BookOpen className="w-full h-full text-gray-300" />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "2s" }}
        className="absolute top-40 right-20 w-14 h-14 opacity-6"
      >
        <div className="w-full h-full bg-gray-200 rounded-2xl rotate-12" />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "4s" }}
        className="absolute bottom-32 left-1/4 w-10 h-10 opacity-10"
      >
        <FileText className="w-full h-full text-gray-400" />
      </motion.div>

      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "3s" }}
        className="absolute bottom-20 right-16 w-16 h-16 opacity-6"
      >
        <div className="w-full h-full bg-gray-300 rounded-full" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-medium text-gray-900 mb-4">
            Latest <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text ">Blog Posts</span>
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Stay updated with insights and tips from our community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ModernBlogSkeleton />
              </motion.div>
            ))
          ) : (
            <AnimatePresence>
              {blogs.map((blog, index) => {
                const blogSlug = createBlogSlug(blog.title, blog.id)
                const imageUrl = pocketbase.getBlogImageUrl(blog)

                return (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 hover:bg-white/80 hover:border-gray-300/50 transition-all duration-500 hover:shadow-xl overflow-hidden h-full">
                      {/* Image */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-4">
                          <Badge className="bg-gray-100 text-gray-700 border-0 hover:bg-gray-200 transition-colors duration-300">
                            {blog.category}
                          </Badge>
                          {blog.tags && (
                            <Badge className="bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors duration-300">
                              {blog.tags}
                            </Badge>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300 leading-tight">
                          <Link href={`/blog/${blogSlug}`}>{blog.title}</Link>
                        </h3>

                        {/* Meta */}
                        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mr-2">
                              <Calendar className="h-3 w-3 text-gray-500" />
                            </div>
                            <time dateTime={blog.created} className="font-medium">
                              {formatDate(blog.created)}
                            </time>
                          </div>
                          {blog.author && (
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center mr-2">
                                <User className="h-3 w-3 text-gray-500" />
                              </div>
                              <span className="font-medium">{blog.author}</span>
                            </div>
                          )}
                        </div>

                        {/* Content Preview */}
                        <p className="text-gray-600 mb-6 line-clamp-3 font-light leading-relaxed">
                          {truncateContent(blog.content)}
                        </p>

                        {/* Read More Button */}
                        <Link href={`/blog/${blogSlug}`}>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl group/btn">
                              Read More
                              <motion.div
                                whileHover={{ x: 3 }}
                                transition={{ duration: 0.2 }}
                                className="ml-2"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.div>
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>

        {!loading && blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <Link href="/blog">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="px-8 py-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 hover:border-gray-300/50 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  View All Blog Posts
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
