import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Cube, Floor, Front } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from 'three';

let dropCounter = 0;
let cubeLength = 1;
let cubeList = [];
let resting = [];
let heightMap = Array(20).fill(-1);
let ceiling = 10;
let dropTime = 100;

class GameScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x000000);

        // Add meshes to scene
        // const land = new Land();
        // const flower = new Flower(this);
        const lights = new BasicLights();
        const cube = new Cube(this);
        //const front = new Front(this);

        const floor = new Floor(this);
        this.add(lights, floor);

        cube.position.add(new THREE.Vector3(0, 1, 0));
        this.add(cube);
        let list = [cube];
        resting.push(list);
        // Populate GUI
        //this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    generatePiece() {
        // generate a random number to decide what piece type
        // we can change how we want to do this
        let pieceType = Math.floor(Math.random() * 7);

        // create the four cubes for the shape
        let cube1 = new Cube(this);
        let cube2 = new Cube(this);
        let cube3 = new Cube(this);
        let cube4 = new Cube(this);

        // assemble the cubes based on what shape pice we're making
        let col = Math.floor(Math.random() * 20 - 10);

        cube1.position.add(new THREE.Vector3(col, ceiling, 0));
        if (pieceType == 0) {
            cube2.position
                .copy(cube1.position)
                .add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position
                .copy(cube1.position)
                .add(new THREE.Vector3(-cubeLength, 0, 0));
            cube4.position
                .copy(cube1.position)
                .add(new THREE.Vector3(cubeLength, 0, 0));
        } else if (pieceType == 1) {
            cube2.position
                .copy(cube1.position)
                .add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position
                .copy(cube1.position)
                .add(new THREE.Vector3(0, -cubeLength * 2, 0));
            cube4.position
                .copy(cube1.position)
                .add(new THREE.Vector3(cubeLength, -cubeLength * 2, 0));
        } else if (pieceType == 2) {
            cube2.position
                .copy(cube1.position)
                .add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position
                .copy(cube1.position)
                .add(new THREE.Vector3(0, -cubeLength * 2, 0));
            cube4.position
                .copy(cube1.position)
                .add(new THREE.Vector3(-cubeLength, -cubeLength * 2, 0));
        } else if (pieceType == 3) {
            cube2.position
                .copy(cube1.position)
                .add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position
                .copy(cube1.position)
                .add(new THREE.Vector3(-cubeLength, -cubeLength, 0));
            cube4.position
                .copy(cube1.position)
                .add(new THREE.Vector3(cubeLength, 0, 0));
        } else if (pieceType == 4) {
            cube2.position
                .copy(cube1.position)
                .add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position
                .copy(cube1.position)
                .add(new THREE.Vector3(cubeLength, -cubeLength, 0));
            cube4.position
                .copy(cube1.position)
                .add(new THREE.Vector3(-cubeLength, 0, 0));
        } else if (pieceType == 5) {
            cube2.position
                .copy(cube1.position)
                .add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position
                .copy(cube1.position)
                .add(new THREE.Vector3(-cubeLength, -cubeLength, 0));
            cube4.position
                .copy(cube1.position)
                .add(new THREE.Vector3(-cubeLength, 0, 0));
        } else {
            cube2.position
                .copy(cube1.position)
                .add(new THREE.Vector3(0, -cubeLength, 0));
            cube3.position
                .copy(cube1.position)
                .add(new THREE.Vector3(0, -cubeLength * 2, 0));
            cube4.position
                .copy(cube1.position)
                .add(new THREE.Vector3(0, -cubeLength * 3, 0));
        }

        // add the cube pieces to the scene and the cubeList
        this.add(cube1);
        this.add(cube2);
        this.add(cube3);
        this.add(cube4);

        let pieceList = [];
        pieceList.push(cube1);
        pieceList.push(cube2);
        pieceList.push(cube3);
        pieceList.push(cube4);

        cubeList.push(pieceList);
    }

    dropPieces() {
        let tempSize = cubeList.length;
        for (let i = 0; i < tempSize; i++) {
            let pieceList = cubeList.shift();
            let newPieceList = [];
            let oldPieceList = [];
            let added = true;

            for (let j = 0; j < 4; j++) {
                let newCube = new Cube(this);
                let oldCube = pieceList.shift();
                oldPieceList.push(oldCube);
                // shift downwards
                newCube.position.x = oldCube.position.x;
                newCube.position.y = oldCube.position.y - cubeLength;
                newCube.position.z = oldCube.position.z;

                // height map collisions
                if (
                    newCube.position.y <=
                    heightMap[Math.floor(newCube.position.x) + 10]
                ) {
                    for (const cubeNew of newPieceList) {
                        cubeNew.position.y += cubeLength;
                        heightMap[Math.floor(cubeNew.position.x) + 10] =
                            Math.max(
                                heightMap[Math.floor(cubeNew.position.x) + 10],
                                cubeNew.position.y
                            );
                        pieceList.push(cubeNew);
                    }

                    // add the piece back to the old piece list and change height map value
                    pieceList.push(oldCube);
                    heightMap[Math.floor(oldCube.position.x) + 10] = Math.max(
                        heightMap[Math.floor(oldCube.position.x) + 10],
                        oldCube.position.y
                    );

                    // add it to the resting place
                    resting.push(pieceList);
                    // tell it not to add the (empty) pieceList to cubeList (no longer a falling piece)
                    added = false;
                    break;
                }

                newPieceList.push(newCube);
            }
            if (added) {
                for (const older of oldPieceList) {
                    this.remove(older);
                }
                for (const newer of newPieceList) {
                    this.add(newer);
                }
                cubeList.push(newPieceList);
            }
        }
    }

    update() {
        // // increment the counter for dropping
        // dropCounter++;
        // // generate a piece every so often
        // if (dropCounter % (dropTime * 4) == 0) {
        //     this.generatePiece();
        // }
        // // every so often, move all pieces downwards
        // if (dropCounter % dropTime == 0) {
        //     this.dropPieces();
        // }
    }

    handleCameraCollision(cameraPosition, previousCameraPosition) {
        for (let piece of resting) {
            for (let cube of piece) {
                let center = cube.position;
                let halfLength = cubeLength / 2;
                let insideCube = true;
                if (
                    cameraPosition.x < center.x - halfLength ||
                    cameraPosition.x < center.x + halfLength
                ) {
                    insideCube = false;
                } else if (
                    cameraPosition.y < center.y - halfLength ||
                    cameraPosition.y < center.y + halfLength
                ) {
                    insideCube = false;
                } else if (
                    cameraPosition.z < center.z - halfLength ||
                    cameraPosition.z < center.z + halfLength
                ) {
                    insideCube = false;
                }
                if (!insideCube) {
                    continue;
                }
                // let kickDirection = previousCameraPosition
                //     .clone()
                //     .sub(previousCameraPosition);
                kickDirection = new THREE.Vector3(0, 1, 0);
                let xshift = Math.abs(
                    center.x +
                        Math.sign(cameraPosition.x) * halfLength -
                        cameraPosition.x
                );
                let yshift = Math.abs(
                    center.y +
                        Math.sign(cameraPosition.y) * halfLength -
                        cameraPosition.y
                );
                let zshift = Math.abs(
                    center.z +
                        Math.sign(cameraPosition.z) * halfLength -
                        cameraPosition.z
                );
                let scale;
                // if (xshift < yshift) {
                //     if (xshift < zshift) {
                //         scale = xshift / kickDirection.x;
                //     } else {
                //         scale = zshift / kickDirection.z;
                //     }
                // } else if (yshift < zshift) {
                //     scale = yshift / kickDirection.y;
                // } else {
                //     scale = zshift / kickDirection.z;
                // }
                cameraPosition.add(
                    kickDirection.multiplyScalar(scale + 10.002)
                );
            }
        }
    }
    generateCube() {
        const newCube = new Cube(this);

        // move it somehwhere
    }
}

export default GameScene;
