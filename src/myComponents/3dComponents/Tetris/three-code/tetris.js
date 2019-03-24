import * as THREE from "three";
import TrackballControls from 'three-trackballcontrols';
import {
    tetris,
    addGrids,
    makeRandomTetrimino,
    Keys
} from './helper';

let sceneAlias;

export default function initScene(scene, renderer, canvasId, canvasParentId) {
    sceneAlias = scene;
    var height = window.innerHeight - 200,
        width = window.innerWidth;
    renderer.setClearColor(0x282c34);    // set background color
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    const domElem = renderer.domElement;
    domElem.id = canvasId;
    document.getElementById(canvasParentId).appendChild(domElem);
    let camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 10000);
    scene.add(camera);
    camera.position.set(130, 250, 170);
    camera.lookAt(scene.position);

    let controls = new TrackballControls(camera, domElem);

    // Resize Three.js scene on window resize
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------

    //add game mode selection buttons
    const button = document.createElement('button');
    button.innerHTML = 'MANUAL MODE';
    button.className += 'buttonTetrisManualMode';
    button.addEventListener('click', whenManualMode);
    document.getElementById(canvasParentId).appendChild(button);
    // document.body.appendChild(button);
    function whenManualMode() {
        tetris.manualMode = true;
    }

    const button2 = document.createElement('button');
    button2.innerHTML = 'AUTO MODE';
    button2.className += 'buttonTetrisAutoMode';
    button2.addEventListener('click', whenAutoMode);
    document.getElementById(canvasParentId).appendChild(button2);
    // document.body.appendChild(button2);
    function whenAutoMode() {
        tetris.manualMode = false;
    }

    //show cube counters
    const cubesInGameCounter = document.createElement('h3');
    cubesInGameCounter.innerHTML = "Cubes in game = " + tetris.cubesInSceneCounter;
    cubesInGameCounter.className += 'buttonCubeInGameCount';
    // document.body.appendChild(cubesInGameCounter);
    document.getElementById(canvasParentId).appendChild(cubesInGameCounter);

    const cubesRemovedCounter = document.createElement('h3');
    cubesRemovedCounter.innerHTML = "Cubes removed = " + tetris.cubesRemovedCounter;
    cubesRemovedCounter.className += 'buttonCubeRemovedCount';
    // document.body.appendChild(cubesRemovedCounter);
    document.getElementById(canvasParentId).appendChild(cubesRemovedCounter);

    const instructionsText = document.createElement('p');
    instructionsText.innerHTML = "⚠️<br/>Press A,Q: ⬆️⬇️<br/>Press arrows: ⬅️➡️↙️️↗️ <br/>Press space: ⬇️🔃";
    instructionsText.className += 'instructionsText';
    // document.body.appendChild(cubesRemovedCounter);
    document.getElementById(canvasParentId).appendChild(instructionsText);


    //detect keyboard inputs
    document.addEventListener('keydown', whenKeyDown);
    function whenKeyDown(event) {
        if (!tetris.gameLost) {
            if (event.keyCode === Keys.LEFT) {
                tetris.tetInAction.moveLeft();
            } else if (event.keyCode === Keys.RIGHT) {
                tetris.tetInAction.moveRight();
            } else if (event.keyCode === Keys.UP) {
                tetris.tetInAction.moveFront();
            } else if (event.keyCode === Keys.DOWN) {
                tetris.tetInAction.moveBack();
            } else if (event.keyCode === Keys.Q) {
                if (tetris.manualMode) {
                    tetris.tetInAction.moveUp();
                }
            } else if (event.keyCode === Keys.A) {
                if (tetris.manualMode) {
                    tetris.tetInAction.moveDown(false, sceneAlias);
                }
            } else if (event.keyCode === Keys.SPACE) {
                tetris.tetInAction.moveDown(true, sceneAlias);
            }
        }
    }


    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------
    function initNewGame() {
        tetris.playAgain = false;
        tetris.gameLost = false;
        tetris.tetInAction = null;
        tetris.tetriminoMoved = false;
        tetris.cubesRemovedCounter = 0;
        tetris.cubesInSceneCounter = 0;
        cubesInGameCounter.innerHTML = "Cubes in game =" + tetris.cubesInSceneCounter;
        cubesRemovedCounter.innerHTML = "Cubes removed =" + tetris.cubesRemovedCounter;

        for (let i = 0; i < tetris.yGridDivision; i++) {
            tetris.levelsBool[i] = [];
            tetris.levelsCube[i] = [];
            for (let j = 0; j < tetris.xGridDivision; j++) {
                tetris.levelsBool[i][j] = [];
                tetris.levelsCube[i][j] = [];
                for (let k = 0; k < tetris.zGridDivision; k++) {
                    tetris.levelsBool[i][j][k] = false;
                    tetris.levelsCube[i][j][k] = null;
                }
            }
        }
        addGrids(scene);
        makeRandomTetrimino(scene);
    }

    function runInAutoMode() {
        tetris.tetInAction.moveDown(false, scene);
    }

    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------      M A I N    -------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------------------


    initNewGame();
    let previousSec, sec = new Date().getSeconds();
    function render() {
        requestAnimationFrame(render);

        sec = new Date().getSeconds();
        if (!tetris.gameLost) {
            if (sec !== previousSec) {
                previousSec = sec;
                if (!tetris.manualMode) {
                    runInAutoMode();
                }
                checkAndRemoveFilledLevels();
            }
        } else if (tetris.playAgain) {
            scene.remove.apply(scene, scene.children);
            initNewGame();
        }
        controls.update();
        renderer.render(scene, camera);
    }
    render();


    function checkAndRemoveFilledLevels() {
        if (tetris.tetriminoMoved) {
            //check which levels need to be removed
            const levelsToClean = [];
            for (let i = 0; i < tetris.yGridDivision; i++) {
                let levelFillCounter = 0;
                let j;
                let k;
                for (j = 0; j < tetris.xGridDivision; j++) {
                    for (k = 0; k < tetris.zGridDivision; k++) {
                        if (tetris.levelsBool[i][j][k] === true) {
                            levelFillCounter++;
                        }
                    }
                }
                if (levelFillCounter > 7) {     //for demo only. 7 cubes on each level is enough to clean that level
                    levelsToClean[i] = true;
                } else {
                    levelsToClean[i] = false;
                }
            }

            //remove levels
            for (let i = 0; i < levelsToClean.length; i++) {
                if (levelsToClean[i]) {
                    for (let j = 0; j < tetris.levelsBool[i].length; j++) {
                        const cubes = tetris.levelsBool[i];
                        for (let k = 0; k < cubes[j].length; k++) {
                            if (cubes[j][k]) {
                                cubes[j][k] = false;
                                tetris.cubesRemovedCounter++;
                                tetris.cubesInSceneCounter--;
                                scene.remove(tetris.levelsCube[i][j][k]);
                            }
                        }
                    }
                    cubesInGameCounter.innerHTML = "Cubes in game =" + tetris.cubesInSceneCounter;
                    cubesRemovedCounter.innerHTML = "Cubes removed =" + tetris.cubesRemovedCounter;
                } else {
                    // console.log("NO cleaning= " + i);
                }
            }

            //slide down upper levels
            tetris.tetriminoMoved = false;
        }
    }
}

