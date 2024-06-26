---
title: 3.Meters with caps
order: 3
---

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactAudioSpectrum from 'react-audio-spectrum';

function App() {
  return (
    <div>
      <audio id="audio-element3"
        src="https://reader.guru/medias/How-Long-Will-I-Love-You.mp3"
        autoPlay
        crossOrigin='anonymous'
        controls
      >
      </audio>
      <ReactAudioSpectrum
        id="audio-canvas3"
        height={200}
        width={300}
        audioId={'audio-element3'}
        capColor={'red'}
        capHeight={2}
        meterWidth={2}
        meterCount={512}
        meterColor={[
          {stop: 0, color: '#f00'},
          {stop: 0.5, color: '#0CD7FD'},
          {stop: 1, color: 'green'}
        ]}
        gap={4}
      />
    </div>
  );
}

ReactDOM.render((
  <App />
), mountNode);
```
