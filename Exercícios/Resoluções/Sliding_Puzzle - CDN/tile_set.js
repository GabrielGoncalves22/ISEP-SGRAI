import * as THREE from "three";
import { merge } from "./merge.js";
import Tile from "./tile.js";

/*
 * parameters = {
 *  size: Integer,
 *  sizeMin: Integer,
 *  sizeMax: Integer,
 *  sizeStep: Integer,
 *  shuffleIterations: Integer,
 *  animation: {
 *   duration: Float
 *  }
 * }
 *
 * tileParameters = {
 *  initialSize: Vector3,
 *  segments: Integer,
 *  radius: Float,
 *  frontSide: {
 *   materials: {
 *    color: Color,
 *    transparent: Boolean,
 *    opacity: Float,
 *    aoMapIntensity: Float,
 *    displacementScale: Float,
 *    displacementBias: Float,
 *    normalMapType: Integer,
 *    normalScale: Vector2,
 *    bumpScale: Float,
 *    roughness: Float
 *   },
 *   textures: {
 *    wrapS: Integer,
 *    wrapT: Integer,
 *    offset: Vector2,
 *    repeat: Vector2,
 *    magFilter: Integer,
 *    minFilter: Integer
 *   },
 *   bitmaps: {
 *    mapUrl: String,
 *    alphaMapUrl: String,
 *    aoMapUrl: String,
 *    displacementMapUrl: String,
 *    normalMapUrl: String,
 *    bumpMapUrl: String,
 *    roughnessMapUrl: String,
 *    credits: String
 *   }
 *  },
 *  backSide: {
 *   materials: {
 *    color: Color,
 *    transparent: Boolean,
 *    opacity: Float,
 *    aoMapIntensity: Float,
 *    displacementScale: Float,
 *    displacementBias: Float,
 *    normalMapType: Integer,
 *    normalScale: Vector2,
 *    bumpScale: Float,
 *    roughness: Float
 *   },
 *   textures: {
 *    wrapS: Integer,
 *    wrapT: Integer,
 *    offset: Vector2,
 *    repeat: Vector2,
 *    magFilter: Integer,
 *    minFilter: Integer
 *   },
 *   bitmaps: {
 *    mapUrl: String,
 *    alphaMapUrl: String,
 *    aoMapUrl: String,
 *    displacementMapUrl: String,
 *    normalMapUrl: String,
 *    bumpMapUrl: String,
 *    roughnessMapUrl: String,
 *    credits: String
 *   }
 *  },
 *  remainingSides: {
 *   materials: {
 *    color: Color,
 *    transparent: Boolean,
 *    opacity: Float,
 *    aoMapIntensity: Float,
 *    displacementScale: Float,
 *    displacementBias: Float,
 *    normalMapType: Integer,
 *    normalScale: Vector2,
 *    bumpScale: Float,
 *    roughness: Float
 *   },
 *   textures: {
 *    wrapS: Integer,
 *    wrapT: Integer,
 *    offset: Vector2,
 *    repeat: Vector2,
 *    magFilter: Integer,
 *    minFilter: Integer
 *   },
 *   bitmaps: {
 *    mapUrl: String,
 *    alphaMapUrl: String,
 *    aoMapUrl: String,
 *    displacementMapUrl: String,
 *    normalMapUrl: String,
 *    bumpMapUrl: String,
 *    roughnessMapUrl: String,
 *    credits: String
 *   }
 *  }
 * }
 *
 * textures = {
 *  frontSide: {
 *   map: Texture,
 *   alphaMap: Texture,
 *   aoMap: Texture,
 *   displacementMap: Texture,
 *   normalMap: Texture,
 *   bumpMap: Texture,
 *   roughnessMap: Texture
 *  },
 *  backSide: {
 *   map: Texture,
 *   alphaMap: Texture,
 *   aoMap: Texture,
 *   displacementMap: Texture,
 *   normalMap: Texture,
 *   bumpMap: Texture,
 *   roughnessMap: Texture
 *  },
 *  remainingSides: {
 *   map: Texture,
 *   alphaMap: Texture,
 *   aoMap: Texture,
 *   displacementMap: Texture,
 *   normalMap: Texture,
 *   bumpMap: Texture,
 *   roughnessMap: Texture
 *  }
 * }
 */

export default class TileSet extends THREE.Group {
    constructor(parameters, tileParameters, textures) {
        super();
        merge(this, parameters);

        this.sizeMinusOne = this.size - 1;
        this.sizeMinusOneHalved = this.sizeMinusOne / 2.0;
        this.nTiles = this.size * this.size;

        this.animation.inProgress = false;

        // Set the tiles size
        tileParameters.size = new THREE.Vector3(
            tileParameters.initialSize.x / this.size,
            tileParameters.initialSize.y / this.size,
            tileParameters.initialSize.z
        );

        // Compute textures properties offset and repeat, create the tiles
        this.tiles = [];
        let id = 1; // Tile identification number
        let offsetX, offsetY;
        for (let row = 0; row < this.size; row++) {
            this.tiles[row] = [];
            for (let column = 0; column < this.size; column++) {
                // Front side of the tile
                if (column == this.sizeMinusOne && row == this.sizeMinusOne) { // The tile in the last position of the set: assign it a smiley
                    offsetX = 0.0;
                    offsetY = 0.0;
                }
                else { // Remaining tiles of the set: assign them the appropriate numbers
                    offsetX = (id % 10.0) / 10.0;
                    offsetY = Math.floor(id / 10.0) / 10.0;
                }
                textures.frontSide.setOffset(offsetX, offsetY);
                textures.frontSide.setRepeat(1.0 / 10.0, 1.0 / 10.0);
                // Back side of the tile
                offsetX = (this.sizeMinusOne - column) / this.size;
                offsetY = (this.sizeMinusOne - row) / this.size;
                textures.backSide.setOffset(offsetX, offsetY);
                textures.backSide.setRepeat(1.0 / this.size, 1.0 / this.size);
                // Create the tile
                this.tiles[row][column] = new Tile(tileParameters, textures);
                this.tiles[row][column].tileId = id;
                this.tiles[row][column].translateX(this.tiles[row][column].size.x * (column - this.sizeMinusOneHalved));
                this.tiles[row][column].translateY(this.tiles[row][column].size.y * ((this.sizeMinusOne - row) - this.sizeMinusOneHalved));
                id++;
            }
        }
        this.emptyCell = [this.sizeMinusOne, this.sizeMinusOne];

        // Shuffle tiles

        // Create a list of cells
        const cells = [];
        for (let row = 0; row < this.size; row++) {
            for (let column = 0; column < this.size; column++) {
                cells.push({ row: row, column: column });
            }
        }

        // Start iterating
        for (let i = 0; i < this.shuffleIterations || this.solved(); i++) {
            for (let j = 1; j <= this.nTiles; j++) {
                const row = this.emptyCell[0];
                const column = this.emptyCell[1];

                // Randomly choose a cell from the list
                const index = THREE.MathUtils.randInt(0, this.nTiles - j);
                const cell = cells[index];

                // Determine the horizontal and vertical moves required to empty the cell
                let horizontal = cell.column - column;
                let vertical = cell.row - row;

                // Computer the total number of moves required
                const nMoves = Math.abs(horizontal) + Math.abs(vertical);

                // Randomly move the empty cell
                for (let k = 1; k <= nMoves; k++) {
                    const move = THREE.MathUtils.randInt(0, nMoves - k);
                    if (move < Math.abs(horizontal)) {
                        if (horizontal < 0) {
                            this.slideRight();
                            horizontal++;
                        }
                        else {
                            this.slideLeft();
                            horizontal--;
                        }
                    }
                    else {
                        if (vertical < 0) {
                            this.slideDown();
                            vertical++;
                        }
                        else {
                            this.slideUp();
                            vertical--;
                        }
                    }
                }

                // Swap cells
                cells[index] = cells[this.nTiles - j];
                cells[this.nTiles - j] = cell;
            }
        }
    }

    startAnimation(type, enabled) {
        this.animation.type = type;
        if (this.animation.type == "add") {
            this.rows = [];
            this.columns = [];
            // Add tiles to the set
            for (let row = 0; row < this.size; row++) {
                for (let column = 0; column < this.size; column++) {
                    const id = this.tiles[row][column].tileId;
                    this.rows[id] = row;
                    this.columns[id] = column;
                    if (enabled || id == this.nTiles) { // Note that there should be no visible tile in the last position of the set
                        this.tiles[row][column].visible = false;
                    }
                    this.add(this.tiles[row][column]);
                }
            }
        }
        if (enabled) {
            // Create a clock and start the animation
            this.clock = new THREE.Clock();
            this.animation.inProgress = true;
        }
    }

    animate() {
        const elapsedTime = this.clock.getElapsedTime();
        const triggerTimeIncrement = this.animation.duration / this.nTiles;
        let triggerTime = 0.0;
        for (let id = 1; id <= this.nTiles; id++) {
            const row = this.rows[id];
            const column = this.columns[id];
            if (elapsedTime >= triggerTime) {
                if (this.animation.type == "add") {
                    if (id != this.nTiles) { // Note that there should be no visible tile in the last position of the set
                        this.tiles[row][column].visible = true;
                    }
                }
                else {
                    this.tiles[row][column].visible = false;
                }
                triggerTime += triggerTimeIncrement;
            }
        }
        if (elapsedTime >= this.animation.duration) {
            // Stop the animation
            this.animation.inProgress = false;
            this.clock.stop();
        }
    }

    stopAnimation() {
        if (this.animation.type == "remove") {
            // Remove tiles from the set and dispose of the their resources
            for (let i = this.nTiles - 1; i >= 0; i--) {
                const element = this.children[i];
                this.remove(element);
                element.dispose();
            }
        }
    }

    slideLeft() {
        const row = this.emptyCell[0];
        const column = this.emptyCell[1];
        if (column < this.sizeMinusOne) {
            this.tiles[row][column].translateX(this.tiles[row][column].size.x);
            this.tiles[row][column + 1].translateX(-this.tiles[row][column + 1].size.x);
            const swap = this.tiles[row][column];
            this.tiles[row][column] = this.tiles[row][column + 1];
            this.tiles[row][column + 1] = swap;
            this.emptyCell[1]++;
        }
    }

    slideRight() {
        const row = this.emptyCell[0];
        const column = this.emptyCell[1];
        if (column > 0) {
            this.tiles[row][column].translateX(-this.tiles[row][column].size.x);
            this.tiles[row][column - 1].translateX(this.tiles[row][column - 1].size.x);
            const swap = this.tiles[row][column];
            this.tiles[row][column] = this.tiles[row][column - 1];
            this.tiles[row][column - 1] = swap;
            this.emptyCell[1]--;
        }
    }

    slideDown() {
        const row = this.emptyCell[0];
        const column = this.emptyCell[1];
        if (row > 0) {
            this.tiles[row][column].translateY(this.tiles[row][column].size.y);
            this.tiles[row - 1][column].translateY(-this.tiles[row - 1][column].size.y);
            const swap = this.tiles[row][column];
            this.tiles[row][column] = this.tiles[row - 1][column];
            this.tiles[row - 1][column] = swap;
            this.emptyCell[0]--;
        }
    }

    slideUp() {
        const row = this.emptyCell[0];
        const column = this.emptyCell[1];
        if (row < this.sizeMinusOne) {
            this.tiles[row][column].translateY(-this.tiles[row][column].size.y);
            this.tiles[row + 1][column].translateY(this.tiles[row + 1][column].size.y);
            const swap = this.tiles[row][column];
            this.tiles[row][column] = this.tiles[row + 1][column];
            this.tiles[row + 1][column] = swap;
            this.emptyCell[0]++;
        }
    }

    slideTile(tileId) {
        const row = this.emptyCell[0];
        const column = this.emptyCell[1];
        if (column < this.sizeMinusOne && this.tiles[row][column + 1].tileId == tileId) {
            this.slideLeft();
        }
        else if (column > 0 && this.tiles[row][column - 1].tileId == tileId) {
            this.slideRight();
        }
        else if (row > 0 && this.tiles[row - 1][column].tileId == tileId) {
            this.slideDown();

        }
        else if (row < this.sizeMinusOne && this.tiles[row + 1][column].tileId == tileId) {
            this.slideUp();
        }
    }

    solved() {
        let id = 1;
        for (let row = 0; row < this.size; row++) {
            for (let column = 0; column < this.size; column++) {
                if (this.tiles[row][column].tileId != id) {
                    return false;
                }
                id++;
            }
        }
        return true;
    }
}