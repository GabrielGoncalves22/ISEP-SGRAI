// Basic Watch - JPP 2021, 2022, 2023
// 2D modeling
// Basic animation
// Transformations

import * as THREE from "three";

export default class Watch extends THREE.Group {
    constructor(cityName, center = new THREE.Vector2(0.0, 0.0), radius = 0.75, nameBackgroundColor = 0xffffff, nameForegroundColor = 0x000000, dialColor = 0x000000, markersColor = 0xffffff, handsHMColor = 0xffffff, handSColor = 0xff0000) {
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
        ]

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
        const radius0 = 0.85 * radius;
        const radius1 = 0.90 * radius;
        const radius2 = 0.95 * radius;
        let points = [];
        const angleIncrement = 2.0 * Math.PI / 60.0;
        let angle = 0.0;
        for (let i = 0; i < 60; i++) {
            let cos = Math.cos(angle);
            let sin = Math.sin(angle);
            if (i % 5 == 0) {
                points.push(new THREE.Vector2(radius0 * cos, radius0 * sin));
            }
            else {
                points.push(new THREE.Vector2(radius1 * cos, radius1 * sin));
            }
            points.push(new THREE.Vector2(radius2 * cos, radius2 * sin));
            angle += angleIncrement;
        }
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        material = new THREE.LineBasicMaterial({ color: markersColor });
        this.markers = new THREE.LineSegments(geometry, material);
        this.add(this.markers);

        // Create the hour hand (a line segment) pointing at 0.0 radians (the positive X-semiaxis)
        points = [new THREE.Vector2(0.0, 0.0), new THREE.Vector2(0.5 * radius, 0.0)];
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        material = new THREE.LineBasicMaterial({ color: handsHMColor });
        this.handH = new THREE.LineSegments(geometry, material);
        this.add(this.handH);

        // Create the minute hand (a line segment) pointing at 0.0 radians (the positive X-semiaxis)
        points = [new THREE.Vector2(0.0, 0.0), new THREE.Vector2(0.7 * radius, 0.0)];
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.handM = new THREE.LineSegments(geometry, material);
        this.add(this.handM);

        // Create the second hand (a line segment and a circle) pointing at 0.0 radians (the positive X-semiaxis)
        this.handS = new THREE.Group();

        // Create the line segment
        points = [new THREE.Vector2(0.0, 0.0), new THREE.Vector2(0.8 * radius, 0.0)];
        geometry = new THREE.BufferGeometry().setFromPoints(points);
        material = new THREE.LineBasicMaterial({ color: handSColor });
        let handS = new THREE.LineSegments(geometry, material);
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

        // Then create a "label" <div> element and append it as a child of "container"
        this.label = document.createElement("div");
        this.label.style.position = "absolute";
        this.label.style.left = (50.0 * center.x - 30.0 * radius).toString() + "vmin";
        this.label.style.top = (-50.0 * center.y + 54.0 * radius).toString() + "vmin";
        this.label.style.width = (60.0 * radius).toString() + "vmin";
        this.label.style.fontSize = (8.0 * radius).toString() + "vmin";
        this.label.style.backgroundColor = "#" + new THREE.Color(nameBackgroundColor).getHexString();
        this.label.style.color = "#" + new THREE.Color(nameForegroundColor).getHexString();
        this.label.innerHTML = this.cities[this.cityIndex].name;
        container.appendChild(this.label);
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