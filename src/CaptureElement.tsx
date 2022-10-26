import styled from "@emotion/styled";
import html2canvas from "html2canvas";
import React, { ReactNode, useEffect, useState } from "react";

import { useElementSize } from "./useElementSize";
import { isTouchEvent } from "./utils";

interface Props {
  onCapture: ({
    blob,
    dataUrl,
  }: {
    blob: Blob | null;
    dataUrl: string;
  }) => void;
  children: (props: {
    isStartCapture: boolean;
    startCapture: () => void;
    cropPositionTop: number;
    cropPositionLeft: number;
    cropWidth: number;
    cropHeight: number;
  }) => ReactNode;
}

export function CaptureElement({ onCapture, children }: Props) {
  const { elementWidth, elementHeight } = useElementSize(
    document.getElementById("wrapper")
  );

  const [isStartCapture, setIsStartCapture] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [elementPositionLeft, setElementPositionLeft] = useState<number>(0);
  const [elementPositionTop, setElementPositionTop] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [cropPositionTop, setCropPositionTop] = useState<number>(0);
  const [cropPositionLeft, setCropPositionLeft] = useState<number>(0);
  const [cropWidth, setCropWidth] = useState<number>(0);
  const [cropHeight, setCropHeight] = useState<number>(0);
  const [borderWidth, setBorderWidth] = useState<any>(1);
  const [crossHairsTop, setCrossHairsTop] = useState<number>(0);
  const [crossHairsLeft, setCrossHairsLeft] = useState<number>(0);

  useEffect(() => {
    const wrapper = document.getElementById("wrapper");

    if (wrapper != null) {
      const { x, y } = wrapper?.getBoundingClientRect();
      setElementPositionLeft(x);
      setElementPositionTop(y);
    }
  }, []);

  const handleStart = (e: any) => {
    const isMobile = isTouchEvent(e);
    if (
      !isStartCapture ||
      (isMobile && (e.touches == null || e.touches[0] == null))
    )
      return;

    let startX = isMobile ? e.touches[0].clientX : e.clientX;
    let startY = isMobile ? e.touches[0].clientY : e.clientY;
    startX -= elementPositionLeft;
    startY -= elementPositionTop;

    setStartX(startX);
    setStartY(startY);
    setCropPositionTop(startY);
    setCropPositionLeft(startX);
    setIsMouseDown(true);
  };

  const handleMove = (e: any) => {
    const isMobile = isTouchEvent(e);

    if (
      !isStartCapture ||
      (isMobile && (e.touches == null || e.touches[0] == null))
    )
      return;

    let cropPositionTop = startY;
    let cropPositionLeft = startX;

    let endX = isMobile ? e.touches[0].clientX : e.clientX;
    let endY = isMobile ? e.touches[0].clientY : e.clientY;
    endX -= elementPositionLeft;
    endY -= elementPositionTop;

    const isStartTop = endY >= startY;
    const isStartBottom = endY <= startY;
    const isStartLeft = endX >= startX;
    const isStartRight = endX <= startX;

    const isStartTopLeft = isStartTop && isStartLeft;
    const isStartTopRight = isStartTop && isStartRight;
    const isStartBottomLeft = isStartBottom && isStartLeft;
    const isStartBottomRight = isStartBottom && isStartRight;
    let newBorderWidth = borderWidth;
    let cropWidth = 0;
    let cropHeight = 0;

    if (isMouseDown) {
      if (isStartTopLeft) {
        newBorderWidth = `${startY}px ${elementWidth - endX}px ${
          elementHeight - endY
        }px ${startX}px`;
        cropWidth = endX - startX;
        cropHeight = endY - startY;
      }

      if (isStartTopRight) {
        newBorderWidth = `${startY}px ${elementWidth - startX}px ${
          elementHeight - endY
        }px ${endX}px`;
        cropWidth = startX - endX;
        cropHeight = endY - startY;
        cropPositionLeft = endX;
      }

      if (isStartBottomLeft) {
        newBorderWidth = `${endY}px ${elementWidth - endX}px ${
          elementHeight - startY
        }px ${startX}px`;
        cropWidth = endX - startX;
        cropHeight = startY - endY;
        cropPositionTop = endY;
      }

      if (isStartBottomRight) {
        newBorderWidth = `${endY}px ${elementWidth - startX}px ${
          elementHeight - startY
        }px ${endX}px`;
        cropWidth = startX - endX;
        cropHeight = startY - endY;
        cropPositionLeft = endX;
        cropPositionTop = endY;
      }
    }

    cropWidth *= window.devicePixelRatio;
    cropHeight *= window.devicePixelRatio;

    setCrossHairsLeft(endX + elementPositionLeft);
    setCrossHairsTop(endY + elementPositionTop);
    setBorderWidth(newBorderWidth);
    setCropWidth(cropWidth);
    setCropHeight(cropHeight);
    setCropPositionTop(cropPositionTop);
    setCropPositionLeft(cropPositionLeft);
  };

  const handleEnd = () => {
    if (!isStartCapture) return;

    setBorderWidth(0);

    setTimeout(() => {
      handleClickTakeScreenShot();
    }, 0);
    setIsStartCapture(false);
    setIsMouseDown(false);
  };

  const handleClickTakeScreenShot = async () => {
    const body = document.querySelector("body");

    if (body) {
      const canvas = await html2canvas(body);

      const croppedCanvas = document.createElement("canvas");
      const croppedCanvasContext = croppedCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;

      if (croppedCanvasContext && croppedCanvas) {
        (croppedCanvasContext as CanvasRenderingContext2D).drawImage(
          canvas,
          (elementPositionLeft + cropPositionLeft) * window.devicePixelRatio,
          (elementPositionTop + cropPositionTop) * window.devicePixelRatio,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );

        croppedCanvas.toBlob((blob) => {
          onCapture({ blob, dataUrl: croppedCanvas.toDataURL() });
        });
      }
    }

    setCrossHairsLeft(0);
    setCrossHairsTop(0);
  };

  return (
    <Container
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
    >
      <div id="wrapper" className="wrapper">
        {children({
          startCapture: () => setIsStartCapture(true),
          isStartCapture,
          cropPositionTop,
          cropPositionLeft,
          cropWidth: cropWidth / window.devicePixelRatio,
          cropHeight: cropHeight / window.devicePixelRatio,
        })}
        {isStartCapture && (
          <div
            className={`overlay ${isMouseDown && "highlighting"}`}
            style={{ borderWidth: borderWidth }}
          />
        )}
      </div>
      {isStartCapture && (
        <div
          className="crosshairs"
          style={{ left: crossHairsLeft + "px", top: crossHairsTop + "px" }}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;

  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .overlay.highlighting {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: none;
    border-color: rgba(0, 0, 0, 0.5);
    border-style: solid;
  }

  .crosshairs {
    position: fixed;
    width: 100%;
    z-index: 2147483645;
  }

  .crosshairs.hidden {
    display: none;
  }

  .crosshairs::before,
  .crosshairs::after {
    content: "";
    position: absolute;
  }

  .crosshairs::before {
    height: 24px;
    width: 2px;
    background: #000;
    top: -11px;
  }

  .crosshairs::after {
    width: 24px;
    height: 2px;
    background: #000;
    left: -11px;
  }

  .crosshairs,
  .crosshairs:before,
  .crosshairs:after,
  .overlay,
  .overlay:before,
  .overlay:after {
    box-sizing: border-box;
  }
`;
