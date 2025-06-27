import * as Location from "expo-location";
import { useEffect, useState } from "react";
import logger from "src/constants/logger";

const precision = 100_000;

function roundCoordinates(coords?: Location.LocationObjectCoords) {
  if (!coords) return { latitude: 0, longitude: 0 };
  return {
    latitude: Math.round(coords.latitude * precision) / precision,
    longitude: Math.round(coords.longitude * precision) / precision,
  };
}

export function useCurrentLocation() {
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [permissionAllowed, setPermissionAllowed] = useState(true);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let cancelled = false;

    async function startListening() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionAllowed(false);
        logger.warn("Permission to access location was denied");
        return;
      }

      setPermissionAllowed(true);

      const location = await Location.getLastKnownPositionAsync();
      setCurrentLocation((prev) => prev ?? location);

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (location) => {
          if (cancelled) return;
          setCurrentLocation((prev) =>
            roundCoordinates(prev?.coords) === roundCoordinates(location.coords) ? prev : location
          );
        }
      );
    }

    startListening();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []);

  return {
    currentLocation,
    permissionAllowed,
  };
}
