import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { merge } from "./merge.js";

/*
 * parameters = {
 *  size: Vector3,
 *  segments: Integer,
 *  radius: Float,
 *  primaryColor: Color,
 *  secondaryColor: Color,
 *  tertiaryColor: Color,
 *  roughness: Float
 * }
 */

export default class Tile extends THREE.Mesh {
    constructor(parameters) {
        super();
        merge(this, parameters);

        // Create the materials
        const primaryMaterial = new THREE.MeshStandardMaterial({ color: this.primaryColor, roughness: this.roughness });
        const secondaryMaterial = new THREE.MeshStandardMaterial({ color: this.secondaryColor, roughness: this.roughness });
        const tertiaryMaterial = new THREE.MeshStandardMaterial({ color: this.tertiaryColor, roughness: this.roughness });

        // Create a rounded box that casts shadows but does not receive them
        this.geometry = new RoundedBoxGeometry(this.size.x, this.size.y, this.size.z, this.segments, this.radius);
        this.material = [
            tertiaryMaterial, // Positive X
            tertiaryMaterial, // Negative X
            tertiaryMaterial, // Positive Y
            tertiaryMaterial, // Negative Y
            primaryMaterial, // Positive Z
            secondaryMaterial // Negative Z
        ];
        this.castShadow = true;
        this.receiveShadow = false;
    }

    // Object disposal: https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
    dispose() {
        this.material.forEach(material => {
            if (material.map) {
                // Dispose texture
                material.map.dispose();
            }
            // Dispose material
            material.dispose();
        });
        // Dispose geometry
        this.geometry.dispose();
    }
}