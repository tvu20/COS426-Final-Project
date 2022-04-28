import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { Scene, Color, SphereGeometry, MeshStandardMaterial, MeshPhongMaterial, Mesh} from 'three'
import MODEL from './ball.gltf';

class Ball extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            jump: this.jump.bind(this),
            left: this.left.bind(this),
            right:this.right.bind(this),
            isLeft: false,
            isRight: false,
        };

        // // Load object
        // const loader = new GLTFLoader();

        this.name = 'ball';
        // loader.load(MODEL, (gltf) => {
        //     this.add(gltf.scene);
        // });
        var faceradius = 0.2;    
        var geometry = new SphereGeometry( faceradius, 32, 32 );//sphere size
        let material = new MeshStandardMaterial({color: 0x0000ff, roughness: 0});
        // var material = new MeshPhongMaterial({ 
        //     color: 0x0000ff, 
        //     ambient: 0x000000,
        //     specular: 0x000000,
        //     shininess: 50
        // });
        var ball = new Mesh( geometry, material );
        ball.geometry.dynamic = true;
        ball.geometry.verticesNeedUpdate = true;
        //particle.geometry.normalsNeedUpdate = true;       

        ball.position.x = 0;
        ball.position.y = 0; 
        ball.position.z = 0;

        ball.scale.x = ball.scale.y = ball.scale.z = 4;
        this.add(ball);

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        this.state.gui.add(this.state, 'jump');
        this.state.gui.add(this.state, 'left');
        this.state.gui.add(this.state, 'right');
    }
    left(){
        this.isRight = false;
        this.isLeft = true;
        this.position.x = this.position.x - 0.03;
    }
    right(){
        this.isLeft = false;
        this.isRight = true;
        this.position.x = this.position.x + 0.03;
    }

    jump() {
        // // Add a simple twirl
        // this.state.twirl += 6 * Math.PI;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 3 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }

    update(timeStamp) {
        // if (this.state.bob) {
        //     // Bob back and forth
        //     this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        // }
        // if (this.state.twirl > 0) {
        //     // Lazy implementation of twirl
        //     this.state.twirl -= Math.PI / 8;
        //     this.rotation.y += Math.PI / 8;
        // }
        if(this.isLeft){
            this.left();
        }
        if(this.isRight){
            this.right();
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Ball;
