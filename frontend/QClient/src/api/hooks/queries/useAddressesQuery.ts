import { useQuery } from "@tanstack/react-query";
import { Address } from "../../types/Address";
import { api } from "../..";
import { useValidAccountId } from "src/context/AuthContext";

export default function useAddressesQuery() {
  const accountId = useValidAccountId();

  return useQuery<Address[], Error>({
    queryKey: ["addresses"],
    queryFn: async () => {
      return (await api.axios.get<Address[]>(api.routes.account(accountId).addresses)).data;
    },
  });
}
