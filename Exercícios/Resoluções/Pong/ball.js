import * as THREE from "three";
import { merge } from "./merge.js";

/*
 * parameters = {
 *  color: Integer,
 *  radius: Float,
 *  initialSpeed: Float,
 *  hitSpeed: Float,
 *  speedIncrement: Float,
 *  speedAttenuation: Float,
 *  directionMax: Float,
 *  spinMax: Float,
 *  spinAttenuation: Float
 * }
 */

export default class Ball extends THREE.Mesh {
    constructor(parameters, player1, player2, table) {
        super();
        merge(this, parameters);
        this.speedIncrement *= this.initialSpeed;
        this.speedAttenuation += 1.0;
        this.spinAttenuation += 1.0;
        this.player1 = player1;
        this.player2 = player2;
        this.table = table;

        // Create the ball (a circle)
        this.geometry = new THREE.CircleGeometry(this.radius, 16);
        this.material = new THREE.MeshBasicMaterial({ color: this.color });

        this.initialize();
    }

    initialize() {
        this.center = new THREE.Vector2(0.0, THREE.MathUtils.randFloatSpread(this.table.size.y - 4.0 * this.radius));
        this.speed = this.initialSpeed;
        this.direction = THREE.MathUtils.randFloatSpread(2.0 * this.directionMax); // Direction in radians
        this.spin = 0.0; // Angle in radians used to simulate the Magnus effect
        this.position.set(this.center.x, this.center.y);
    }

    update(deltaT) {
        // Update the ball's center position
        const coveredDistance = this.speed * deltaT;
        const centerIncrement = new THREE.Vector2(coveredDistance * Math.cos(this.direction), coveredDistance * Math.sin(this.direction));
        this.center.add(centerIncrement);
        if (centerIncrement.x < 0.0) { // The ball is moving to the left
            if (this.center.x - this.radius < this.player1.center.x + this.player1.halfSize.x &&
                this.center.x - this.radius > this.player1.center.x - this.player1.halfSize.x &&
                this.center.y + this.radius > this.player1.center.y - this.player1.halfSize.y &&
                this.center.y - this.radius < this.player1.center.y + this.player1.halfSize.y) { // The ball hit player 1 racket
                // Compute the ball speed
                this.speed = this.hitSpeed;
                if (this.player1.keyStates.backward) { // The racket is moving backward
                    this.speed -= this.speedIncrement;
                }
                if (this.player1.keyStates.forward) { // The racket is moving forward
                    this.speed += this.speedIncrement;
                }
                // Compute the ball direction
                this.direction = (this.center.y - this.player1.center.y) / (this.player1.halfSize.y + this.radius) * this.directionMax;  // The ball rebounds
                // Compute the ball spin
                this.spin = 0.0;
                if (this.player1.keyStates.down) {
                    this.spin = this.spinMax;
                }
                if (this.player1.keyStates.up) {
                    this.spin = -this.spinMax;
                }
            }
            else {
                // Attenuate the ball speed
                this.speed *= Math.pow(this.speedAttenuation, deltaT);
            }
        }
        else { // The ball is moving to the right
            if (this.center.x + this.radius > this.player2.center.x - this.player2.halfSize.x &&
                this.center.x + this.radius < this.player2.center.x + this.player2.halfSize.x &&
                this.center.y + this.radius > this.player2.center.y - this.player2.halfSize.y &&
                this.center.y - this.radius < this.player2.center.y + this.player2.halfSize.y) { // The ball hit player 2 racket
                // Compute the ball speed
                this.speed = this.hitSpeed;
                if (this.player2.keyStates.backward) { // The racket is moving backward
                    this.speed -= this.speedIncrement;
                }
                if (this.player2.keyStates.forward) { // The racket is moving forward
                    this.speed += this.speedIncrement;
                }
                // Compute the ball direction
                this.direction = Math.PI - (this.center.y - this.player2.center.y) / (this.player2.halfSize.y + this.radius) * this.directionMax; // The ball rebounds
                // Compute the ball spin
                this.spin = 0.0;
                if (this.player2.keyStates.down) {
                    this.spin = -this.spinMax;
                }
                if (this.player2.keyStates.up) {
                    this.spin = this.spinMax;
                }
            }
            else {
                // Attenuate the ball speed
                this.speed *= Math.pow(this.speedAttenuation, deltaT);
            }
        }
        if (centerIncrement.y < 0.0 && this.center.y - this.radius < -this.table.halfSize.y || // The ball is moving down and hit the bottom line
            centerIncrement.y > 0.0 && this.center.y + this.radius > this.table.halfSize.y) { // The ball is moving up and hit the top line
            this.direction = -this.direction;  // The ball rebounds
            if (centerIncrement.x < 0.0) {
                this.direction += 2.0 * Math.PI; // This is to ensure that the ball direction stays within the interval 0.0 <= direction < 2.0 * π (pi)
            }
        }
        // Add the spin to the ball direction
        this.direction += this.spin;
        // Check the ball direction boundaries
        if (this.direction > -Math.PI / 2.0 && this.direction < -this.directionMax) {
            this.direction = -this.directionMax;
        }
        else if (this.direction > this.directionMax && this.direction < Math.PI / 2.0) {
            this.direction = this.directionMax;
        }
        else if (this.direction > Math.PI / 2.0 && this.direction < Math.PI - this.directionMax) {
            this.direction = Math.PI - this.directionMax;
        }
        else if (this.direction > Math.PI + this.directionMax && this.direction < 3.0 * Math.PI / 2.0) {
            this.direction = Math.PI + this.directionMax;
        }
        // Attenuate the ball spin
        this.spin *= Math.pow(this.spinAttenuation, deltaT);

        this.position.set(this.center.x, this.center.y);
    }
}