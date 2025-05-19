import { useQuery } from "@tanstack/react-query";
import { Address } from "../../types/Address";
import { api } from "../..";
import { useAuthContext } from "src/context/AuthContext";

export default function useAddressesQuery() {
  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account is not defined in authContext");

  const accountId = authContext.account.id;

  return useQuery<Address[], Error>({
    queryFn: async () => {
      return (await api.axios.get<Address[]>(api.routes.account(accountId).addresses)).data;
    },
    queryKey: ["addresses"],
  });
}
