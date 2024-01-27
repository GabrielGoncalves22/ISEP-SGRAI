import * as THREE from "three";
import { merge } from "./merge.js";

/*
 * parameters = {
 *  color: Color,
 *  transparent: Boolean,
 *  opacity: Float,
 *  aoMapIntensity: Float,
 *  displacementScale: Float,
 *  displacementBias: Float,
 *  normalMapType: Integer,
 *  normalScale: Vector2,
 *  bumpScale: Float,
 *  roughness: Float
 * }
 *
 * textures = {
 *  map: Texture,
 *  alphaMap: Texture,
 *  aoMap: Texture,
 *  displacementMap: Texture,
 *  normalMap: Texture,
 *  bumpMap: Texture,
 *  roughnessMap: Texture
 * }
 */

export default class MultiTexturedMaterial extends THREE.MeshStandardMaterial {
    constructor(parameters, textures) {
        super();
        merge(this, parameters);
        _.mergeWith(this, textures, (objValue, srcValue) => { // Custom merge: textures must be cloned
            if (srcValue instanceof THREE.Texture) {
                return srcValue.clone();
            }
        });
    }

    // Object disposal: https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
    dispose() {
        // Dispose of the textures
        ["map", "alphaMap", "aoMap", "displacementMap", "normalMap", "bumpMap", "roughnessMap"].forEach(element => {
            if (element in this && this[element] !== null) {
                this[element].dispose();
            }
        });
        // Dispose of the material
        super.dispose();
    }
}