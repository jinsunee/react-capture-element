import React, { useState } from "react";
import { CaptureElement } from "../src";

export default function Example() {
  const [dataUrl, setDataUrl] = useState<string>();
  const [size, setSize] = useState<{ width: number; height: number }>();

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          width: 600,
          height: 600,
        }}
      >
        <CaptureElement
          onCapture={({ dataUrl, size }) => {
            setDataUrl(dataUrl);
            setSize(size);
          }}
        >
          {({
            captureMode,
            captureStatus,
            onStartCapture,
            onStopCapture,
            onResetCapture,
            cropPositionLeft,
            cropPositionTop,
          }) => (
            <>
              <button onClick={onStartCapture}>start Capture</button>
              <img
                src={require("./assets/img.jpg")}
                alt=""
                style={{
                  width: "100%",
                  pointerEvents: "none",
                }}
              />
              {captureStatus === "DONE" && captureMode === "ON" && size && (
                <div
                  style={{
                    position: "absolute",
                    left: cropPositionLeft + size.width - 200,
                    top: cropPositionTop + size.height,
                    zIndex: 999,
                  }}
                >
                  <button onClick={onResetCapture}>Reset Capture</button>
                  <button onClick={onStopCapture}>Stop Capture</button>
                </div>
              )}
            </>
          )}
        </CaptureElement>
      </div>
      <div style={{ flex: 1 }}>
        {dataUrl != null && (
          <img alt="data-url-image" src={dataUrl} style={{ ...size }} />
        )}
      </div>
    </div>
  );
}
