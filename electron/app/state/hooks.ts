import _ from "lodash";
import {
  useEffect,
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import ResizeObserver from "resize-observer-polyfill";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

import {
  mousePosition,
  destinationTop,
  previousLayout,
  liveTop,
  baseLayout,
} from "./atoms";

export const useTrackMousePosition = () => {
  let timeout;
  const setMousePosition = useSetRecoilState(mousePosition);

  const updateMousePosition = (event) => {
    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }
    timeout = window.requestAnimationFrame(() => {
      setMousePosition([event.clientX, event.clientY]);
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);
};

export const useScrollListener = (ref, setFirst, setSecond) => {
  const [liveTopValue, setLiveTop] = useRecoilState(liveTop);
  const firstBaseLayoutValue = useRecoilValue(baseLayout(0));
  const secondBaseLayoutValue = useRecoilValue(baseLayout(1));

  useLayoutEffect(() => {
    let timeout;
    const updateTop = (event) => {
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }
      timeout = window.requestAnimationFrame(() => {
        setLiveTop(event.target.scrollTop);
      });
    };
    const target = ref.current;
    ref.current && ref.current.addEventListener("scroll", updateTop);

    return () => target && target.removeEventListener("scroll", updateTop);
  }, [ref.current, liveTopValue]);

  useLayoutEffect(() => {
    setFirst({
      y: firstBaseLayoutValue.y,
      height: firstBaseLayoutValue.height,
    });
    setSecond({
      y: secondBaseLayoutValue.y,
      height: secondBaseLayoutValue.height,
    });
  }, [liveTopValue]);
};

export const useResizeObserver = () => {
  const [entry, setEntry] = useState({});
  const [node, setNode] = useState(null);
  const observer = useRef(null);

  const disconnect = useCallback(() => {
    const { current } = observer;
    current && current.disconnect();
  }, []);

  const observe = useCallback(
    _.debounce(() => {
      observer.current = new ResizeObserver(([entry]) => setEntry(entry));
      node && observer.current.observe(node);
    }, 500),
    [node]
  );

  useLayoutEffect(() => {
    observe();
    return () => disconnect();
  }, [disconnect, observe]);

  return [setNode, entry];
};
