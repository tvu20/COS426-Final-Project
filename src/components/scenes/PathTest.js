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

      case "ArrowDown":
        var obj = this.getObjectByName("ball");
        obj.fall();
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
    // console.log(ballBB);

    for (const mesh of roadCollisions) {
      let meshBB = new THREE.Box3();
      mesh.geometry.computeBoundingBox();
      meshBB.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);

      if (
        ballBB.intersectsBox(meshBB) ||
        this.ball.position.y > this.ball.yPos
        // this.ball.positiion.y > this.ball.yPos
      ) {
        // this.ball.fall();
        // console.log("collision");
        this.state.sinceLastCollision = 0;
        // this.ball.state.isFallen = true;
      } else {
        this.state.sinceLastCollision++;
        // console.log("not colliding");
        // if (this.ball.position.y <= this.ball.yPos) {
        //   console.log("fall");
        // }
        // console.log("no collision");
      }

      // if (this.state.sinceLastCollision > 50) console.log("fall");

      // console.log(meshBB);
      // let meshBB =
      // let meshBB = new THREE.Box3().setFromObject(mesh);
      // console.log(meshBB);

      // if (this.ball.bb.intersectsBox(mesh)) {
      //   console.log("touching");
      //   // this.ball.state.isFallen = true;
      // }
    }
  }

  update(timeStamp) {
    const { updateList } = this.state;

    // Call update for each object in the updateList
    for (const obj of updateList) {
      obj.update(timeStamp);
    }

    var obj = this.getObjectByName("ball");
    if (obj !== undefined && obj.state.isFallen) {
      this.remove(obj);
      //enter game end state
    }

    this.findCollision();
  }
}

export default PathTest;
