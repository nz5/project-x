import * as THREE from "three";
import TrackballControls from 'three-trackballcontrols';
import {
    tetris,
    addGrids,
    makeRandomTetrimino,
    Keys
} from './helper';

export default function initScene(scene, renderer, canvasId, canvasParentId) {
    var height = window.innerHeight - 200,
        width = window.innerWidth;
    renderer.setClearColor(0x282c43);    // set background color
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






// -----------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------
function initNewGame() {
    tetris.playAgain = false;
    tetris.gameLost = false;
    tetris.tetInAction = null;
    tetris.tetriminoMoved = false;

    for (let i = 0; i < tetris.yGridDivision; i++) {
        tetris.levelsBool[i] = new Array();
        tetris.levelsCube[i] = new Array();
        for (let j = 0; j < tetris.xGridDivision; j++) {
            tetris.levelsBool[i][j] = new Array();
            tetris.levelsCube[i][j] = new Array();
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
    tetris.tetInAction.moveDown(false);
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
        const levelsToClean = new Array();
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
            if (levelFillCounter > 6) {     //for demo only. 7 cubes on each level is enough to clean that level
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
                cubesInGameCounter.innerHTML = "Cubes in game=" + tetris.cubesInSceneCounter;
                cubesRemovedCounter.innerHTML = "Cubes removed counter=" + tetris.cubesRemovedCounter;
            } else {
                console.log("NO cleaning= " + i);
            }
        }

        //slide down upper levels

        tetris.tetriminoMoved = false;
    }
}

// -----------------------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------------------



//add game mode selection buttons
const button = document.createElement('button');
button.innerHTML = 'MANUAL MODE';
button.className += 'button';
button.addEventListener('click', whenManualMode);
document.getElementById(canvasParentId).appendChild(button);
// document.body.appendChild(button);
function whenManualMode() {
    tetris.manualMode = true;
}

const button2 = document.createElement('button');
button2.innerHTML = 'AUTO MODE';
button2.className += 'button';
button2.addEventListener('click', whenAutoMode);
document.getElementById(canvasParentId).appendChild(button2);
// document.body.appendChild(button2);
function whenAutoMode() {
    tetris.manualMode = false;
}

//show cube counters
const cubesInGameCounter = document.createElement('button');
cubesInGameCounter.innerHTML = "Cubes in game = " + tetris.cubesInSceneCounter;
cubesInGameCounter.className += 'button';
// document.body.appendChild(cubesInGameCounter);
document.getElementById(canvasParentId).appendChild(cubesInGameCounter);


const cubesRemovedCounter = document.createElement('button');
cubesRemovedCounter.innerHTML = "Cubes removed = " + tetris.cubesRemovedCounter;
cubesRemovedCounter.className += 'button';
// document.body.appendChild(cubesRemovedCounter);
document.getElementById(canvasParentId).appendChild(cubesRemovedCounter);


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
                tetris.tetInAction.moveDown(false);
            }
        } else if (event.keyCode === Keys.SPACE) {
            tetris.tetInAction.moveDown(true);
        }
    }
}













}

//* Initialize webGL
// const canvas = document.getElementById("myCanvas");
// const renderer = new THREE.WebGLRenderer({ canvas: canvas });
// renderer.setClearColor(0x000000);    // set background color
// renderer.shadowMap.enabled = true;

// const scene = new THREE.Scene();

// let camera = new THREE.PerspectiveCamera(40, canvas.width / canvas.height, 0.1, 10000);
// camera.position.set(130, 250, 170);
// camera.lookAt(scene.position);





// // -----------------------------------------------------------------------------------------------------------------------------
// // -----------------------------------------------------------------------------------------------------------------------------
// function initNewGame() {
//     tetris.playAgain = false;
//     tetris.gameLost = false;
//     tetris.tetInAction = null;
//     tetris.tetriminoMoved = false;

//     for (let i = 0; i < tetris.yGridDivision; i++) {
//         tetris.levelsBool[i] = new Array();
//         tetris.levelsCube[i] = new Array();
//         for (let j = 0; j < tetris.xGridDivision; j++) {
//             tetris.levelsBool[i][j] = new Array();
//             tetris.levelsCube[i][j] = new Array();
//             for (let k = 0; k < tetris.zGridDivision; k++) {
//                 tetris.levelsBool[i][j][k] = false;
//                 tetris.levelsCube[i][j][k] = null;
//             }
//         }
//     }
//     addGrids();
//     makeRandomTetrimino();
// }

// function runInAutoMode() {
//     tetris.tetInAction.moveDown(false);
// }

// // -----------------------------------------------------------------------------------------------------------------------------
// // -----------------------------------------------------------------------------------------------------------------------------
// // -----------------------------------------------      M A I N    -------------------------------------------------------------
// // -----------------------------------------------------------------------------------------------------------------------------
// // -----------------------------------------------------------------------------------------------------------------------------


// initNewGame();
// let previousSec, sec = new Date().getSeconds();
// function render() {
//     requestAnimationFrame(render);

//     sec = new Date().getSeconds();
//     if (!tetris.gameLost) {
//         if (sec !== previousSec) {
//             previousSec = sec;
//             if (!tetris.manualMode) {
//                 runInAutoMode();
//             }
//             checkAndRemoveFilledLevels();
//         }
//     } else if (tetris.playAgain) {
//         scene.remove.apply(scene, scene.children);
//         initNewGame();
//     }

//     controls.update();
//     renderer.render(scene, camera);
// }
// render();


// function checkAndRemoveFilledLevels() {

//     if (tetris.tetriminoMoved) {
//         //check which levels need to be removed
//         const levelsToClean = new Array();
//         for (let i = 0; i < tetris.yGridDivision; i++) {
//             let levelFillCounter = 0;
//             let j;
//             let k;
//             for (j = 0; j < tetris.xGridDivision; j++) {
//                 for (k = 0; k < tetris.zGridDivision; k++) {
//                     if (tetris.levelsBool[i][j][k] === true) {
//                         levelFillCounter++;
//                     }
//                 }
//             }
//             if (levelFillCounter > 6) {     //for demo only. 7 cubes on each level is enough to clean that level
//                 levelsToClean[i] = true;
//             } else {
//                 levelsToClean[i] = false;
//             }
//         }

//         //remove levels
//         for (let i = 0; i < levelsToClean.length; i++) {
//             if (levelsToClean[i]) {
//                 for (let j = 0; j < tetris.levelsBool[i].length; j++) {
//                     const cubes = tetris.levelsBool[i];
//                     for (let k = 0; k < cubes[j].length; k++) {
//                         if (cubes[j][k]) {
//                             cubes[j][k] = false;
//                             tetris.cubesRemovedCounter++;
//                             tetris.cubesInSceneCounter--;
//                             scene.remove(tetris.levelsCube[i][j][k]);
//                         }
//                     }
//                 }
//                 cubesInGameCounter.innerHTML = "Cubes in game=" + tetris.cubesInSceneCounter;
//                 cubesRemovedCounter.innerHTML = "Cubes removed counter=" + tetris.cubesRemovedCounter;
//             } else {
//                 console.log("NO cleaning= " + i);
//             }
//         }

//         //slide down upper levels

//         tetris.tetriminoMoved = false;
//     }
// }

// // -----------------------------------------------------------------------------------------------------------------------------
// // -----------------------------------------------------------------------------------------------------------------------------



// //add game mode selection buttons
// const button = document.createElement('button');
// button.innerHTML = 'MANUAL MODE';
// button.className += 'button';
// button.addEventListener('click', whenManualMode);
// document.body.appendChild(button);
// function whenManualMode() {
//     tetris.manualMode = true;
// }

// const button2 = document.createElement('button');
// button2.innerHTML = 'AUTO MODE';
// button2.className += 'button';
// button2.addEventListener('click', whenAutoMode);
// document.body.appendChild(button2);
// function whenAutoMode() {
//     tetris.manualMode = false;
// }

// //show cube counters
// const cubesInGameCounter = document.createElement('button');
// cubesInGameCounter.innerHTML = "Cubes in game = " + tetris.cubesInSceneCounter;
// cubesInGameCounter.className += 'button';
// document.body.appendChild(cubesInGameCounter);

// const cubesRemovedCounter = document.createElement('button');
// cubesRemovedCounter.innerHTML = "Cubes removed = " + tetris.cubesRemovedCounter;
// cubesRemovedCounter.className += 'button';
// document.body.appendChild(cubesRemovedCounter);


// //detect keyboard inputs
// document.addEventListener('keydown', whenKeyDown);
// function whenKeyDown(event) {
//     if (!tetris.gameLost) {
//         if (event.keyCode === Keys.LEFT) {
//             tetris.tetInAction.moveLeft();
//         } else if (event.keyCode === Keys.RIGHT) {
//             tetris.tetInAction.moveRight();
//         } else if (event.keyCode === Keys.UP) {
//             tetris.tetInAction.moveFront();
//         } else if (event.keyCode === Keys.DOWN) {
//             tetris.tetInAction.moveBack();
//         } else if (event.keyCode === Keys.Q) {
//             if (tetris.manualMode) {
//                 tetris.tetInAction.moveUp();
//             }
//         } else if (event.keyCode === Keys.A) {
//             if (tetris.manualMode) {
//                 tetris.tetInAction.moveDown(false);
//             }
//         } else if (event.keyCode === Keys.SPACE) {
//             tetris.tetInAction.moveDown(true);
//         }
//     }
// }