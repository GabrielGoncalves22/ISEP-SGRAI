import * as THREE from "three";
import { merge } from "./merge.js";
import MultiTexturedMaterial from "./material.js";

/*
 * parameters = {
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
 */

export default class Frame extends THREE.Group {
    constructor(parameters) {
        super();
        merge(this, parameters);

        // Create a material
        let material = new MultiTexturedMaterial(this.materialParameters);

        // Create a frame (an extruded shape with a hole and an optional double-sided face) that receives shadows but does not cast them

        // Create the extruded shape outline
        const shape = new THREE.Shape();
        shape.moveTo(-0.4375, -0.5);
        shape.lineTo(0.4375, -0.5);
        shape.arc(0.0, 0.0625, 0.0625, -Math.PI / 2.0, 0.0, false);
        shape.lineTo(0.5, 0.4375);
        shape.arc(-0.0625, 0.0, 0.0625, 0.0, Math.PI / 2.0, false);
        shape.lineTo(-0.4375, 0.5);
        shape.arc(0.0, -0.0625, 0.0625, Math.PI / 2.0, Math.PI, false);
        shape.lineTo(-0.5, -0.4375);
        shape.arc(0.0625, 0.0, 0.0625, Math.PI, -Math.PI / 2.0, false);

        // Create the extruded shape hole
        const path = new THREE.Shape();
        path.moveTo(-0.3828125, -0.4375);
        path.lineTo(0.3828125, -0.4375);
        path.arc(0.0, 0.0546875, 0.0546875, -Math.PI / 2.0, 0.0, false);
        path.lineTo(0.4375, 0.3828125);
        path.arc(-0.0546875, 0.0, 0.0546875, 0.0, Math.PI / 2.0, false);
        path.lineTo(-0.3828125, 0.4375);
        path.arc(0.0, -0.0546875, 0.0546875, Math.PI / 2.0, Math.PI, false);
        path.lineTo(-0.4375, -0.3828125);
        path.arc(0.0546875, 0.0, 0.0546875, Math.PI, -Math.PI / 2.0, false);

        // Add the hole to the shape
        shape.holes = [path];

        // Extrude the shape
        let geometry = new THREE.ExtrudeGeometry(shape, { steps: 1, depth: 1.0, bevelEnabled: false });
        let uv = geometry.getAttribute("uv");
        let uv1 = uv.clone();
        geometry.setAttribute("uv1", uv1); // The aoMap requires a second set of UVs: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.aoMap
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0.0, 0.0, -0.5);
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        this.add(mesh);

        // Create a double-sided material
        material = new MultiTexturedMaterial(this.materialParameters);
        material.side = THREE.DoubleSide;

        // Create the optional double-sided face (a shape)
        geometry = new THREE.ShapeGeometry(path);
        uv = geometry.getAttribute("uv");
        uv1 = uv.clone();
        geometry.setAttribute("uv1", uv1); // The aoMap requires a second set of UVs: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.aoMap
        this.separator.mesh = new THREE.Mesh(geometry, material);
        this.separator.mesh.castShadow = false;
        this.separator.mesh.receiveShadow = true;
        this.separator.mesh.visible = this.separator.enabled;
        this.add(this.separator.mesh);

        // Set the frame size
        this.scale.set(this.size.x, this.size.y, this.size.z);
    }
}