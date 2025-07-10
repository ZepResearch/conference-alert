"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Search, ArrowRight, Filter, Sparkles, BookOpen, FileText } from "lucide-react"
import pocketbase from "@/lib/pocketbase"
import Image from "next/image"
import { Navbar } from "@/components/Navbar"

export default function BlogPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [error, setError] = useState(null)

  const categories = useMemo(
    () => [
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
    ],
    [],
  )

  const tags = useMemo(
    () => [
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
    ],
    [],
  )

  const fetchBlogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let result
      if (searchTerm.trim()) {
        result = await pocketbase.searchBlogs(searchTerm.trim(), currentPage, 12)
      } else if (selectedCategory !== "all") {
        result = await pocketbase.getBlogsByCategory(selectedCategory, currentPage, 12)
      } else if (selectedTag !== "all") {
        result = await pocketbase.getBlogsByTag(selectedTag, currentPage, 12)
      } else {
        result = await pocketbase.getBlogs(currentPage, 12)
      }

      if (result.success) {
        setBlogs(result.blogs.items)
        setTotalPages(result.blogs.totalPages)
        setTotalItems(result.blogs.totalItems)
        console.log("Fetched blogs for listing:", result.blogs.items)
      } else {
        setError(result.error)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
      setError("Failed to load blogs")
    } finally {
      setLoading(false)
    }
  }, [currentPage, selectedCategory, selectedTag, searchTerm])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  const handleSearch = useCallback(async (e) => {
    e.preventDefault()
    setCurrentPage(1)
    setSelectedCategory("all")
    setSelectedTag("all")
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
      const textContent = content.replace(/<[^>]*>/g, "")
      return textContent.length > maxLength ? textContent.substring(0, maxLength) + "..." : textContent
    }
  }, [])

  const createBlogSlug = useMemo(() => {
    return (title, id) => {
      return pocketbase.createSlug(title, id)
    }
  }, [])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category)
    setSelectedTag("all")
    setCurrentPage(1)
    setSearchTerm("")
  }, [])

  const handleTagChange = useCallback((tag) => {
    setSelectedTag(tag)
    setSelectedCategory("all")
    setCurrentPage(1)
    setSearchTerm("")
  }, [])

  // Loading skeleton component
  const BlogCardSkeleton = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-200/50 overflow-hidden"
    >
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
    </motion.div>
  )

  const floatingVariants = {
    float: {
      y: [-8, 8, -8],
      rotate: [0, 3, -3, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10 relative overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div
        variants={floatingVariants}
        animate="float"
        className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl opacity-30"
      />
      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "2s" }}
        className="absolute top-40 right-20 w-48 h-48 bg-purple-200/20 rounded-full blur-xl opacity-20"
      />
      <motion.div
        variants={floatingVariants}
        animate="float"
        style={{ animationDelay: "4s" }}
        className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-200/25 rounded-full blur-xl opacity-25"
      />

      {/* Header */}
      <Navbar/>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-4 overflow-hidden pt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl font-light text-gray-900 mb-6 leading-tight">
            
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block bg-gradient-to-tr from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium"
              >
                Blogs
              </motion.span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-3xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed font-light"
          >
            Insights, tips, and updates from the world of conferences and academia
          </motion.p>
        </div>
      </motion.section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white backdrop-blur-sm rounded-3xl border transition-all duration-500 shadow-xl">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Search & Filter</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Search blogs</label>
                  <form onSubmit={handleSearch}>
                    <Input
                      type="text"
                      placeholder="Search blogs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-12 border-1 shadow bg-white focus:bg-white transition-all duration-300 rounded-xl text-base placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </form>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="h-12 w-full shadow border-1 bg-white focus:bg-white transition-all duration-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Tag</label>
                  <Select value={selectedTag} onValueChange={handleTagChange}>
                    <SelectTrigger className="h-12 w-full shadow border-1 bg-white focus:bg-white transition-all duration-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue placeholder="All Tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {tags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag.charAt(0).toUpperCase() + tag.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium opacity-0">Apply</label>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setCurrentPage(1)}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Apply Filters
                    </Button>
                  </motion.div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {loading ? "Loading..." : `Showing ${blogs.length} of ${totalItems} blog posts`}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        {error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 p-12 max-w-md mx-auto">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">Error loading blogs</h3>
              <p className="text-gray-600 font-light mb-6">{error}</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={fetchBlogs}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                >
                  Try Again
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(12)].map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
                      <div className="bg-white backdrop-blur-sm rounded-3xl border shadow transition-all duration-500 hover:shadow-xl overflow-hidden h-full">
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
                                <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }} className="ml-2">
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex justify-center space-x-2"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                  >
                    Previous
                  </Button>
                </motion.div>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                    return (
                      <motion.div key={page} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className={
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl w-10"
                              : "bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl w-10"
                          }
                        >
                          {page}
                        </Button>
                      </motion.div>
                    )
                  } else if (page === currentPage - 3 || page === currentPage + 3) {
                    return (
                      <span key={page} className="px-2 flex items-center text-gray-400">
                        ...
                      </span>
                    )
                  }
                  return null
                })}

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80 hover:border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                  >
                    Next
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 p-12 max-w-md mx-auto">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-gray-900 mb-3">No blogs found</h3>
              <p className="text-gray-600 font-light">Try adjusting your search or filter criteria.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
