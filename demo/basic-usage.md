---
title: 1.Basic usage
order: 1
---

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactAudioSpectrum from 'react-audio-spectrum';

function App() {
  return (
    <div>
      <audio id="audio-element"
        src="https://reader.guru/medias/How-Long-Will-I-Love-You.mp3"
        autoPlay
        crossOrigin='anonymous'
        controls
      >
      </audio>
      <ReactAudioSpectrum
        id="audio-canvas"
        audioId={'audio-element'}
      />
    </div>
  );
}

ReactDOM.render((
  <App />
), mountNode);
```
