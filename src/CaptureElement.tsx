import styled from "@emotion/styled";
import html2canvas from "html2canvas";
import * as React from "react";

import { useElementSize } from "./useElementSize";
import { isTouchEvent } from "./utils";

const { useState, useEffect, useCallback, useRef } = React;

type CaptureMode = "ON" | "OFF";
type CaptureStatus = "NOT_YET" | "IN_PROGRESS" | "DONE";

interface Props {
  onCapture: ({
    blob,
    dataUrl,
  }: {
    blob: Blob | null;
    dataUrl: string;
  }) => void;
  cursorColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  children: (props: {
    captureMode: CaptureMode;
    captureStatus: CaptureStatus;
    onStartCapture: () => void;
    onStopCapture: () => void;
    onResetCapture: () => void;
    cropPositionTop: number;
    cropPositionLeft: number;
    cropWidth: number;
    cropHeight: number;
  }) => React.ReactNode;
}

export function CaptureElement({
  onCapture,
  cursorColor = "#000",
  overlayColor = "#000",
  overlayOpacity = 0.5,
  children,
}: Props) {
  const { elementWidth, elementHeight } = useElementSize(
    document.getElementById("content")
  );

  const [captureMode, setCaptureMode] = useState<CaptureMode>("OFF");
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>("NOT_YET");
  const [elementPositionLeft, setElementPositionLeft] = useState<number>(0);
  const [elementPositionTop, setElementPositionTop] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [cropPositionTop, setCropPositionTop] = useState<number>(0);
  const [cropPositionLeft, setCropPositionLeft] = useState<number>(0);
  const [cropWidth, setCropWidth] = useState<number>(0);
  const [cropHeight, setCropHeight] = useState<number>(0);
  const initialBorderWidth = useRef<string>("");
  const [borderWidth, setBorderWidth] = useState<string>();
  const [crossHairsTop, setCrossHairsTop] = useState<number>(0);
  const [crossHairsLeft, setCrossHairsLeft] = useState<number>(0);
  const [showCursor, setShowCursor] = useState<boolean>(false);

  const handleStart = (e: any) => {
    const isMobile = isTouchEvent(e);
    if (
      captureMode === "OFF" ||
      captureStatus !== "NOT_YET" ||
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
    setCaptureStatus("IN_PROGRESS");
  };

  const handleMove = (e: any) => {
    const isMobile = isTouchEvent(e);

    if (
      captureMode === "OFF" ||
      (isMobile && (e.touches == null || e.touches[0] == null))
    )
      return;

    let endX = isMobile ? e.touches[0].clientX : e.clientX;
    let endY = isMobile ? e.touches[0].clientY : e.clientY;
    endX -= elementPositionLeft;
    endY -= elementPositionTop;

    setCrossHairsLeft(endX + elementPositionLeft);
    setCrossHairsTop(endY + elementPositionTop);

    if (captureStatus === "IN_PROGRESS") {
      let cropPositionTop = startY;
      let cropPositionLeft = startX;

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

      cropWidth *= window.devicePixelRatio;
      cropHeight *= window.devicePixelRatio;

      setBorderWidth(newBorderWidth);
      setCropWidth(cropWidth);
      setCropHeight(cropHeight);
      setCropPositionTop(cropPositionTop);
      setCropPositionLeft(cropPositionLeft);
    }
  };

  const handleEnd = () => {
    if (captureMode === "OFF" || captureStatus !== "IN_PROGRESS") return;
    if (
      initialBorderWidth.current != null &&
      borderWidth === initialBorderWidth.current
    ) {
      setCaptureStatus("NOT_YET");
      return;
    }

    handleClickTakeScreenShot();
    setCaptureStatus("DONE");
    setCrossHairsLeft(0);
    setCrossHairsTop(0);
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
  };

  const handleStartCapture = useCallback(() => setCaptureMode("ON"), []);

  const handleStopCapture = useCallback(() => {
    setCaptureMode("OFF");
    setCaptureStatus("NOT_YET");
    setBorderWidth(initialBorderWidth.current!);
    setCrossHairsLeft(0);
    setCrossHairsTop(0);
  }, []);

  const handleResetCapture = useCallback(() => {
    setBorderWidth(initialBorderWidth.current!);
    setCaptureStatus("NOT_YET");
  }, []);

  useEffect(() => {
    const content = document.getElementById("content");

    if (content != null) {
      const { x, y } = content?.getBoundingClientRect();
      setElementPositionLeft(x);
      setElementPositionTop(y);
    }
  }, []);

  useEffect(() => {
    const borderWidth = `0px ${elementWidth}px ${elementHeight}px 0px`;

    initialBorderWidth.current = borderWidth;
    setBorderWidth(borderWidth);
  }, [elementWidth, elementHeight]);

  useEffect(() => {
    if (captureMode === "ON" && captureStatus !== "DONE") {
      setShowCursor(true);
    } else {
      setShowCursor(false);
    }
  }, [captureMode, captureStatus]);

  return (
    <Container
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={() => {
        if (captureMode === "OFF") return;
        setShowCursor(false);
        handleEnd();
      }}
      onMouseEnter={() => {
        if (captureMode === "OFF") return;
        setShowCursor(true);
      }}
    >
      <Content id="content">
        {children({
          captureMode,
          captureStatus,
          onStartCapture: handleStartCapture,
          onStopCapture: handleStopCapture,
          onResetCapture: handleResetCapture,
          cropPositionTop,
          cropPositionLeft,
          cropWidth: cropWidth / window.devicePixelRatio,
          cropHeight: cropHeight / window.devicePixelRatio,
        })}
        {captureMode === "ON" && (
          <Overlay
            style={{ borderWidth: borderWidth }}
            overlayColor={overlayColor}
            overlayOpacity={overlayOpacity}
          />
        )}
      </Content>
      {showCursor && (
        <Crosshairs
          style={{
            left: crossHairsLeft,
            top: crossHairsTop,
          }}
          cursorColor={cursorColor}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const Overlay = styled.div<{ overlayColor: string; overlayOpacity: number }>`
  background: none;
  border-color: ${({ overlayColor }) => overlayColor};
  opacity: ${({ overlayOpacity }) => overlayOpacity};
  border-style: solid;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Crosshairs = styled.div<{ cursorColor: string }>`
  position: fixed;
  width: 100%;
  z-index: 2147483645;
  box-sizing: border-box;

  &::before,
  &::after {
    content: "";
    position: absolute;
  }

  &::before {
    height: 24px;
    width: 2px;
    background: ${({ cursorColor }) => cursorColor};
    top: -11px;
  }

  &::after {
    width: 24px;
    height: 2px;
    background: ${({ cursorColor }) => cursorColor};
    left: -11px;
  }
`;
