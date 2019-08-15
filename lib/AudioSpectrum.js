"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AudioSpectrum =
/*#__PURE__*/
function (_Component) {
  _inherits(AudioSpectrum, _Component);

  function AudioSpectrum(props) {
    var _this;

    _classCallCheck(this, AudioSpectrum);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AudioSpectrum).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "initAudioEvents", function () {
      var audioEle = _this.audioEle;

      if (audioEle) {
        audioEle.onpause = function (e) {
          _this.playStatus = 'PAUSED';
        };

        audioEle.onplay = function (e) {
          _this.playStatus = 'PLAYING';

          _this.prepareAPIs();

          var analyser = _this.setupAudioNode(_this.audioEle);

          _this.drawSpectrum(analyser);
        };
      }
    });

    _defineProperty(_assertThisInitialized(_this), "drawSpectrum", function (analyser) {
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
          }

          ;
          ctx.fillStyle = _this.props.capColor; // draw the cap, with transition effect

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
          }

          ;
          ctx.fillStyle = gradient; // set the filllStyle to gradient for a better look
          // let y = cheight - value + this.props.capHeight

          var y = (270 - value) * cheight / 270 + _this.props.capHeight;
          ctx.fillRect(_i2 * (_this.props.meterWidth + _this.props.gap), y, _this.props.meterWidth, cheight); // the meter
        }

        _this.animationId = requestAnimationFrame(drawMeter);
      };

      _this.animationId = requestAnimationFrame(drawMeter);
    });

    _defineProperty(_assertThisInitialized(_this), "setupAudioNode", function (audioEle) {
      if (!_this.analyser) {
        _this.analyser = _this.audioContext.createAnalyser();
        _this.analyser.smoothingTimeConstant = 0.8;
        _this.analyser.fftSize = 2048;
      }

      if (!_this.mediaEleSource) {
        _this.mediaEleSource = _this.audioContext.createMediaElementSource(audioEle);

        _this.mediaEleSource.connect(_this.analyser);

        _this.mediaEleSource.connect(_this.audioContext.destination);
      }

      return _this.analyser;
    });

    _defineProperty(_assertThisInitialized(_this), "prepareElements", function () {
      var _this$props = _this.props,
          audioId = _this$props.audioId,
          audioEle = _this$props.audioEle;

      if (!audioId && !audioEle) {
        console.log('target audio not found!');
        return;
      } else if (audioId) {
        _this.audioEle = document.getElementById(audioId);
      } else {
        _this.audioEle = audioEle;
      }

      _this.audioCanvas = document.getElementById(_this.canvasId);
    });

    _defineProperty(_assertThisInitialized(_this), "prepareAPIs", function () {
      // fix browser vender for AudioContext and requestAnimationFrame
      window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
      window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
      window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;

      try {
        _this.audioContext = new window.AudioContext(); // 1.set audioContext
      } catch (e) {
        // console.error('!Your browser does not support AudioContext')
        console.log(e);
      }
    });

    _this.animationId = null;
    _this.audioContext = null;
    _this.audioEle = null;
    _this.audioCanvas = null;
    _this.playStatus = null;
    _this.canvasId = _this.props.id || _this.getRandomId(50);
    _this.mediaEleSource = null;
    _this.analyser = null;
    return _this;
  }

  _createClass(AudioSpectrum, [{
    key: "getRandomId",
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
    key: "componentDidMount",
    value: function componentDidMount() {
      this.prepareElements();
      this.initAudioEvents();
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("canvas", {
        id: this.canvasId,
        width: this.props.width,
        height: this.props.height
      });
    }
  }]);

  return AudioSpectrum;
}(_react.Component);

AudioSpectrum.propTypes = {
  id: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  width: _propTypes.default.number,
  height: _propTypes.default.number,
  audioId: _propTypes.default.string,
  audioEle: _propTypes.default.object,
  capColor: _propTypes.default.string,
  capHeight: _propTypes.default.number,
  meterWidth: _propTypes.default.number,
  meterCount: _propTypes.default.number,
  meterColor: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.shape({
    stop: _propTypes.default.number,
    color: _propTypes.default.string
  }))]),
  gap: _propTypes.default.number
};
AudioSpectrum.defaultProps = {
  width: 300,
  height: 200,
  capColor: '#FFF',
  capHeight: 2,
  meterWidth: 2,
  meterCount: 40 * (2 + 2),
  meterColor: [{
    stop: 0,
    color: '#f00'
  }, {
    stop: 0.5,
    color: '#0CD7FD'
  }, {
    stop: 1,
    color: 'red'
  }],
  gap: 10 // gap between meters

};
var _default = AudioSpectrum;
exports.default = _default;