import { Group } from "three";
import { Block } from "objects";

class Blocks extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    console.log("hi");
    super();

    this.initialized = false;

    //   // camera
    //   this.state = {
    //     cameraPosition: parent.camera.position,
    //   };

    //   this.init();

    // Add self to parent's update list
    parent.addToUpdateList(this);
  }

  addBlock() {
    const block = new Block(this);
    this.add(block);
  }

  update(timeStamp) {
    if (!this.initialized) {
      this.addBlock();
      this.initialized = true;
    }
  }
}

export default Blocks;
