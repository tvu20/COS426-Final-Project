import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./scene.gltf";

import * as THREE from "three";

class Coin extends Group {
  constructor(parent) {
    super();

    this.state = {
      pos: parent.state.blockPos,
    };

    this.bb;

    this.init();
  }

  init() {
    const loader = new GLTFLoader();

    this.name = "coin";
    loader.load(MODEL, (gltf) => {
      let mesh = gltf.scene;
      this.add(mesh);
    });

    this.position.x = this.state.pos.x;
    this.position.y = this.state.pos.y + 3;
    this.position.z = this.state.pos.z;

    this.scale.x = 0.25;
    this.scale.y = 0.25;
    this.scale.z = 0.25;

    // bounding box exercise
    let geometry = new THREE.BoxGeometry(3, 10, 3);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y += 0;

    this.bb = mesh;
    // this.add(mesh);
  }

  remove() {
    this.remove.apply(this, this.children);
  }

  updatePosition() {
    let temp = this.position.z + this.parent.movementSpeed;
    this.position.z = temp;

    // rotating the thing
    this.rotation.y += 0.1;
  }
}

export default Coin;
