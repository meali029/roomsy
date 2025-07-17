// src/components/auth/AuthInput.tsx

import { InputHTMLAttributes } from "react"

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function AuthInput({ label, ...props }: AuthInputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  )
}
