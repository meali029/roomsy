export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto p-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-40 bg-gray-200 rounded" />
        <div className="h-40 bg-gray-200 rounded" />
        <div className="h-40 bg-gray-200 rounded" />
      </div>
    </div>
  )
}
