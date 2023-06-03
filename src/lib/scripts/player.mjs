import * as THREE from 'three';
import { entities, addEntity } from './objects.mjs';

export class Player {
    constructor(scene, camera, input_controller, controls) {

        this._euler = new THREE.Euler( 0, 0, 0, 'YXZ' );

        this.movement_speed = 0.0001;

        this.camera = camera;
        this.input_controller = input_controller;
        this.controls = controls;

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 3, 1),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );

        addEntity(scene, mesh, 'player', {
            position: {
                x: 0,
                y: 2,
                z: 0
            },
        });

        this.player_entity = entities.get('player');

        this.hook = {
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            velocity: {
                x: 0,
                y: 0,
                z: 0
            },

            embedded: false,
            length: 1000,
            stiffness: 0.9,
            
        }


    }

    update(dt) {

        this.controls.update();

        this._euler.setFromQuaternion( this.camera.quaternion );

        if (this.input_controller.pressed['forward']) {

            this.player_entity.velocity.x -= Math.sin(this._euler.y) * this.movement_speed * dt;
            this.player_entity.velocity.z -= Math.cos(this._euler.y) * this.movement_speed * dt;

        }

        if (this.input_controller.pressed['backward']) {

            this.player_entity.velocity.x += Math.sin(this._euler.y) * this.movement_speed * dt;
            this.player_entity.velocity.z += Math.cos(this._euler.y) * this.movement_speed * dt;

        }

        if (this.input_controller.pressed['left']) {

            this.player_entity.velocity.x -= Math.sin(this._euler.y + Math.PI / 2) * this.movement_speed * dt;
            this.player_entity.velocity.z -= Math.cos(this._euler.y + Math.PI / 2) * this.movement_speed * dt;

        }

        if (this.input_controller.pressed['right']) {

            this.player_entity.velocity.x += Math.sin(this._euler.y + Math.PI / 2) * this.movement_speed * dt;
            this.player_entity.velocity.z += Math.cos(this._euler.y + Math.PI / 2) * this.movement_speed * dt;

        }

        // this.player_entity.velocity.x *= 0.94;
        // this.player_entity.velocity.y *= 0.94;
        // this.player_entity.velocity.z *= 0.94;

        // this.player_entity.position.x += this.player_entity.velocity.x * dt;
        // this.player_entity.position.y += this.player_entity.velocity.y * dt;
        // this.player_entity.position.z += this.player_entity.velocity.z * dt;

    }
}
