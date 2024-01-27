import * as THREE from "three";

export const generalData = {
    setDevicePixelRatio: false
}

export const gameData = {
    color: 0xffffff,
    position: new THREE.Vector2(0.0, 0.0),
    scale: 1.0,
    end: 10,
    keyCodes: { start: "Space", pause: "Space" } // Start and pause/resume keys
}

export const tableData = {
    color: 0xffffff,
    size: new THREE.Vector2(1.9, 1.4),
    dashes: 16 // Net (a dashed line segment)
}

export const playerData = {
    color: 0xffffff,
    side: undefined, // Left side: "left"; right side: "right"; automatically set by Pong()
    initialSize: new THREE.Vector2(0.05, 0.2),
    sizeIncrement: 0.05, // -5% of initial size whenever the player scores; +5% of initial size  whenever the player concedes
    initialSpeed: 1.0,
    speedIncrement: 0.05, // +5% of initial speed whenever the player scores; -5% of initial speed  whenever the player concedes
    centerBoundaries: { rear: 0.95, front: 0.15 }, // fraction of (table.size.x / 2.0)
    keyCodes: { backward: "ArrowLeft", forward: "ArrowRight", down: "ArrowDown", up: "ArrowUp" } // Arrow keys; MUST BE REDEFINED when creating an instance of Pong() so that each player is assigned a different set of keys
}

export const ballData = {
    color: 0xffffff,
    radius: 0.025,
    initialSpeed: 1.125, // 75% of hit speed
    hitSpeed: 1.5,
    speedIncrement: 0.5, // -50% of initial speed whenever the racket moves backward; +50% of initial speed whenever the racket moves forward
    speedAttenuation: -0.2, // -20% per second
    directionMax: Math.PI / 3.0, // 60.0 degrees
    spinMax: Math.PI / 180.0, // -1.0 or +1.0 degree whenever the racket moves sidewards
    spinAttenuation: -0.5 // -50% per second
}