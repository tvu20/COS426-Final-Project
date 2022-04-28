/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PathTest } from "scenes";
import { AudioData } from "./components/audio";
import soundFile from "./meme.mp3";
// import soundFile from "./sevenrings.mp3";

// Initialize core ThreeJS components
const camera = new PerspectiveCamera();
const scene = new PathTest(camera);
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
// camera.position.set(0, 5, 30);
// camera.position.set(0, 10, 20);
camera.position.set(0, 20, 20);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = "block"; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = "hidden"; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
  controls.update();
  renderer.render(scene, camera);
  scene.update && scene.update(timeStamp);
  window.requestAnimationFrame(onAnimationFrameHandler);

  // analyser stuff
  analyser.fftSize = 128;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  scene.freqData = dataArray;

  let instantEnergy = 0;
  for (let i = 0; i < bufferLength; i++) {
    instantEnergy += (dataArray[i] / 256) * (dataArray[i] / 256);
  }
  audiodata.add(instantEnergy);

  let bump = audiodata.averageLocalEnergy() * 1.15 < instantEnergy;
  let beat = false;

  if (bump) {
    if (time - lastBeat > 20) {
      lastBeat = time;
      beat = true;
    }
  }

  if (beat) {
    scene.addBeat();
  }

  time++;
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener("resize", windowResizeHandler, false);

// keydown handler
window.addEventListener("keydown", (event) => {
  const key = event.key;
  scene.move(event.key);
});

// AUDIO

// set up canvas context for visualizer
var canVas = document.querySelector(".visualizer");
var canvasCtx = canVas.getContext("2d");

var audiodata = new AudioData();
let time = 0;
let lastBeat = 0;

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();

// delay node
// const delayNode = new DelayNode(audioContext, {
//   delayTime: 2,
//   maxDelayTime: 2,
// });

const audioElement = document.querySelector("audio");
audioElement.src = soundFile;

// added delay node here - delete that line to remove
const track = audioContext.createMediaElementSource(audioElement);
track.connect(analyser);
analyser.connect(audioContext.destination);
// analyser.connect(delayNode);
// delayNode.connect(audioContext.destination);

// select our play button
const playButton = document.querySelector("button");

playButton.addEventListener(
  "click",
  function () {
    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === "false") {
      audioElement.play();
      this.dataset.playing = "true";
    } else if (this.dataset.playing === "true") {
      audioElement.pause();
      this.dataset.playing = "false";
    }
  },
  false
);

audioElement.addEventListener(
  "ended",
  () => {
    playButton.dataset.playing = "false";
  },
  false
);

// function visualize() {
//   // analyser.fftSize = 2048;
//   analyser.fftSize = 128;
//   var bufferLength = analyser.frequencyBinCount;
//   var dataArray = new Uint8Array(bufferLength);

//   var draw = function () {
//     requestAnimationFrame(draw);

//     analyser.getByteFrequencyData(dataArray);

//     let instantEnergy = 0;
//     for (let i = 0; i < bufferLength; i++) {
//       instantEnergy += (dataArray[i] / 256) * (dataArray[i] / 256);
//     }
//     audiodata.add(instantEnergy);

//     let bump = audiodata.averageLocalEnergy() * 1.15 < instantEnergy;
//     let beat = false;

//     if (bump) {
//       if (time - lastBeat > 20) {
//         lastBeat = time;
//         beat = true;
//       }
//     }

//     // _______________________________________________________

//     if (beat) console.log("beat");

//     let WIDTH = canVas.width;
//     let HEIGHT = canVas.height;

//     canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
//     canvasCtx.fillStyle = "rgb(0, 0, 0)";
//     canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

//     var barWidth = (WIDTH / bufferLength) * 2.5;
//     var barHeight;
//     var x = 0;

//     for (var i = 0; i < bufferLength; i++) {
//       barHeight = dataArray[i];

//       if (beat || time - lastBeat < 5) {
//         canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
//         canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
//       } else {
//         canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
//         canvasCtx.fillRect(x, 0, barWidth, 0);
//       }

//       x += barWidth + 1;
//     }
//   };

//   draw();
// }

//------

function visualize() {
  let WIDTH = canVas.width;
  let HEIGHT = canVas.height;

  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  var draw = function () {
    var drawVisual = requestAnimationFrame(draw);
    // console.log(dataArray);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";

    canvasCtx.beginPath();

    var sliceWidth = (WIDTH * 1.0) / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
      var v = dataArray[i] / 128.0;
      var y = (v * HEIGHT) / 2;
      // var y = (v * HEIGHT) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canVas.width, canVas.height / 2);
    canvasCtx.stroke();
  };

  draw();
}

// --------

// function visualize() {
//   let WIDTH = canVas.width;
//   let HEIGHT = canVas.height;

//   analyser.fftSize = 256;
//   var bufferLengthAlt = analyser.frequencyBinCount;
//   var dataArrayAlt = new Uint8Array(bufferLengthAlt);

//   canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

//   var draw = function () {
//     let drawVisual = requestAnimationFrame(draw);

//     analyser.getByteFrequencyData(dataArrayAlt);

//     canvasCtx.fillStyle = "rgb(0, 0, 0)";
//     canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

//     var barWidth = (WIDTH / bufferLengthAlt) * 2.5;
//     var barHeight;
//     var x = 0;

//     for (var i = 0; i < bufferLengthAlt; i++) {
//       barHeight = dataArrayAlt[i];

//       canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
//       canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

//       x += barWidth + 1;
//     }
//   };

//   draw();
// }

// window.addEventListener("click", function () {
//   audioContext.resume().then(() => {
//     console.log("Playback resumed successfully");
//   });
// });
