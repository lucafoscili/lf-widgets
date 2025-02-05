import { LfTabbarScroll } from "@lf-widgets/foundations";

export const triggerScroll = (
  container: HTMLDivElement,
  direction: LfTabbarScroll,
) => {
  const scrollAmount = 200;
  if (container) {
    const currentScroll = container.scrollLeft;
    const newScroll =
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;
    container.scrollTo({ left: newScroll, behavior: "smooth" });
  }
};
