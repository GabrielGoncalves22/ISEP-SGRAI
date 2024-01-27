import * as THREE from "three";
import { merge } from "./merge.js";

/*
 * parameters = {
 *  color: Color,
 *  intensity: Float
 * }
 */

export class AmbientLight extends THREE.AmbientLight {
    constructor(parameters) {
        super();
        merge(this, parameters);
    }
}

/*
 * parameters = {
 *  color: Color,
 *  intensity: Float,
 *  offset: Vector3,
 *  castShadow: Boolean,
 *  shadow: {
 *   mapSize: Vector2,
 *   camera: {
 *    left: Float,
 *    right: Float,
 *    top: Float,
 *    bottom: Float,
 *    near: Float,
 *    far: Float
 *   }
 *  }
 * }
 */

export class DirectionalLight extends THREE.DirectionalLight {
    constructor(parameters) {
        super();
        merge(this, parameters);
    }
}