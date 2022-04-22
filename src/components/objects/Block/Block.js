import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./scene.gltf";

class Block extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    this.init();
  }

  init() {
    const loader = new GLTFLoader();

    this.name = "block";

    loader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
    });
  }

  remove() {
    this.remove.apply(this, this.children);
  }

  updatePosition() {
    // console.log(this.parent.movementSpeed);
    let temp = this.position.z + this.parent.movementSpeed;
    // this.position.z = parseFloat(temp).toPrecision(3);
    // console.log(parseFloat(temp).toPrecision(3));
    this.position.z = temp;
  }
}

export default Block;
