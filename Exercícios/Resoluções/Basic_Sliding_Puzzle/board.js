import * as THREE from "three";
import { merge } from "./merge.js";
import Frame from "./frame.js";
import Tile from "./tile.js";

/*
 * boardParameters = {
 *  background: {
 *   enabled: Boolean,
 *   url: String,
 *   wrapS: Integer,
 *   wrapT: Integer,
 *   repeat: Vector2,
 *   magFilter: Integer,
 *   minFilter: Integer
 *  },
 *  grid: {
 *   initialSize: Integer,
 *   sizeMin: Integer,
 *   sizeMax: Integer,
 *   sizeStep: Integer
 *  },
 *  images: {
 *   bitmaps: [{
 *    url: String,
 *    credits: String
 *   }],
 *   wrapS: Integer,
 *   wrapT: Integer,
 *   magFilter: Integer,
 *   minFilter: Integer
 *  },
 *  shuffleIterations: Integer,
 *  keyCodes: { audio: String, background: String, separator: String, statistics: String, userInterface: String, help: String, shuffle: String, left: String, right: String, down: String, up: String }
 * }
 *
 * frameParameters = {
 *  size: Vector3,
 *  segments: Vector3,
 *  materialParameters: {
 *   color: Color,
 *   mapUrl: String,
 *   aoMapUrl: String,
 *   aoMapIntensity: Float,
 *   displacementMapUrl: String,
 *   displacementScale: Float,
 *   displacementBias: Float,
 *   normalMapUrl: String,
 *   normalMapType: Integer,
 *   normalScale: Vector2,
 *   bumpMapUrl: String,
 *   bumpScale: Float,
 *   roughnessMapUrl: String,
 *   roughness: Float,
 *   wrapS: Integer,
 *   wrapT: Integer,
 *   repeat: Vector2,
 *   magFilter: Integer,
 *   minFilter: Integer
 *  },
 *  credits: String,
 *  separator: {
 *   enabled: Boolean
 *  }
 * }
 *
 * tileParameters = {
 *  initialSize: Vector3,
 *  segments: Integer,
 *  radius: Float,
 *  primaryColor: Color,
 *  secondaryColor: Color,
 *  tertiaryColor: Color,
 *  roughness: Float
 * }
 */

export default class Board extends THREE.Group {
    constructor(boardParameters, frameParameters, tileParameters) {
        super();
        merge(this, boardParameters);
        this.tileParameters = tileParameters;
        this.background.textures = []; // Scene background disabled: 0; scene background enabled: 1

        // Load and configure the default background texture (scene background disabled)
        const texture = new THREE.TextureLoader().load(this.background.url);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = this.background.wrapS;
        texture.wrapT = this.background.wrapT;
        texture.repeat.set(this.background.repeat.x, this.background.repeat.y);
        texture.magFilter = this.background.magFilter;
        texture.minFilter = this.background.minFilter;
        this.background.textures[0] = texture;

        // Randomly reorder the list of images
        this.nImages = this.images.bitmaps.length - 1;
        for (let i = 0; i < this.nImages - 1; i++) {
            const index = THREE.MathUtils.randInt(1, this.nImages - i);
            const swap = this.images.bitmaps[index];
            this.images.bitmaps[index] = this.images.bitmaps[this.nImages - i];
            this.images.bitmaps[this.nImages - i] = swap;
        }

        // Initialize the active image
        this.activeImage = 0;

        // Create a board (a frame and a grid)

        // Create the frame and add it to the board
        this.frame = new Frame(frameParameters);
        this.add(this.frame);

        // Create the grid
        this.createGrid(this.grid.initialSize);
    }

    loaded = function () {
        return this.imageBitmapsLoaded == 2;
    }

    shuffle() {
        // Create a list of squares
        const squares = [];
        for (let row = 0; row < this.grid.size; row++) {
            for (let column = 0; column < this.grid.size; column++) {
                squares.push({ row: row, column: column });
            }
        }

        // Compute the number of squares
        const nSquares = this.grid.size * this.grid.size;

        // Start iterating
        for (let i = 0; i < this.shuffleIterations || this.ordered(false); i++) {
            for (let j = 1; j <= nSquares; j++) {
                const row = this.emptySquare[0];
                const column = this.emptySquare[1];

                // Randomly choose a square from the list
                const index = THREE.MathUtils.randInt(0, nSquares - j);
                const square = squares[index];

                // Determine the horizontal and vertical moves required to empty the square
                let horizontal = square.column - column;
                let vertical = square.row - row;

                // Computer the total number of moves required
                const nMoves = Math.abs(horizontal) + Math.abs(vertical);

                // Randomly move the empty square
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

                // Swap squares
                squares[index] = squares[nSquares - j];
                squares[nSquares - j] = square;
            }
        }
    }

    onLoad(imageIndex, bitmap) {
        this.images.bitmaps[imageIndex].bitmap = bitmap;

        // Create a canvas texture and configure it
        const texture = new THREE.CanvasTexture(this.images.bitmaps[imageIndex].bitmap); // This is almost the same as the base Texture class, except that it sets needsUpdate to true immediately: https://threejs.org/docs/api/en/textures/CanvasTexture.html
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = this.images.wrapS;
        texture.wrapT = this.images.wrapT;
        texture.magFilter = this.images.magFilter;
        texture.minFilter = this.images.minFilter;
        let materialIndex;
        if (imageIndex == 0) { // Image bitmap corresponding to the numbers side of the board
            materialIndex = 4; // materialIndex 4 corresponds to the material assigned to the tiles' positive Z face (see file "tile.js")
            texture.repeat.set(1.0 / 10.0, 1.0 / 10.0);
        }
        else { // Image bitmap corresponding to the picture side of the board
            materialIndex = 5; // materialIndex 5 corresponds to the material assigned to the tiles' negative Z face (see file "tile.js")
            texture.repeat.set(1.0 / this.grid.size, 1.0 / this.grid.size);
            this.background.textures[1] = texture; // Set the active background texture (scene background enabled)
        }

        // Compute the texture offsets and assign them to the tiles
        let id = 1;
        let offsetX, offsetY;
        for (let row = 0; row < this.grid.size; row++) {
            for (let column = 0; column < this.grid.size; column++) {
                this.tiles[row][column].material[materialIndex].map = texture.clone();
                if (imageIndex == 0) { // Image bitmap corresponding to the numbers side of the board
                    if (column == this.grid.sizeMinusOne && row == this.grid.sizeMinusOne) { // The tile in the last position of the grid: assign it a smiley
                        offsetX = 0.0;
                        offsetY = 0.0;
                    }
                    else {
                        offsetX = (id % 10.0) / 10.0;
                        offsetY = Math.floor(id / 10.0) / 10.0;
                    }
                }
                else { // Image bitmap corresponding to the picture side of the board
                    offsetX = (this.grid.sizeMinusOne - column) / this.grid.size;
                    offsetY = (this.grid.sizeMinusOne - row) / this.grid.size;
                }
                this.tiles[row][column].material[materialIndex].map.offset.set(offsetX, offsetY); // Select the part of the texture to assign to each tile
                id++;
            }
        }

        // Update the number of image bitmaps loaded
        this.imageBitmapsLoaded++;

        if (this.loaded()) { // Both image bitmaps have been loaded
            // Shuffle tiles
            this.shuffle();

            // Add tiles to the grid
            this.grid.tiles = new THREE.Group();
            for (let row = 0; row < this.grid.size; row++) {
                for (let column = 0; column < this.grid.size; column++) {
                    this.grid.tiles.add(this.tiles[row][column]);
                }
            }
            // Add the grid to the board
            this.add(this.grid.tiles);
        }
    }

    loadImageBitmap(imageIndex) {
        if (this.images.bitmaps[imageIndex].bitmap === undefined) { // The image bitmap hasn't yet been loaded
            // Create an image bitmap loader
            const loader = new THREE.ImageBitmapLoader();
            loader.setOptions({ imageOrientation: "flipY" });

            // Load the image bitmap
            loader.load(this.images.bitmaps[imageIndex].url, bitmap => this.onLoad(imageIndex, bitmap));
        }
        else { // The image bitmap has already been loaded
            this.onLoad(imageIndex, this.images.bitmaps[imageIndex].bitmap);
        }
    }

    deleteGrid() {
        // Remove the grid from the board
        this.remove(this.grid.tiles);
        // Free its resources
        this.grid.tiles.children.forEach(tile => {
            tile.dispose();
        });
    }

    createGrid(gridSize) {
        // Set the grid size
        this.grid.size = gridSize;
        this.grid.sizeMinusOne = this.grid.size - 1;
        this.grid.sizeMinusOneHalved = this.grid.sizeMinusOne / 2.0;

        // Set the tiles size. Their width and height depend on the grid size
        this.tileParameters.size = new THREE.Vector3(
            this.tileParameters.initialSize.x / this.grid.size,
            this.tileParameters.initialSize.y / this.grid.size,
            this.tileParameters.initialSize.z
        );

        // Create the tiles
        this.tiles = [];
        let id = 1; // Tile identification number
        for (let row = 0; row < this.grid.size; row++) {
            this.tiles[row] = [];
            for (let column = 0; column < this.grid.size; column++) {
                this.tiles[row][column] = new Tile(this.tileParameters);
                this.tiles[row][column].tileId = id++;
                this.tiles[row][column].translateX(this.tiles[row][column].size.x * (column - this.grid.sizeMinusOneHalved));
                this.tiles[row][column].translateY(this.tiles[row][column].size.y * ((this.grid.sizeMinusOne - row) - this.grid.sizeMinusOneHalved));
            }
        }
        this.emptySquare = [this.grid.sizeMinusOne, this.grid.sizeMinusOne];
        this.tiles[this.grid.sizeMinusOne][this.grid.sizeMinusOne].visible = false; // Note that there should be no tile in the last position of the grid

        // Initialize the number of image bitmaps loaded
        this.imageBitmapsLoaded = 0;

        // Load the image bitmap corresponding to the numbers side of the board
        this.loadImageBitmap(0);

        // Update the active image
        this.activeImage = this.activeImage % this.nImages + 1;

        // Load the image bitmap corresponding to the picture side of the board
        this.loadImageBitmap(this.activeImage);
    }

    startShuffling(gridSize) {
        if (this.loaded()) {
            // Delete the current grid and create a new one
            this.deleteGrid();
            this.createGrid(gridSize);
        }
    }

    slideLeft() {
        const row = this.emptySquare[0];
        const column = this.emptySquare[1];
        if (column < this.grid.sizeMinusOne) {
            this.tiles[row][column].translateX(this.tiles[row][column].size.x);
            this.tiles[row][column + 1].translateX(-this.tiles[row][column + 1].size.x);
            const swap = this.tiles[row][column];
            this.tiles[row][column] = this.tiles[row][column + 1];
            this.tiles[row][column + 1] = swap;
            this.emptySquare[1]++;
        }
    }

    slideRight() {
        const row = this.emptySquare[0];
        const column = this.emptySquare[1];
        if (column > 0) {
            this.tiles[row][column].translateX(-this.tiles[row][column].size.x);
            this.tiles[row][column - 1].translateX(this.tiles[row][column - 1].size.x);
            const swap = this.tiles[row][column];
            this.tiles[row][column] = this.tiles[row][column - 1];
            this.tiles[row][column - 1] = swap;
            this.emptySquare[1]--;
        }
    }

    slideDown() {
        const row = this.emptySquare[0];
        const column = this.emptySquare[1];
        if (row > 0) {
            this.tiles[row][column].translateY(this.tiles[row][column].size.y);
            this.tiles[row - 1][column].translateY(-this.tiles[row - 1][column].size.y);
            const swap = this.tiles[row][column];
            this.tiles[row][column] = this.tiles[row - 1][column];
            this.tiles[row - 1][column] = swap;
            this.emptySquare[0]--;
        }
    }

    slideUp() {
        const row = this.emptySquare[0];
        const column = this.emptySquare[1];
        if (row < this.grid.sizeMinusOne) {
            this.tiles[row][column].translateY(-this.tiles[row][column].size.y);
            this.tiles[row + 1][column].translateY(this.tiles[row + 1][column].size.y);
            const swap = this.tiles[row][column];
            this.tiles[row][column] = this.tiles[row + 1][column];
            this.tiles[row + 1][column] = swap;
            this.emptySquare[0]++;
        }
    }

    slideTile(tileId) {
        const row = this.emptySquare[0];
        const column = this.emptySquare[1];
        if (column < this.grid.sizeMinusOne && this.tiles[row][column + 1].tileId == tileId) {
            this.slideLeft();
        }
        else if (column > 0 && this.tiles[row][column - 1].tileId == tileId) {
            this.slideRight();
        }
        else if (row > 0 && this.tiles[row - 1][column].tileId == tileId) {
            this.slideDown();

        }
        else if (row < this.grid.sizeMinusOne && this.tiles[row + 1][column].tileId == tileId) {
            this.slideUp();
        }
    }

    ordered(gameOver) {
        let id = 1;
        for (let row = 0; row < this.grid.size; row++) {
            for (let column = 0; column < this.grid.size; column++) {
                if (this.tiles[row][column].tileId != id) {
                    return false;
                }
                id++;
            }
        }
        if (gameOver) {
            this.tiles[this.grid.sizeMinusOne][this.grid.sizeMinusOne].visible = true; // Make visible the tile in the last position of the grid
        }
        return true;
    }
}