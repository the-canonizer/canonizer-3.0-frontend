import { useWindowSize } from "./useWindowSize";

export const useIsMobile = () => {
  const { width: windowWidth } = useWindowSize();
  const isBrowserMobile = !!windowWidth && windowWidth < 1024;

  return isBrowserMobile;
};
