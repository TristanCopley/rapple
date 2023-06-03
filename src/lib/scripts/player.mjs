import * as THREE from 'three';

export class Player {
    constructor(camera, input_controller, controls) {

        this._euler = new THREE.Euler( 0, 0, 0, 'YXZ' );

        this.movement_speed = 0.0001;

        this.camera = camera;
        this.input_controller = input_controller;
        this.controls = controls;

        this.position = {
            x: 0,
            y: 0,
            z: 0
        }

        this.velocity = {
            x: 0,
            y: 0,
            z: 0
        }

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

            this.velocity.x -= Math.sin(this._euler.y) * this.movement_speed * dt;
            this.velocity.z -= Math.cos(this._euler.y) * this.movement_speed * dt;

        }

        if (this.input_controller.pressed['backward']) {

            this.velocity.x += Math.sin(this._euler.y) * this.movement_speed * dt;
            this.velocity.z += Math.cos(this._euler.y) * this.movement_speed * dt;

        }

        if (this.input_controller.pressed['left']) {

            this.velocity.x -= Math.sin(this._euler.y + Math.PI / 2) * this.movement_speed * dt;
            this.velocity.z -= Math.cos(this._euler.y + Math.PI / 2) * this.movement_speed * dt;

        }

        if (this.input_controller.pressed['right']) {

            this.velocity.x += Math.sin(this._euler.y + Math.PI / 2) * this.movement_speed * dt;
            this.velocity.z += Math.cos(this._euler.y + Math.PI / 2) * this.movement_speed * dt;

        }

        this.velocity.x *= 0.94;
        this.velocity.y *= 0.94;
        this.velocity.z *= 0.94;

        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.position.z += this.velocity.z * dt;

    }
}
