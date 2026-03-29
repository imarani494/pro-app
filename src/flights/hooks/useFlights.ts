import { useAppSelector } from "@/shared/lib/hooks";
import { RootState } from "@/shared/lib/store";

export function useFlights() {
  return useAppSelector((state: RootState) => state.flights);
}
