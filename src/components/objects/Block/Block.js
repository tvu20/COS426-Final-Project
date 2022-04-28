import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./scene.gltf";
import * as THREE from "three";

class Block extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    this.state = {
      pos: parent.state.blockPos,
    };

    this.bb;
    this.bbHelper;

    this.init();
  }

  init() {
    const loader = new GLTFLoader();

    this.name = "block";

    loader.load(MODEL, (gltf) => {
      let mesh = gltf.scene;
      this.add(mesh);
    });

    this.rotation.y = Math.PI / 4;

    this.position.x = this.state.pos.x;
    this.position.y = this.state.pos.y;
    this.position.z = this.state.pos.z;

    // console.log(this.position.x);

    // bounding box exercise
    let geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y += 1;

    this.bb = mesh;
    // this.add(mesh);
    // this.add(collision);

    // this.bb = new THREE.BoxGeometry(0, 0, 0);
    // // this.bbHelper = new THREE.BoxHelper(this.bb, 0xffff00);
    // // this.add(this.bbHelper);
  }

  remove() {
    this.remove.apply(this, this.children);
  }

  updatePosition() {
    let temp = this.position.z + this.parent.movementSpeed;
    this.position.z = temp;
  }
}

export default Block;
