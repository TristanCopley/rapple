import * as THREE from 'three';

export const entities = new Map();

export function addEntity(scene, mesh, name, options = {}) {

    let _options = {
        static: false,
        physics: true,
        position: {
            x: mesh.position.x,
            y: mesh.position.y,
            z: mesh.position.z,
        },
        velocity: {
            x: 0,
            y: 0,
            z: 0
        }
    }

    _options = Object.assign(_options, options);

    mesh.position.set(_options.position.x, _options.position.y, _options.position.z);

    entities.set(name, {
        mesh: mesh,
        bbox: new THREE.Box3().setFromObject(mesh),
        ..._options
    });

    scene.add(mesh);

}

export function removeEntity(scene, name) {

    scene.remove(entities.get(name).mesh);
    entities.delete(name);

}