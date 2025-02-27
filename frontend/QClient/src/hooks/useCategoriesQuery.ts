import { useQuery } from "@tanstack/react-query";
import api from "src/api";
import { Category } from "src/api/types/Category";

export default function useCategoriesQuery() {
  return useQuery<Category[], Error>({
    queryFn: api.fetchCategories.queryFn,
    queryKey: api.fetchCategories.queryKey(),
  });
}
