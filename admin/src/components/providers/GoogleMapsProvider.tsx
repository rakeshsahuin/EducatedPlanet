"use client";

import React, { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { Loader2 } from "lucide-react";

interface GoogleMapsProviderProps {
  children: ReactNode;
}

interface GoogleMapsContextValue {
  isLoaded: boolean;
  maps: typeof google.maps | null;
}

export const GoogleMapsContext = createContext<GoogleMapsContextValue>({
  isLoaded: false,
  maps: null,
});

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error("useGoogleMaps must be used within GoogleMapsProvider");
  }
  return context;
}

// Check if Places library is available
export function isPlacesLibraryAvailable(): boolean {
  return !!(window.google?.maps?.places);
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [maps, setMaps] = useState<typeof google.maps | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      setError("Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.");
      return;
    }

    // Initialize window.google if it doesn't exist
    if (!window.google) {
      (window as any).google = {};
    }

    // Check if API is already loaded
    if (window.google && window.google.maps) {
      // API already loaded, just import places library
      const gmaps = window.google.maps;
      if (gmaps.importLibrary) {
        gmaps.importLibrary('places')
          .then(() => {
            console.log("Google Maps Places library imported successfully");
            setMaps(gmaps);
            setIsLoaded(true);
            setError(null);
          })
          .catch((err: any) => {
            console.error("Failed to import places library:", err);
            setError("Failed to load Google Maps places library.");
          });
      } else {
        // Fallback for older API versions
        console.log("Google Maps loaded (legacy mode)");
        setMaps(gmaps);
        setIsLoaded(true);
        setError(null);
      }
      return;
    }

    // Create callback function for Google Maps API
    const callbackName = `initGoogleMaps_${Date.now()}`;
    (window as any)[callbackName] = async () => {
      const gmaps = window.google.maps;

      try {
        if (gmaps.importLibrary) {
          // Import both places and geometry libraries
          await Promise.all([
            gmaps.importLibrary('places'),
            gmaps.importLibrary('geometry')
          ]);
          console.log("Google Maps libraries loaded successfully");
        }

        setMaps(gmaps);
        setIsLoaded(true);
        setError(null);
      } catch (err: any) {
        console.error("Failed to import Google Maps libraries:", err);
        setError("Failed to load Google Maps libraries.");
      }

      // Clean up callback
      delete (window as any)[callbackName];
    };

    // Set the options for the Google Maps API
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&v=weekly&language=en&region=IN&callback=${callbackName}`;

    script.onerror = () => {
      console.error("Failed to load Google Maps API script");
      setError("Failed to load Google Maps API. Please check your API key and network connection.");
      delete (window as any)[callbackName];
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      delete (window as any)[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  if (error) {
    console.error(error);
    // Still render children so the app doesn't break completely
    return <>{children}</>;
  }

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, maps }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}