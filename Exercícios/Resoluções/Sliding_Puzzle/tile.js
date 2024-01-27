import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { merge } from "./merge.js";
import MultiTexturedMaterial from "./material.js";

/*
 * parameters = {
 *  size: Vector3,
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

export default class Tile extends THREE.Mesh {
    constructor(parameters, textures) {
        super();
        merge(this, parameters);

        // Create a rounded box that casts shadows but does not receive them
        this.geometry = new RoundedBoxGeometry(this.size.x, this.size.y, this.size.z, this.segments, this.radius);
        let uv = this.geometry.getAttribute("uv");
        let uv1 = uv.clone();
        this.geometry.setAttribute("uv1", uv1); // The aoMap requires a second set of UVs: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.aoMap

        // Create materials
        this.frontSideMaterial = new MultiTexturedMaterial(this.frontSide.materials, textures.frontSide);
        this.backSideMaterial = new MultiTexturedMaterial(this.backSide.materials, textures.backSide);
        this.remainingSidesMaterial = new MultiTexturedMaterial(this.remainingSides.materials, textures.remainingSides);

        // Assign materials to the appropriate sides of the mesh
        this.material = [
            this.remainingSidesMaterial, // Positive X
            this.remainingSidesMaterial, // Negative X
            this.remainingSidesMaterial, // Positive Y
            this.remainingSidesMaterial, // Negative Y
            this.frontSideMaterial, // Positive Z
            this.backSideMaterial // Negative Z
        ];
        this.castShadow = true;
        this.receiveShadow = false;
    }

    // Object disposal: https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
    dispose() {
        // Dispose of the tile textures and materials
        this.frontSideMaterial.dispose();
        this.backSideMaterial.dispose();
        this.remainingSidesMaterial.dispose();
        // Dispose of the tile geometry
        this.geometry.dispose();
    }
}