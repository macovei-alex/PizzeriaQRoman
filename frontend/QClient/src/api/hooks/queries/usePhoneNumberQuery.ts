import { useQuery } from "@tanstack/react-query";
import { AccountId } from "src/context/AuthContext";
import { api } from "../..";

export function usePhoneNumberQuery(accountId: AccountId) {
  return useQuery<string, Error>({
    queryFn: async () => (await api.axios.get(api.routes.account(accountId).phoneNumber)).data,
    queryKey: [accountId, "phoneNumber"],
  });
}
