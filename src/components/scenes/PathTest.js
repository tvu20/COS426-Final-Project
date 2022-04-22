import * as Dat from "dat.gui";
import { Scene, Color } from "three";
import { Block } from "objects";
// import { Blocks } from "objects";
import { BasicLights } from "lights";

class PathTest extends Scene {
  constructor(camera) {
    // Call parent Scene() constructor
    super();

    // Init state
    this.state = {
      gui: new Dat.GUI(), // Create GUI for scene
      movementSpeed: 0.1, // Movement speed
      updateList: [],
    };

    // Set background to a nice color
    this.background = new Color(0x7ec0ee);

    // camera
    this.camera = camera;

    // Add meshes to scene
    // const path = new Blocks(this);
    const block = new Block(this);
    const lights = new BasicLights();
    // this.add(path, lights);
    this.add(block, lights);

    // Populate GUI
    this.state.gui.add(this.state, "movementSpeed", 0.05, 1);
  }

  addToUpdateList(object) {
    this.state.updateList.push(object);
  }

  update(timeStamp) {
    const { updateList } = this.state;

    // Call update for each object in the updateList
    for (const obj of updateList) {
      obj.update(timeStamp);
    }
  }
}

export default PathTest;
