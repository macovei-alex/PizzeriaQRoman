import { useQuery } from "@tanstack/react-query";
import { Address } from "../types/Address";
import { api } from "..";
import { useAuthContext } from "src/context/AuthContext";

export default function useAddressesQuery() {
  const authContext = useAuthContext();

  return useQuery<Address[], Error>({
    queryFn: async () => {
      return (await api.axios.get<Address[]>(`/accounts/${authContext.account?.id}/addresses`)).data;
    },
    queryKey: ["addresses"],
  });
}
