import * as Dat from "dat.gui";
import * as THREE from "three";
import { Scene, Color, SphereGeometry, MeshPhongMaterial, Mesh } from "three";
// import { Flower } from "objects";
// import { Block } from "objects";
import { Road } from "../objects/Road";
import Ball from "../objects/Ball/Ball";
import { BasicLights } from "lights";

class PathTest extends Scene {
  constructor(camera) {
    // Call parent Scene() constructor
    super();

    // Init state
    this.state = {
      gui: new Dat.GUI(), // Create GUI for scene
      //   movementSpeed: 0.1, // Movement speed
      updateList: [],
      sinceLastCollision: 0,
      offTrack: false,
      gameStarted: false,
      gameEnded: false,
      paused: false,
      sinceFalling: 0,
    };

    // Set background to a nice color
    this.background = new Color(0x7ec0ee);

    // camera
    this.camera = camera;

    // frequency data
    this.freqData = [];
    this.beat = false;

    // Add meshes to scene
    const road = new Road(this);
    const lights = new BasicLights();
    const ball = new Ball(this);
    this.add(road, lights, ball);

    this.road = road;
    this.ball = ball;

    // Populate GUI
    // this.state.gui.add(this.state, "movementSpeed", 0.05, 1);
  }

  move(direction) {
    switch (direction) {
      case "ArrowLeft":
        var obj = this.getObjectByName("ball");
        obj.left();
        break;
      case "ArrowRight":
        var obj = this.getObjectByName("ball");
        obj.right();

        break;

      case "ArrowUp":
        var obj = this.getObjectByName("ball");
        obj.jump();
        break;
    }
  }

  addToUpdateList(object) {
    this.state.updateList.push(object);
  }

  addBeat() {
    this.beat = true;
  }

  removeBeat() {
    this.beat = false;
  }

  findCollision() {
    let roadCollisions = this.road.blockCollisions;

    let ballMesh = this.ball.bb;
    let ballBB = new THREE.Box3().setFromObject(ballMesh);

    for (const mesh of roadCollisions) {
      let meshBB = new THREE.Box3();
      mesh.geometry.computeBoundingBox();
      meshBB.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);

      if (
        ballBB.intersectsBox(meshBB) ||
        this.ball.position.y > this.ball.yPos
      ) {
        this.state.sinceLastCollision = 0;
      } else {
        this.state.sinceLastCollision++;
      }

      if (this.state.sinceLastCollision > 20) {
        var obj = this.getObjectByName("ball");
        obj.fall();
        this.state.offTrack = true;
      }
    }
  }

  update(timeStamp) {
    const { updateList } = this.state;

    if (this.state.gameStarted && !this.state.paused) {
      // Call update for each object in the updateList
      for (const obj of updateList) {
        obj.update(timeStamp);
      }

      var obj = this.getObjectByName("ball");
      if (obj !== undefined && obj.state.isFallen) {
        this.remove(obj);
        //enter game end state
      }

      if (!this.state.offTrack) {
        this.findCollision();
      }

      // if falling
      if (this.state.offTrack) {
        this.state.sinceFalling++;
        if (this.state.sinceFalling > 80) {
          this.state.offTrack = false;
          this.state.paused = true;
          this.state.gameStarted = false;
        }
      }
    }
  }
}

export default PathTest;
