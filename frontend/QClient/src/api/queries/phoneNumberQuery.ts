import { useQuery } from "@tanstack/react-query";
import { AccountId } from "src/context/AuthContext";
import { api } from "..";

export function usePhoneNumberQuery(accountId: AccountId) {
  return useQuery<string, Error>({
    queryFn: async () => {
      const response = await api.axios.get(api.routes.account(accountId).phoneNumber);
      await new Promise((res) => setTimeout(res, 2000));
      return response.data;
    },
    queryKey: [accountId, "phoneNumber"],
  });
}
