import { useState, useCallback } from 'react';
// import * as Location from 'expo-location';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    // Simulate permission request
    setTimeout(() => {
      setPermissionGranted(true);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    // Simulate getting location
    return new Promise<LocationCoords>((resolve) => {
      setTimeout(() => {
        const mockLocation = { latitude: 37.7749, longitude: -122.4194 };
        setLocation(mockLocation);
        setIsLoading(false);
        resolve(mockLocation);
      }, 1500);
    });
  }, []);

  const watchLocation = useCallback(() => {
    // Simulate watching location
    const interval = setInterval(() => {
      setLocation((prev) => prev ? { ...prev, latitude: prev.latitude + 0.0001 } : { latitude: 37.7749, longitude: -122.4194 });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return { location, isLoading, error, permissionGranted, requestPermission, getCurrentLocation, watchLocation };
}
