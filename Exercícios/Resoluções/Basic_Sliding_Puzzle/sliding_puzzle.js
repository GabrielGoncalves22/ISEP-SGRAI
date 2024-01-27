// Sliding Puzzle - JPP 2021, 2022, 2023
// Audio
// 3D modeling
// Perspective and orthographic projections
// Linear and affine transformations
// Lighting and materials
// Shadows
// Multitexturing
// Picking
// User interaction

import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import Orientation from "./orientation.js";
import { generalData, audioData, boardData, frameData, tileData, ambientLightData, directionalLightData, cameraData } from "./default_data.js";
import { merge } from "./merge.js";
import Audio from "./audio.js";
import Board from "./board.js";
import { AmbientLight, DirectionalLight } from "./lights.js";
import Camera from "./camera.js";

/*
 * generalParameters = {
 *  setDevicePixelRatio: Boolean
 * }
 *
 * audioParameters = {
 *  enabled: Boolean,
 *  volume: Float,
 *  clips: [{ url: String, position: String, referenceDistance: Float, loop: Boolean, volume: Float }],
 *  credits: String
 * }
 *
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
 *
 * ambientLightParameters = {
 *  color: Color,
 *  intensity: Float
 * }
 *
 * directionalLightParameters = {
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
 *
 * cameraParameters = {
 *  initialProjection: String,
 *  initialTarget: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  orientationStep: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  distanceStep: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  zoomStep: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 */

export default class SlidingPuzzle {
    constructor(generalParameters, audioParameters, boardParameters, frameParameters, tileParameters, ambientLightParameters, directionalLightParameters, cameraParameters) {
        this.generalParameters = merge({}, generalData, generalParameters);
        this.audioParameters = merge({}, audioData, audioParameters);
        this.boardParameters = merge({}, boardData, boardParameters);
        this.frameParameters = merge({}, frameData, frameParameters);
        this.tileParameters = merge({}, tileData, tileParameters);
        this.ambientLightParameters = merge({}, ambientLightData, ambientLightParameters);
        this.directionalLightParameters = merge({}, directionalLightData, directionalLightParameters);
        this.cameraParameters = merge({}, cameraData, cameraParameters);

        // Set the game state
        this.gameRunning = false;
        this.gameOver = true;
        this.gameShuffling = true;

        // Create the audio listener, the audio sources and load the sound clips
        this.audio = new Audio(this.audioParameters);

        // Create a 3D scene
        this.scene = new THREE.Scene();

        // Create the board and add it to the scene
        this.board = new Board(this.boardParameters, this.frameParameters, this.tileParameters);
        this.scene.add(this.board);

        // Create the lights and add them to the scene
        this.ambientLight = new AmbientLight(this.ambientLightParameters);
        this.scene.add(this.ambientLight);
        this.directionalLight = new DirectionalLight(this.directionalLightParameters);
        this.scene.add(this.directionalLight);

        // Create the camera
        this.camera = new Camera(this.cameraParameters);

        // Create the statistics and make its node invisible
        this.statistics = new Stats();
        this.statistics.dom.style.display = "none";
        this.statistics.dom.style.left = "0.5vw";
        this.statistics.dom.style.top = "1.0vh";
        document.body.appendChild(this.statistics.dom);

        // Create a renderer and turn on shadows in the renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        if (this.generalParameters.setDevicePixelRatio) {
            this.renderer.setPixelRatio(window.devicePixelRatio);
        }
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.id = "canvas";
        document.body.appendChild(this.renderer.domElement);

        // Get and configure the panels' <div> elements
        this.viewPanel = document.getElementById("view-panel");
        this.projection = document.getElementById("projection");
        this.horizontal = document.getElementById("horizontal");
        this.horizontal.min = this.camera.orientationMin.h.toFixed(0);
        this.horizontal.max = this.camera.orientationMax.h.toFixed(0);
        this.horizontal.step = this.camera.orientationStep.h.toFixed(0);
        this.vertical = document.getElementById("vertical");
        this.vertical.min = this.camera.orientationMin.v.toFixed(0);
        this.vertical.max = this.camera.orientationMax.v.toFixed(0);
        this.vertical.step = this.camera.orientationStep.v.toFixed(0);
        this.distance = document.getElementById("distance");
        this.distance.min = this.camera.distanceMin.toFixed(1);
        this.distance.max = this.camera.distanceMax.toFixed(1);
        this.distance.step = this.camera.distanceStep.toFixed(1);
        this.zoom = document.getElementById("zoom");
        this.zoom.min = this.camera.zoomMin.toFixed(1);
        this.zoom.max = this.camera.zoomMax.toFixed(1);
        this.zoom.step = this.camera.zoomStep.toFixed(1);
        this.reset = document.getElementById("reset");
        this.mouseHelpPanel = document.getElementById("mouse-help-panel");
        this.keyboardHelpPanel = document.getElementById("keyboard-help-panel");
        this.creditsPanel = document.getElementById("credits-panel");
        this.puzzlePanel = document.getElementById("puzzle-panel");
        this.audio.checkBox = document.getElementById("audio");
        this.audio.checkBox.checked = this.audio.enabled;
        this.background = { checkBox: document.getElementById("background") };
        this.background.checkBox.checked = this.board.background.enabled;
        this.separator = { checkBox: document.getElementById("separator") };
        this.separator.checkBox.checked = this.board.frame.separator.enabled;
        this.statistics.checkBox = document.getElementById("statistics");
        this.statistics.checkBox.checked = false;
        this.userInterface = { checkBox: document.getElementById("user-interface") };
        this.userInterface.checkBox.checked = true;
        this.help = { checkBox: document.getElementById("help") };
        this.help.checkBox.checked = false;
        this.board.element = document.getElementById("grid-size");
        this.board.element.value = this.board.grid.initialSize.toFixed(0);
        this.board.element.min = this.board.grid.sizeMin.toFixed(0);
        this.board.element.max = this.board.grid.sizeMax.toFixed(0);
        this.board.element.step = this.board.grid.sizeStep.toFixed(0);
        this.shuffle = document.getElementById("shuffle");

        // Set the mouse related information
        this.mouse = {
            initialPosition: new THREE.Vector2(), // Mouse position when a button is pressed
            previousPosition: new THREE.Vector2(), // Previous mouse position
            currentPosition: new THREE.Vector2(), // Current mouse position
            actionInProgress: false // Orbiting around a target: true; otherwise: false
        }

        // Build the help panels
        this.buildHelpPanels();

        // Build the credits panel
        this.buildCreditsPanel();

        // Update the view panel
        this.updateViewPanel();
    }

    buildHelpPanels() {
        // Mouse help panel is static; so, it doesn't need to be built

        // Keyboard help panel
        const table = document.getElementById("keyboard-help-table");
        let i = 0;
        for (const key in this.board.keyCodes) {
            while (table.rows[i].cells.length < 2) {
                i++;
            };
            table.rows[i++].cells[0].innerHTML = this.board.keyCodes[key];
        }
    }

    buildCreditsPanel() {
        const table = document.getElementById("credits-table");
        while (table.rows.length > 1) {
            table.deleteRow(-1);
        };
        [this.audio.credits, this.frameParameters.credits, this.board.images.bitmaps[this.board.activeImage].credits].forEach(element => {
            if (element != "") {
                const row = table.insertRow(-1);
                const cell = row.insertCell(-1);
                cell.innerHTML = element;
            }
        });
    }

    updateViewPanel() {
        this.projection.options.selectedIndex = ["perspective", "orthographic"].indexOf(this.camera.projection);
        this.horizontal.value = this.camera.orientation.h.toFixed(0);
        this.vertical.value = this.camera.orientation.v.toFixed(0);
        this.distance.value = this.camera.distance.toFixed(1);
        this.zoom.value = this.camera.zoom.toFixed(1);
    }

    setCursor(action) {
        let cursor;
        switch (action) {
            case "dolly-in":
                cursor = "url('./cursors/dolly-in_16.png') 8 8, n-resize"; // Custom cursor plus a mandatory fallback cursor in case the icon fails to load
                break;
            case "dolly-out":
                cursor = "url('./cursors/dolly-out_16.png') 8 8, s-resize"; // Custom cursor plus a mandatory fallback cursor in case the icon fails to load
                break;
            case "zoom-in":
                cursor = "zoom-in";
                break;
            case "zoom-out":
                cursor = "zoom-out";
                break;
            case "orbit":
                cursor = "url('./cursors/orbit_32.png') 16 16, crosshair"; // Custom cursor plus a mandatory fallback cursor in case the icon fails to load
                break;
            case "auto":
                cursor = "auto";
                break;
        }
        document.body.style.cursor = cursor;
    }

    enableAudio(enabled) {
        if (enabled) {
            this.audio.checkBox.checked = true;
            this.audio.enabled = true;
        }
        else {
            this.audio.checkBox.checked = false;
            this.audio.enabled = false;
            this.audio.stop();
        }
    }

    enableBackground(enabled) {
        if (enabled) {
            this.background.checkBox.checked = true;
            this.scene.background = this.board.background.textures[1];
        }
        else {
            this.background.checkBox.checked = false;
            this.scene.background = this.board.background.textures[0];
        }
    }

    setBackground() {
        let ratio = this.camera.aspectRatio;
        if (ratio < 1.0) {
            this.board.background.textures.forEach(texture => {
                texture.repeat.set(ratio, 1.0);
                texture.offset.set((1.0 - ratio) / 2.0, 0.0);
            });
        }
        else {
            ratio = 1.0 / ratio;
            this.board.background.textures.forEach(texture => {
                texture.repeat.set(1.0, ratio);
                texture.offset.set(0.0, (1.0 - ratio) / 2.0);
            });
        }
        if (this.background.checkBox.checked) {
            this.scene.background = this.board.background.textures[1];
        }
        else {
            this.scene.background = this.board.background.textures[0];
        }
    }

    enableSeparator(enabled) {
        this.separator.checkBox.checked = enabled;
        this.board.frame.separator.mesh.visible = enabled;
    }

    setStatisticsVisibility(visible) {
        this.statistics.checkBox.checked = visible;
        this.statistics.dom.style.display = visible ? "block" : "none";
    }

    setUserInterfaceVisibility(visible) {
        this.userInterface.checkBox.checked = visible;
        this.viewPanel.style.display = visible ? "block" : "none";
        this.puzzlePanel.style.display = visible ? "block" : "none";
    }

    setHelpVisibility(visible) {
        if (visible) {
            this.help.checkBox.checked = true;
            this.mouseHelpPanel.style.display = "block";
            this.keyboardHelpPanel.style.display = "block";
            this.creditsPanel.style.display = "block";
        }
        else {
            this.help.checkBox.checked = false;
            this.mouseHelpPanel.style.display = "none";
            this.keyboardHelpPanel.style.display = "none";
            this.creditsPanel.style.display = "none";
        }
    }

    checkIfGameOver() {
        if (this.board.ordered(true)) {
            this.gameOver = true;
            this.audio.stop();
            this.audio.play();
        }
    }

    startShuffling() {
        this.gameOver = true;
        this.gameShuffling = true;
        this.board.startShuffling(this.board.element.checkValidity() ? this.board.element.value : this.board.grid.size);
        this.buildCreditsPanel();
    }

    windowResize() {
        this.camera.setProjectionParameters();
        this.setBackground();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    keyDown(event) {
        if (document.activeElement == document.body) {
            // Prevent the "Space" and "Arrow" keys from scrolling the document's content
            if (event.code == "Space" || event.code == "ArrowLeft" || event.code == "ArrowRight" || event.code == "ArrowDown" || event.code == "ArrowUp") {
                event.preventDefault();
            }
            if (event.code == this.board.keyCodes.audio) { // Enable / disable audio
                this.enableAudio(!this.audio.checkBox.checked);
            }
            if (event.code == this.board.keyCodes.background) { // Enable / disable background
                this.enableBackground(!this.background.checkBox.checked);
            }
            if (event.code == this.board.keyCodes.separator) { // Enable / disable separator
                this.enableSeparator(!this.separator.checkBox.checked);
            }
            else if (event.code == this.board.keyCodes.statistics) { // Display / hide statistics
                this.setStatisticsVisibility(!this.statistics.checkBox.checked);
            }
            else if (event.code == this.board.keyCodes.userInterface) { // Display / hide user interface
                this.setUserInterfaceVisibility(!this.userInterface.checkBox.checked);
            }
            else if (event.code == this.board.keyCodes.help) { // Display / hide help
                this.setHelpVisibility(!this.help.checkBox.checked);
            }
            else if (event.code == this.board.keyCodes.shuffle) { // Shuffle board
                this.startShuffling();
            }
            else if (event.code == this.board.keyCodes.left) {
                if (!this.gameOver) {
                    if (90.0 <= this.camera.orientation.h && this.camera.orientation.h < 270.0) {
                        this.board.slideLeft();
                    }
                    else {
                        this.board.slideRight();
                    }
                    this.checkIfGameOver();
                }
            }
            else if (event.code == this.board.keyCodes.right) {
                if (!this.gameOver) {
                    if (90.0 <= this.camera.orientation.h && this.camera.orientation.h < 270.0) {
                        this.board.slideRight();
                    }
                    else {
                        this.board.slideLeft();
                    }
                    this.checkIfGameOver();
                }
            }
            else if (event.code == this.board.keyCodes.down) {
                if (!this.gameOver) {
                    this.board.slideDown();
                    this.checkIfGameOver();
                }
            }
            else if (event.code == this.board.keyCodes.up) {
                if (!this.gameOver) {
                    this.board.slideUp();
                    this.checkIfGameOver();
                }
            }
        }
    }

    mouseClick(event) {
        if (event.target.id == "canvas") {
            event.preventDefault();
            if (!this.gameOver) {
                const raycaster = new THREE.Raycaster();
                // Compute mouse position in normalized device coordinates (-1.0 to +1.0)
                const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2.0 - 1.0, -(event.clientY / window.innerHeight) * 2.0 + 1.0);
                // Set the picking ray
                raycaster.setFromCamera(mouse, this.camera.activeProjection);
                // Find tiles intersected by the picking ray
                const intersects = raycaster.intersectObjects(this.scene.children[0].children[1].children);
                if (intersects.length > 0) { // One or more tiles have been picked
                    const tile = intersects[0].object;
                    if (tile.visible) { // The picked tile is not the invisible one
                        this.board.slideTile(tile.tileId); // Slide the nearest picked tile
                        this.checkIfGameOver();
                    }
                }
            }
        }
    }

    mouseDown(event) {
        if (event.target.id == "canvas") {
            event.preventDefault();
            if (event.buttons == 2) { // Secondary button down
                // Store initial mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
                this.mouse.initialPosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
                this.setCursor("orbit"); // Change the cursor to "orbit"
                this.mouse.previousPosition = this.mouse.initialPosition;
                this.mouse.actionInProgress = true;
            }
        }
    }

    mouseMove(event) {
        if (event.target.id == "canvas") {
            document.activeElement.blur();
            if (event.buttons == 2) { // Secondary button down
                // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
                this.mouse.currentPosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
                if (this.mouse.actionInProgress) { // Secondary button down and action in progress
                    // Compute mouse movement and update mouse position
                    const mouseIncrement = this.mouse.currentPosition.clone().sub(this.mouse.previousPosition);
                    this.camera.updateOrientation(mouseIncrement.multiply(new THREE.Vector2(-0.5, 0.5))); // Orbiting around a target
                    this.updateViewPanel();
                    this.mouse.previousPosition = this.mouse.currentPosition;
                }
            }
            else {
                this.setCursor("auto");
            }
        }
        else {
            this.setCursor("auto");
        }
    }

    mouseUp(event) {
        if (event.button == 2) { // Secondary button up (do not confuse event.button with event.buttons: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button and https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
            this.mouse.actionInProgress = false;
            // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
            this.mouse.currentPosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
            // Reset the cursor
            this.setCursor("auto");
        }
    }

    mouseWheel(event) {
        // Prevent the mouse wheel from scrolling the document's content
        event.preventDefault();
        if (event.shiftKey) { // The shift key is being pressed
            this.setCursor(event.deltaY < 0 ? "dolly-in" : "dolly-out"); // Change the cursor to "dolly-in" or "dolly-out"
            this.camera.updateDistance(0.005 * event.deltaY); // Dollying
        }
        else { // The shift key is not being pressed
            this.setCursor(event.deltaY < 0 ? "zoom-in" : "zoom-out"); // Change the cursor to "zoom-in" or "zoom-out"
            this.camera.updateZoom(-0.001 * event.deltaY); // Zooming
        }
        this.updateViewPanel();
    }

    contextMenu(event) {
        // Prevent the context menu from appearing when the secondary mouse button is clicked
        event.preventDefault();
    }

    elementChange(event) {
        switch (event.target.id) {
            case "projection":
                this.camera.activeProjection.remove(this.audio.listener);
                this.camera.setActiveProjection(["perspective", "orthographic"][this.projection.options.selectedIndex]);
                this.camera.activeProjection.add(this.audio.listener);
                break;
            case "horizontal":
            case "vertical":
            case "distance":
            case "zoom":
                if (event.target.checkValidity()) {
                    switch (event.target.id) {
                        case "horizontal":
                        case "vertical":
                            this.camera.setOrientation(new Orientation(this.horizontal.value, this.vertical.value));
                            break;
                        case "distance":
                            this.camera.setDistance(this.distance.value);
                            break;
                        case "zoom":
                            this.camera.setZoom(this.zoom.value);
                            break;
                    }
                }
                break;
            case "audio":
                this.enableAudio(event.target.checked);
                break;
            case "background":
                this.enableBackground(event.target.checked);
                break;
            case "separator":
                this.enableSeparator(event.target.checked);
                break;
            case "statistics":
                this.setStatisticsVisibility(event.target.checked);
                break;
            case "user-interface":
                this.setUserInterfaceVisibility(event.target.checked);
                break;
            case "help":
                this.setHelpVisibility(event.target.checked);
                break;
        }
    }

    buttonClick(event) {
        switch (event.target.id) {
            case "reset":
                this.camera.initialize();
                this.updateViewPanel();
                break;
            case "shuffle":
                this.startShuffling();
                break;
        }
    }

    update() {
        if (!this.gameRunning) {
            if (this.audio.loaded()) { // If the audio resources have been loaded
                // Add the audio listener to the camera
                this.camera.activeProjection.add(this.audio.listener);

                // Register the event handler to be called on window resize
                window.addEventListener("resize", event => this.windowResize(event));

                // Register the event handler to be called on key down
                document.addEventListener("keydown", event => this.keyDown(event));

                // Register the event handler to be called on mouse click
                document.addEventListener("click", event => this.mouseClick(event));

                // Register the event handler to be called on mouse down
                document.addEventListener("mousedown", event => this.mouseDown(event));

                // Register the event handler to be called on mouse move
                document.addEventListener("mousemove", event => this.mouseMove(event));

                // Register the event handler to be called on mouse up
                document.addEventListener("mouseup", event => this.mouseUp(event));

                // Register the event handler to be called on mouse wheel
                this.renderer.domElement.addEventListener("wheel", event => this.mouseWheel(event));

                // Register the event handler to be called on context menu
                document.addEventListener("contextmenu", event => this.contextMenu(event));

                // Register the event handler to be called on select, input number, or input checkbox change
                this.projection.addEventListener("change", event => this.elementChange(event));
                this.horizontal.addEventListener("change", event => this.elementChange(event));
                this.vertical.addEventListener("change", event => this.elementChange(event));
                this.distance.addEventListener("change", event => this.elementChange(event));
                this.zoom.addEventListener("change", event => this.elementChange(event));
                this.audio.checkBox.addEventListener("change", event => this.elementChange(event));
                this.background.checkBox.addEventListener("change", event => this.elementChange(event));
                this.separator.checkBox.addEventListener("change", event => this.elementChange(event));
                this.statistics.checkBox.addEventListener("change", event => this.elementChange(event));
                this.userInterface.checkBox.addEventListener("change", event => this.elementChange(event));
                this.help.checkBox.addEventListener("change", event => this.elementChange(event));

                // Register the event handler to be called on input button click
                this.reset.addEventListener("click", event => this.buttonClick(event));
                this.shuffle.addEventListener("click", event => this.buttonClick(event));

                // Start the game
                this.gameRunning = true;
            }
        }
        else {
            if (this.board.loaded() && this.gameShuffling) { // If the board resources have been loaded
                this.gameShuffling = false;
                this.gameOver = false;
                this.setBackground();
            }
            // Update the directional light position
            this.directionalLight.position.copy(this.camera.activeProjection.position).add(this.camera.activeProjection.localToWorld(this.directionalLight.offset.clone()));

            // Update statistics
            this.statistics.update();

            // Render the scene
            this.renderer.render(this.scene, this.camera.activeProjection); // Render the scene
        }
    }
}