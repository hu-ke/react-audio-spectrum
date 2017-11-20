# React Audio Spectrum
> An audio spectrum visualizer for react.

![](https://hu-ke.github.io/react-audio-spectrum/react-audio-spectrum-demo.gif)
## Live Demo
> https://hu-ke.github.io/react-audio-spectrum/

## Getting Started
```
<audio id="audio-element"
  src="path/to/your/song.mp3"
  autoPlay
>
</audio>
<AudioSpectrum
  id="audio-canvas"
  height={200}
  width={300}
  audioId={'audio-element'}
  capColor={'red'}
  capHeight={2}
  meterWidth={2}
  meterCount={512}
  meterColor={[
    {stop: 0, color: '#f00'},
    {stop: 0.5, color: '#0CD7FD'},
    {stop: 1, color: 'red'}
  ]}
  gap={4}
/>
```
## Props
| property | description | type|default| isRequired |
|---------|---------|-------------|---------|--------|
| id| canvas id|number/string| a random string|false|
|width|canvas width|number|300|false|
|height|canvas height|number|200|false|
|audioId|id of the target audio element|number/string| - |true|
|capColor|color of caps|string|#FFF|false|
|capHeight|height of caps|string|2|false|
|meterWidth|width of meters|number|2|false|
|meterColor|color of meters|string/array|[{stop: 0, color: '#f00'},{stop: 0.5, color: '#0CD7FD'},{stop: 1, color: 'red'}]|false|
|gap|gap between meters|number|10|false|
## Install
```
yarn add react-audio-spectrum --save
or
npm install react-audio-spectrum --save
```
## Contributing
react-audio-spectrum is a free and open source react library, and I appreciate any help you're willing to give - whether it's fixing bugs, improving documentation, or suggesting new features.
