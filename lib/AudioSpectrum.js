'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AudioSpectrum = function (_Component) {
  _inherits(AudioSpectrum, _Component);

  function AudioSpectrum(props) {
    _classCallCheck(this, AudioSpectrum);

    var _this = _possibleConstructorReturn(this, (AudioSpectrum.__proto__ || Object.getPrototypeOf(AudioSpectrum)).call(this, props));

    _this.initAudioEvents = function (analyser) {
      var audioEle = _this.audioEle;
      audioEle.onpause = function (e) {
        _this.playStatus = 'PAUSED';
      };
      audioEle.onplay = function (e) {
        _this.playStatus = 'PLAYING';
        _this.drawSpectrum(analyser);
      };
    };

    _this.drawSpectrum = function (analyser) {
      var cwidth = _this.audioCanvas.width;
      var cheight = _this.audioCanvas.height - _this.props.capHeight;
      var capYPositionArray = []; // store the vertical position of hte caps for the preivous frame
      var ctx = _this.audioCanvas.getContext('2d');
      var gradient = ctx.createLinearGradient(0, 0, 0, 300);

      if (_this.props.meterColor.constructor === Array) {
        var stops = _this.props.meterColor;
        var len = stops.length;
        for (var i = 0; i < len; i++) {
          gradient.addColorStop(stops[i]['stop'], stops[i]['color']);
        }
      } else if (typeof _this.props.meterColor === 'string') {
        gradient = _this.props.meterColor;
      }

      var drawMeter = function drawMeter() {
        var array = new Uint8Array(analyser.frequencyBinCount); // item value of array: 0 - 255
        analyser.getByteFrequencyData(array);
        if (_this.playStatus === 'PAUSED') {
          for (var _i = array.length - 1; _i >= 0; _i--) {
            array[_i] = 0;
          }
          var allCapsReachBottom = !capYPositionArray.some(function (cap) {
            return cap > 0;
          });
          if (allCapsReachBottom) {
            ctx.clearRect(0, 0, cwidth, cheight + _this.props.capHeight);
            cancelAnimationFrame(_this.animationId); // since the sound is top and animation finished, stop the requestAnimation to prevent potential memory leak,THIS IS VERY IMPORTANT!
            return;
          }
        }
        var step = Math.round(array.length / _this.props.meterCount); // sample limited data from the total array
        ctx.clearRect(0, 0, cwidth, cheight + _this.props.capHeight);
        for (var _i2 = 0; _i2 < _this.props.meterCount; _i2++) {
          var value = array[_i2 * step];
          if (capYPositionArray.length < Math.round(_this.props.meterCount)) {
            capYPositionArray.push(value);
          };
          ctx.fillStyle = _this.props.capColor;
          // draw the cap, with transition effect
          if (value < capYPositionArray[_i2]) {
            // let y = cheight - (--capYPositionArray[i])
            var preValue = --capYPositionArray[_i2];
            var _y = (270 - preValue) * cheight / 270;
            ctx.fillRect(_i2 * (_this.props.meterWidth + _this.props.gap), _y, _this.props.meterWidth, _this.props.capHeight);
          } else {
            // let y = cheight - value
            var _y2 = (270 - value) * cheight / 270;
            ctx.fillRect(_i2 * (_this.props.meterWidth + _this.props.gap), _y2, _this.props.meterWidth, _this.props.capHeight);
            capYPositionArray[_i2] = value;
          };
          ctx.fillStyle = gradient; // set the filllStyle to gradient for a better look

          // let y = cheight - value + this.props.capHeight
          var y = (270 - value) * cheight / 270 + _this.props.capHeight;
          ctx.fillRect(_i2 * (_this.props.meterWidth + _this.props.gap), y, _this.props.meterWidth, cheight); // the meter
        }
        _this.animationId = requestAnimationFrame(drawMeter);
      };
      _this.animationId = requestAnimationFrame(drawMeter);
    };

    _this.setupAudioNode = function (audioEle) {
      var analyser = _this.audioContext.createAnalyser();
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 2048;

      var mediaEleSource = _this.audioContext.createMediaElementSource(audioEle);
      mediaEleSource.connect(analyser);
      mediaEleSource.connect(_this.audioContext.destination);

      return analyser;
    };

    _this.prepareElements = function () {
      _this.audioEle = document.getElementById(_this.props.audioId);
      _this.audioCanvas = document.getElementById(_this.canvasId);
    };

    _this.prepareAPIs = function () {
      // fix browser vender for AudioContext and requestAnimationFrame
      window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
      window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
      window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
      try {
        _this.audioContext = new AudioContext(); // 1.set audioContext
      } catch (e) {
        // console.error('!Your browser does not support AudioContext')
        console.log(e);
      }
    };

    _this.animationId = null;
    _this.audioContext = null;
    _this.audioEle = null;
    _this.audioCanvas = null;
    _this.playStatus = null;
    _this.canvasId = _this.props.id || _this.getRandomId(50);
    return _this;
  }

  _createClass(AudioSpectrum, [{
    key: 'getRandomId',
    value: function getRandomId(len) {
      var str = '1234567890-qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
      var strLen = str.length;
      var res = '';
      for (var i = 0; i < len; i++) {
        var randomIndex = Math.floor(Math.random() * strLen);
        res += str[randomIndex];
      }
      return res;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.prepareAPIs();
      this.prepareElements();
      var analyser = this.setupAudioNode(this.audioEle);
      this.initAudioEvents(analyser);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('canvas', { id: this.canvasId, width: this.props.width, height: this.props.height });
    }
  }]);

  return AudioSpectrum;
}(_react.Component);

AudioSpectrum.propTypes = {
  id: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  audioId: _propTypes2.default.string.isRequired,
  capColor: _propTypes2.default.string,
  capHeight: _propTypes2.default.number,
  meterWidth: _propTypes2.default.number,
  meterCount: _propTypes2.default.number,
  meterColor: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.shape({
    stop: _propTypes2.default.number,
    color: _propTypes2.default.string
  }))]),
  gap: _propTypes2.default.number
};
AudioSpectrum.defaultProps = {
  width: 300,
  height: 200,
  capColor: '#FFF',
  capHeight: 2,
  meterWidth: 2,
  meterCount: 40 * (2 + 2),
  meterColor: [{ stop: 0, color: '#f00' }, { stop: 0.5, color: '#0CD7FD' }, { stop: 1, color: 'red' }],
  gap: 10 // gap between meters
};
exports.default = AudioSpectrum;