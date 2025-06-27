import { useQueryClient } from "@tanstack/react-query";
import { RefObject } from "react";
import MapView, { Region } from "react-native-maps";
import { mapsAddressManualOptions } from "src/api/hooks/options/mapsAddressManualOptions";
import { mapsCoordinatesManualOptions } from "src/api/hooks/options/mapsCoordinatesManualOptions";
import { useBidirectionalStateUpdates } from "src/hooks/useBidirectionalStateUpdates";
import logger from "src/constants/logger";

export function useBidirectionalAddressRegionUpdates(mapRef: RefObject<MapView | null>) {
  const queryClient = useQueryClient();

  const {
    state1: region,
    updateState1: updateRegion,
    fetchingState1: fetchingRegion,
    state2: address,
    updateState2: updateAddress,
    fetchingState2: fetchingAddress,
  } = useBidirectionalStateUpdates<Region, string>({
    initialState1: {
      latitude: 45.4361,
      longitude: 28.0134,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
    fetchState1: async (newAddress, oldRegion) => {
      try {
        const result = await queryClient.fetchQuery(mapsCoordinatesManualOptions(newAddress));
        const newRegion = {
          ...oldRegion,
          latitude: result.lat,
          longitude: result.lng,
        };
        mapRef.current?.animateToRegion(newRegion);
        return newRegion;
      } catch (error) {
        logger.error("Failed to fetch coordinates for address:", newAddress, error);
        return oldRegion;
      }
    },
    debounceFetchState1: 0,
    initialState2: "",
    fetchState2: async (region, oldAddress) => {
      try {
        return await queryClient.fetchQuery(mapsAddressManualOptions(region.latitude, region.longitude));
      } catch (error) {
        logger.error("Failed to fetch address for coordinates:", region, error);
        return "";
      }
    },
    debounceFetchState2: 500,
  });

  return {
    region,
    setRegion: updateRegion,
    fetchingRegion,
    address,
    setAddress: updateAddress,
    fetchingAddress,
  };
}
