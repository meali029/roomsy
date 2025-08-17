"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, AlertTriangle, CheckCircle } from "lucide-react"

// Declare global Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: unknown) => {
            addListener: (event: string, callback: () => void) => void
            getPlace: () => {
              formatted_address?: string
              name?: string
              geometry?: unknown
            }
          }
        }
      }
    }
    initGoogleMaps: () => void
  }
}

interface MapPickerProps {
  onLocationChange: (address: string) => void
  defaultLocation?: string
}

export default function MapPicker({ onLocationChange, defaultLocation }: MapPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Initializing location services...")

  useEffect(() => {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!API_KEY) {
      console.warn('Google Maps API key not found')
      setMapError(true)
      return
    }

    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) {
        console.warn('Cannot initialize autocomplete: missing elements')
        return
      }

      try {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["geocode", "establishment"],
          componentRestrictions: { country: "pk" },
          fields: ["formatted_address", "name", "geometry"]
        })

        autocomplete.addListener("place_changed", () => {
          try {
            const place = autocomplete.getPlace()
            
            if (place.formatted_address) {
              onLocationChange(place.formatted_address)
            } else if (place.name) {
              onLocationChange(place.name)
            }
          } catch (error) {
            console.error('Error in place_changed listener:', error)
          }
        })

      } catch (error) {
        console.error('Error initializing autocomplete:', error)
        setMapError(true)
      }
    }

    const loadGoogleMapsAPI = (apiKey: string) => {
      setLoadingMessage("Loading Google Maps...")
      
      // Create callback function
      window.initGoogleMaps = () => {
        if (window.google?.maps?.places) {
          setIsGoogleMapsLoaded(true)
          initializeAutocomplete()
        } else {
          setMapError(true)
        }
      }

      try {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
        script.async = true
        script.defer = true
        
        script.onerror = () => {
          console.error('Failed to load Google Maps API')
          setMapError(true)
        }

        document.head.appendChild(script)

        // Fallback timeout
        setTimeout(() => {
          if (!window.google?.maps?.places) {
            console.warn('Google Maps loading timeout')
            setMapError(true)
          }
        }, 15000)

      } catch (error) {
        console.error('Error loading Google Maps:', error)
        setMapError(true)
      }
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps?.places) {
      setIsGoogleMapsLoaded(true)
      initializeAutocomplete()
      return
    }

    // Check if script is already loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      setLoadingMessage("Waiting for Maps API...")
      // Wait for existing script to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkInterval)
          setIsGoogleMapsLoaded(true)
          initializeAutocomplete()
        }
      }, 100)

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval)
        if (!window.google?.maps?.places) {
          setMapError(true)
        }
      }, 10000)
      return
    }

    // Load Google Maps API
    loadGoogleMapsAPI(API_KEY)
  }, [onLocationChange])

  // Fallback input without Google Maps integration
  if (mapError) {
    return (
      <div className="space-y-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rich-green/60 w-5 h-5" />
          <input
            ref={inputRef}
            defaultValue={defaultLocation}
            type="text"
            placeholder="Enter your complete address (e.g., House 123, Block A, DHA Phase 5, Lahore)"
            className="input pl-11 w-full"
            onChange={(e) => onLocationChange(e.target.value)}
          />
        </div>
        <div className="flex items-start space-x-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Enhanced location search unavailable</p>
            <p className="text-xs mt-1">
              Google Maps integration failed. Please enter your complete address manually including:
              <br/>• House/Building number
              <br/>• Street/Block name  
              <br/>• Area (e.g., DHA Phase 5)
              <br/>• City (e.g., Lahore, Karachi, Islamabad)
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (!isGoogleMapsLoaded) {
    return (
      <div className="space-y-3">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rich-green/60 w-5 h-5" />
          <input
            ref={inputRef}
            defaultValue={defaultLocation}
            type="text"
            placeholder="Enter your address (enhanced search loading...)"
            className="input pl-11 w-full"
            onChange={(e) => onLocationChange(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 text-rich-green/70 text-sm">
          <div className="animate-spin w-4 h-4 border-2 border-rich-green/20 border-t-rich-green rounded-full"></div>
          <span>{loadingMessage}</span>
        </div>
      </div>
    )
  }

  // Google Maps loaded successfully
  return (
    <div className="space-y-3">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rich-green/60 w-5 h-5 z-10" />
        <input
          ref={inputRef}
          defaultValue={defaultLocation}
          type="text"
          placeholder="Start typing your location in Pakistan..."
          className="input pl-11 w-full"
        />
      </div>
      <div className="flex items-center space-x-2 text-green-600 text-sm bg-green-50 p-2 rounded-lg border border-green-200">
        <CheckCircle className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs">
          Enhanced location search active - start typing to see suggestions
        </span>
      </div>
    </div>
  )
}
