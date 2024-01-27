// Pong - JPP 2021, 2022, 2023
// 2D modeling
// Animation
// User interaction

import * as THREE from "three";
import { gameData, tableData, playerData, ballData } from "./default_data.js";
import { merge } from "./merge.js";
import Table from "./table.js";
import Player from "./player.js";
import Ball from "./ball.js";

/*
 * gameParameters = {
 *  color: Integer,
 *  position: Vector2,
 *  scale: Float,
 *  end: Integer,
 *  keyCodes: { start: String, pause: String }
 * }
 *
 * tableParameters = {
 *  color: Integer,
 *  size: Vector2,
 *  dashes: Integer
 * }
 *
 * player1Parameters = {
 *  color: Integer,
 *  side: String,
 *  initialSize: Vector2,
 *  sizeIncrement: Float,
 *  initialSpeed: Float,
 *  speedIncrement: Float,
 *  centerBoundaries: { rear: Float, front: Float },
 *  keyCodes: { backward: String, forward: String, down: String, up: String }
 * }
 *
 * player2Parameters = {
 *  color: Integer,
 *  side: String,
 *  initialSize: Vector2,
 *  sizeIncrement: Float,
 *  initialSpeed: Float,
 *  speedIncrement: Float,
 *  centerBoundaries: { rear: Float, front: Float },
 *  keyCodes: { backward: String, forward: String, down: String, up: String }
 * }
 *
 * ballParameters = {
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

export default class Pong extends THREE.Group {
    constructor(gameParameters, tableParameters, player1Parameters, player2Parameters, ballParameters) {
        super();

        this.gameParameters = merge({}, gameData, gameParameters);
        this.tableParameters = merge({}, tableData, tableParameters);
        this.player1Parameters = merge({}, playerData, player1Parameters);
        this.player2Parameters = merge({}, playerData, player2Parameters);
        this.ballParameters = merge({}, ballData, ballParameters);

        // Set the game state
        /*
         *  gameRunning | gamePaused | Game state
         * -------------+------------+------------------------------
         *     false    |    false   | not running; never ran
         *     false    |    true    | not running; has already run
         *     true     |    false   | running; not paused
         *     true     |    true    | running; paused
         */
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameBlurred = false;

        // Create the game (a table, two players and a ball)

        // Create the table
        this.table = new Table(this.tableParameters);
        this.add(this.table);

        // Create the two players
        this.player1Parameters.side = "left";
        this.player1 = new Player(this.player1Parameters, this.table);
        this.add(this.player1);
        this.player2Parameters.side = "right";
        this.player2 = new Player(this.player2Parameters, this.table);
        this.add(this.player2);

        // Create the ball
        this.ball = new Ball(this.ballParameters, this.player1, this.player2, this.table);
        this.add(this.ball);

        // Make the ball invisible
        this.ball.visible = false;

        // Set the game position and scale
        this.position.set(this.gameParameters.position.x, this.gameParameters.position.y);
        this.scale.set(this.gameParameters.scale, this.gameParameters.scale);

        // Create two HTML <div> elements

        // Start by getting a "container" <div> element with the top-left corner at the center of the viewport (the origin of the coordinate system)
        const container = document.getElementById("container");

        // Then create a "score" <div> element and append it as a child of "container"
        this.score = document.createElement("div");
        this.score.style.position = "absolute";
        this.score.style.left = (50.0 * this.gameParameters.position.x - 50.0 * this.gameParameters.scale).toString() + "vmin";
        this.score.style.bottom = (50.0 * this.gameParameters.position.y + 38.0 * this.gameParameters.scale).toString() + "vmin";
        this.score.style.width = (100.0 * this.gameParameters.scale).toString() + "vmin";
        this.score.style.fontSize = (4.0 * this.gameParameters.scale).toString() + "vmin";
        this.score.style.color = "#" + new THREE.Color(this.gameParameters.color).getHexString();
        container.appendChild(this.score);

        // Finally, create a "status" <div> element and append it as a child of "container"
        this.status = document.createElement("div");
        this.status.style.position = "absolute";
        this.status.style.left = (50.0 * this.gameParameters.position.x - 50.0 * this.gameParameters.scale).toString() + "vmin";
        this.status.style.top = (-50.0 * this.gameParameters.position.y + 38.0 * this.gameParameters.scale).toString() + "vmin";
        this.status.style.width = (100.0 * this.gameParameters.scale).toString() + "vmin";
        this.status.style.fontSize = (1.5 * this.gameParameters.scale).toString() + "vmin";
        this.status.style.color = "#" + new THREE.Color(this.gameParameters.color).getHexString();
        container.appendChild(this.status);

        // Register the event handler to be called on blur
        window.addEventListener("blur", event => this.focusChange(true));

        // Register the event handler to be called on focus
        window.addEventListener("focus", event => this.focusChange(false));

        // Register the event handler to be called on key down
        document.addEventListener("keydown", event => this.keyChange(event, true));

        // Register the event handler to be called on key release
        document.addEventListener("keyup", event => this.keyChange(event, false));

        // Display the score
        this.displayScore();

        // Create the clock
        this.clock = new THREE.Clock(false);
    }

    displayScore() {
        // Display the score
        this.score.innerHTML = this.player1.score + " - " + this.player2.score;
    }

    displayStatus(text) {
        // Display the current game state
        this.status.innerHTML = text;
    }

    focusChange(state) {
        this.gameBlurred = state;
        if (this.gameRunning && !this.gamePaused && this.gameBlurred) {
            this.gamePaused = true;
            this.clock.stop();
        }
    }

    keyChange(event, state) {
        // Prevent the "Space" and "Arrow" keys from scrolling the document's content
        if (event.code == "Space" || event.code == "ArrowLeft" || event.code == "ArrowRight" || event.code == "ArrowDown" || event.code == "ArrowUp") {
            event.preventDefault();
        }
        if (event.code == this.player1.keyCodes.backward) {
            this.player1.keyStates.backward = state;
        }
        if (event.code == this.player1.keyCodes.forward) {
            this.player1.keyStates.forward = state;
        }
        if (event.code == this.player1.keyCodes.down) {
            this.player1.keyStates.down = state;
        }
        if (event.code == this.player1.keyCodes.up) {
            this.player1.keyStates.up = state;
        }
        if (event.code == this.player2.keyCodes.backward) {
            this.player2.keyStates.backward = state;
        }
        if (event.code == this.player2.keyCodes.forward) {
            this.player2.keyStates.forward = state;
        }
        if (event.code == this.player2.keyCodes.down) {
            this.player2.keyStates.down = state;
        }
        if (event.code == this.player2.keyCodes.up) {
            this.player2.keyStates.up = state;
        }
        // The following two cases are handled together, as the start and pause keys can be the same
        if (event.code == this.gameParameters.keyCodes.start || event.code == this.gameParameters.keyCodes.pause) {
            if (state) {
                if (event.code == this.gameParameters.keyCodes.start && !this.gameRunning) {
                    this.player1.initialize();
                    this.player2.initialize();
                    this.ball.initialize();
                    this.ball.visible = true; // Make the ball visible
                    this.gameRunning = true;
                    this.gamePaused = false;
                    this.clock.start();
                    this.displayScore();
                }
                else if (event.code == this.gameParameters.keyCodes.pause && this.gameRunning) {
                    this.gamePaused = !this.gamePaused;
                    if (this.gamePaused) {
                        this.clock.stop();
                    }
                    else {
                        this.clock.start();
                    }
                }
            }
        }
    }

    update() {
        let text = "<table>";
        if (!this.gameRunning) {
            if (!this.gamePaused) {
                // Display players keys
                text += "<tr><th colspan = '4'>Player 1</th><th colspan = '4'>Player 2</th></tr>\
                <tr><td><b>Left:</b> " + this.player1.keyCodes.backward + "</td><td><b>Down:</b> " + this.player1.keyCodes.down + "</td><td><b>Up:</b> " + this.player1.keyCodes.up + "</td><td><b>Right:</b> " + this.player1.keyCodes.forward + "</td><td><b>Left:</b> " + this.player2.keyCodes.forward + "</td><td><b>Down:</b> " + this.player2.keyCodes.down + "</td><td><b>Up:</b> " + this.player2.keyCodes.up + "</td><td><b>Right:</b> " + this.player2.keyCodes.backward + "</td></tr>";
                if (!this.gameBlurred) {
                    text += "<tr><td colspan = '8'>Press " + this.gameParameters.keyCodes.start + " to play</td></tr>";
                }
            }
            else {
                text += "<tr><td>Game over. <b>Player " + (this.player1.score == this.gameParameters.end ? "1" : "2") + "</b> wins</td></tr>";
                if (!this.gameBlurred) {
                    text += "<tr><td>Press " + this.gameParameters.keyCodes.start + " to play again</td></tr>";
                }
            }
        }
        else {
            if (!this.gamePaused) {
                text += "<colgroup><col style = 'width: 8.33%'><col style = 'width: 11.0%'><col style = 'width: 8.33%'><col style = 'width: 5.67%'><col style = 'width: 8.33%'><col style = 'width: 11.0%'><col style = 'width: 8.33%'><col style = 'width: 5.67%'><col style = 'width: 8.33%'><col style = 'width: 11.0%'><col style = 'width: 8.33%'><col style = 'width: 5.67%'></colgroup>\
                <tr><th colspan = '4'>Player 1</th><th colspan = '4'>Ball</th><th colspan = '4'>Player 2</th></tr>\
                <tr><td rowspan = '2'>Position:</td><td rowspan = '2'>" + this.player1.center.x.toFixed(2) + ", " + this.player1.center.y.toFixed(2) + "</td><td>Speed:</td><td>" + this.player1.speed.toFixed(2) + "</td><td>Position:</td><td>" + this.ball.center.x.toFixed(2) + ", " + this.ball.center.y.toFixed(2) + "</td><td>Speed:</td><td>" + this.ball.speed.toFixed(2) + "</td><td rowspan = '2'>Position:</td><td rowspan = '2'>" + this.player2.center.x.toFixed(2) + ", " + this.player2.center.y.toFixed(2) + "</td><td>Speed:</td><td>" + this.player2.speed.toFixed(2) + "</td></tr>\
                <tr><td>Size:</td><td>" + this.player1.size.y.toFixed(2) + "</td><td>Direction:</td><td>" + THREE.MathUtils.radToDeg(this.ball.direction).toFixed(2) + "°</td><td>Spin:</td><td>" + THREE.MathUtils.radToDeg(this.ball.spin).toFixed(2) + "°</td><td>Size:</td><td>" + this.player2.size.y.toFixed(2) + "</td></tr>";

                // Compute the elapsed time in seconds
                const deltaT = this.clock.getDelta();

                // Update the players
                this.player1.update(deltaT);
                this.player2.update(deltaT);

                // Update the ball
                this.ball.update(deltaT);

                // Check if a player scored
                if (this.ball.center.x > this.table.halfSize.x) { // Player 1 scored
                    this.player1.scored();
                    this.player2.conceded();
                    this.ball.initialize();
                    this.displayScore();
                }
                else if (this.ball.center.x < -this.table.halfSize.x) { // Player 2 scored
                    this.player2.scored();
                    this.player1.conceded();
                    this.ball.initialize();
                    this.ball.direction = Math.PI - this.ball.direction; // Reverse the ball direction
                    this.displayScore();
                }

                // Check if the game is over
                if (this.player1.score == this.gameParameters.end || this.player2.score == this.gameParameters.end) {
                    this.ball.visible = false; // Make the ball invisible
                    this.gameRunning = false;
                    this.gamePaused = true;
                    this.clock.stop();
                }
            }
            else {
                text += "<tr><td>Game paused</td></tr>";
                if (!this.gameBlurred) {
                    text += "<tr><td>Press " + this.gameParameters.keyCodes.pause + " to resume</td></tr>";
                }
            }
        }
        text += "</table>";
        this.displayStatus(text);
    }
}