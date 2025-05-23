import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { api } from "src/api";

export function useNavigationAddress(latitude: number, longitude: number) {
  const lastAddress = useRef<string | undefined>(undefined);
  const query = useQuery({
    queryKey: ["navigation", "address", latitude, longitude],
    queryFn: async () =>
      api.axios.get<string>(api.routes.navigation.address(latitude, longitude)).then((res) => {
        lastAddress.current = res.data;
        return res.data;
      }),
    gcTime: 0,
  });

  return {
    ...query,
    data: lastAddress.current,
  };
}
