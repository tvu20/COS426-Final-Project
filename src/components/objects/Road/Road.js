import { Group, Vector3 } from "three";
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
      blockPos: new Vector3(0, 0, -5),
      direction: 1,
      justJumped: false,
    };

    this.blocks = [];

    // Add self to parent's update list
    parent.addToUpdateList(this);
  }

  addBlock() {
    // updating position

    // direction: -1 = left, 1 = right
    this.state.blockPos.x += 1.5 * this.state.direction;

    let temp = this.random();

    // jumping state
    if (temp < 2 && this.state.justJumped == false) {
      this.state.justJumped = true;
      return;
    }

    // changing direction
    if (temp > 6 && this.state.justJumped == false) {
      this.state.direction *= -1;
    }

    this.state.justJumped = false;

    // stopping it from going out of bounds
    if (this.state.blockPos.x > 5) {
      this.state.direction = -1;
    } else if (this.state.blockPos.x < -5) {
      this.state.direction = 1;
    }

    // creating the block
    const block = new Block(this);
    this.blocks.push(block);
    this.add(block);
  }

  // temporary function
  random() {
    return Math.floor(Math.random() * 10) + 1;
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

    if (this.state.time - this.state.lastBlock > 30) {
      this.addBlock();
      this.state.lastBlock = this.state.time;
    }

    this.updateBlocks();

    this.state.time++;
  }
}

export default Road;
