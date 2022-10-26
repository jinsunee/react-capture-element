import { useEffect, useState } from "react";

export function useElementSize(element: any) {
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [elementHeight, setElementHeight] = useState<number>(0);

  useEffect(() => {
    function onChangeElementSize(callback: () => void) {
      let oldWidth = element.clientWidth,
        newWidth,
        oldHeight = element.clientHeight,
        newHeight;

      (function run() {
        newWidth = element.clientWidth;
        newHeight = element.clientHeight;
        if (oldWidth !== newWidth || oldHeight !== newHeight) callback();

        oldWidth = newWidth;
        oldHeight = newHeight;

        if (element.onElementHeightChangeTimer) {
          clearTimeout(element.onElementHeightChangeTimer);
        }

        element.onElementHeightChangeTimer = setTimeout(run, 200);
      })();
    }

    if (element != null) {
      const { clientWidth, clientHeight } = element;

      setElementWidth(clientWidth);
      setElementHeight(clientHeight);

      onChangeElementSize(() => {
        const { clientWidth, clientHeight } = element;
        setElementWidth(clientWidth);
        setElementHeight(clientHeight);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element]);

  return { elementWidth, elementHeight };
}
