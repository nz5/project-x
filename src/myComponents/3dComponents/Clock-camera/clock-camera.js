import * as THREE from "three";
// import TrackballControls from 'three-trackballcontrols';


export default function initScene(scene, renderer, canvasId, bgColor, viewId) {
  var height = window.innerHeight - 100,
    width = window.innerWidth;
  renderer.setClearColor(bgColor);
  renderer.setSize(width, height);
  const domElem = renderer.domElement;
  domElem.id = canvasId;
  document.getElementById(viewId).appendChild(domElem);

  const camera3 = new THREE.PerspectiveCamera(40, width / height, 0.1, 10000);
  camera3.position.set(0, 0, 30);
  camera3.lookAt(scene.position);

  const light = new THREE.PointLight();
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff));
  // const controls3 = new TrackballControls(camera3, domElem);
 
  // Resize Three.js scene on window resize
 window.addEventListener('resize', onWindowResize, false);
 function onWindowResize() {
   camera3.aspect = window.innerWidth / window.innerHeight;
   camera3.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
 }


  // define watch class
  const watch = {
    timeZoneDiffFactor: 12 - 3,
    camera3Offset: 60,
    clockRadius: 20,
    numOfArrows: 60,
    clockMinArrowStep: 2 * Math.PI / 60,

    frontBackgroundColor: "red",
    rearBackgroundColor: "blue",
    middleBackgroundColor: "black",
    outerRingColor: "black",
    handSecondColor: "red",
    handMinuteColor: "red",
    handHourColor: "red",
    handSecondColor2: "yellow",
    handMinuteColor2: "yellow",
    handHourColor2: "yellow",

    blobColor: "black",
    blobRadius: 1,

    arrowSmallColor: "red",
    arrowBigColor: "red",
    arrow12oclockColor: "orange",
    arrowSmallHeight: 2.6,
    arrowSmallWidth: 0.1,
    arrowSmallDepth: 4.9,
    arrowBigHeight: 5.2,
    arrowBigWidth: 0.2,
    arrowBigDepth: 5.2,

    handDistanceFromCenterFront: 1.8,
    handSecondHeight: 35,
    handSecondWidth: 0.1,
    handSecondDepth: 0.1,
    handMinuteHeight: 18,
    handMinuteWidth: 0.25,
    handMinuteDepth: 0.5,
    handHourHeight: 10,
    handHourWidth: 0.2,
    handHourDepth: 0.5,

    stepSecondHand: 2 * Math.PI / 60,
    stepMinuteHand: 2 * Math.PI / 60,
    stepHourHand: 2 * Math.PI / 12,
  }

  // add outer ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(watch.clockRadius, 2.6, 100, 100),
    new THREE.MeshBasicMaterial({ color: watch.outerRingColor })
  );
  scene.add(ring);

  // add blob
  const blobGeo = new THREE.SphereBufferGeometry(watch.blobRadius, 32, 32);
  const blobMaterial = new THREE.MeshLambertMaterial({ color: watch.blobColor, transparent: false, opacity: 0.5 });
  const blob = new THREE.Mesh(blobGeo, blobMaterial);
  blob.scale.set(1, 1, 3);
  ring.add(blob);

  // add clock background
  for (let i = 0; i < 3; i++) {
    let color, offset, opacity;
    if (i === 0) {
      offset = 2.4;
      color = watch.frontBackgroundColor;
      opacity = 0.3;
    } else if (i === 1) {
      offset = -2.4;
      color = watch.rearBackgroundColor;
      opacity = 0.3;
    } else {
      offset = 0;
      color = watch.middleBackgroundColor;
      opacity = 0.9;
    }
    const clockBackground = new THREE.Mesh(
      new THREE.CircleGeometry(watch.clockRadius, 50),
      new THREE.MeshLambertMaterial({ color: color, side: THREE.DoubleSide, transparent: true, opacity: opacity })
    );
    clockBackground.position.z = offset;
    ring.add(clockBackground);
  }

  // add minute indicators
  for (let i = 0; i < watch.numOfArrows; i++) {
    let color, width, height, depth, offset;
    if (i === 0) {
      color = watch.arrow12oclockColor;
      width = watch.arrowBigWidth;
      height = watch.arrowBigHeight;
      depth = watch.arrowBigDepth;
      offset = 0;
    } else if (i % 5 === 0) {
      color = watch.arrowBigColor;
      width = watch.arrowBigWidth;
      height = watch.arrowBigHeight;
      depth = watch.arrowBigDepth;
      offset = 0;
    } else {
      color = watch.arrowSmallColor;
      width = watch.arrowSmallWidth;
      height = watch.arrowSmallHeight;
      depth = watch.arrowSmallDepth;
      offset = -1.4;
    }
    const arrowGeo = new THREE.BoxBufferGeometry(width, height, depth);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: color });
    const arrow = new THREE.Mesh(arrowGeo, arrowMaterial);
    arrow.position.y = (watch.clockRadius + offset) * Math.cos(watch.clockMinArrowStep * i);
    arrow.position.x = (watch.clockRadius + offset) * Math.sin(watch.clockMinArrowStep * i);
    arrow.rotation.z = -watch.clockMinArrowStep * i;
    ring.add(arrow);
  }

  // add front & rear second hand
  const handSecondGeo = new THREE.SphereBufferGeometry(1, 32, 32);
  const handSecondMaterial = new THREE.MeshLambertMaterial({ color: watch.handSecondColor, transparent: false, opacity: 1 });
  const handSecond = new THREE.Mesh(handSecondGeo, handSecondMaterial);
  handSecond.position.z = watch.handDistanceFromCenterFront;
  handSecond.scale.set(watch.handSecondWidth, watch.handSecondHeight / 2, watch.handSecondDepth);
  ring.add(handSecond);

  const handSecondGeo2 = new THREE.SphereBufferGeometry(1, 32, 32);
  const handSecondMaterial2 = new THREE.MeshLambertMaterial({ color: watch.handSecondColor2, transparent: false, opacity: 1 });
  const handSecond2 = new THREE.Mesh(handSecondGeo2, handSecondMaterial2);
  handSecond2.position.z = -watch.handDistanceFromCenterFront;
  handSecond2.scale.set(watch.handSecondWidth, watch.handSecondHeight / 2, watch.handSecondDepth);
  ring.add(handSecond2);

  // add front & rear minute hand
  const handMinuteGeo = new THREE.SphereBufferGeometry(1, 32, 32);
  const handMinuteMaterial = new THREE.MeshLambertMaterial({ color: watch.handMinuteColor, transparent: false, opacity: 1 });
  const handMinute = new THREE.Mesh(handMinuteGeo, handMinuteMaterial);
  handMinute.position.z = watch.handDistanceFromCenterFront;
  handMinute.scale.set(watch.handMinuteWidth, watch.handMinuteHeight / 2, watch.handMinuteDepth);
  ring.add(handMinute);

  const handMinuteGeo2 = new THREE.SphereBufferGeometry(1, 32, 32);
  const handMinuteMaterial2 = new THREE.MeshLambertMaterial({ color: watch.handMinuteColor2, transparent: false, opacity: 1 });
  const handMinute2 = new THREE.Mesh(handMinuteGeo2, handMinuteMaterial2);
  handMinute2.position.z = -watch.handDistanceFromCenterFront;
  handMinute2.scale.set(watch.handMinuteWidth, watch.handMinuteHeight / 2, watch.handMinuteDepth);
  ring.add(handMinute2);

  // add front & rear hour hand
  const handHourGeo = new THREE.SphereBufferGeometry(1, 32, 32);
  const handHourMaterial = new THREE.MeshLambertMaterial({ color: watch.handHourColor, transparent: false, opacity: 1 });
  const handHour = new THREE.Mesh(handHourGeo, handHourMaterial);
  handHour.position.z = watch.handDistanceFromCenterFront;
  handHour.scale.set(watch.handHourWidth, watch.handHourHeight / 2, watch.handHourDepth);
  ring.add(handHour);

  const handHourGeo2 = new THREE.SphereBufferGeometry(1, 32, 32);
  const handHourMaterial2 = new THREE.MeshLambertMaterial({ color: watch.handHourColor2, transparent: false, opacity: 1 });
  const handHour2 = new THREE.Mesh(handHourGeo2, handHourMaterial2);
  handHour2.position.z = -watch.handDistanceFromCenterFront;
  handHour2.scale.set(watch.handHourWidth, watch.handHourHeight / 2, watch.handHourDepth);
  ring.add(handHour2);

  render();
  function render() {
    requestAnimationFrame(render);
    const date = new Date();
    const millis = date.getMilliseconds();
    const second = date.getSeconds();
    const minute = date.getMinutes();
    const hour = date.getHours();

    //control front hands
    handSecond.position.y = watch.handSecondHeight / 2 * Math.cos(watch.stepSecondHand * (second + millis / 1000));
    handSecond.position.x = watch.handSecondHeight / 2 * Math.sin(watch.stepSecondHand * (second + millis / 1000));
    handSecond.rotation.z = -watch.stepSecondHand * (second + millis / 1000);
    handMinute.position.y = watch.handMinuteHeight / 2 * Math.cos(watch.stepMinuteHand * (minute + second / 60));
    handMinute.position.x = watch.handMinuteHeight / 2 * Math.sin(watch.stepMinuteHand * (minute + second / 60));
    handMinute.rotation.z = -watch.stepMinuteHand * (minute + second / 60);
    handHour.position.y = watch.handHourHeight / 2 * Math.cos(watch.stepHourHand * (hour + (minute / 60)));
    handHour.position.x = watch.handHourHeight / 2 * Math.sin(watch.stepHourHand * (hour + (minute / 60)));
    handHour.rotation.z = -watch.stepHourHand * (hour + (minute / 60));

    //control rear hands
    let hourInBaku;
    if (hour >= watch.timeZoneDiffFactor) {
      hourInBaku = - (watch.timeZoneDiffFactor - hour);
    } else {
      hourInBaku = hour + 3;
    }
    handSecond2.position.y = watch.handSecondHeight / 2 * Math.cos(watch.stepSecondHand * (second + millis / 1000));
    handSecond2.position.x = -watch.handSecondHeight / 2 * Math.sin(watch.stepSecondHand * (second + millis / 1000));
    handSecond2.rotation.z = watch.stepSecondHand * (second + millis / 1000);
    handMinute2.position.y = watch.handMinuteHeight / 2 * Math.cos(watch.stepMinuteHand * (minute + second / 60));
    handMinute2.position.x = -watch.handMinuteHeight / 2 * Math.sin(watch.stepMinuteHand * (minute + second / 60));
    handMinute2.rotation.z = watch.stepMinuteHand * (minute + second / 60);
    handHour2.position.y = watch.handHourHeight / 2 * Math.cos(watch.stepHourHand * (hourInBaku + (minute / 60)));
    handHour2.position.x = -watch.handHourHeight / 2 * Math.sin(watch.stepHourHand * (hourInBaku + (minute / 60)));
    handHour2.rotation.z = watch.stepHourHand * (hourInBaku + (minute / 60));

    //control camera #3
    camera3.position.y = watch.camera3Offset * Math.cos(watch.stepSecondHand * (second + millis / 1000));
    camera3.position.x = watch.camera3Offset * Math.sin(watch.stepSecondHand * (second + millis / 1000));
    camera3.lookAt(scene.position);

    // controls3.update();

    renderer.render(scene, camera3);
  }
}