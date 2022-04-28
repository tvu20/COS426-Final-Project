import {
  Group,
  SpotLight,
  AmbientLight,
  HemisphereLight,
  DirectionalLight,
} from "three";

class BasicLights extends Group {
  constructor(...args) {
    // Invoke parent Group() constructor with our args
    super(...args);

    const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
    const ambi = new AmbientLight(0x404040, 1.32);
    const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

    dir.position.set(5, 1, 2);
    dir.target.position.set(0, 0, 0);

    let color = 0xffffff;
    let intensity = 1;
    let light = new DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, -2, -5);

    // this.add(ambi, hemi, dir);
    // this.add(dir.target);
    this.add(light);
    // this.add(light.dir);

    // this.add(ambi, hemi, dir);
  }
}

export default BasicLights;
