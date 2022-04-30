/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Fog, Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PathTest } from "scenes";
import { AudioData } from "./components/audio";
import soundFile from "./meme.mp3";
// import "./app.css";
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

// // fog
// // scene.fog = new Fog();
// scene.fog = new Fog(new Color(0x7ec0ee), 1, 200);

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

// --------------------
// GAME CONTROL
// --------------------

// control variables
let gameOver = false;
let paused = false;
let gameStarted = false;

function beginGame() {
  scene.state.gameStarted = true;
  scene.state.paused = false;
  gameStarted = true;
}

function pauseGame() {
  scene.state.paused = true;
}

function unpauseGame() {
  scene.state.paused = false;
}

function lose() {
  gameOver = true;
  scene.state.gameEnded = true;
  console.log("lose");
  audioElement.pause();
  currentlyPlaying = false;
  // this.dataset.playing = "false";
}

// score
let score = 0;
let scoreDiv = document.getElementById("score");
scoreDiv.innerHTML = "Score: " + score;
// document.body.appendChild(scoreDiv);

// --------------------
// AUDIO
// --------------------

// set up canvas context for visualizer
var canVas = document.querySelector(".visualizer");
var canvasCtx = canVas.getContext("2d");

var audiodata = new AudioData();
let time = 0;
let lastBeat = 0;
let currentlyPlaying = false;

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
    // if (this.dataset.playing === "false") {
    if (!currentlyPlaying) {
      beginGame();
      audioElement.play();
      currentlyPlaying = true;
      // this.dataset.playing = "true";
      // } else if (this.dataset.playing === "true") {
    } else if (currentlyPlaying) {
      pauseGame();
      audioElement.pause();
      currentlyPlaying = false;
      // this.dataset.playing = "false";
    }
  },
  false
);

audioElement.addEventListener(
  "ended",
  () => {
    currentlyPlaying = false;
    // playButton.dataset.playing = "false";
  },
  false
);

//-------

// function visualize() {
//   let WIDTH = canVas.width;
//   let HEIGHT = canVas.height;

//   analyser.fftSize = 2048;
//   var bufferLength = analyser.frequencyBinCount;
//   var dataArray = new Uint8Array(bufferLength);

//   canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

//   var draw = function () {
//     var drawVisual = requestAnimationFrame(draw);
//     // console.log(dataArray);

//     analyser.getByteTimeDomainData(dataArray);

//     canvasCtx.fillStyle = "rgb(200, 200, 200)";
//     canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

//     canvasCtx.lineWidth = 2;
//     canvasCtx.strokeStyle = "rgb(0, 0, 0)";

//     canvasCtx.beginPath();

//     var sliceWidth = (WIDTH * 1.0) / bufferLength;
//     var x = 0;

//     for (var i = 0; i < bufferLength; i++) {
//       var v = dataArray[i] / 128.0;
//       var y = (v * HEIGHT) / 2;
//       // var y = (v * HEIGHT) / 2;

//       if (i === 0) {
//         canvasCtx.moveTo(x, y);
//       } else {
//         canvasCtx.lineTo(x, y);
//       }

//       x += sliceWidth;
//     }

//     canvasCtx.lineTo(canVas.width, canVas.height / 2);
//     canvasCtx.stroke();
//   };

//   draw();
// }

// --------------------
// RENDER HANDLER
// --------------------

const onAnimationFrameHandler = (timeStamp) => {
  controls.update();
  renderer.render(scene, camera);
  scene.update && scene.update(timeStamp);
  window.requestAnimationFrame(onAnimationFrameHandler);

  if (scene.state.offTrack && !scene.state.gameEnded) {
    lose();
  }

  // scoring
  if (scene.state.score != score) {
    score = scene.state.score;
    scoreDiv.innerHTML = "Score: " + score;
  }

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
