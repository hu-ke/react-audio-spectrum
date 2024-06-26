import * as React from 'react';
import { useEffect, useRef } from 'react';
import { getRandomId } from './utils';

type ColorItem = {
  stop: number,
  color: string,
}

type ComponentProps = {
  id: string,
  width?: number,
  height?: number,
  audioId?: string,
  audioEle?: HTMLElement,
  capColor?: string,
  capHeight?: number,
  meterWidth?: number,
  meterColor?: string | ColorItem[],
  meterCount?: number,
  gap?: number,
  silent?: boolean,
};

enum PLAY_STATUS {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING'
}


export default function ReactAudioSpectrum(props: ComponentProps) {
  const { 
    id = getRandomId(50), 
    audioId, audioEle, 
    width=300, height=200, 
    capColor='#FFF', capHeight=2, meterColor=[
      {stop: 0, color: '#f00'},
      {stop: 0.5, color: '#0CD7FD'},
      {stop: 1, color: 'red'}
    ],
    gap=10,
    meterCount=160, meterWidth=2,
    silent=false
  } = props;
  const _audioEleRef = useRef<HTMLElement>()
  const _audioCanvasRef = useRef<HTMLCanvasElement>()
  const _playStatusRef = useRef<PLAY_STATUS>()
  const _audioContextRef = useRef<AudioContext>()
  const _audioAnalyserRef = useRef<AnalyserNode>()
  const _mediaEleSourceRef = useRef<MediaElementAudioSourceNode>()
  const _animationIdRef = useRef<number>()

  const prepareElements = () => {
    if (!audioId && !audioEle) {
      console.error('target audio not found!');
      return
    } else if (audioId) {
      _audioEleRef.current = document.getElementById(audioId);
    } else {
      _audioEleRef.current = audioEle
    }
    _audioCanvasRef.current = document.getElementById(id) as HTMLCanvasElement
  }

  const handleBrowserVendors = () => {
    // fix browser vender for AudioContext and requestAnimationFrame
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
  }

  const createAndConnect = (audioEle: HTMLElement) => {
    // set audioContext
    try {
      _audioContextRef.current = new window.AudioContext();
    } catch (e) {
      console.error('Your browser does not support AudioContext', e)
    }
    // create and config Analyser
    if (!_audioAnalyserRef.current) {
      _audioAnalyserRef.current = _audioContextRef.current.createAnalyser()
      _audioAnalyserRef.current.smoothingTimeConstant = 0.8
      _audioAnalyserRef.current.fftSize = 2048
    }
    // create MediaElementSource and connect with both analyser and audioContext
    if (!_mediaEleSourceRef.current) {
      // @ts-ignore
      _mediaEleSourceRef.current = _audioContextRef.current.createMediaElementSource(audioEle)
      _mediaEleSourceRef.current.connect(_audioAnalyserRef.current)
      if (!silent) {
        _mediaEleSourceRef.current.connect(_audioContextRef.current.destination);
      }
    }
  }

  const drawSpectrum = () => {
    let cwidth = width
    let cheight = height - capHeight
    let capYPositionArray = [] as number[] // store the vertical position of hte caps for the preivous frame
    let ctx = _audioCanvasRef.current.getContext('2d')
    let gradient = null as string | CanvasGradient;
    gradient = ctx.createLinearGradient(0, 0, 0, cheight)

    if (meterColor.constructor === Array) {
      let stops = meterColor
      let len = stops.length
      for (let i = 0; i < len; i++) {
        gradient.addColorStop(stops[i]['stop'], stops[i]['color'])
      }
    } else if (typeof meterColor === 'string') {
      gradient = meterColor
    }

    let drawMeter = () => {
      let array = new Uint8Array(_audioAnalyserRef.current.frequencyBinCount); // item value of array: 0 - 255
      _audioAnalyserRef.current.getByteFrequencyData(array);
      if (_playStatusRef.current === PLAY_STATUS.PAUSED) {
        for (let i = array.length - 1; i >= 0; i--) {
          array[i] = 0
        }
        let allCapsReachBottom = !capYPositionArray.some(cap => cap > 0)
        if (allCapsReachBottom) {
          ctx.clearRect(0, 0, cwidth, cheight + capHeight)
          cancelAnimationFrame(_animationIdRef.current) // since the sound is top and animation finished, stop the requestAnimation to prevent potential memory leak,THIS IS VERY IMPORTANT!
          return
        }
      }
      let step = Math.round(array.length / meterCount) // sample limited data from the total array
      ctx.clearRect(0, 0, cwidth, cheight + capHeight)
      for (let i = 0; i < meterCount; i++) {
        let value = array[i * step] // pick one value out of every 2(step)
        if (capYPositionArray.length < Math.round(meterCount)) {
          capYPositionArray.push(value)
        };
        ctx.fillStyle = capColor
        // draw the cap, with transition effect
        if (value < capYPositionArray[i]) {
          // let y = cheight - (--capYPositionArray[i])
          let preValue = --capYPositionArray[i]
          let y = (256 - preValue) * cheight / 256
          ctx.fillRect(i * (meterWidth + gap), y, meterWidth, capHeight)
        } else {
          // let y = cheight - value
          let y = (256 - value) * cheight / 256
          ctx.fillRect(i * (meterWidth + gap), y, meterWidth, capHeight)
          capYPositionArray[i] = value
        };
        ctx.fillStyle = gradient; // set the filllStyle to gradient for a better look

        // let y = cheight - value + capHeight
        let y = (256 - value) * (cheight) / 256 + capHeight
        ctx.fillRect(i * (meterWidth + gap), y, meterWidth, cheight) // the meter
      }
      _animationIdRef.current = requestAnimationFrame(drawMeter)
    }
    _animationIdRef.current = requestAnimationFrame(drawMeter)
  }

  const initAudioEvents = () => {
    if (_audioEleRef.current) {
      _audioEleRef.current.onpause = (e) => {
        _playStatusRef.current = PLAY_STATUS.PAUSED
      }
      _audioEleRef.current.onplay = (e) => {
        _playStatusRef.current = PLAY_STATUS.PLAYING
        createAndConnect(_audioEleRef.current)
        drawSpectrum()
      }
    }
  }
  
  useEffect(() => {
    prepareElements()
    handleBrowserVendors()
    initAudioEvents()
  }, [])

  return (
    <canvas id={id} width={width} height={height}></canvas>
  );
}
