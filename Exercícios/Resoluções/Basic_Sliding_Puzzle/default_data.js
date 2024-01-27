import * as THREE from "three";
import Orientation from "./orientation.js";

export const generalData = {
    setDevicePixelRatio: false
}

export const audioData = {
    enabled: false,
    volume: 1.0,
    clips: [],
    credits: ""
}

export const boardData = {
    background: {
        enabled: false, // Default background: false; active image background: true
        url: "./textures/marble_0008_2k_pDE6pB/marble_0008_color_2k.jpg",
        wrapS: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
        wrapT: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
        repeat: new THREE.Vector2(1.0, 1.0),
        magFilter: THREE.LinearFilter, // THREE.NearestFilter or THREE.LinearFilter
        minFilter: THREE.LinearMipmapLinearFilter // THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter or THREE.LinearMipmapLinearFilter
    },
    grid: {
        initialSize: 4, // 4 x 4 puzzle
        sizeMin: 2,
        sizeMax: 10,
        sizeStep: 1
    },
    images: {
        bitmaps: [
            { // First image corresponds to the numbers side of the board
                url: "./images/numbers_marble_0008_color_2k.jpg",
                credits: ""
            },
            { // Subsequent images correspond to the picture side of the board
                url: "./images/atacama-desert-photography-2048x2048_788746-mm-90.jpg",
                credits: "(1) Image downloaded from <a href='https://uhdwallpapers.org/' target='_blank' rel='noopener'>HD Wallpapers</a>."
            }
        ],
        wrapS: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
        wrapT: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
        magFilter: THREE.LinearFilter, // THREE.NearestFilter or THREE.LinearFilter
        minFilter: THREE.LinearMipmapLinearFilter // THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter or THREE.LinearMipmapLinearFilter
    },
    shuffleIterations: 10,
    keyCodes: { audio: "KeyA", background: "KeyB", separator: "KeyP", statistics: "KeyS", userInterface: "KeyU", help: "KeyH", shuffle: "Enter", left: "ArrowLeft", right: "ArrowRight", down: "ArrowDown", up: "ArrowUp" }
}

export const frameData = {
    size: new THREE.Vector3(4.0, 4.0, 0.125),
    segments: new THREE.Vector3(1, 1, 1),
    materialParameters: {
        color: new THREE.Color(0xffffff),
        mapUrl: "./textures/wood_0019_2k_Qmj43Z/wood_0019_color_2k.jpg",
        aoMapUrl: "./textures/wood_0019_2k_Qmj43Z/wood_0019_ao_2k.jpg",
        aoMapIntensity: 1.0,
        displacementMapUrl: "",
        displacementScale: 1.0,
        displacementBias: 0.0,
        normalMapUrl: "./textures/wood_0019_2k_Qmj43Z/wood_0019_normal_opengl_2k.png",
        normalMapType: THREE.TangentSpaceNormalMap, // THREE.TangentSpaceNormalMap or THREE.ObjectSpaceNormalMap,
        normalScale: { x: 2.0, y: -2.0 },
        bumpMapUrl: "",
        bumpScale: 1.0,
        roughnessMapUrl: "./textures/wood_0019_2k_Qmj43Z/wood_0019_roughness_2k.jpg",
        roughness: 1.0,
        wrapS: THREE.RepeatWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
        wrapT: THREE.RepeatWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
        repeat: new THREE.Vector2(1.0, 1.0),
        magFilter: THREE.LinearFilter, // THREE.NearestFilter or THREE.LinearFilter
        minFilter: THREE.LinearMipmapLinearFilter // THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter or THREE.LinearMipmapLinearFilter
    },
    credits: "Textures downloaded from <a href='https://www.texturecan.com/' target='_blank' rel='noopener'>TextureCan</a>.",
    separator: { enabled: false }
}

export const tileData = {
    initialSize: new THREE.Vector3(3.5, 3.5, 0.25),
    segments: 1,
    radius: 0.0625,
    primaryColor: new THREE.Color(0xffffff),
    secondaryColor: new THREE.Color(0xffffff),
    tertiaryColor: new THREE.Color(0xa0a0a0),
    roughness: 0.0
}

export const ambientLightData = {
    color: new THREE.Color(0xffffff),
    intensity: 1.0
}

export const directionalLightData = {
    color: new THREE.Color(0xffffff),
    intensity: 1.0,
    offset: new THREE.Vector3(0.0, 0.0, 0.0), // Displacement in relation to the camera position
    castShadow: false,
    shadow: {
        mapSize: new THREE.Vector2(512, 512),  // Shadow map size
        camera: { // The light's view of the world
            left: -5.0,
            right: 5.0,
            top: 5.0,
            bottom: -5.0,
            near: 0.5,
            far: 500.0
        }
    }
}

export const cameraData = {
    initialProjection: "perspective", // Perspective projection: "perspective"; orthographic projection: "orthographic"
    initialTarget: new THREE.Vector3(0.0, 0.0, 0.0), // Target position
    initialOrientation: new Orientation(180.0, 0.0), // Horizontal and vertical orientation and associated limits (expressed in degrees)
    orientationMin: new Orientation(0.0, -90.0),
    orientationMax: new Orientation(360.0, 90.0),
    orientationStep: new Orientation(1.0, 1.0),
    initialDistance: 8.0, // Distance to the target and associated limits
    distanceMin: 4.0,
    distanceMax: 16.0,
    distanceStep: 0.1,
    initialZoom: 1.0, // Zoom factor and associated limits
    zoomMin: 0.5,
    zoomMax: 2.0,
    zoomStep: 0.1,
    initialFov: 45.0, // Field-of-view (expressed in degrees)
    near: 0.01, // Front clipping plane
    far: 100.0, // Back clipping plane
}