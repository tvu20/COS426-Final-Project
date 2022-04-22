import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./scene.gltf";

class Block extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    const loader = new GLTFLoader();

    this.name = "block";

    loader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
    });

    // Add self to parent's update list
    parent.addToUpdateList(this);
  }

  update(timeStamp) {
    this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
    // const { cameraPosition } = this.state;
    // this.position.z += this.parent.gameSpeed;

    // if (this.position.z > cameraPosition.z) {
    //   this.position.z -= 200;
    // }
  }
}

export default Block;
