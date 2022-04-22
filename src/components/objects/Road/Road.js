import { Group } from "three";
import Block from "../Block/Block";

class Road extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    this.initialized = false;

    this.state = {
      movementSpeed: parent.state.movementSpeed,
      cameraPosition: parent.camera.position,
    };

    this.blocks = [];

    // Add self to parent's update list
    parent.addToUpdateList(this);
  }

  addBlock() {
    const block = new Block(this);
    this.blocks.push(block);
    this.add(block);
  }

  updateBlocks() {
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];

      if (block.position.z > this.state.cameraPosition.z) {
        this.blocks.shift();
        this.remove(block);
        this.addBlock();
      } else {
        block.updatePosition();
      }
    }
  }

  update(timeStamp) {
    if (!this.initialized) {
      this.addBlock();
      this.initialized = true;
    }

    this.updateBlocks();
  }
}

export default Road;
