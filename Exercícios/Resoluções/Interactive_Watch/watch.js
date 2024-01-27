// Interactive Watch - JPP 2021, 2022, 2023
// 2D modeling
// Basic animation
// Transformations
// User interaction

import * as THREE from "three";

export default class Watch extends THREE.Group {
    constructor(cityName = "Oporto", center = new THREE.Vector2(0.0, 0.0), radius = 0.75, nameBackgroundColor = 0xffffff, nameForegroundColor = 0x000000, dialColor = 0x000000, markersColor = 0xffffff, handsHMColor = 0xffffff, handSColor = 0xff0000) {
        super();

        this.cities = [
            { name: "Oporto", timeZone: 0 },
            { name: "Paris", timeZone: 1 },
            { name: "Helsinki", timeZone: 2 },
            { name: "Beijing", timeZone: 7 },
            { name: "Tokyo", timeZone: 8 },
            { name: "Sydney", timeZone: 9 },
            { name: "Los Angeles", timeZone: -8 },
            { name: "New York", timeZone: -5 },
            { name: "Rio de Janeiro", timeZone: -4 },
            { name: "Reykjavik", timeZone: -1 }
        ];

        this.cityIndex = 0;
        const numberOfCities = this.cities.length;
        while (this.cityIndex < numberOfCities && cityName != this.cities[this.cityIndex].name) {
            this.cityIndex++;
        }
        if (this.cityIndex == numberOfCities) {
            this.cityIndex = 0;
        }

        // Create the watch (a dial, sixty markers, an hour hand, a minute hand and a second hand)

        // Create the dial (a circle)
        let geometry = new THREE.CircleGeometry(radius, 60);
        let material = new THREE.MeshBasicMaterial({ color: dialColor });
        this.dial = new THREE.Mesh(geometry, material);
        this.add(this.dial);

        // Create the sixty markers (sixty line segments)
        let radius0 = 0.85 * radius;
        let curve = new THREE.EllipseCurve(0.0, 0.0, radius0, radius0, 0.0, 2.0 * Math.PI, false, 0.0);
        const points0 = curve.getPoints(12);
        radius0 = 0.90 * radius;
        curve = new THREE.EllipseCurve(0.0, 0.0, radius0, radius0, 0.0, 2.0 * Math.PI, false, 0.0);
        const points1 = curve.getPoints(60);
        radius0 = 0.95 * radius;
        curve = new THREE.EllipseCurve(0.0, 0.0, radius0, radius0, 0.0, 2.0 * Math.PI, false, 0.0);
        const points2 = curve.getPoints(60);
        const points3 = [];
        let i = 0;
        for (let j = 0; j < 60; j++) {
            if (j % 5 == 0) {
                points3.push(points0[i++]);
            }
            else {
                points3.push(points1[j]);
            }
            points3.push(points2[j]);
        }
        geometry = new THREE.BufferGeometry().setFromPoints(points3);
        material = new THREE.LineBasicMaterial({ color: markersColor });
        this.markers = new THREE.LineSegments(geometry, material);
        this.add(this.markers);

        // Create the hour hand (a two-triangle mesh) pointing at 0.0 radians (the positive X-semiaxis)
        let length = 0.5 * radius;
        let points = [
            -0.2 * length, 0.0, 0.0,
            0.0, -0.05 * length, 0.0,
            0.0, 0.05 * length, 0.0,
            1.0 * length, 0.0, 0.0
        ];
        let indices = [
            0, 1, 2,
            2, 1, 3
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(new Float32Array(points), 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setIndex(indices);
        material = new THREE.MeshBasicMaterial({ color: handsHMColor });
        this.handH = new THREE.Mesh(geometry, material);
        this.add(this.handH);

        // Create the minute hand (a two-triangle mesh) pointing at 0.0 radians (the positive X-semiaxis)
        length = 0.7 * radius;
        points = [
            -0.2 * length, 0.0, 0.0,
            0.0, -0.05 * length, 0.0,
            0.0, 0.05 * length, 0.0,
            1.0 * length, 0.0, 0.0
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(new Float32Array(points), 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setIndex(indices);
        this.handM = new THREE.Mesh(geometry, material);
        this.add(this.handM);

        // Create the second hand (two line segments, a circumference and a circle) pointing at 0.0 radians (the positive X-semiaxis)
        this.handS = new THREE.Group();

        // Create the two line segments
        length = 0.8 * radius;
        points = [
            new THREE.Vector2(-0.3 * length, 0.0), new THREE.Vector2(-0.2 * length, 0.0),
            new THREE.Vector2(-0.1 * length, 0.0), new THREE.Vector2(1.0 * length, 0.0)
        ];
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        material = new THREE.LineBasicMaterial({ color: handSColor });
        let handS = new THREE.LineSegments(geometry, material);
        this.handS.add(handS);

        // Create the circumference: three options to choose from
        let x0 = -0.15 * length, y0 = 0.0;
        radius0 = 0.05 * length;

        // First option: uses the parametric form of the circle equation plus classes THREE.BufferGeometry and THREE.LineLoop
        /*
        points = [];
        const angleIncrement = 2.0 * Math.PI / 16.0;
        let angle = 0.0;
        for (let i = 0; i < 16; i++) {
            points.push(new THREE.Vector2(radius0 * Math.cos(angle) + x0, radius0 * Math.sin(angle) + y0));
            angle += angleIncrement;
        }
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        handS = new THREE.LineLoop(geometry, material);
        */
        // End of first option

        // Second option: uses classes THREE.EllipseCurve, THREE.BufferGeometry and THREE.Line
        /*
        curve = new THREE.EllipseCurve(x0, y0, radius0, radius0, 0.0, 2.0 * Math.PI, false, 0.0);
        points = curve.getPoints(16);
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        handS = new THREE.Line(geometry, material);
        */
        // End of second option

        // Third option: uses classes THREE.CircleGeometry, THREE.EdgesGeometry and THREE.LineSegments
        geometry = new THREE.CircleGeometry(radius0, 16);
        const edges = new THREE.EdgesGeometry(geometry);
        handS = new THREE.LineSegments(edges, material);
        handS.position.set(x0, y0);
        // End of third option

        this.handS.add(handS);

        // Create the circle
        geometry = new THREE.CircleGeometry(0.03 * radius, 16);
        material = new THREE.MeshBasicMaterial({ color: handSColor });
        handS = new THREE.Mesh(geometry, material);
        this.handS.add(handS);

        this.add(this.handS);

        // Set the watch position
        this.position.set(center.x, center.y);

        // Create one HTML <div> element

        // Start by getting a "container" <div> element with the top-left corner at the center of the viewport (the origin of the coordinate system)
        const container = document.getElementById("container");

        // Then create a "label" <select> element and append it as a child of "container"
        this.label = document.createElement("select");
        this.label.style.position = "absolute";
        this.label.style.left = (50.0 * center.x - 30.0 * radius).toString() + "vmin";
        this.label.style.top = (-50.0 * center.y + 54.0 * radius).toString() + "vmin";
        this.label.style.width = (60.0 * radius).toString() + "vmin";
        this.label.style.fontSize = (6.0 * radius).toString() + "vmin";
        this.label.style.backgroundColor = "#" + new THREE.Color(nameBackgroundColor).getHexString();
        this.label.style.color = "#" + new THREE.Color(nameForegroundColor).getHexString();
        this.cities.forEach(element => {
            const option = document.createElement("option");
            option.text = element.name;
            this.label.appendChild(option);
        });
        this.label.options.selectedIndex = this.cityIndex;
        this.label.addEventListener("change", event => this.change(event));
        container.appendChild(this.label);
    }

    change(event) {
        this.cityIndex = event.target.selectedIndex;
    }

    update() {
        const time = Date().split(" ")[4].split(":").map(Number); // Hours: time[0]; minutes: time[1]; seconds: time[2]
        time[0] = (time[0] + this.cities[this.cityIndex].timeZone) % 12;
        // Compute the hour hand angle
        let angle = Math.PI / 2.0 - 2.0 * Math.PI * (time[0] / 12.0 + time[1] / (12.0 * 60.0) + time[2] / (12.0 * 60.0 * 60.0));
        this.handH.rotation.z = angle;

        // Compute the minute hand angle
        angle = Math.PI / 2.0 - 2.0 * Math.PI * (time[1] / 60.0 + time[2] / (60.0 * 60.0));
        this.handM.rotation.z = angle;

        // Compute the second hand angle
        angle = Math.PI / 2.0 - 2.0 * Math.PI * time[2] / 60.0;
        this.handS.rotation.z = angle;
    }
}