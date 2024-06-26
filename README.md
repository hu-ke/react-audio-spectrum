# React Audio Spectrum
> An audio spectrum visualizer for react.

![](https://hukepublicbucket.oss-cn-hangzhou.aliyuncs.com/react-audio-spectrum/react-audio-spectrum-demo.gif)
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
### you can also pass audio element to the component
```
this.audioEle = new Audio('path/to/your/song.mp3) 
<AudioSpectrum
  id="audio-canvas"
  height={200}
  width={300}
  audioEle={this.audioEle}
/>
```
if you use both `audioId` and `audioEle` props, the component will ignore `audioEle`.
### How to fix `CORS` issue?
if you encounter the console error like: `MediaElementAudioSource outputs zeroes due to CORS access restrictions` That means your web application attempts to access resources (like MP3 files) from a different origin (domain, protocol, or port) without the appropriate CORS headers being set by the server hosting the resource. Here is the nginx sample config to resolve CORS errors:
```bash
location / {
    add_header 'Access-Control-Allow-Origin' '*';
}
```
Or, if you are specifying allowed origins:
```bash
location / {
    add_header 'Access-Control-Allow-Origin' 'https://your-website.com';
}
```
Further more, you need to add the `crossOrigin` attribute to your `audio` element:
```
<audio id="audio-element1"
  src="https://reader.guru/medias/How-Long-Will-I-Love-You.mp3"
  crossOrigin="anonymous"
>
```
The link `https://reader.guru/medias/How-Long-Will-I-Love-You.mp3` has been configured with `Access-Control-Allow-Origin` header, you can use it for testing.

## Props
| property | description | type|default| isRequired |
|---------|---------|-------------|---------|--------|
| id| canvas id|number/string| a random string|false|
|width|canvas width|number|300|false|
|height|canvas height|number|200|false|
|audioId|id of the target audio element|number/string| - |false|
|audioEle|target audio element|audio object| - |false|
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
