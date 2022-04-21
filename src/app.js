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
import { SeedScene } from "scenes";
import soundFile from "./default.mp3";

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(6, 3, -10);
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

var file = document.getElementById("fileInput");
var audioinput = document.getElementById("audio");
var analyser;
var context;
var src;

// testing purposes
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const audioElement = new Audio(soundFile);
// const audioElement = document.querySelector("audio");
const track = audioContext.createMediaElementSource(audioElement);
track.connect(audioContext.destination);

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

// window.addEventListener("click", function () {
//   audioContext.resume().then(() => {
//     console.log("Playback resumed successfully");
//   });
// });
