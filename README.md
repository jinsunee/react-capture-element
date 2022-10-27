# react-capture-element

react-capture-element allows you to capture all React Element, including images, pdf.

![NPM version](https://img.shields.io/npm/v/react-capture-element)
![License](http://img.shields.io/npm/l/dooboo-ui-legacy.svg?style=flat-square)

## Preview

<p align="center">
  <img src="https://user-images.githubusercontent.com/31176502/198377589-aaa2ad58-9106-4968-9166-8924af0dd92b.gif" />
</p>

## Installation

```
$ yarn add react-capture-element
```

## How to run example code

```
$ git clone https://github.com/jinsunee/react-capture-element.git
$ cd react-capture-element
$ yarn
$ yarn storybook
```

## Full code of example

```
import React, { useState } from "react";
import { CaptureElement } from "../src";

export default function Example() {
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
        <CaptureElement onCapture={({ dataUrl, blob }) => setDataUrl(dataUrl)}>
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
                  backgroundColor: 'purple',
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

```
