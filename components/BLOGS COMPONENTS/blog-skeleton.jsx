import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function BlogCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-t-lg"></div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="h-9 bg-gray-200 rounded"></div>
      </CardContent>
    </Card>
  )
}

export function BlogDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-pulse">
        {/* Back button skeleton */}
        <div className="h-9 bg-gray-200 rounded w-32 mb-8"></div>

        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="flex items-center gap-6">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        {/* Image skeleton */}
        <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>

        {/* Content skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
