import { useQuery } from "react-query";
import api from "../api";

export default function useApiCategories() {
  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: api.fetchCategories,
  });

  return categoryQuery;
}
