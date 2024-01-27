import * as THREE from "three";
import { merge } from "./merge.js";

/*
 * parameters = {
 *  color: Integer,
 *  side: String,
 *  size: Vector2,
 *  speed: Float,
 *  baseline: Float,
 *  keyCodes: { down: String, up: String }
 * }
 */

export default class Player extends THREE.Mesh {
    constructor(parameters, table) {
        super();
        merge(this, parameters);
        this.halfSize = this.size.clone().divideScalar(2.0);
        this.baseline *= table.halfSize.x;
        this.centerLower = -table.halfSize.y + this.halfSize.y;
        this.centerUpper = table.halfSize.y - this.halfSize.y;
        this.keyStates = { down: false, up: false };

        // Create the racket (a rectangle)
        this.geometry = new THREE.PlaneGeometry(this.size.x, this.size.y);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });

        this.initialize();
    }

    checkLowerBoundary() {
        if (this.center.y < this.centerLower) {
            this.center.y = this.centerLower;
        }
    }

    checkUpperBoundary() {
        if (this.center.y > this.centerUpper) {
            this.center.y = this.centerUpper;
        }
    }

    initialize() {
        this.center = new THREE.Vector2(this.baseline, 0.0);
        if (this.side == "left") { // Player 1 racket: the center's x-coordinate must be negative
            this.center.x = -this.center.x;
        }
        this.score = 0;
        this.position.set(this.center.x, this.center.y);
    }

    update(deltaT) {
        // Update the racket's center position and check its boundaries
        if (this.keyStates.down) {
            this.center.y -= this.speed * deltaT;
            this.checkLowerBoundary();
        }
        if (this.keyStates.up) {
            this.center.y += this.speed * deltaT;
            this.checkUpperBoundary();
        }
        this.position.set(this.center.x, this.center.y);
    }
}