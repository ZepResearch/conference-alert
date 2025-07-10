"use client"

export function RichTextStyles() {
  return (
    <style jsx global>{`
      .rich-text-content {
        line-height: 1.7;
        color: #374151;
      }
      
      .rich-text-content h1 {
        font-size: 2.25rem;
        font-weight: 700;
        color: #111827;
        margin: 2rem 0 1rem 0;
        line-height: 1.2;
      }
      
      .rich-text-content h2 {
        font-size: 1.875rem;
        font-weight: 600;
        color: #111827;
        margin: 1.75rem 0 0.75rem 0;
        line-height: 1.3;
      }
      
      .rich-text-content h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #111827;
        margin: 1.5rem 0 0.5rem 0;
        line-height: 1.4;
      }
      
      .rich-text-content h4 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        margin: 1.25rem 0 0.5rem 0;
        line-height: 1.4;
      }
      
      .rich-text-content p {
        margin: 0 0 1.25rem 0;
        line-height: 1.7;
      }
      
      .rich-text-content ul, .rich-text-content ol {
        margin: 1rem 0;
        padding-left: 1.5rem;
      }
      
      .rich-text-content li {
        margin: 0.5rem 0;
        line-height: 1.6;
      }
      
      .rich-text-content a {
        color: #2563eb;
        text-decoration: underline;
        transition: color 0.2s;
      }
      
      .rich-text-content a:hover {
        color: #1d4ed8;
      }
      
      .rich-text-content strong {
        font-weight: 600;
        color: #111827;
      }
      
      .rich-text-content em {
        font-style: italic;
      }
      
      .rich-text-content blockquote {
        border-left: 4px solid #3b82f6;
        padding-left: 1rem;
        margin: 1.5rem 0;
        font-style: italic;
        color: #6b7280;
        background: #f9fafb;
        padding: 1rem;
        border-radius: 0.375rem;
      }
      
      .rich-text-content code {
        background: #f3f4f6;
        color: #1f2937;
        padding: 0.125rem 0.25rem;
        border-radius: 0.25rem;
        font-size: 0.875rem;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }
      
      .rich-text-content pre {
        background: #1f2937;
        color: #f9fafb;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 1.5rem 0;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }
      
      .rich-text-content pre code {
        background: transparent;
        color: inherit;
        padding: 0;
      }
      
      .rich-text-content img {
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
        margin: 1.5rem 0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      
      .rich-text-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        overflow: hidden;
      }
      
      .rich-text-content th {
        background: #f9fafb;
        padding: 0.75rem;
        text-align: left;
        font-weight: 600;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .rich-text-content td {
        padding: 0.75rem;
        border-bottom: 1px solid #f3f4f6;
      }
      
      .rich-text-content hr {
        border: none;
        border-top: 1px solid #e5e7eb;
        margin: 2rem 0;
      }
    `}</style>
  )
}
