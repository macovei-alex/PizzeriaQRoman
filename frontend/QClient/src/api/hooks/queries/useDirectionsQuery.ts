import { useQuery } from "@tanstack/react-query";
import { LatLng } from "react-native-maps";
import { api } from "../..";
import { Directions } from "../../types/Directions";
import { decode } from "@mapbox/polyline";
import { useEffect, useRef } from "react";
import equal from "fast-deep-equal";

export function useDirectionsQuery(origin?: LatLng, destination?: LatLng) {
  const originRef = useRef(origin);
  const destinationRef = useRef(destination);

  const query = useQuery<LatLng[]>({
    queryFn: async ({ signal }) => {
      if (!originRef.current || !destinationRef.current) return [];
      const data = (
        await api.axios.get<Directions>(
          api.routes.navigation.directions(originRef.current, destinationRef.current),
          { signal }
        )
      ).data;
      if (data.routes.length) {
        const points = decode(data.routes[0].overview_polyline.points).map(([latitude, longitude]) => ({
          latitude,
          longitude,
        }));
        return points;
      }
      return [];
    },
    queryKey: ["directions"],
    enabled: !!originRef.current && !!destinationRef.current,
  });

  useEffect(() => {
    if (!equal(origin, originRef.current) || !equal(destination, destinationRef.current)) {
      originRef.current = origin;
      destinationRef.current = destination;
      query.refetch();
    }
  }, [origin, destination, query]);

  return query;
}
