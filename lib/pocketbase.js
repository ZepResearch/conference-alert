import PocketBase from "pocketbase"

class PocketBaseClient {
  constructor() {
    this.pb = new PocketBase("https://conference-alert.pockethost.io")
    // Enable auto cancellation for duplicate requests
    this.pb.autoCancellation(false)
  }

  // Authentication methods
  async login(email, password) {
    try {
      const authData = await this.pb.collection("users").authWithPassword(email, password)
      return { success: true, user: authData.record, token: authData.token }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: error.message }
    }
  }

  async register(email, password, passwordConfirm, name) {
    try {
      const data = {
        email,
        password,
        passwordConfirm,
        name,
      }
      const record = await this.pb.collection("users").create(data)
      // Send verification email
      try {
        await this.pb.collection("users").requestVerification(email)
      } catch (verifyError) {
        console.warn("Verification email failed:", verifyError)
      }
      return { success: true, user: record }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, error: error.message }
    }
  }

  logout() {
    this.pb.authStore.clear()
  }

  // Event methods
  async createEvent(eventData) {
    try {
      if (!this.pb.authStore.isValid) {
        throw new Error("User not authenticated")
      }
      // Create FormData for file upload
      const formData = new FormData()
      // Add all event data to FormData
      Object.keys(eventData).forEach((key) => {
        if (eventData[key] !== "" && eventData[key] !== null && eventData[key] !== undefined) {
          if (key === "event_keywords" && Array.isArray(eventData[key])) {
            formData.append(key, JSON.stringify(eventData[key]))
          } else if (key === "thumbnail" && eventData[key] instanceof File) {
            formData.append(key, eventData[key])
          } else if (key !== "thumbnail") {
            formData.append(key, eventData[key])
          }
        }
      })
      // Add required fields
      formData.append("submitted_by", this.pb.authStore.record.id)
      formData.append("status", "pending")
      const record = await this.pb.collection("events").create(formData)
      return { success: true, event: record }
    } catch (error) {
      console.error("Create event error:", error)
      return { success: false, error: error.message }
    }
  }

  async getEvents(page = 1, perPage = 50, filter = "") {
    try {
      const resultList = await this.pb.collection("events").getList(page, perPage, {
        filter: filter,
        sort: "-created",
        expand: "submitted_by",
      })
      return { success: true, events: resultList }
    } catch (error) {
      console.error("Get events error:", error)
      return { success: false, error: error.message }
    }
  }

  async searchEvents(filter, page = 1, perPage = 20) {
    try {
      const resultList = await this.pb.collection("events").getList(page, perPage, {
        filter: filter,
        sort: "-event_start_date,-created",
        expand: "submitted_by",
      })
      return { success: true, events: resultList }
    } catch (error) {
      console.error("Search events error:", error)
      return { success: false, error: error.message }
    }
  }

  async getEventBySlug(slug) {
    try {
      // Extract ID from slug (format: event-name-id)
      const parts = slug.split("-")
      const eventId = parts[parts.length - 1]
      const record = await this.pb.collection("events").getOne(eventId, {
        expand: "submitted_by",
      })
      return { success: true, event: record }
    } catch (error) {
      console.error("Get event by slug error:", error)
      return { success: false, error: error.message }
    }
  }

  async getUserEvents(userId, page = 1, perPage = 50) {
    try {
      if (!this.pb.authStore.isValid) {
        throw new Error("User not authenticated")
      }
      const filter = `submitted_by = "${userId}"`
      const resultList = await this.pb.collection("events").getList(page, perPage, {
        filter: filter,
        sort: "-created",
      })
      return { success: true, events: resultList }
    } catch (error) {
      console.error("Get user events error:", error)
      return { success: false, error: error.message }
    }
  }

  // Blog methods with optimization
  async getBlogs(page = 1, perPage = 10, filter = "") {
    try {
      let finalFilter = 'status = "published"'
      if (filter) {
        finalFilter += ` && ${filter}`
      }

      const resultList = await this.pb.collection("blogs").getList(page, perPage, {
        filter: finalFilter,
        sort: "-created",
        fields: "id,title,content,featured_image,tags,category,author,created,updated", // Only fetch needed fields
      })

      return { success: true, blogs: resultList }
    } catch (error) {
      console.error("Get blogs error:", error)
      return { success: false, error: error.message }
    }
  }

  async getBlogById(id) {
    try {
      const record = await this.pb.collection("blogs").getOne(id, {
        fields: "*", // Get all fields for detail page
      })
      return { success: true, blog: record }
    } catch (error) {
      console.error("Get blog by ID error:", error)
      return { success: false, error: error.message }
    }
  }

  async getBlogBySlug(slug) {
    try {
      // Extract ID from slug (format: blog-title-id)
      const parts = slug.split("-")
      const blogId = parts[parts.length - 1]
      const record = await this.pb.collection("blogs").getOne(blogId)
      return { success: true, blog: record }
    } catch (error) {
      console.error("Get blog by slug error:", error)
      return { success: false, error: error.message }
    }
  }

  async searchBlogs(searchTerm, page = 1, perPage = 10) {
    try {
      const filter = `status = "published" && (title ~ "${searchTerm}" || content ~ "${searchTerm}" || tags ~ "${searchTerm}" || category ~ "${searchTerm}")`

      const resultList = await this.pb.collection("blogs").getList(page, perPage, {
        filter: filter,
        sort: "-created",
      })
      return { success: true, blogs: resultList }
    } catch (error) {
      console.error("Search blogs error:", error)
      return { success: false, error: error.message }
    }
  }

  async getBlogsByCategory(category, page = 1, perPage = 10) {
    try {
      const filter = `status = "published" && category = "${category}"`

      const resultList = await this.pb.collection("blogs").getList(page, perPage, {
        filter: filter,
        sort: "-created",
      })
      return { success: true, blogs: resultList }
    } catch (error) {
      console.error("Get blogs by category error:", error)
      return { success: false, error: error.message }
    }
  }

  async getBlogsByTag(tag, page = 1, perPage = 10) {
    try {
      const filter = `status = "published" && tags = "${tag}"`

      const resultList = await this.pb.collection("blogs").getList(page, perPage, {
        filter: filter,
        sort: "-created",
      })
      return { success: true, blogs: resultList }
    } catch (error) {
      console.error("Get blogs by tag error:", error)
      return { success: false, error: error.message }
    }
  }

  // Helper method to create SEO-friendly slug
  createSlug(title, id) {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    return `${slug}-${id}`
  }

  // Helper method to get blog featured image URL - FIXED VERSION
  getBlogImageUrl(blog) {
    if (blog && blog.featured_image) {
      const url = `https://conference-alert.pockethost.io/api/files/blogs/${blog.id}/${blog.featured_image}`
      console.log("Generated blog image URL:", url)
      return url
    }
    console.log("No featured image found for blog:", blog?.id)
    return null
  }

  // Helper method to get event thumbnail URL (keeping existing functionality)
  getThumbnailUrl(event) {
    if (event.thumbnail) {
      return `https://conference-alert.pockethost.io/api/files/events/${event.id}/${event.thumbnail}`
    }
    return null
  }

  // Legacy method - keeping for backward compatibility but using new method internally
  getFileUrl(record, filename) {
    if (!record || !filename) {
      console.log("Missing record or filename:", { record: !!record, filename })
      return null
    }

    // For blogs, use the specific blog image URL method
    if (record.collectionName === "blogs" || !record.collectionName) {
      return this.getBlogImageUrl(record)
    }

    try {
      const url = this.pb.files.getUrl(record, filename)
      console.log("Generated URL using PB method:", url)
      return url
    } catch (error) {
      console.error("Error generating file URL:", error)
      return null
    }
  }

  // Utility methods
  get isAuthenticated() {
    return this.pb.authStore.isValid
  }

  get currentUser() {
    return this.pb.authStore.record
  }

  get authToken() {
    return this.pb.authStore.token
  }

  // Auth store listener
  onChange(callback) {
    return this.pb.authStore.onChange(callback)
  }
}

// Create singleton instance
const pocketbase = new PocketBaseClient()
export default pocketbase
