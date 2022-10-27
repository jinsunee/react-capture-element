import React, { useState } from "react";
import { CaptureElement } from "../src";

export default function Example({
  backgroundColor = "purple",
}: {
  backgroundColor: string;
}) {
  const [dataUrl, setDataUrl] = useState<string>();

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
          width: 400,
          height: 400,
        }}
      >
        <CaptureElement onCapture={({ dataUrl }) => setDataUrl(dataUrl)}>
          {({
            captureMode,
            captureStatus,
            onStartCapture,
            onStopCapture,
            onResetCapture,
            cropPositionLeft,
            cropPositionTop,
            cropWidth,
            cropHeight,
          }) => (
            <>
              <button onClick={onStartCapture}>start Capture</button>
              <div
                style={{
                  backgroundColor,
                  height: 300,
                  width: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Capture me!
              </div>
              {captureStatus === "DONE" && captureMode === "ON" && (
                <div
                  style={{
                    position: "absolute",
                    left: cropPositionLeft + cropWidth - 20,
                    top: cropPositionTop + cropHeight,
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
          <img alt="data-url-image" src={dataUrl} style={{ width: 300 }} />
        )}
      </div>
    </div>
  );
}
