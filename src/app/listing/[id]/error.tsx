"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-semibold text-red-600">Couldn’t load this listing.</h2>
      <p className="text-gray-700 mt-2">{error.message || "Something went wrong."}</p>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">
        Try again
      </button>
    </div>
  )
}
