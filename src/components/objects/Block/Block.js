import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./scene.gltf";

class Block extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    // camera
    this.state = {
      cameraPosition: parent.camera.position,
    };

    this.init();

    // Add self to parent's update list
    parent.addToUpdateList(this);
  }

  init() {
    const loader = new GLTFLoader();

    this.name = "block";

    loader.load(MODEL, (gltf) => {
      this.add(gltf.scene);
    });
  }

  update(timeStamp) {
    const { cameraPosition } = this.state;
    this.position.z += this.parent.state.movementSpeed;

    if (this.position.z > cameraPosition.z) {
      this.position.z = 0;
    }
  }
}

export default Block;
