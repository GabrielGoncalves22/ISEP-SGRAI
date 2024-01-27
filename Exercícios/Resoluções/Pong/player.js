import * as THREE from "three";
import { merge } from "./merge.js";

/*
 * parameters = {
 *  color: Integer,
 *  side: String,
 *  initialSize: Vector2,
 *  sizeIncrement: Float,
 *  initialSpeed: Float,
 *  speedIncrement: Float,
 *  centerBoundaries: { rear: Float, front: Float },
 *  keyCodes: { backward: String, forward: String, down: String, up: String }
 * }
 */

export default class Player extends THREE.Mesh {
    constructor(parameters, table) {
        super();
        merge(this, parameters);
        this.sizeIncrement *= this.initialSize.y;
        this.speedIncrement *= this.initialSpeed;
        this.keyStates = { backward: false, forward: false, down: false, up: false };
        this.table = table;

        // Create the racket (a rectangle)
        this.geometry = new THREE.PlaneGeometry(this.initialSize.x, this.initialSize.y);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });

        this.initialize();
    }

    checkRearBoundary() {
        if (this.side == "left") { // Player 1
            if (this.center.x < this.centerRear) {
                this.center.x = this.centerRear;
            }
        }
        else { // Player 2
            if (this.center.x > this.centerRear) {
                this.center.x = this.centerRear;
            }
        }
    }

    checkFrontBoundary() {
        if (this.side == "left") { // Player 1
            if (this.center.x > this.centerFront) {
                this.center.x = this.centerFront;
            }
        }
        else { // Player 2
            if (this.center.x < this.centerFront) {
                this.center.x = this.centerFront;
            }
        }
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

    setCenterBoundaries(initializeCenter) {
        this.centerRear = this.centerBoundaries.rear * this.table.halfSize.x;
        this.centerFront = this.centerBoundaries.front * this.table.halfSize.x;
        this.centerLower = -this.table.halfSize.y + this.halfSize.y;
        this.centerUpper = this.table.halfSize.y - this.halfSize.y;
        if (this.side == "left") { // Player 1 racket: the center's x-coordinate must be negative
            this.centerRear = -this.centerRear;
            this.centerFront = -this.centerFront;
        }
        if (initializeCenter) {
            this.center = new THREE.Vector2(this.centerRear, 0.0);
        }
        else {
            this.checkLowerBoundary();
            this.checkUpperBoundary();
        }
        this.position.set(this.center.x, this.center.y);
        this.scale.set(1.0, this.size.y / this.initialSize.y);
    }

    initialize() {
        this.size = this.initialSize.clone();
        this.halfSize = this.size.clone().divideScalar(2.0);
        this.speed = this.initialSpeed;
        this.setCenterBoundaries(true);
        this.score = 0;
    }

    scored() {
        this.size.y -= this.sizeIncrement;
        this.halfSize.y = this.size.y / 2.0;
        this.speed += this.speedIncrement;
        this.score++; // Increment player score
        this.setCenterBoundaries(false);
    }

    conceded() {
        this.size.y += this.sizeIncrement;
        this.halfSize.y = this.size.y / 2.0;
        this.speed -= this.speedIncrement;
        this.setCenterBoundaries(false);
    }

    update(deltaT) {
        // Update the racket's center position and check its boundaries
        if (this.keyStates.backward) {
            if (this.side == "left") { // Player 1
                this.center.x -= this.speed * deltaT;
            }
            else { // Player 2
                this.center.x += this.speed * deltaT;
            }
            this.checkRearBoundary();
        }
        if (this.keyStates.forward) {
            if (this.side == "left") { // Player 1
                this.center.x += this.speed * deltaT;
            }
            else { // Player 2
                this.center.x -= this.speed * deltaT;
            }
            this.checkFrontBoundary();
        }
        if (this.keyStates.down) {
            this.center.y -= this.speed * deltaT;
            this.checkLowerBoundary();
        }
        if (this.keyStates.up) {
            this.center.y += this.speed * deltaT;
            this.checkUpperBoundary();
        }
        this.position.set(this.center.x, this.center.y);
        this.scale.set(1.0, this.size.y / this.initialSize.y);
    }
}