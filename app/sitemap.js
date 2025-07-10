// import pocketbase from "@/lib/pocketbase"

// export default async function sitemap() {
//   const baseUrl = "https://conference-alert.com" // Replace with your actual domain

//   // Static pages
//   const staticPages = [
//     {
//       url: baseUrl,
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 1,
//     },
//     {
//       url: `${baseUrl}/blog`,
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 0.8,
//     },
//   ]

//   // Dynamic blog pages
//   let blogPages = []
//   try {
//     const result = await pocketbase.getBlogs(1, 1000) // Get all published blogs
//     if (result.success) {
//       blogPages = result.blogs.items.map((blog) => ({
//         url: `${baseUrl}/blog/${pocketbase.createSlug(blog.title, blog.id)}`,
//         lastModified: new Date(blog.updated),
//         changeFrequency: "weekly",
//         priority: 0.6,
//       }))
//     }
//   } catch (error) {
//     console.error("Error generating sitemap for blogs:", error)
//   }

//   return [...staticPages, ...blogPages]
// }