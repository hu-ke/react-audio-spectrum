import React, { Component } from 'react';
import './App.css';
import './assets/iconfont/iconfont.css'
import AudioSpectrum from 'react-audio-spectrum'
import HowLongWillILoveYou from './assets/media/How-Long-Will-I-Love-You.mp3'
import boydontcry from './assets/media/boydontcry.mp3'
import CantStandTheRain from './assets/media/CantStandTheRain.mp3'
import HoneyHoney from './assets/media/HoneyHoney.mp3'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      audioStatus: 'PAUSED',
      audioStatus1: 'PAUSED',
      audioStatus2: 'PAUSED',
      audioStatus3: 'PAUSED',
    }
    this.audioEle = null
    this.audioEle1 = null
    this.audioEle2 = null
    this.audioEle3 = null
    this.playlist = [boydontcry, HowLongWillILoveYou, CantStandTheRain, HoneyHoney]
    this.playInfoList = [{
      song: '男孩别哭',
      player: '海龟先生',
    }, {
      song: 'How Long Will I Love You',
      player: 'Ellie Goulding'
    }, {
      song: `Can't Stand The Rain`,
      player: 'The Rescues'
    }, {
      song: 'Honey Honey',
      player: '孙燕姿'
    }]
  }
  componentDidMount() {
    this.audioEle = document.getElementById('audio-element')
    this.audioEle1 = document.getElementById('audio-element1')
    this.audioEle2 = document.getElementById('audio-element2')
    this.audioEle3 = document.getElementById('audio-element3')

    this.audioEle1.oncanplay = (e) => {
      // safari不允许自动播放
      if (this.isSafari()) {
        return
      }
      this.play1()
    }
  }
  isSafari = () => {
    return window.navigator.userAgent.indexOf('Safari') > -1 && window.navigator.userAgent.indexOf('Chrome') === -1
  }
  pause = () => {
    this.audioEle.pause()
    this.setState({
      audioStatus: 'PAUSED'
    })
  }
  play = () => {
    this.audioEle.play()
    this.setState({
      audioStatus: 'PLAYING'
    })
  }

  pause1 = () => {
    this.audioEle1.pause()
    this.setState({
      audioStatus1: 'PAUSED'
    })
  }
  play1 = () => {
    this.audioEle1.play()
    this.setState({
      audioStatus1: 'PLAYING'
    })
  }

  pause2 = () => {
    this.audioEle2.pause()
    this.setState({
      audioStatus2: 'PAUSED'
    })
  }
  play2 = () => {
    this.audioEle2.play()
    this.setState({
      audioStatus2: 'PLAYING'
    })
  }

  pause3 = () => {
    this.audioEle3.pause()
    this.setState({
      audioStatus3: 'PAUSED'
    })
  }
  play3 = () => {
    this.audioEle3.play()
    this.setState({
      audioStatus3: 'PLAYING'
    })
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="card">
            {
              this.state.audioStatus === 'PAUSED' ? (
                <i onClick={this.play} className="iconfont icon-play"></i>
              ) : <i onClick={this.pause} className="iconfont icon-pause"></i>
            }<br/>
            <audio id="audio-element"
              preload="true"
              src={`${this.playlist[0]}`}
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
            <p>meters with gradient colors</p>
          </div>
          <div className="card">
            {
              this.state.audioStatus1 === 'PAUSED' ? (
                <i onClick={this.play1} className="iconfont icon-play"></i>
              ) : <i onClick={this.pause1} className="iconfont icon-pause"></i>
            }<br/>
            <audio id="audio-element1"
              src={`${this.playlist[1]}`}
            >
            </audio>
            <AudioSpectrum
              height={200}
              width={300}
              audioId={'audio-element1'}
              capColor={'red'}
              capHeight={2}
              meterWidth={10}
              meterCount={512}
              meterColor={[
                {stop: 0, color: 'orange'},
                {stop: 0.5, color: 'red'},
                {stop: 1, color: '#FFF'}
              ]}
              gap={4}
            />
            <p>meterWidth: 10</p>
          </div>
          <div className="card">
            {
              this.state.audioStatus2 === 'PAUSED' ? (
                <i onClick={this.play2} className="iconfont icon-play"></i>
              ) : <i onClick={this.pause2} className="iconfont icon-pause"></i>
            }<br/>
            <audio id="audio-element2"
              preload="true"
              src={`${this.playlist[2]}`}
            >
            </audio>
            <AudioSpectrum
              height={200}
              width={300}
              audioId={'audio-element2'}
              capColor={'red'}
              capHeight={2}
              meterWidth={2}
              meterCount={512}
              meterColor={[
                {stop: 0, color: 'pink'},
                {stop: 1, color: 'red'}
              ]}
              gap={1}
            />
            <p>meterCount: 20<br/>gap: 1</p>
          </div>
          {
            !this.isSafari() && <div className="card">
              {
                this.state.audioStatus3 === 'PAUSED' ? (
                  <i onClick={this.play3} className="iconfont icon-play"></i>
                ) : <i onClick={this.pause3} className="iconfont icon-pause"></i>
              }<br/>
              <audio id="audio-element3"
                preload="true"
                src={`${this.playlist[3]}`}
              >
              </audio>
              <AudioSpectrum
                height={200}
                width={300}
                audioId={'audio-element3'}
                capColor={'#92BF3F'}
                capHeight={10}
                meterWidth={10}
                meterCount={20}
                meterColor={'#41BF3F'}
                gap={10}
              />
              <p>gap: 10<br/> capHeight:10 <br/> capColor: '#92BF3F <br/> meterColor: '#41BF3F'}</p>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
