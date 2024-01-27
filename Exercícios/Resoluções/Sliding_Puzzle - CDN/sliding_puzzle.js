// Sliding Puzzle - JPP 2021, 2022, 2023
// Audio
// 3D modeling
// Sprites
// Animation
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
import { generalData, gameData, audioData, frameData, tileSetData, tileData, earthModelData, imageData, ambientLightData, directionalLightData, cameraData } from "./default_data.js";
import { merge } from "./merge.js";
import Audio from "./audio.js";
import MultiTexture from "./texture.js";
import Frame from "./frame.js";
import TileSet from "./tile_set.js";
import EarthModel from "./earth_model.js";
import { AmbientLight, DirectionalLight } from "./lights.js";
import Camera from "./camera.js";

/*
 * generalParameters = {
 *  setDevicePixelRatio: Boolean
 * }
 *
 * gameParameters = {
 *  background: {
 *   enabled: Boolean,
 *   default: {
 *    textures: {
 *     wrapS: Integer,
 *     wrapT: Integer,
 *     offset: Vector2,
 *     repeat: Vector2,
 *     magFilter: Integer,
 *     minFilter: Integer
 *    },
 *    bitmaps: {
 *     mapUrl: String,
 *     credits: String
 *    }
 *   }
 *  },
 *  animation: {
 *   enabled: Boolean
 *  },
 *  tips: {
 *   enabled: Boolean,
 *   size: Vector2,
 *   timeout: Integer
 *  },
 *  keyCodes: { audio: String, background: String, separator: String, animation: String, tips: String, statistics: String, userInterface: String, help: String, shuffle: String, left: String, right: String, down: String, up: String }
 * }
 *
 * audioParameters = {
 *  enabled: Boolean,
 *  volume: Float,
 *  clips: [{ url: String, position: String, referenceDistance: Float, loop: Boolean, volume: Float }],
 *  credits: String
 * }
 *
 * frameParameters = {
 *  size: Vector3,
 *  segments: Vector3,
 *  materials: {
 *   color: Color,
 *   transparent: Boolean,
 *   opacity: Float,
 *   aoMapIntensity: Float,
 *   displacementScale: Float,
 *   displacementBias: Float,
 *   normalMapType: Integer,
 *   normalScale: Vector2,
 *   bumpScale: Float,
 *   roughness: Float
 *  },
 *  textures: {
 *   wrapS: Integer,
 *   wrapT: Integer,
 *   offset: Vector2,
 *   repeat: Vector2,
 *   magFilter: Integer,
 *   minFilter: Integer
 *  },
 *  bitmaps: {
 *   mapUrl: String,
 *   alphaMapUrl: String,
 *   aoMapUrl: String,
 *   displacementMapUrl: String,
 *   normalMapUrl: String,
 *   bumpMapUrl: String,
 *   roughnessMapUrl: String,
 *   credits: String
 *  },
 *  separator: {
 *   enabled: Boolean
 *  }
 * }
 *
 * tileSetParameters = {
 *  size: Integer,
 *  sizeMin: Integer,
 *  sizeMax: Integer,
 *  sizeStep: Integer,
 *  shuffleIterations: Integer,
 *  animation: {
 *   duration: Float
 *  }
 * }
 *
 * tileParameters = {
 *  initialSize: Vector3,
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
 * earthModelParameters = {
 *  size: Vector2,
 *  background: {
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
 *    credits: String
 *   }
 *  },
 *  surface: {
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
 *   },
 *   animation: {
 *    speed: Float
 *   }
 *  },
 *  clouds: {
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
 *   animation: {
 *    speed: Float
 *   }
 *  },
 *  ambientLight: {
 *   color: Color,
 *   intensity: Float
 *  },
 *  directionalLight: {
 *   color: Color,
 *   intensity: Float,
 *   offset: Vector3,
 *   castShadow: Boolean,
 *   shadow: {
 *    mapSize: Vector2,
 *    camera: {
 *     left: Float,
 *     right: Float,
 *     top: Float,
 *     bottom: Float,
 *     near: Float,
 *     far: Float
 *    }
 *   }
 *  },
 *  camera: {
 *   initialDistance: Float,
 *   distanceMin: Float,
 *   distanceMax: Float,
 *   damping: {
 *    enabled: Boolean,
 *    factor: Float
 *   }
 *   fov: Float,
 *   near: Float,
 *   far: Float
 *  },
 *  credits: String
 * }
 *
 * imageParameters = [{
 *  textures: {
 *   wrapS: Integer,
 *   wrapT: Integer,
 *   offset: Vector2,
 *   repeat: Vector2,
 *   magFilter: Integer,
 *   minFilter: Integer
 *  },
 *  bitmaps: {
 *   mapUrl: String,
 *   credits: String
 *  }
 * }]
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
    constructor(generalParameters, gameParameters, audioParameters, frameParameters, tileSetParameters, tileParameters, earthModelParameters, imageParameters, ambientLightParameters, directionalLightParameters, cameraParameters) {
        this.generalParameters = merge({}, generalData, generalParameters);
        merge(this, gameData, gameParameters);
        this.audioParameters = merge({}, audioData, audioParameters);
        this.frameParameters = merge({}, frameData, frameParameters);
        this.tileSetParameters = merge({}, tileSetData, tileSetParameters);
        this.tileParameters = merge({}, tileData, tileParameters);
        this.earthModelParameters = merge({}, earthModelData, earthModelParameters);
        this.imageParameters = imageData.concat(imageParameters);
        this.ambientLightParameters = merge({}, ambientLightData, ambientLightParameters);
        this.directionalLightParameters = merge({}, directionalLightData, directionalLightParameters);
        this.cameraParameters = merge({}, cameraData, cameraParameters);

        // Set the game state
        /*
         *  gameState | Game state
         * -----------+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
         *      0     | wait until audio, frame and Earth model resources are loaded; create the frame and the Earth model; load tile resources
         *      1     | load back side tile image if needed
         *      2     | wait until default background and tile resources are loaded; create the new tile set and shuffle tiles; add tiles to the new tile set (animation); set the background
         *      3     | wait until the animation is finished; scale the tip; start the game
         *      4     | game in progress
         *      5     | game over
         *      6     | shuffle command triggered: remove tiles from the current tile set (animation)
         *      7     | wait until the animation is finished; update the index of the selected back side tile image; start over (go to game state 1)
         */
        this.gameState = 0;

        // Create the audio listener, the audio sources and load the sound clips
        this.audio = new Audio(this.audioParameters);

        // Create a 3D scene
        this.scene = new THREE.Scene();

        // Create and configure the tip, but don't add it to the scene; it will be rendered separately so that it overlaps the scene
        const material = new THREE.SpriteMaterial();
        this.tip = new THREE.Sprite(material);
        this.tip.visible = false;
        this.tip.translateZ(-this.tileParameters.initialSize.z / 2.0);

        // Load and configure the default background texture (scene background disabled)
        this.backgroundTextures = { default: new MultiTexture(this.background.default.textures, this.background.default.bitmaps), selected: {} };

        // Load frame resources
        this.frameTextures = new MultiTexture(this.frameParameters.textures, this.frameParameters.bitmaps);

        // Load Earth model resources
        this.earthModelTextures = { background: new MultiTexture(this.earthModelParameters.background.textures, this.earthModelParameters.background.bitmaps), surface: new MultiTexture(this.earthModelParameters.surface.textures, this.earthModelParameters.surface.bitmaps), clouds: new MultiTexture(this.earthModelParameters.clouds.textures, this.earthModelParameters.clouds.bitmaps) };

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
        this.renderer.autoClearColor = false;
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
        this.background.checkBox = document.getElementById("background");
        this.background.checkBox.checked = this.background.enabled;
        this.separator = { checkBox: document.getElementById("separator") };
        this.separator.checkBox.checked = this.frameParameters.separator.enabled; // Using this.frameParameters instead of this.frame because the frame hasn't been created yet
        this.animation.checkBox = document.getElementById("animation");
        this.animation.checkBox.checked = this.animation.enabled;
        this.tips.checkBox = document.getElementById("tips");
        this.tips.checkBox.checked = this.tips.enabled;
        this.statistics.checkBox = document.getElementById("statistics");
        this.statistics.checkBox.checked = false;
        this.userInterface = { checkBox: document.getElementById("user-interface") };
        this.userInterface.checkBox.checked = true;
        this.help = { checkBox: document.getElementById("help") };
        this.help.checkBox.checked = false;
        this.size = document.getElementById("tile-set-size");
        this.size.value = this.tileSetParameters.size.toFixed(0); // Using this.tileSetParameters instead of this.tileSet because the tile set hasn't been created yet
        this.size.min = this.tileSetParameters.sizeMin.toFixed(0); // Idem
        this.size.max = this.tileSetParameters.sizeMax.toFixed(0); // Idem
        this.size.step = this.tileSetParameters.sizeStep.toFixed(0); // Idem
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

        // Update the view panel
        this.updateViewPanel();
    }

    buildHelpPanels() {
        // Mouse help panel is static; so, it doesn't need to be built

        // Keyboard help panel
        const table = document.getElementById("keyboard-help-table");
        let i = 0;
        for (const key in this.keyCodes) {
            while (table.rows[i].cells.length < 2) {
                i++;
            };
            table.rows[i++].cells[0].innerHTML = this.keyCodes[key];
        }
    }

    buildCreditsPanel() {
        const table = document.getElementById("credits-table");
        while (table.rows.length > 1) {
            table.deleteRow(-1);
        };
        const credits = [];
        credits.push(this.audio.credits); // Audio credits
        credits.push(this.background.checkBox.checked ? "" : this.background.default.bitmaps.credits); // Default background texture credits
        credits.push(this.frame.bitmaps.credits); // Frame textures credits
        credits.push(this.visibleSide() == "front-side" ? this.tileParameters.frontSide.bitmaps.credits : this.tileParameters.backSide.bitmaps.credits); // Tile textures (front and back sides) credits
        credits.push(this.tileParameters.remainingSides.bitmaps.credits); // Tile textures (remaining sides) credits
        credits.push(this.imageParameters[this.selectedIndex].bitmaps.credits); // Back side tile image credits
        if (this.selectedIndex == 0) { // Earth image / animation selected
            credits.push(this.earthModelParameters.credits); // Earth model credits
        }
        credits.forEach(element => {
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
            this.scene.background = this.backgroundTextures.selected.map;
        }
        else {
            this.background.checkBox.checked = false;
            this.scene.background = this.backgroundTextures.default.map;
        }
    }

    setBackground() {
        let ratio = this.camera.aspectRatio;
        if (ratio < 1.0) {
            this.backgroundTextures.default.map.repeat.set(ratio, 1.0);
            this.backgroundTextures.default.map.offset.set((1.0 - ratio) / 2.0, 0.0);
            this.backgroundTextures.selected.map.repeat.set(ratio, 1.0);
            this.backgroundTextures.selected.map.offset.set((1.0 - ratio) / 2.0, 0.0);
        }
        else {
            ratio = 1.0 / ratio;
            this.backgroundTextures.default.map.repeat.set(1.0, ratio);
            this.backgroundTextures.default.map.offset.set(0.0, (1.0 - ratio) / 2.0);
            this.backgroundTextures.selected.map.repeat.set(1.0, ratio);
            this.backgroundTextures.selected.map.offset.set(0.0, (1.0 - ratio) / 2.0);
        }
        if (this.background.checkBox.checked) {
            this.scene.background = this.backgroundTextures.selected.map;
        }
        else {
            this.scene.background = this.backgroundTextures.default.map;
        }
    }

    enableSeparator(enabled) {
        this.separator.checkBox.checked = enabled;
        this.frame.separator.mesh.visible = enabled;
    }

    enableAnimation(enabled) {
        this.animation.checkBox.checked = enabled;
        this.animation.enabled = enabled;
        if (enabled) {
            this.earthModel.clock.start();
        }
        else {
            this.earthModel.clock.stop();
        }
    }

    enableTips(enabled) {
        this.tips.checkBox.checked = enabled;
        this.tips.enabled = enabled;
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

    visibleSide() {
        return 90.0 <= this.camera.orientation.h && this.camera.orientation.h < 270.0 ? "front-side" : "back-side";
    }

    tipActive() {
        return this.tips.enabled && this.visibleSide() == "back-side" && this.gameState == 4;
    }

    tilePicked(event) {
        const raycaster = new THREE.Raycaster();
        // Compute mouse position in normalized device coordinates (-1.0 to +1.0)
        const mouse = new THREE.Vector2((event.clientX / window.innerWidth) * 2.0 - 1.0, -(event.clientY / window.innerHeight) * 2.0 + 1.0);
        // Set the picking ray
        raycaster.setFromCamera(mouse, this.camera.activeProjection);
        // Find tiles intersected by the picking ray
        const intersects = raycaster.intersectObjects(this.scene.children[3].children);
        if (intersects.length > 0 && intersects[0].object.visible) {
            return intersects[0].object; // Return the closest visible tile
        }
        return null; // No visible tile was picked
    }

    windowResize() {
        this.camera.setProjectionParameters();
        this.setBackground();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    keyDown(event) {
        if (event.key == "Control") {
            if (this.selectedIndex == 0) { // Earth image / animation selected: enable orbit controls (Earth model camera)
                this.earthModel.orbitControls.enableRotate = true;
                this.earthModel.orbitControls.enableZoom = true;
            }
        }
        else {
            if (document.activeElement == document.body) {
                // Prevent the "Space" and "Arrow" keys from scrolling the document's content
                if (event.code == "Space" || event.code == "ArrowLeft" || event.code == "ArrowRight" || event.code == "ArrowDown" || event.code == "ArrowUp") {
                    event.preventDefault();
                }
                if (event.code == this.keyCodes.audio) { // Enable / disable audio
                    this.enableAudio(!this.audio.checkBox.checked);
                }
                else if (event.code == this.keyCodes.background) { // Enable / disable background
                    this.enableBackground(!this.background.checkBox.checked);
                    this.buildCreditsPanel();
                }
                else if (event.code == this.keyCodes.separator) { // Enable / disable separator
                    this.enableSeparator(!this.separator.checkBox.checked);
                }
                else if (event.code == this.keyCodes.animation) { // Enable / disable animation
                    this.enableAnimation(!this.animation.checkBox.checked);
                }
                else if (event.code == this.keyCodes.tips) { // Enable / disable tips
                    this.enableTips(!this.tips.checkBox.checked);
                }
                else if (event.code == this.keyCodes.statistics) { // Display / hide statistics
                    this.setStatisticsVisibility(!this.statistics.checkBox.checked);
                }
                else if (event.code == this.keyCodes.userInterface) { // Display / hide user interface
                    this.setUserInterfaceVisibility(!this.userInterface.checkBox.checked);
                }
                else if (event.code == this.keyCodes.help) { // Display / hide help
                    this.setHelpVisibility(!this.help.checkBox.checked);
                }
                else if (event.code == this.keyCodes.shuffle) { // Shuffle tiles
                    if (this.gameState == 4 || this.gameState == 5) { // If a game is in progress or over
                        this.gameState = 6;
                    }
                }
                else if (event.code == this.keyCodes.left) { // Slide left
                    if (this.gameState == 4) { // If the game is in progress
                        if (this.visibleSide() == "front-side") {
                            this.tileSet.slideLeft();
                        }
                        else {
                            this.tileSet.slideRight();
                        }
                    }
                }
                else if (event.code == this.keyCodes.right) { // Slide right
                    if (this.gameState == 4) { // If the game is in progress
                        if (this.visibleSide() == "front-side") {
                            this.tileSet.slideRight();
                        }
                        else {
                            this.tileSet.slideLeft();
                        }
                    }
                }
                else if (event.code == this.keyCodes.down) { // Slide down
                    if (this.gameState == 4) { // If the game is in progress
                        this.tileSet.slideDown();
                    }
                }
                else if (event.code == this.keyCodes.up) { // Slide up
                    if (this.gameState == 4) { // If the game is in progress
                        this.tileSet.slideUp();
                    }
                }
            }
        }
    }

    keyUp(event) {
        if (event.key == "Control") {
            if (this.selectedIndex == 0) { // Earth image / animation selected: disable orbit controls (Earth model camera)
                this.earthModel.orbitControls.enableRotate = false;
                this.earthModel.orbitControls.enableZoom = false;
            }
        }
    }

    mouseClick(event) {
        if (!event.ctrlKey) {
            if (event.target.id == "canvas") {
                event.preventDefault();
                if (this.gameState == 4) { // If the game is in progress
                    const tile = this.tilePicked(event);
                    if (tile != null) { // A tile was picked
                        this.tileSet.slideTile(tile.tileId); // Slide the nearest picked tile
                    }
                }
            }
        }
    }

    mouseDown(event) {
        if (event.ctrlKey) {
            if (this.selectedIndex == 0) { // Earth image / animation selected
                if (event.buttons == 2) { // Secondary button down
                    this.setCursor("orbit"); // Change the cursor to "orbit"
                }
            }
        }
        else {
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
    }

    mouseMove(event) {
        if (!event.ctrlKey) {
            if (event.target.id == "canvas") {
                document.activeElement.blur();
                if (event.buttons == 2) { // Secondary button down
                    // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
                    this.mouse.currentPosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
                    if (this.mouse.actionInProgress) { // Secondary button down and action in progress
                        // Compute mouse movement and update mouse position
                        const mouseIncrement = this.mouse.currentPosition.clone().sub(this.mouse.previousPosition);
                        this.camera.updateOrientation(mouseIncrement.multiply(new THREE.Vector2(-0.5, 0.5))); // Orbiting around a target
                        this.buildCreditsPanel();
                        this.updateViewPanel();
                        this.mouse.previousPosition = this.mouse.currentPosition;
                    }
                }
                else {
                    if (event.buttons == 0) { // No buttons down
                        if (this.tipActive()) {
                            const tile = this.tilePicked(event);
                            if (tile != null) { // A tile was picked
                                this.tip.material.map = tile.material[4].map // material[4] corresponds to the front side material
                                this.tip.position.setX(tile.position.x);
                                this.tip.position.setY(tile.position.y);
                                if (!this.tip.visible) {
                                    this.tip.visible = true;
                                    setTimeout(() => {
                                        this.tip.visible = false;
                                    }, this.tips.timeout);
                                }
                            }
                        }
                    }
                    this.setCursor("auto");
                }
            }
            else {
                this.setCursor("auto");
            }
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
        // Prevent the mouse wheel from scrolling/zooming the document's content
        event.preventDefault();
        if (event.ctrlKey) {
            if (this.selectedIndex == 0) { // Earth image / animation selected
                this.setCursor(event.deltaY < 0 ? "dolly-in" : "dolly-out"); // Change the cursor to "dolly-in" or "dolly-out"
            }
        }
        else {
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
                            this.buildCreditsPanel();
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
                this.buildCreditsPanel();
                break;
            case "separator":
                this.enableSeparator(event.target.checked);
                break;
            case "animation":
                this.enableAnimation(event.target.checked);
                break;
            case "tips":
                this.enableTips(event.target.checked);
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
            case "reset": // Reset the camera
                this.camera.initialize();
                this.buildCreditsPanel();
                this.updateViewPanel();
                break;
            case "shuffle": // Shuffle tiles
                if (this.gameState == 4 || this.gameState == 5) { // If a game is in progress or over
                    this.gameState = 6;
                }
                break;
        }
    }

    update() {
        // Let's build a finite-state machine based on the value of gameState
        switch (this.gameState) {
            case 0: // Wait until audio, frame and Earth model resources are loaded; create the frame and the Earth model; load tile resources
                if (this.audio.loaded() && this.frameTextures.loaded() && this.earthModelTextures.background.loaded() && this.earthModelTextures.surface.loaded() && this.earthModelTextures.clouds.loaded()) { // If audio, frame and Earth model resources are loaded
                    // Add the audio listener to the camera
                    this.camera.activeProjection.add(this.audio.listener);

                    // Create the frame and add it to the scene
                    this.frame = new Frame(this.frameParameters, this.frameTextures);
                    this.scene.add(this.frame);

                    // Create the Earth model
                    this.earthModel = new EarthModel(this.earthModelParameters, this.earthModelTextures, this.renderer.domElement);

                    // Randomly reorder the list of back side tile images (all except the first)
                    this.nImages = this.imageParameters.length; // Number of back side tile images
                    for (let i = 1; i < this.nImages - 1; i++) {
                        const index = THREE.MathUtils.randInt(1, this.nImages - i);

                        // Swap images
                        const image = this.imageParameters[index];
                        this.imageParameters[index] = this.imageParameters[this.nImages - i];
                        this.imageParameters[this.nImages - i] = image;
                    }

                    // Load tile resources
                    this.tileTextures = {
                        frontSide: new MultiTexture(this.tileParameters.frontSide.textures, this.tileParameters.frontSide.bitmaps),
                        backSide: new MultiTexture(this.tileParameters.backSide.textures, this.tileParameters.backSide.bitmaps),
                        remainingSides: new MultiTexture(this.tileParameters.remainingSides.textures, this.tileParameters.remainingSides.bitmaps)
                    };

                    // Register the event handler to be called on window resize
                    window.addEventListener("resize", event => this.windowResize(event));

                    // Register the event handler to be called on key down
                    document.addEventListener("keydown", event => this.keyDown(event));

                    // Register the event handler to be called on key up
                    document.addEventListener("keyup", event => this.keyUp(event));

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
                    this.animation.checkBox.addEventListener("change", event => this.elementChange(event));
                    this.tips.checkBox.addEventListener("change", event => this.elementChange(event));
                    this.statistics.checkBox.addEventListener("change", event => this.elementChange(event));
                    this.userInterface.checkBox.addEventListener("change", event => this.elementChange(event));
                    this.help.checkBox.addEventListener("change", event => this.elementChange(event));

                    // Register the event handler to be called on input button click
                    this.reset.addEventListener("click", event => this.buttonClick(event));
                    this.shuffle.addEventListener("click", event => this.buttonClick(event));

                    // Initialize image resources
                    this.imageTextures = [];

                    // Initialize the index of the selected back side tile image
                    this.selectedIndex = 0; // Earth image / animation selected

                    // Update the game state
                    this.gameState = 1;
                }
                break;
            case 1: // Load back side tile image if needed
                if (this.imageTextures[this.selectedIndex] === undefined) {
                    this.imageTextures[this.selectedIndex] = new MultiTexture(this.imageParameters[this.selectedIndex].textures, this.imageParameters[this.selectedIndex].bitmaps);
                }

                // Update the game state
                this.gameState = 2;
                break;
            case 2: // Wait until default background, tile and image resources are loaded; create the new tile set and shuffle tiles; add tiles to the new tile set (animation); set the background
                if (this.backgroundTextures.default.loaded() && this.tileTextures.frontSide.loaded() && this.tileTextures.backSide.loaded() && this.tileTextures.remainingSides.loaded() && this.imageTextures[this.selectedIndex].loaded()) { // If default background, tile and image resources are loaded
                    if (this.selectedIndex == 0) { // Earth image / animation selected
                        this.tileTextures.backSide.map = this.earthModel.framebufferTexture;
                        this.earthModel.orbitControls.reset();
                    }
                    else {
                        this.tileTextures.backSide.map = this.imageTextures[this.selectedIndex].map;
                    }

                    // Check the new tile set size validity
                    if (this.size.checkValidity()) {
                        this.tileSetParameters.size = parseInt(this.size.value, 10);
                    }
                    this.size.value = this.tileSetParameters.size;

                    // Create the new tile set and shuffle tiles
                    this.tileSet = new TileSet(this.tileSetParameters, this.tileParameters, this.tileTextures);

                    // Add the new tile set to the scene
                    this.scene.add(this.tileSet);

                    // Add tiles to the new tile set (animation)
                    this.tileSet.startAnimation("add", this.animation.enabled);

                    // Get and configure the selected back side tile image background texture (scene background enabled)
                    this.backgroundTextures.selected = this.tileTextures.backSide;

                    // Set the background
                    this.setBackground();

                    // Build the credits panel
                    this.buildCreditsPanel();

                    // Update the game state
                    this.gameState = 3;
                }
                break;
            case 3: // Wait until the animation is finished; scale the tip; start the game
                if (this.tileSet.animation.inProgress) {
                    this.tileSet.animate();
                }
                else { // The animation is finished
                    this.tileSet.stopAnimation();

                    // Scale the tip
                    this.tip.scale.set(this.tips.size.x * this.tileParameters.size.x, this.tips.size.y * this.tileParameters.size.y);

                    // Update the game state
                    this.gameState = 4;
                }
                break;
            case 4: // Game in progress
                if (this.tileSet.solved()) { // If the tile set is solved
                    // Play clip
                    this.audio.stop();
                    this.audio.play();

                    // Make visible the tile in the last position of the set
                    this.tileSet.tiles[this.tileSet.sizeMinusOne][this.tileSet.sizeMinusOne].visible = true;

                    // Update the game state
                    this.gameState = 5;
                }
                break;
            case 5: // Game over
                // Do nothing (wait for the shuffle command to be triggered)
                break;
            case 6: // Shuffle command triggered: remove tiles from the current tile set (animation)
                this.tileSet.startAnimation("remove", this.animation.enabled);

                // Update the game state
                this.gameState = 7;
                break;
            case 7: // Wait until the animation is finished; update the index of the selected back side tile image; start over (go to game state 1)
                if (this.tileSet.animation.inProgress) {
                    this.tileSet.animate();
                }
                else { // The animation is finished
                    this.tileSet.stopAnimation();

                    // Remove the current tile set from the scene
                    this.scene.remove(this.tileSet);

                    // Update the index of the selected back side tile image
                    this.selectedIndex = (this.selectedIndex + 1) % this.nImages;

                    // Update the game state
                    this.gameState = 1;
                }
                break;
        }

        // Update the directional light position
        this.directionalLight.position.copy(this.camera.activeProjection.position).add(this.camera.activeProjection.localToWorld(this.directionalLight.offset.clone()));

        // Update statistics
        this.statistics.update();

        if (this.selectedIndex == 0) { // Earth image / animation selected
            // Update the Earth model, render the corresponding scene to a render target and copy the resulting image to a texture
            this.earthModel.update();
            this.renderer.setRenderTarget(this.earthModel.renderTarget);
            this.renderer.render(this.earthModel.scene, this.earthModel.camera.object);
            this.renderer.copyFramebufferToTexture(new THREE.Vector2(0.0, 0.0), this.earthModel.framebufferTexture);
            this.renderer.setRenderTarget(null);
        }

        // Render the main scene
        this.renderer.render(this.scene, this.camera.activeProjection); // Render the scene
        if (this.tipActive()) {
            this.renderer.render(this.tip, this.camera.activeProjection); // Render the tip
        }
    }
}