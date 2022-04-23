import { Group } from "three";
import Block from "../Block/Block";

class Road extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    this.initialized = false;

    this.movementSpeed = 0.05;

    this.state = {
      // movementSpeed: parent.state.movementSpeed,
      cameraPosition: parent.camera.position,
      time: 0,
      lastBlock: 0,
    };

    this.blocks = [];

    // Add self to parent's update list
    parent.addToUpdateList(this);
  }

  addBlock() {
    // console.log("adding a block");
    const block = new Block(this);
    this.blocks.push(block);
    this.add(block);
  }

  updateBlocks() {
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];

      if (block.position.z > this.state.cameraPosition.z) {
        // removing offscreen block
        this.blocks.shift();
        this.remove(block);
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

    if (this.state.time - this.state.lastBlock > 40) {
      this.addBlock();
      this.state.lastBlock = this.state.time;
    }

    this.updateBlocks();

    this.state.time++;
  }
}

export default Road;
