import { useQuery } from "@tanstack/react-query";
import api from "src/api";
import { Category } from "src/api/types/Category";

export default function useCategoriesQuery() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: api.fetchCategories,
  });
}
