---
title: 5.Play in silent
order: 5
---

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactAudioSpectrum from 'react-audio-spectrum';

function App() {
  return (
    <div>
      <audio id="audio-element5"
        src="https://reader.guru/medias/How-Long-Will-I-Love-You.mp3"
        autoPlay
        crossOrigin='anonymous'
        controls
      >
      </audio>
      <ReactAudioSpectrum
        silent
        id="audio-canvas5"
        audioId={'audio-element5'}
      />
    </div>
  );
}

ReactDOM.render((
  <App />
), mountNode);
```
