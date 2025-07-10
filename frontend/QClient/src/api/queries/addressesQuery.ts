import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Address } from "../types/Address";
import { api } from "..";
import { AccountId, useValidAccountId } from "src/context/AuthContext";

export function addressesQueryOptions(accountId: AccountId): UseQueryOptions<Address[], Error> {
  return {
    queryKey: ["addresses"],
    queryFn: async () => {
      return (await api.axios.get<Address[]>(api.routes.account(accountId).addresses)).data;
    },
  };
}

export default function useAddressesQuery() {
  const accountId = useValidAccountId();
  return useQuery(addressesQueryOptions(accountId));
}
