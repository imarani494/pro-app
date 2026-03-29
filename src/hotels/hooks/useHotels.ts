import { RootState } from "@/shared/lib/store";
import { useSelector } from "react-redux";

export function useHotels() {
  return useSelector((state: RootState) => state.hotel);
}
