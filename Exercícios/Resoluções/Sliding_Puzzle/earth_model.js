import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import MultiTexturedMaterial from "./material.js";
import { AmbientLight, DirectionalLight } from "./lights.js";

/*
 * parameters = {
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
 *   radius: Float,
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
 *   radius: Float,
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
 * textures = {
 *  background: {
 *   map: Texture
 *  },
 *  surface: {
 *   map: Texture,
 *   alphaMap: Texture,
 *   aoMap: Texture,
 *   displacementMap: Texture,
 *   normalMap: Texture,
 *   bumpMap: Texture,
 *   roughnessMap: Texture
 *  },
 *  clouds: {
 *   map: Texture,
 *   alphaMap: Texture,
 *   aoMap: Texture,
 *   displacementMap: Texture,
 *   normalMap: Texture,
 *   bumpMap: Texture,
 *   roughnessMap: Texture
 *  }
 * }
 */

export default class EarthModel {
    constructor(parameters, textures, domElement) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Convert angular speeds from degrees/second to radians/second
        this.surface.animation.speed = THREE.MathUtils.degToRad(this.surface.animation.speed);
        this.clouds.animation.speed = THREE.MathUtils.degToRad(this.clouds.animation.speed);

        // Create a 3D scene
        this.scene = new THREE.Scene();
        this.scene.background = textures.background.map;

        // Create the lights and add them to the scene
        this.light = new AmbientLight(this.ambientLight);
        this.scene.add(this.light);
        this.light = new DirectionalLight(this.directionalLight);
        this.scene.add(this.light);

        // Create the camera
        this.camera.object = new THREE.PerspectiveCamera(this.camera.fov, this.size.width / this.size.height, this.camera.near, this.camera.far);

        // Set the camera position;
        this.camera.object.position.z = this.camera.initialDistance;

        // Create a render target
        this.renderTarget = new THREE.WebGLRenderTarget(this.size.width, this.size.height);
        this.renderTarget.texture.colorSpace = THREE.SRGBColorSpace;

        // Create a framebuffer texture
        this.framebufferTexture = new THREE.FramebufferTexture(this.size.width, this.size.height);
        this.framebufferTexture.colorSpace = THREE.SRGBColorSpace;

        // Create the Earth model

        // Create the surface (a single-sided sphere)
        let geometry = new THREE.SphereGeometry(this.surface.radius, 96, 96);
        let uv = geometry.getAttribute("uv");
        let uv1 = uv.clone();
        geometry.setAttribute("uv1", uv1); // The aoMap requires a second set of UVs: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.aoMap

        // Create the single-sided surface material
        let material = new MultiTexturedMaterial(this.surface.materials, textures.surface);

        // Create the mesh and add it to the scene
        this.surfaceMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.surfaceMesh);

        // Create the clouds (a double-sided sphere)
        geometry = new THREE.SphereGeometry(this.clouds.radius, 96, 96);
        uv = geometry.getAttribute("uv");
        uv1 = uv.clone();
        geometry.setAttribute("uv1", uv1); // The aoMap requires a second set of UVs: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.aoMap

        // Create the double-sided clouds material
        material = new MultiTexturedMaterial(this.clouds.materials, textures.clouds);

        // Create the mesh and add it to the scene
        this.cloudsMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.cloudsMesh);

        // Create and configure orbit controls
        this.orbitControls = new OrbitControls(this.camera.object, domElement);
        this.orbitControls.enabled = true;
        this.orbitControls.enablePan = false;
        this.orbitControls.enableRotate = false; // Since we want orbit controls to be activated in conjunction with the Ctrl modifier key, rotation will be assigned to the secondary mouse button, rather than the default primary button. Check this issue: https://stackoverflow.com/questions/72571034/change-behavior-of-control-and-shift-keys-in-orbitcontrols
        this.orbitControls.enableZoom = false;
        this.orbitControls.enableDamping = this.camera.damping.enabled;
        this.orbitControls.dampingFactor = this.camera.damping.factor;
        this.orbitControls.minDistance = this.camera.distanceMin;
        this.orbitControls.maxDistance = this.camera.distanceMax;

        // Create a clock
        this.clock = new THREE.Clock();
    }

    update() {
        // Update orbit controls
        this.orbitControls.update();

        // Update the directional light position
        this.light.position.copy(this.camera.object.position).add(this.camera.object.localToWorld(this.directionalLight.offset.clone()));

        // Update the model
        const deltaT = this.clock.getDelta();
        let angle = this.surface.animation.speed * deltaT;
        this.surfaceMesh.rotation.y += angle;
        angle = this.clouds.animation.speed * deltaT;
        this.cloudsMesh.rotation.y += angle;
    }
}