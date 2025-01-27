import { useQuery } from "react-query";
import api from "../api";

export default function useApiCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: api.fetchCategories,
  });
}
