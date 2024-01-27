import * as THREE from "three";

/*
 * parameters = {
 *  wrapS: Integer,
 *  wrapT: Integer,
 *  offset: Vector2,
 *  repeat: Vector2,
 *  magFilter: Integer,
 *  minFilter: Integer
 * }
 *
 * bitmapParameters = {
 *  mapUrl: String,
 *  alphaMapUrl: String,
 *  aoMapUrl: String,
 *  displacementMapUrl: String,
 *  normalMapUrl: String,
 *  bumpMapUrl: String,
 *  roughnessMapUrl: String,
 *  credits: String
 * }
 */


export default class MultiTexture {
    constructor(parameters, bitmapParameters) {
        this.maps = ["map", "alphaMap", "aoMap", "displacementMap", "normalMap", "bumpMap", "roughnessMap"];

        this.onLoad = function (map, bitmap) {
            // Create a canvas texture
            const texture = new THREE.CanvasTexture(bitmap); // This is almost the same as the base Texture class, except that it sets needsUpdate to true immediately: https://threejs.org/docs/api/en/textures/CanvasTexture.html

            if (map == "map") {
                texture.colorSpace = THREE.SRGBColorSpace;
            }
            else if (map == "aoMap") { // The aoMap requires a second set of UVs: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.aoMap
                texture.channel = 1; // Lets you select the uv attribute to map the texture to: https://threejs.org/docs/index.html#api/en/textures/Texture.channel
            }
            // Configure the texture
            ["wrapS", "wrapT", "offset", "repeat", "magFilter", "minFilter"].forEach(element => {
                if (element in parameters) {
                    texture[element] = parameters[element];
                }
            });

            // Store the texture
            this[map] = texture;

            bitmapBalance--;
        }

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource '" + url + "' (" + error + ").");
        }

        this.loaded = function () {
            return bitmapBalance == 0;
        }

        // Initialize bitmapBalance. It increases whenever a bitmap is found and decreases each time a bitmap is successfully loaded. When it reaches zero, all bitmaps have been loaded
        let bitmapBalance = 0;

        // Create and configure an image bitmap loader
        const loader = new THREE.ImageBitmapLoader();
        loader.setOptions({ imageOrientation: "flipY" });

        // Load the bitmaps
        for (const element in bitmapParameters) {
            if (element.endsWith("Url")) { // If element relates to a URL
                const url = bitmapParameters[element];
                if (url != "") {
                    console.log("Need to load resource ", url);
                    bitmapBalance++;

                    // Load the image bitmap
                    loader.load(
                        //Resource URL
                        url,

                        // onLoad callback
                        bitmap => this.onLoad(element.slice(0, -3), bitmap), // Get the map name by excluding "Url" from element

                        // onProgress callback
                        xhr => this.onProgress(url, xhr),

                        // onError callback
                        error => this.onError(url, error)
                    );
                }
            }
        }
    }

    setOffset(x, y) {
        this.maps.forEach(element => {
            if (element in this) {
                this[element].offset = new THREE.Vector2(x, y);
            }
        });
    }

    setRepeat(x, y) {
        this.maps.forEach(element => {
            if (element in this) {
                this[element].repeat = new THREE.Vector2(x, y);
            }
        });
    }
}