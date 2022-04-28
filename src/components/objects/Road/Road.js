import { Group, Vector3 } from "three";
import Block from "../Block/Block";
import Coin from "../Coin/Coin";

class Road extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    this.initialized = false;

    // pathing variables
    this.movementSpeed = 0.075;
    this.timeDiff = 20;
    this.dirChangeFactor = 1.5;

    this.state = {
      cameraPosition: parent.camera.position,
      time: 0,
      lastBlock: 0,
      blockPos: new Vector3(0, 0, -5),
      direction: 1,
      justJumped: false,
    };

    this.blocks = [];
    this.coins = [];

    // Add self to parent's update list
    parent.addToUpdateList(this);
  }

  addBlock() {
    let beat = this.parent.beat;
    let type = this.random();

    // direction: -1 = left, 1 = right
    this.state.blockPos.x += this.dirChangeFactor * this.state.direction;

    // changing direction
    if (beat && type >= 6 && !this.state.justJumped) {
      this.state.direction *= -1;
      this.parent.removeBeat();
    }

    // jumping
    if (beat && type < 6 && !this.state.justJumped) {
      this.state.justJumped = true;
      this.parent.removeBeat();
      return;
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

    // creating the coin
    let makeCoin = this.random() < 4;

    if (makeCoin) {
      const coin = new Coin(this);
      this.coins.push(coin);
      this.add(coin);
    }
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

    for (let i = 0; i < this.coins.length; i++) {
      const coin = this.coins[i];

      if (coin.position.z > this.state.cameraPosition.z) {
        // removing offscreen coin
        this.coins.shift();
        this.remove(coin);
      } else {
        coin.updatePosition();
      }
    }
  }

  update(timeStamp) {
    if (!this.initialized) {
      this.addBlock();
      this.initialized = true;
    }

    if (this.state.time - this.state.lastBlock > this.timeDiff) {
      this.addBlock();
      this.state.lastBlock = this.state.time;
    }

    this.updateBlocks();

    this.state.time++;
  }
}

export default Road;
