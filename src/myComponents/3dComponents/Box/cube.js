import React from 'react';
import ReactDOM from 'react-dom';
import * as THREE from "three";
import TrackballControls from 'three-trackballcontrols';



export default class Cube extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer(),
      canvasId: "cubeCanvas"
    };
  }

  componentDidMount() {
    { initScene(this.state.scene, this.state.renderer, this.state.canvasId) };
  }

  componentWillUnmount() {
    const scene = this.state.scene;
    for (let i = scene.children.length - 1; i >= 0; i--) {
      const object = scene.children[i];
      if (object.type === 'Mesh') {
        object.geometry.dispose();
        object.material.dispose();
        scene.remove(object);
      }
      scene.dispose();
      scene.remove(object);
    }

    const element = document.getElementById(this.state.canvasId);
    element.parentNode.removeChild(element);

  }

  render() {
    return (
      <div className='container'>
      </div>
    );
  }
}



function initScene(scene, renderer, canvasId) {
  var height = window.innerHeight,
    width = window.innerWidth;
  // scene = new THREE.Scene(); // Creates a new scene
  // var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height); // sets size of render to the screen size
  renderer.setClearColor(0x282c34);    // set background color
  const domElem = renderer.domElement;
  domElem.id = canvasId;
  document.getElementById('3boxView').appendChild(domElem); 
  // document.body.appendChild(domElem); // Renders a canvas tag to the DOM

  // const canvas = document.getElementById("mycanvas");
  // const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  // renderer.setSize( width, height ); 


  var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000); // Creates a camera and passes (field of view, aspect ratio, near clipping plane, far clipping plane)
  camera.position.set(0, 0, 5);// moves the camera back some so we won't be inside of the cube
  camera.lookAt(scene.position); // makes the camera always point toward the scene
  scene.add(camera);
  // let controls = new TrackballControls(camera, canvas);

  var light = new THREE.PointLight(0xFFFF00);
  light.position.set(10, 0, 10);
  scene.add(light);

  var geometry = new THREE.BoxGeometry(2, 2, 2); // give the cube it's dimensions (width, height, depth)
  var material = new THREE.MeshLambertMaterial({ color: 0xFF0000, wireframe: false }); // creates material and gives it a color
  material.wireframe = false;
  var cube1 = new THREE.Mesh(geometry, material); // crates the cube using the geometry and the material
  var cube2 = new THREE.Mesh(geometry, material);
  cube2.position.set(5, -2, -5);
  var cube3 = new THREE.Mesh(geometry, material);
  cube3.position.set(-5, -2, -5);

  scene.add(cube1, cube2, cube3); // adds the cube to the scene

  // Resize Three.js scene on window resize
  window.addEventListener('resize', onWindowResize, false);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }


  // Render loop to display cube
  let cube3DirUP = true;
  const cube3RotateXSpeed = 0.06;
  const cube2RotateXSpeed = 0.06;
  render();
  function render() {
    requestAnimationFrame(render); // requestAnimationFrame will pause when the user navigates to a new tab
    cube1.rotation.z += 0.01;
    cube1.rotation.x += 0.01;
    cube1.rotation.y += 0.01;  // Runs every frame giving it the animation
    cube1.position.z -= 0.01;
    cube2.rotation.x += 0.01;

    if (cube3DirUP) {
      cube3.rotation.y += cube3RotateXSpeed;
      // cube2.rotation.y -= cube2RotateXSpeed;
      if (cube3.position.y < 5) {
        cube3.position.y += 0.05;
        // cube2.position.y -= 0.05;
      } else {
        cube3DirUP = false;
      }
    } else {
      cube3.rotation.y -= cube3RotateXSpeed;
      // cube2.rotation.y -= cube2RotateXSpeed;
      if (cube3.position.y > -3) {
        cube3.position.y -= 0.05;
        // cube2.position.y += 0.05;
      } else {
        cube3DirUP = true;
      }
    }

    // controls.update();
    renderer.render(scene, camera);
  };
}