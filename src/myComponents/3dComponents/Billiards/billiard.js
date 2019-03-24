import * as THREE from "three";
import TrackballControls from 'three-trackballcontrols';

export default function initScene(scene, renderer, canvasId, bgColor, viewId) {
    var height = window.innerHeight - 200,
        width = window.innerWidth;
    renderer.setClearColor(bgColor);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    const domElem = renderer.domElement;
    domElem.id = canvasId;
    domElem.style.width ='100%';
    domElem.style.height='100%';
    document.getElementById(viewId).appendChild(domElem);

    const txtLoader = new THREE.TextureLoader();

    let camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 10000);
    camera.position.set(40, 80, 180);
    camera.lookAt(scene.position);

    let controls = new TrackballControls(camera, domElem);

    //add reset button
    const button = document.createElement('button');
    button.innerHTML = 'R E S E T';
    button.className += 'buttonBilliard';
    button.addEventListener('click', whenResetButtonPressed);
    document.body.appendChild(button);
    function whenResetButtonPressed() {
        for (let index = 0; index < balls.ball.length; index++) {
            setInitialSpeeds(index);
        }
    }

    //------------------------------------------------------------------------------------------------------------------------------

    const balls = {
        radius: 2,
        randomInitialSpeedMax: 220,
        numOfBalls: 8,
        ball: [],
        ballColorSpecular: "yellow",
        ballSpeed: [],
        ballPosition: [],
        ballOmega: [],
        ballAx: [],
        frictionFactor: 0.7,
        frictionFactorCushion: 1,
        frictionFactorBall: 0.1,
    }

    const table = {
        bedLength: 80,
        bedWidth: 40,
        bedColor: "green",
        bedShininess: 10,
        bedColorSpecular: "black",

        cushionWidth: 4,

        floorLength: 200,
        floorWidth: 150,
        floorColor: "green",
        floorShininess: 0,
        floorColorSpecular: "gray",

        ceilingRadius: 15,
        ceilingColor: "gray",
        ceilingOpacity: 0.5,
        cordLength: 4,
        cordRadius: 0.5,
        cordColor: "gray",

        legHeight: 20,
        legRadiousTop: 2,
        legRadiousBottom: 1,
        legColor: "black",

        lightHeight: 50,
        lightBulbRadius: 2,
    }

    addLights();
    addBed();
    addLegs();
    addCeiling();
    addCord();
    addFloor();
    addCushions();
    addBalls();

    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------      M A I N    -------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------

    const computerClock = new THREE.Clock();

    function render() {
        requestAnimationFrame(render);

        const dt = computerClock.getDelta();
        // const t = computerClock.getElapsedTime();
        // const millis = new Date().getMilliseconds;

        for (let ballNumber = 0; ballNumber < balls.ballPosition.length; ballNumber++) {
            updateBallPosition(ballNumber, dt);
            checkBallWallOverlap(ballNumber);
            checkBallBallOverlap(ballNumber);
        }

        controls.update();
        renderer.render(scene, camera);
    }
    render();


    function checkBallBallOverlap(i) {
        for (let j = 0; j < i; j++) {
            if (doBallsCollide(i, j)) {
                const p1 = balls.ballPosition[i];
                const p2 = balls.ballPosition[j];
                const u1 = balls.ballSpeed[i];
                const u2 = balls.ballSpeed[j];

                const d = new THREE.Vector3();
                const v1 = new THREE.Vector3();
                const v2 = new THREE.Vector3();
                d.subVectors(p2, p1);
                const temp = d.clone().multiplyScalar(u1.clone().sub(u2).dot(d) / Math.pow(d.length(), 2));
                v1.subVectors(u1, temp);
                v2.addVectors(u2, temp);

                balls.ballSpeed[i] = v1.multiplyScalar(1 - balls.frictionFactorBall);
                balls.ballSpeed[j] = v2.multiplyScalar(1 - balls.frictionFactorBall);
                balls.ballOmega[i] = balls.ballSpeed[i].length() / balls.radius;
                balls.ballOmega[j] = balls.ballSpeed[j].length() / balls.radius;
                balls.ballAx[i] = balls.ballSpeed[i].clone().cross(new THREE.Vector3(0, 1, 0));
                balls.ballAx[i].multiplyScalar(-1);
                balls.ballAx[i].normalize();
                balls.ballAx[j] = balls.ballSpeed[j].clone().cross(new THREE.Vector3(0, 1, 0));
                balls.ballAx[j].multiplyScalar(-1);
                balls.ballAx[j].normalize();
            }
        }
    }

    function doBallsCollide(ball1, ball2) {

        const v = new THREE.Vector3();
        const d = new THREE.Vector3();
        v.subVectors(balls.ballSpeed[ball2], balls.ballSpeed[ball1]);
        d.subVectors(balls.ballPosition[ball2], balls.ballPosition[ball1]);

        const dotPr = v.dot(d);
        const moveTowardsEachOther = (dotPr < 0);
        const overlap = doBallsOverlap(ball1, ball2);

        return overlap && moveTowardsEachOther;
    }

    function checkBallWallOverlap(ballNumber) {
        const ballPos = balls.ballPosition[ballNumber];
        const ballSpeed = balls.ballSpeed[ballNumber];

        //check x coordinates
        if (ballPos.x > table.bedWidth - balls.radius) {
            ballSpeed.x = -Math.abs(ballSpeed.x);
            ballSpeed.multiplyScalar(balls.frictionFactorCushion, 1, balls.frictionFactorCushion);
            balls.ballAx[ballNumber] = ballSpeed.clone().cross(new THREE.Vector3(0, 1, 0));
            balls.ballAx[ballNumber].multiplyScalar(-1);
            balls.ballAx[ballNumber].normalize();
        }
        if (ballPos.x < balls.radius) {
            ballSpeed.x = Math.abs(ballSpeed.x);
            ballSpeed.multiplyScalar(balls.frictionFactorCushion, 1, balls.frictionFactorCushion);
            balls.ballAx[ballNumber] = ballSpeed.clone().cross(new THREE.Vector3(0, 1, 0));
            balls.ballAx[ballNumber].multiplyScalar(-1);
            balls.ballAx[ballNumber].normalize();
        }

        //check z coordinates
        if (ballPos.z > table.bedLength - balls.radius) {
            ballSpeed.z = -Math.abs(ballSpeed.z);
            ballSpeed.multiplyScalar(balls.frictionFactorCushion, 1, balls.frictionFactorCushion);
            balls.ballAx[ballNumber] = ballSpeed.clone().cross(new THREE.Vector3(0, 1, 0));
            balls.ballAx[ballNumber].multiplyScalar(-1);
            balls.ballAx[ballNumber].normalize();
        }
        if (ballPos.z < balls.radius) {
            ballSpeed.z = Math.abs(ballSpeed.z);
            ballSpeed.multiplyScalar(balls.frictionFactorCushion, 1, balls.frictionFactorCushion);
            balls.ballAx[ballNumber] = ballSpeed.clone().cross(new THREE.Vector3(0, 1, 0));
            balls.ballAx[ballNumber].multiplyScalar(-1);
            balls.ballAx[ballNumber].normalize();
        }
    }

    function updateBallPosition(ballNumber, dt) {
        applyNaturalFriction(ballNumber, dt)
        const ball = balls.ball[ballNumber];
        const ballPos = balls.ballPosition[ballNumber];
        const dR = new THREE.Matrix4();
        dR.makeRotationAxis(balls.ballAx[ballNumber], balls.ballOmega[ballNumber] * dt);
        ball.matrix.premultiply(dR);
        ballPos.add(balls.ballSpeed[ballNumber].clone().multiplyScalar(dt));
        ball.matrix.setPosition(ballPos);
    }

    function applyNaturalFriction(index, dt) {
        const ballSpeed = balls.ballSpeed[index];
        ballSpeed.multiplyScalar(1 - balls.frictionFactor * dt);
        balls.ballOmega[index] = ballSpeed.length() / balls.radius;
        balls.ballAx[index] = ballSpeed.clone().cross(new THREE.Vector3(0, 1, 0));
        balls.ballAx[index].multiplyScalar(-1);
        balls.ballAx[index].normalize();
    }

    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------------------    ADD BALLS and SET RANDOM Speed    ------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------

    function addBalls() {
        for (let ballNumber = 0; ballNumber < balls.numOfBalls - 1; ballNumber++) {
            const txtFileName = './skins/Ball' + (ballNumber + 8) + '.jpg'
            const txtMap = txtLoader.load(txtFileName);
            const ballGeo = new THREE.SphereBufferGeometry(balls.radius, 38, 38);
            let ballMaterial = new THREE.MeshPhongMaterial({
                transparent: false, opacity: 1, map: txtMap,
                side: THREE.DoubleSide, specular: balls.ballColorSpecular, shininess: 50,
            });
            // const ballMaterial = new THREE.MeshPhongMaterial({wireframe: false, map: txtMap});

            const ball = new THREE.Mesh(ballGeo, ballMaterial);
            ball.castShadow = true;
            ball.matrixAutoUpdate = false;
            balls.ball[ballNumber] = ball;

            do {
                setInitialPositions(ballNumber);
            } while (doesOverlapWithOthers(ballNumber));
            setInitialSpeeds(ballNumber);
            ball.matrix.setPosition(balls.ballPosition[ballNumber]);
            scene.add(ball);
        }
    }

    function doesOverlapWithOthers(ballNumberToAdd) {
        for (let ballNumberOther = 0; ballNumberOther < balls.ball.length - 1; ballNumberOther++) {
            if (doBallsOverlap(ballNumberToAdd, ballNumberOther)) {
                return true;
            }
        }
        return false;
    }

    function doBallsOverlap(newBall, existingBall) {
        const distance =
            Math.pow((balls.ballPosition[newBall].x - balls.ballPosition[existingBall].x), 2) +
            Math.pow((balls.ballPosition[newBall].z - balls.ballPosition[existingBall].z), 2);
        if (distance <= Math.pow((balls.radius * 2), 2)) {
            return true;
        }
        return false;
    }

    function setInitialSpeeds(index) {
        balls.ballSpeed[index] = new THREE.Vector3(balls.randomInitialSpeedMax * Math.random() * getRandomSign(),
            0,
            balls.randomInitialSpeedMax * Math.random() * getRandomSign());
        balls.ballOmega[index] = balls.ballSpeed[index].length() / balls.radius;
        balls.ballAx[index] = balls.ballSpeed[index].clone().cross(new THREE.Vector3(0, 1, 0));
        balls.ballAx[index].multiplyScalar(-1);
        balls.ballAx[index].normalize();
    }

    function setInitialPositions(index) {
        const ballPos = new THREE.Vector3(
            getRandomArbitrary(0 + balls.radius, table.bedWidth - balls.radius)
            , table.legHeight + balls.radius + 0.1,
            getRandomArbitrary(0 + balls.radius, table.bedLength - balls.radius));
        balls.ballPosition[index] = ballPos;
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomSign() {
        return Math.random() < 0.5 ? 1 : -1;
    }


    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------
    // ---------------------------------------------        ADD OBJECTS            -------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------

    function addLights() {
        const targetObject = new THREE.Object3D();
        targetObject.position.x = table.bedWidth / 2;
        targetObject.position.z = table.bedLength / 2;
        scene.add(targetObject);

        const ambientLight = new THREE.AmbientLight("orange");
        scene.add(ambientLight);

        const light = new THREE.SpotLight(0xffaaff);
        light.position.set(table.bedWidth / 2, table.lightHeight, table.bedLength / 2);
        light.castShadow = true;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 40;
        light.target = targetObject;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        scene.add(light);

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(table.lightBulbRadius, 32, 32),
            new THREE.MeshPhongMaterial({ color: "black", emissive: "yellow" }));
        bulb.position.copy(light.position);
        scene.add(bulb);
    }

    function addBed() {
        const boardGeo = new THREE.PlaneBufferGeometry(table.bedWidth, table.bedLength, 32);
        const boardMaterial = new THREE.MeshPhongMaterial({
            color: table.bedColor, transparent: false, opacity: 1,
            side: THREE.DoubleSide, specular: table.bedColorSpecular, shininess: table.bedShininess
        });
        const bed = new THREE.Mesh(boardGeo, boardMaterial);
        bed.rotation.x = -Math.PI / 2;
        bed.position.x = table.bedWidth / 2;
        bed.position.y = table.legHeight + 0.05;
        bed.position.z = table.bedLength / 2;
        // bed.castShadow = true;
        bed.receiveShadow = true;
        scene.add(bed);
    }

    function addFloor() {
        const boardGeo = new THREE.PlaneBufferGeometry(table.floorWidth, table.floorLength, 32);
        const boardMaterial = new THREE.MeshPhongMaterial({
            color: table.floorColor, transparent: false,
            side: THREE.DoubleSide, specular: table.floorColorSpecular, shininess: table.floorShininess
        });
        const bed = new THREE.Mesh(boardGeo, boardMaterial);
        bed.rotation.x = -Math.PI / 2;
        bed.position.x = table.bedWidth / 2;
        bed.position.y = - 0.05;
        bed.position.z = table.bedLength / 2;
        bed.receiveShadow = true;
        scene.add(bed);
    }

    function addCord() {
        const geometry = new THREE.CylinderGeometry(table.cordRadius, table.cordRadius, table.cordLength, 32);
        const material = new THREE.MeshPhongMaterial({
            color: table.cordColor, transparent: false, opacity: 1,
            side: THREE.DoubleSide, specular: "white", shininess: 20
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.x = table.bedWidth / 2;
        cylinder.position.y = table.lightHeight + table.lightBulbRadius + table.cordLength / 2;
        cylinder.position.z = table.bedLength / 2;
        scene.add(cylinder);
    }

    function addCeiling() {
        const geometry = new THREE.CircleBufferGeometry(table.ceilingRadius, 32);
        const material = new THREE.MeshLambertMaterial({
            transparent: false, opacity: table.ceilingOpacity, color: table.ceilingColor,
            wireframeLinewidth: 2, wireframe: true, side: THREE.DoubleSide
        });
        const circle = new THREE.Mesh(geometry, material);
        circle.position.x = table.bedWidth / 2;
        circle.position.y = table.lightHeight + table.lightBulbRadius + 0.05 + table.cordLength;
        circle.position.z = table.bedLength / 2;
        circle.rotation.x = -Math.PI / 2
        scene.add(circle);
    }

    function addCushions() {
        const leftCushion = getLongCushion();
        const rightCushion = getLongCushion();
        const farCushion = getShortCushion();
        const nearCushion = getShortCushion();

        leftCushion.position.x = - table.cushionWidth / 2;
        leftCushion.position.y = table.legHeight;
        leftCushion.position.z = table.bedLength / 2;

        rightCushion.position.x = table.bedWidth + table.cushionWidth / 2;
        rightCushion.position.y = table.legHeight;
        rightCushion.position.z = table.bedLength / 2;

        farCushion.position.x = table.bedWidth / 2;
        farCushion.position.y = table.legHeight;
        farCushion.position.z = - table.cushionWidth / 2;

        nearCushion.position.x = table.bedWidth / 2;
        nearCushion.position.y = table.legHeight;
        nearCushion.position.z = table.bedLength + table.cushionWidth / 2;

        scene.add(leftCushion);
        scene.add(rightCushion);
        scene.add(farCushion);
        scene.add(nearCushion);
    }

    function addLegs() {
        const leftFar = getLeg();
        const rightFar = getLeg();
        const leftClose = getLeg();
        const rightClose = getLeg();

        leftFar.position.x = table.legRadiousTop;
        leftFar.position.y = table.legHeight / 2;
        leftFar.position.z = table.legRadiousTop;

        rightFar.position.x = table.bedWidth - table.legRadiousTop;
        rightFar.position.y = table.legHeight / 2;
        rightFar.position.z = table.legRadiousTop;

        leftClose.position.x = table.legRadiousTop;
        leftClose.position.y = table.legHeight / 2;
        leftClose.position.z = table.bedLength - table.legRadiousTop;

        rightClose.position.x = table.bedWidth - table.legRadiousTop;
        rightClose.position.y = table.legHeight / 2;
        rightClose.position.z = table.bedLength - table.legRadiousTop;

        scene.add(leftFar);
        scene.add(rightFar);
        scene.add(leftClose);
        scene.add(rightClose);
    }

    function getLeg() {
        const geometry = new THREE.CylinderGeometry(table.legRadiousTop, table.legRadiousBottom, table.legHeight, 32);
        const material = new THREE.MeshPhongMaterial({
            color: table.legColor, transparent: false, opacity: 1,
            side: THREE.DoubleSide, specular: "white", shininess: 20
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.castShadow = true;
        return cylinder;
    }

    function getLongCushion() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({
            color: table.bedColor, transparent: false, opacity: 1,
            side: THREE.DoubleSide, specular: table.bedColorSpecular, shininess: table.bedShininess
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.scale.z = table.bedLength + 2 * table.cushionWidth;
        cube.scale.x = table.cushionWidth;
        cube.scale.y = table.cushionWidth;
        return cube;
    }

    function getShortCushion() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({
            color: table.bedColor, transparent: false, opacity: 1,
            side: THREE.DoubleSide, specular: table.bedColorSpecular, shininess: table.bedShininess
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.scale.z = table.cushionWidth;
        cube.scale.x = table.bedWidth + 2 * table.cushionWidth;
        cube.scale.y = table.cushionWidth;
        return cube;
    }
}