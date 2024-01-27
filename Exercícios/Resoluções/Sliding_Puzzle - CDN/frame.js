import * as THREE from "three";
import { merge } from "./merge.js";
import MultiTexturedMaterial from "./material.js";

/*
 * parameters = {
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
 * textures = {
 *  map: Texture,
 *  alphaMap: Texture,
 *  aoMap: Texture,
 *  displacementMap: Texture,
 *  normalMap: Texture,
 *  bumpMap: Texture,
 *  roughnessMap: Texture
 * }
 */

export default class Frame extends THREE.Group {
    constructor(parameters, textures) {
        super();
        merge(this, parameters);

        // Create the frame edge (a single-sided extruded shape with a hole). It receives shadows but does not cast them

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

        // Create the single-sided edge material
        let material = new MultiTexturedMaterial(this.materials, textures);

        // Create the mesh
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0.0, 0.0, -0.5);
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        this.add(mesh);

        // Create the frame separator (a double-sided shape). It receives shadows but does not cast them

        // Create the shape
        geometry = new THREE.ShapeGeometry(path);
        uv = geometry.getAttribute("uv");
        uv1 = uv.clone();
        geometry.setAttribute("uv1", uv1); // The aoMap requires a second set of UVs: https://threejs.org/docs/index.html?q=meshstand#api/en/materials/MeshStandardMaterial.aoMap

        // Create the double-sided separator material. It's identical to the edge material, with the exception of property .side (THREE.DoubleSide instead of default THREE.FrontSide)
        material = new MultiTexturedMaterial(this.materials, textures);
        material.side = THREE.DoubleSide;

        // Create the mesh
        this.separator.mesh = new THREE.Mesh(geometry, material);
        this.separator.mesh.castShadow = false;
        this.separator.mesh.receiveShadow = true;
        this.separator.mesh.visible = this.separator.enabled;
        this.add(this.separator.mesh);

        // Set the frame size
        this.scale.set(this.size.x, this.size.y, this.size.z);
    }
}