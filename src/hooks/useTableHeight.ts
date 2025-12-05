import { useViewportStore } from "@itsa-develop/itsa-fe-components";


export const useHeightTable = (heightFilter: number = 430) => {
  const width = useViewportStore((state) => state.width);
  const viewportHeight =
    typeof window !== "undefined" && typeof window.innerHeight === "number"
      ? window.innerHeight
      : 0;

  if (width > 768) {
    return viewportHeight * 0.667;
  }

  const computed = viewportHeight - heightFilter;
  return computed > 0 ? computed : 0;
};
