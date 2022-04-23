import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./scene.gltf";

class Block extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    this.state = {
      pos: parent.state.blockPos,
    };

    this.init();
  }

  init() {
    const loader = new GLTFLoader();

    this.name = "block";

    loader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
    });

    this.rotation.y = Math.PI / 4;

    this.position.x = this.state.pos.x;
    this.position.y = this.state.pos.y;
    this.position.z = this.state.pos.z;

    // this.position.set(this.state.pos);

    // console.log(this.parent);

    // this.position = this.parent.state.blockPos;

    // this.position.x = 0;
    // this.position.y = 0;
    // this.position.z = -20;
  }

  remove() {
    this.remove.apply(this, this.children);
  }

  updatePosition() {
    let temp = this.position.z + this.parent.movementSpeed;
    // this.position.z = parseFloat(temp).toPrecision(3);
    this.position.z = temp;
  }
}

export default Block;
