import { useQuery } from "@tanstack/react-query";
import { resApi } from "src/api";
import { Category } from "src/api/types/Category";

export default function useCategoriesQuery() {
  return useQuery<Category[], Error>({
    queryFn: async () => {
      return (await resApi.axios.get(`/category/all`)).data as Category[];
    },
    queryKey: ["categories"],
  });
}
