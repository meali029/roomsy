"use client"

import { useEffect, useRef } from "react"

interface MapPickerProps {
  onLocationChange: (address: string) => void
  defaultLocation?: string
}

export default function MapPicker({ onLocationChange, defaultLocation }: MapPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!window.google || !inputRef.current) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      componentRestrictions: { country: "pk" }, // 🇵🇰 limit to Pakistan
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place.formatted_address) {
        onLocationChange(place.formatted_address)
      } else if (place.name) {
        onLocationChange(place.name)
      }
    })
  }, [onLocationChange])

  return (
    <input
      ref={inputRef}
      defaultValue={defaultLocation}
      type="text"
      placeholder="Search location..."
      className="input"
    />
  )
}
