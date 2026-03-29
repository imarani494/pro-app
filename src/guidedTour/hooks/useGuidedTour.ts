import { useAppSelector } from "@/shared/lib/hooks";
import { RootState } from "@/shared/lib/store";

export function useGuidedTour() {
  return useAppSelector((state: RootState) => state.guidedTour);
}
