"use client"

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button onClick={() => reset()} className="bg-indigo-600 text-white px-4 py-2 rounded">Try again</button>
    </div>
  )
}
