import { useQuery } from "@tanstack/react-query";
import { api } from "src/api";
import { Category } from "src/api/types/Category";

export default function useCategoriesQuery() {
  return useQuery<Category[], Error>({
    queryFn: async () => {
      return (await api.axios.get("/categories")).data as Category[];
    },
    queryKey: ["categories"],
  });
}
