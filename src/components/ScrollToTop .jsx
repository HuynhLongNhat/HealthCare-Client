import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    let start = null;
    const duration = 300; // 👉 thời gian cuộn (ms)
    const from = window.scrollY;
    const to = 0;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);
      window.scrollTo(0, from + (to - from) * percent);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
