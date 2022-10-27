# react-element-capture

## Install

```
yarn add react-capture-element
```

## Usage

```
import React from 'react';

export function Example() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          border: "1px solid green",
          overflow: "hidden",
          width: 400,
          height: 400,
        }}
      >
        <CaptureElement onCapture={({ dataUrl, blob }) => console.log(dataUrl)}>
          {({ startCapture }) => (
            <>
              <button onClick={startCapture}>start Capture</button>
              <div
                style={{
                  backgroundColor: 'red',
                  height: 300,
                  width: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
                onClick={startCapture}
              >
                Capture me!
              </div>
            </>
          )}
        </CaptureElement>
      </div>
    </div>
  )
}
```
