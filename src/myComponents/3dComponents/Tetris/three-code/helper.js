import * as THREE from "three";


const tetris = {
    xGridColor: "blue",
    yGridColor: "green",
    zGridColor: "red",
    xGridDivision: 6,
    yGridDivision: 12,
    zGridDivision: 5,
    gridStepSize: 10,

    tetInAction: null,
    tetriminoMoved: false,
    manualMode: true,
    gameLost: false,
    playAgain: false,
    removableItems: [],
    cubesInSceneCounter: 0,
    cubesRemovedCounter: 0,

    levelsBool: [],
    levelsCube: [],
}

const tetriminos = {
    size: 8,
    bevelThickness: 1,
    bevelSegments: 2,

    tColor: "blue",
    sColor: "red",
    colors: ["red", "blue", "yellow", "purple", "green", "orange", "gray"],
    shapes: [
        [   //sShape: red
            [false, false, false, false],
            [false, false, true, true],
            [false, true, true, false],
            [false, false, false, false],
        ],
        [   //tShape: blue
            [false, false, false, false],
            [false, true, true, true],
            [false, false, true, false],
            [false, false, false, false],
        ],
        [   //iShape: yellow
            [false, false, false, false],
            [true, true, true, true],
            [false, false, false, false],
            [false, false, false, false],
        ],
        [   //jShape: purple
            [false, false, false, false],
            [false, true, true, true],
            [false, false, false, true],
            [false, false, false, false],
        ],
        [   //lShape: green
            [false, false, false, false],
            [false, true, true, true],
            [false, true, false, false],
            [false, false, false, false],
        ],
        [   //oShape: orange
            [false, false, false, false],
            [false, true, true, false],
            [false, true, true, false],
            [false, false, false, false],
        ],
        [   //zShape: gray
            [false, false, false, false],
            [false, true, true, false],
            [false, false, true, true],
            [false, false, false, false],
        ]
    ]
}

class TetObj {
    constructor(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.cubes = [a, b, c, d];
    }

    addToScene(scene) {
        for (let j = 0; j < this.cubes.length; j++) {
            scene.add(this.cubes[j]);
            tetris.removableItems.push(this.cubes[j]);
            tetris.cubesInSceneCounter++;
        }
    }

    moveLeft() {
        tetris.tetriminoMoved = true;
        const temp = [];
        let outOfGrid = false;
        let doesCollide = false;
        const doesCollideArray = [];
        let cubeY;
        let cubeX;
        let cubeZ;
        for (let j = 0; j < this.cubes.length; j++) {
            temp[j] = this.cubes[j].position.x - tetris.gridStepSize;

            //is out of grid ?
            if (temp[j] < 1) {
                outOfGrid = true;
            }

            //is collision detected ?
            cubeY = (this.cubes[j].position.y - 1) / 10;
            cubeX = (temp[j] - 1) / 10;
            cubeZ = (this.cubes[j].position.z - 1) / 10;
            if (cubeX >= 0) {
                doesCollideArray[j] = checkIfCollide(cubeY, cubeX, cubeZ, tetris.levelsBool);
            }
        }
        doesCollide = checkIfCollideFromArray(doesCollideArray);

        //if not collide, not out -> update position
        if (!outOfGrid && !doesCollide) {
            for (let j = 0; j < this.cubes.length; j++) {
                this.cubes[j].position.x = temp[j];
            }
        }
    }

    moveRight() {
        tetris.tetriminoMoved = true;
        const temp = [];
        let outOfGrid = false;
        let doesCollide = false;
        const doesCollideArray = [];
        let cubeY;
        let cubeX;
        let cubeZ;
        for (let j = 0; j < this.cubes.length; j++) {
            temp[j] = this.cubes[j].position.x + tetris.gridStepSize;

            //is out of grid ?
            if (temp[j] > 51) {
                outOfGrid = true;
            }

            //is collision detected ?
            cubeY = (this.cubes[j].position.y - 1) / 10;
            cubeX = (temp[j] - 1) / 10;
            cubeZ = (this.cubes[j].position.z - 1) / 10;
            if (cubeX <= 5) {
                doesCollideArray[j] = checkIfCollide(cubeY, cubeX, cubeZ, tetris.levelsBool);
            }
        }
        doesCollide = checkIfCollideFromArray(doesCollideArray);

        //if not collide, not out -> update position
        if (!outOfGrid && !doesCollide) {
            for (let j = 0; j < this.cubes.length; j++) {
                this.cubes[j].position.x = temp[j];
            }
        }
    }

    moveFront() {
        tetris.tetriminoMoved = true;
        const temp = [];
        let outOfGrid = false;
        let doesCollide = false;
        const doesCollideArray = [];
        let cubeY;
        let cubeX;
        let cubeZ;
        for (let j = 0; j < this.cubes.length; j++) {
            temp[j] = this.cubes[j].position.z - tetris.gridStepSize;

            //is out of grid ?
            if (temp[j] < 1) {
                outOfGrid = true;
            }

            //is collision detected ?
            cubeY = (this.cubes[j].position.y - 1) / 10;
            cubeX = (this.cubes[j].position.x - 1) / 10;
            cubeZ = (temp[j] - 1) / 10;
            if (cubeZ >= 0) {
                doesCollideArray[j] = checkIfCollide(cubeY, cubeX, cubeZ, tetris.levelsBool);
            }
        }
        doesCollide = checkIfCollideFromArray(doesCollideArray);

        //if not collide, not out -> update position
        if (!outOfGrid && !doesCollide) {
            for (let j = 0; j < this.cubes.length; j++) {
                this.cubes[j].position.z = temp[j];
            }
        }
    }

    moveBack() {
        tetris.tetriminoMoved = true;
        const temp = [];
        let outOfGrid = false;
        let doesCollide = false;
        const doesCollideArray = [];
        let cubeY;
        let cubeX;
        let cubeZ;
        for (let j = 0; j < this.cubes.length; j++) {
            temp[j] = this.cubes[j].position.z + tetris.gridStepSize;

            //is out of grid ?
            if (temp[j] > 41) {
                outOfGrid = true;
            }

            //is collision detected ?
            cubeY = (this.cubes[j].position.y - 1) / 10;
            cubeX = (this.cubes[j].position.x - 1) / 10;
            cubeZ = (temp[j] - 1) / 10;
            if (cubeZ <= 4) {
                doesCollideArray[j] = checkIfCollide(cubeY, cubeX, cubeZ, tetris.levelsBool);
            }
        }
        doesCollide = checkIfCollideFromArray(doesCollideArray);

        //if not collide, not out -> update position
        if (!outOfGrid && !doesCollide) {
            for (let j = 0; j < this.cubes.length; j++) {
                this.cubes[j].position.z = temp[j];
            }
        }
    }

    moveUp() {
        const temp = [];
        let outOfGrid = false;
        for (let j = 0; j < this.cubes.length; j++) {
            temp[j] = this.cubes[j].position.y + tetris.gridStepSize;
            if (temp[j] > 111) {
                outOfGrid = true;
            }
        }
        if (!outOfGrid) {
            for (let j = 0; j < this.cubes.length; j++) {
                this.cubes[j].position.y = temp[j];
            }
        }
    }

    moveDown(isDropToLowest, sceneAlias) {
        tetris.tetriminoMoved = true;
        const temp = [];
        let outOfGrid = false;
        let doesCollide = false;
        const doesCollideArray = [];
        let cubeY;
        let cubeX;
        let cubeZ;
        let highestGridLevel = false;

        do {
            for (let j = 0; j < this.cubes.length; j++) {
                temp[j] = this.cubes[j].position.y - tetris.gridStepSize;
                cubeY = (temp[j] - 1) / 10;

                //is out of grid, is highest grid level?
                if (cubeY < 0) {
                    outOfGrid = true;
                } else if ((this.cubes[j].position.y - 1) / 10 === 11) {
                    highestGridLevel = true;
                }


                //is collision detected ?
                cubeX = (this.cubes[j].position.x - 1) / 10;
                cubeZ = (this.cubes[j].position.z - 1) / 10;
                if (cubeY >= 0) {
                    doesCollideArray[j] = checkIfCollide(cubeY, cubeX, cubeZ, tetris.levelsBool);
                }
            }
            doesCollide = checkIfCollideFromArray(doesCollideArray);

            //if not collide, not out -> update position
            if (!outOfGrid && !doesCollide) {
                for (let j = 0; j < this.cubes.length; j++) {
                    this.cubes[j].position.y = temp[j];
                }
            }

            //if game lost
            if (doesCollide && highestGridLevel) {
                tetris.gameLost = true;
                // tetris.playAgain = confirm("play again?");
            } else {
                highestGridLevel = false;
            }

            //if collide or out -> add all pieces to storage and create new tetrimino
            if ((outOfGrid || doesCollide) && (!tetris.gameLost)) {
                makeRandomTetrimino(sceneAlias);
                addAllPiecesToStorage(this.cubes);
            }
        } while (!outOfGrid && isDropToLowest && !doesCollide);

    }
}

function checkIfCollideFromArray(doesCollideArray) {
    for (let i = 0; i < doesCollideArray.length; i++) {
        if (doesCollideArray[i]) {
            return true;
        }
    }
}

function checkIfCollide(y, x, z, levelsBool) {
    if (levelsBool[y][x][z] === true) {
        return true;
    }
    return false;
}

function addAllPiecesToStorage(cubes) {
    for (let i = 0; i < cubes.length; i++) {
        let y = (cubes[i].position.y - 1) / 10;
        let x = (cubes[i].position.x - 1) / 10;
        let z = (cubes[i].position.z - 1) / 10;

        tetris.levelsBool[y][x][z] = true;
        tetris.levelsCube[y][x][z] = cubes[i];
    }
}

const Keys = {
    A: 65,
    Q: 81,
    X: 88,
    Y: 89,
    Z: 90,
    P: 80,
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
};

// -----------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------- MAKE TETRIMINOS  --------------------------------------------------------
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function makeRandomTetrimino(scene) {
    const choice = getRandomInt(6);
    const shape = tetriminos.shapes[choice];
    const color = tetriminos.colors[choice]
    tetris.tetInAction = createTetrimino(shape, color);
    tetris.tetInAction.addToScene(scene);
}

function createTetrimino(shape, color) {
    const cubes = [];
    const cubesToReturn = [];
    cubes.push(getCube(color));
    cubes.push(getCube(color));
    cubes.push(getCube(color));
    cubes.push(getCube(color));

    let counter = 0;
    for (let i = 0; i < shape.length; i++) {
        const rows = shape[i];
        for (let j = 0; j < rows.length; j++) {
            const isFillNeed = shape[i][j];
            if (isFillNeed) {
                const cube = cubes.pop();
                cubesToReturn[counter++] = cube;
                cube.position.x += (1 + j) * tetris.gridStepSize;
                cube.position.y += (tetris.yGridDivision - i) * tetris.gridStepSize;
                cube.position.z += 2 * tetris.gridStepSize;
            }
        }
    }
    return new TetObj(cubesToReturn.pop(), cubesToReturn.pop(), cubesToReturn.pop(), cubesToReturn.pop());
}

function getCube(color) {
    // const length = width = tetriminos.size;
    const length = tetriminos.size;
    const width = tetriminos.size;
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);
    const extrudeSettings = {
        steps: 2,
        depth: tetriminos.size,
        bevelEnabled: true,
        bevelThickness: tetriminos.bevelThickness,
        bevelSize: 1,
        bevelSegments: tetriminos.bevelSegments
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshNormalMaterial();  //new THREE.MeshBasicMaterial({color: color});   //
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = tetriminos.bevelThickness;
    mesh.position.y = tetriminos.bevelThickness;
    mesh.position.z = tetriminos.bevelThickness;
    return mesh;
}

// -----------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------- ADD GRIDS   -----------------------------------------------------------------
function addGrids(scene) {
    const yGrid = getGrid(tetris.xGridDivision, tetris.yGridDivision, tetris.yGridColor);
    const xGrid = getGrid(tetris.xGridDivision, tetris.zGridDivision, tetris.xGridColor);
    const zGrid = getGrid(tetris.zGridDivision, tetris.yGridDivision, tetris.zGridColor);
    xGrid.rotation.x = Math.PI / 2;
    zGrid.rotation.y = -Math.PI / 2;
    scene.add(yGrid);
    scene.add(xGrid);
    scene.add(zGrid);
}

function getGrid(x, y, color) {
    const group = new THREE.Group();
    const material = new THREE.LineBasicMaterial({
        color: color
    });

    for (let i = 0; i < y + 1; i++) {
        const geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(0, i * tetris.gridStepSize, 0),
            new THREE.Vector3(x * tetris.gridStepSize, i * tetris.gridStepSize, 0)
        );
        const line = new THREE.Line(geometry, material);
        group.add(line);
    }

    for (let i = 0; i < x + 1; i++) {
        const geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(i * tetris.gridStepSize, 0, 0),
            new THREE.Vector3(i * tetris.gridStepSize, y * tetris.gridStepSize, 0)
        );
        const line = new THREE.Line(geometry, material);
        group.add(line);
    }
    return group;
}


export {
    tetris,
    tetriminos,
    TetObj,
    checkIfCollideFromArray,
    checkIfCollide,
    addAllPiecesToStorage,
    makeRandomTetrimino,
    addGrids,
    Keys
};