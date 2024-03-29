import * as THREE from "three";
import TrackballControls from 'three-trackballcontrols';

export default function initScene(scene, renderer, canvasId) {
  var height = window.innerHeight - 200,
    width = window.innerWidth;
  renderer.setSize(width, height); // sets size of render to the screen size
  renderer.setClearColor(0x282c34);    // set background color
  const domElem = renderer.domElement;
  domElem.id = canvasId;
  document.getElementById('3boxView').appendChild(domElem); 


  var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000); // Creates a camera and passes (field of view, aspect ratio, near clipping plane, far clipping plane)
  camera.position.set(0, 0, 5);// moves the camera back some so we won't be inside of the cube
  camera.lookAt(scene.position); // makes the camera always point toward the scene
  scene.add(camera);
  let controls = new TrackballControls(camera, domElem);

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
  render();
  function render() {
    requestAnimationFrame(render); // requestAnimationFrame will pause when the user navigates to a new tab
    cube1.rotation.z += 0.01;
    cube1.rotation.x += 0.01;
    cube1.rotation.y += 0.01;  // Runs every frame giving it the animation
    cube2.rotation.x += 0.01;

    if (cube3DirUP) {
      cube3.rotation.y += cube3RotateXSpeed;
      if (cube3.position.y < 5) {
        cube3.position.y += 0.05;
      } else {
        cube3DirUP = false;
      }
    } else {
      cube3.rotation.y -= cube3RotateXSpeed;
      if (cube3.position.y > -3) {
        cube3.position.y -= 0.05;
      } else {
        cube3DirUP = true;
      }
    }

    controls.update();
    renderer.render(scene, camera);
  };
}