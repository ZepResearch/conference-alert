import Head from "next/head"

export function SEOHead({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags = [],
  structuredData,
}) {
  const siteTitle = "Conference Alert"
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const defaultDescription =
    "Discover academic conferences, seminars, and workshops worldwide. Stay updated with the latest events in your field."
  const finalDescription = description || defaultDescription
  const defaultImage = "/placeholder.svg?height=630&width=1200"
  const finalImage = image || defaultImage
  const baseUrl = "https://conference-alert.com" // Replace with your actual domain
  const finalUrl = url ? `${baseUrl}${url}` : baseUrl

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={tags.join(", ")} />
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Article specific tags */}
      {type === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
    </Head>
  )
}
