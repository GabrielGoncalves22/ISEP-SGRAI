import * as THREE from "three";
import Orientation from "./orientation.js";

/*
 * parameters = {
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

export default class Camera {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Compute half of the size of the target plane as a function of the camera's distance to the target and the field-of-view
        this.initialHalfSize = Math.tan(THREE.MathUtils.degToRad(this.initialFov / 2.0)) * this.initialDistance;

        // Create two cameras (perspective and orthographic projection)
        this.perspective = new THREE.PerspectiveCamera();
        this.orthographic = new THREE.OrthographicCamera();

        this.initialize();
    }

    /*
     *        Y
     *        |
     *        O -- X
     *       /
     *      Z
     */

    setViewingParameters() { // Set the camera's position, orientation and target (positive Y-semiaxis up)
        const orientation = new Orientation(this.orientation.h, this.orientation.v);
        const cosH = Math.cos(THREE.MathUtils.degToRad(orientation.h));
        const sinH = Math.sin(THREE.MathUtils.degToRad(orientation.h));
        const cosV = Math.cos(THREE.MathUtils.degToRad(orientation.v));
        const sinV = Math.sin(THREE.MathUtils.degToRad(orientation.v));
        // Position
        let positionX = this.target.x - this.distance * sinH * cosV;
        let positionY = this.target.y - this.distance * sinV;
        let positionZ = this.target.z - this.distance * cosH * cosV;
        this.perspective.position.set(positionX, positionY, positionZ);
        this.orthographic.position.set(positionX, positionY, positionZ);
        // Up vector
        const upX = -sinH * sinV;
        const upY = cosV;
        const upZ = -cosH * sinV;
        this.perspective.up.set(upX, upY, upZ);
        this.orthographic.up.set(upX, upY, upZ);
        // Target
        this.perspective.lookAt(this.target);
        this.orthographic.lookAt(this.target);
    }

    setProjectionParameters() {
        // Compute the current aspect ratio
        this.aspectRatio = window.innerWidth / window.innerHeight;
        // Adjust the camera's field-of-view if needed; Set the left, right, top and bottom clipping planes
        let fov, left, right, top, bottom;
        if (this.aspectRatio < 1.0) {
            fov = 2.0 * THREE.MathUtils.radToDeg(Math.atan(Math.tan(THREE.MathUtils.degToRad(this.initialFov / 2.0)) / this.aspectRatio));
            right = this.initialHalfSize;
            left = -right;
            top = right / this.aspectRatio;
            bottom = -top;
        }
        else {
            fov = this.initialFov;
            top = this.initialHalfSize;
            bottom = -top;
            right = top * this.aspectRatio;
            left = -right;
        }

        // Perspective projection camera: the zoom effect is achieved by changing the value of the field-of-view; the PerspectiveCamera.zoom property does just that
        this.perspective.fov = fov;
        this.perspective.aspect = this.aspectRatio;
        this.perspective.near = this.near;
        this.perspective.far = this.far;
        this.perspective.zoom = this.zoom;
        this.perspective.updateProjectionMatrix();

        // Orthographic projection camera: the zoom effect is achieved by changing the values of the left, right, top and bottom clipping planes; the OrthographicCamera.zoom property does just that
        this.orthographic.left = left;
        this.orthographic.right = right;
        this.orthographic.top = top;
        this.orthographic.bottom = bottom;
        this.orthographic.near = this.near;
        this.orthographic.far = this.far;
        this.orthographic.zoom = this.zoom;
        this.orthographic.updateProjectionMatrix();
    }

    setActiveProjection(projection) {
        this.projection = projection;
        if (this.projection != "orthographic") {
            this.activeProjection = this.perspective;
        }
        else {
            this.activeProjection = this.orthographic;
        }
    }

    initialize() {
        this.target = this.initialTarget.clone();
        this.orientation = this.initialOrientation.clone();
        this.distance = this.initialDistance;
        this.zoom = this.initialZoom;

        // Set the projection parameters (perspective: field-of-view, aspect ratio, near and far clipping planes; orthographic: left, right, top, bottom, near and far clipping planes)
        this.setProjectionParameters();

        // Set the viewing parameters (position, orientation and target)
        this.setViewingParameters();

        // Set the initial camera projection
        this.setActiveProjection(this.initialProjection);
    }

    setTarget(target) {
        this.target.copy(target);
        this.setViewingParameters();
    }

    updateTarget(targetIncrement) {
        this.setTarget(this.target.add(targetIncrement));
    }

    setOrientation(orientation) {
        this.orientation.copy(orientation).clamp(this.orientationMin, this.orientationMax);
        this.setViewingParameters();
    }

    updateOrientation(orientationIncrement) {
        this.setOrientation(this.orientation.add(orientationIncrement));
    }

    setDistance(distance) {
        this.distance = THREE.MathUtils.clamp(distance, this.distanceMin, this.distanceMax);
        this.setViewingParameters();
    }

    updateDistance(distanceIncrement) {
        this.setDistance(this.distance + distanceIncrement);
    }

    setZoom(zoom) {
        this.zoom = THREE.MathUtils.clamp(zoom, this.zoomMin, this.zoomMax);
        this.perspective.zoom = this.zoom;
        this.perspective.updateProjectionMatrix();
        this.orthographic.zoom = this.zoom;
        this.orthographic.updateProjectionMatrix();
    }

    updateZoom(zoomIncrement) {
        this.setZoom(this.zoom + zoomIncrement);
    }
}