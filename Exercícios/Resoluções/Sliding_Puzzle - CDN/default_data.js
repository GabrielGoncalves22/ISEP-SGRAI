import * as THREE from "three";
import Orientation from "./orientation.js";

export const generalData = {
    setDevicePixelRatio: false
}

export const gameData = {
    background: {
        enabled: false, // Default texture background: false; selected back side tile image background: true
        default: {
            textures: {
                wrapS: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
                wrapT: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
                offset: new THREE.Vector2(0.0, 0.0),
                repeat: new THREE.Vector2(1.0, 1.0),
                magFilter: THREE.LinearFilter, // THREE.NearestFilter or THREE.LinearFilter
                minFilter: THREE.LinearMipmapLinearFilter // THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter or THREE.LinearMipmapLinearFilter
            },
            bitmaps: {
                mapUrl: "./textures/tiles_0118_2k_00kEGb/tiles_0118_color_2k.jpg",
                credits: "Default background texture downloaded from <a href='https://www.texturecan.com/' target='_blank' rel='noopener'>TextureCan</a>."
            }
        }
    },
    animation: {
        enabled: true // Animate tile addition / removal and Earth model rotation
    },
    tips: {
        enabled: true, // Hide tips: false; Show tips: true (only on back side)
        size: new THREE.Vector2(0.75, 0.75), // fraction of tile size
        timeout: 1000 // Tip visibility in milliseconds
    },
    keyCodes: { audio: "KeyA", background: "KeyB", separator: "KeyP", animation: "KeyN", tips: "KeyT", statistics: "KeyS", userInterface: "KeyU", help: "KeyH", shuffle: "Enter", left: "ArrowLeft", right: "ArrowRight", down: "ArrowDown", up: "ArrowUp" }
}

export const audioData = {
    enabled: false,
    volume: 1.0,
    clips: [],
    credits: ""
}

export const frameData = {
    size: new THREE.Vector3(4.0, 4.0, 0.125),
    segments: new THREE.Vector3(1, 1, 1),
    materials: {
        color: new THREE.Color(0xffffff),
        transparent: false,
        opacity: 1.0,
        aoMapIntensity: 1.0,
        displacementScale: 1.0,
        displacementBias: 0.0,
        normalMapType: THREE.TangentSpaceNormalMap, // THREE.TangentSpaceNormalMap or THREE.ObjectSpaceNormalMap,
        normalScale: new THREE.Vector2(2.0, 2.0),
        bumpScale: 1.0,
        roughness: 1.0
    },
    textures: {
        wrapS: THREE.RepeatWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
        wrapT: THREE.RepeatWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
        offset: new THREE.Vector2(0.0, 0.0),
        repeat: new THREE.Vector2(1.0, 1.0),
        magFilter: THREE.LinearFilter, // THREE.NearestFilter or THREE.LinearFilter
        minFilter: THREE.LinearMipmapLinearFilter // THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter or THREE.LinearMipmapLinearFilter
    },
    bitmaps: {
        mapUrl: "./textures/wood_0019_2k_Qmj43Z/wood_0019_color_2k.jpg",
        alphaMapUrl: "",
        aoMapUrl: "./textures/wood_0019_2k_Qmj43Z/wood_0019_ao_2k.jpg",
        displacementMapUrl: "",
        normalMapUrl: "./textures/wood_0019_2k_Qmj43Z/wood_0019_normal_opengl_2k.png",
        bumpMapUrl: "",
        roughnessMapUrl: "./textures/wood_0019_2k_Qmj43Z/wood_0019_roughness_2k.jpg",
        credits: "Frame textures downloaded from <a href='https://www.texturecan.com/' target='_blank' rel='noopener'>TextureCan</a>."
    },
    separator: { enabled: true }
}

export const tileSetData = {
    size: 4, // 4 x 4 puzzle
    sizeMin: 2,
    sizeMax: 10,
    sizeStep: 1,
    shuffleIterations: 10,
    animation: { // Tile addition / removal
        duration: 1.0 // Total duration in seconds
    }
}

export const tileData = {
    initialSize: new THREE.Vector3(3.5, 3.5, 0.25),
    segments: 1,
    radius: 0.0625,
    frontSide: { // Front side of the tiles
        materials: {
            color: new THREE.Color(0xffffff),
            transparent: false,
            opacity: 1.0,
            aoMapIntensity: 1.0,
            displacementScale: 1.0,
            displacementBias: 0.0,
            normalMapType: THREE.TangentSpaceNormalMap, // THREE.TangentSpaceNormalMap or THREE.ObjectSpaceNormalMap,
            normalScale: new THREE.Vector2(2.0, -2.0),
            bumpScale: 1.0,
            roughness: 1.0
        },
        textures: {
            wrapS: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
            wrapT: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
            offset: new THREE.Vector2(0.0, 0.0),
            repeat: new THREE.Vector2(1.0, 1.0),
            magFilter: THREE.LinearFilter, // THREE.NearestFilter or THREE.LinearFilter
            minFilter: THREE.LinearMipmapLinearFilter // THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter or THREE.LinearMipmapLinearFilter
        },
        bitmaps: {
            mapUrl: "./textures/marble_0008_2k_pDE6pB/numbers_marble_0008_color_2k.jpg",
            alphaMapUrl: "",
            aoMapUrl: "./textures/marble_0008_2k_pDE6pB/numbers_marble_0008_ao_2k.jpg",
            displacementMapUrl: "",
            normalMapUrl: "./textures/marble_0008_2k_pDE6pB/numbers_marble_0008_normal_opengl_2k.png",
            bumpMapUrl: "",
            roughnessMapUrl: "./textures/marble_0008_2k_pDE6pB/numbers_marble_0008_roughness_2k.jpg",
            credits: "(0) Tile textures (front side) adapted from <a href='https://www.texturecan.com/' target='_blank' rel='noopener'>TextureCan</a>."
        }
    },
    backSide: { // Back side of the tiles
        materials: {
            color: new THREE.Color(0xffffff),
            transparent: false,
            opacity: 1.0,
            aoMapIntensity: 1.0,
            displacementScale: 1.0,
            displacementBias: 0.0,
            normalMapType: THREE.TangentSpaceNormalMap, // THREE.TangentSpaceNormalMap or THREE.ObjectSpaceNormalMap,
            normalScale: new THREE.Vector2(2.0, -2.0),
            bumpScale: 1.0,
            roughness: 1.0
        },
        textures: {
            wrapS: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
            wrapT: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
            offset: new THREE.Vector2(0.0, 0.0),
            repeat: new THREE.Vector2(1.0, 1.0),
            magFilter: THREE.LinearFilter, // THREE.NearestFilter or THREE.LinearFilter
            minFilter: THREE.LinearMipmapLinearFilter // THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter or THREE.LinearMipmapLinearFilter
        },
        bitmaps: {
            mapUrl: "",
            alphaMapUrl: "",
            aoMapUrl: "./textures/marble_0008_2k_pDE6pB/marble_0008_ao_2k.jpg",
            displacementMapUrl: "",
            normalMapUrl: "./textures/marble_0008_2k_pDE6pB/marble_0008_normal_opengl_2k.png",
            bumpMapUrl: "",
            roughnessMapUrl: "./textures/marble_0008_2k_pDE6pB/marble_0008_roughness_2k.jpg",
            credits: "(1) Tile textures (back side) downloaded from <a href='https://www.texturecan.com/' target='_blank' rel='noopener'>TextureCan</a>."
        }
    },
    remainingSides: { // Remaining sides of the tiles
        materials: {
            color: new THREE.Color(0xe0e0e0),
            transparent: false,
            opacity: 1.0,
            aoMapIntensity: 1.0,
            displacementScale: 1.0,
            displacementBias: 0.0,
            normalMapType: THREE.TangentSpaceNormalMap, // THREE.TangentSpaceNormalMap or THREE.ObjectSpaceNormalMap,
            normalScale: new THREE.Vector2(1.0, 1.0),
            bumpScale: 1.0,
            roughness: 0.0
        },
        textures: {
            wrapS: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
            wrapT: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
            offset: new THREE.Vector2(0.0, 0.0),
            repeat: new THREE.Vector2(1.0, 1.0),
            magFilter: THREE.LinearFilter, // THREE.NearestFilter or THREE.LinearFilter
            minFilter: THREE.LinearMipmapLinearFilter // THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter or THREE.LinearMipmapLinearFilter
        },
        bitmaps: {
            mapUrl: "",
            alphaMapUrl: "",
            aoMapUrl: "",
            displacementMapUrl: "",
            normalMapUrl: "",
            bumpMapUrl: "",
            roughnessMapUrl: "",
            credits: ""
        }
    }
}

export const earthModelData = {
    size: new THREE.Vector2(512, 512),
    background: {
        textures: {
            wrapS: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
            wrapT: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
            offset: new THREE.Vector2(0.0, 0.0),
            repeat: new THREE.Vector2(1.0, 1.0),
            magFilter: THREE.LinearFilter, // THREE.NearestFilter or THREE.LinearFilter
            minFilter: THREE.LinearMipmapLinearFilter // THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter or THREE.LinearMipmapLinearFilter
        },
        bitmaps: {
            mapUrl: "./textures/marble_0008_2k_pDE6pB/marble_0008_color_2k.jpg",
            credits: ""
        }
    },
    surface: {
        radius: 1.0,
        materials: {
            color: new THREE.Color(0xffffff),
            transparent: false,
            opacity: 1.0,
            aoMapIntensity: 1.0,
            displacementScale: 1.0,
            displacementBias: 0.0,
            normalMapType: THREE.TangentSpaceNormalMap, // THREE.TangentSpaceNormalMap or THREE.ObjectSpaceNormalMap,
            normalScale: new THREE.Vector2(1.0, 1.0),
            bumpScale: 45.0,
            roughness: 1.0
        },
        textures: {
        },
        bitmaps: {
            mapUrl: "./textures/earth/2k_earth_daymap.jpg",
            alphaMapUrl: "",
            aoMapUrl: "",
            displacementMapUrl: "",
            normalMapUrl: "",
            bumpMapUrl: "./textures/earth/8081_earthbump2k.jpg",
            roughnessMapUrl: "./textures/earth/8081_earthrough2k.jpg",
            credits: ""
        },
        animation: { // Surface rotation
            speed: 4.0 // Angular speed in degrees/second
        }
    },
    clouds: {
        radius: 1.005,
        materials: {
            color: new THREE.Color(0xffffff),
            transparent: true,
            opacity: 0.8,
            aoMapIntensity: 1.0,
            displacementScale: 1.0,
            displacementBias: 0.0,
            normalMapType: THREE.TangentSpaceNormalMap, // THREE.TangentSpaceNormalMap or THREE.ObjectSpaceNormalMap,
            normalScale: new THREE.Vector2(1.0, 1.0),
            bumpScale: 1.0,
            roughness: 1.0
        },
        textures: {
        },
        bitmaps: {
            mapUrl: "",
            alphaMapUrl: "./textures/earth/2k_earth_clouds.jpg",
            aoMapUrl: "",
            displacementMapUrl: "",
            normalMapUrl: "",
            bumpMapUrl: "",
            roughnessMapUrl: "",
            credits: ""
        },
        animation: { // Clouds rotation
            speed: 6.0 // Angular speed in degrees/second
        }
    },
    ambientLight: {
        color: new THREE.Color(0xffffff),
        intensity: 1.0
    },
    directionalLight: {
        color: new THREE.Color(0xffffff),
        intensity: 1.0,
        offset: new THREE.Vector3(0.0, 0.0, 0.0), // Displacement in relation to the camera position
        castShadow: false,
        shadow: {
            mapSize: new THREE.Vector2(512, 512), // Shadow map size
            camera: { // The light's view of the world
                left: -5.0,
                right: 5.0,
                top: 5.0,
                bottom: -5.0,
                near: 0.5,
                far: 500.0
            }
        }
    },
    camera: {
        initialDistance: 3.0, // Distance to the target and associated limits
        distanceMin: 2.0,
        distanceMax: 10.0,
        damping: { // Inertia
            enabled: false,
            factor: 0.05
        },
        fov: 45.0, // Field-of-view (expressed in degrees)
        near: 0.5, // Front clipping plane
        far: 11.5, // Back clipping plane
    },
    credits: "Earth model adapted from <a href='https://geethujp.github.io/earthModel/' target='_blank' rel='noopener'>Earth Model</a>."
}

export const imageData = [{
    textures: {
        wrapS: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
        wrapT: THREE.ClampToEdgeWrapping, // THREE.ClampToEdgeWrapping, THREE.RepeatWrapping or THREE.MirroredRepeatWrapping
        offset: new THREE.Vector2(0.0, 0.0),
        repeat: new THREE.Vector2(1.0, 1.0),
        magFilter: THREE.LinearFilter, // THREE.NearestFilter or THREE.LinearFilter
        minFilter: THREE.LinearMipmapLinearFilter // THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter or THREE.LinearMipmapLinearFilter
    },
    bitmaps: {
        mapUrl: "",
        credits: "Earth model textures downloaded from <a href='https://planetpixelemporium.com/' target='_blank' rel='noopener'>Planet Texture Map Collection</a>."
    }
}]

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
        mapSize: new THREE.Vector2(512, 512), // Shadow map size
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