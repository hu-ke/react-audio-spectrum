---
title: 4.Meters with specified width
order: 4
---

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactAudioSpectrum from 'react-audio-spectrum';

function App() {
  return (
    <div>
      <audio id="audio-element4"
        src="https://reader.guru/medias/How-Long-Will-I-Love-You.mp3"
        autoPlay
        crossOrigin='anonymous'
        controls
      >
      </audio>
      <ReactAudioSpectrum
        id="audio-canvas4"
        height={200}
        width={300}
        audioId={'audio-element4'}
        meterWidth={10}
        gap={4}
      />
    </div>
  );
}

ReactDOM.render((
  <App />
), mountNode);
```
