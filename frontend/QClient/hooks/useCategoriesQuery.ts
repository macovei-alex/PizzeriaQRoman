import { useQuery } from "react-query";
import api from "@/api";
import { Category } from "@/api/types/Category";

export default function useCategoriesQuery() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: api.fetchCategories,
  });
}
