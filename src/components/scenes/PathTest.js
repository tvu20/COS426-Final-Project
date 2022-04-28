import * as Dat from "dat.gui";
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

  update(timeStamp) {
    const { updateList } = this.state;

    // Call update for each object in the updateList
    for (const obj of updateList) {
      obj.update(timeStamp);
    }

    var obj = this.getObjectByName("ball");
    if (obj !== undefined && obj.state.isFallen) {
      this.remove(obj);
    }
  }
}

export default PathTest;
