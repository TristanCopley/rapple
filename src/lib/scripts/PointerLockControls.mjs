import {
	Euler,
	EventDispatcher,
	Vector3
} from 'three';

export const mouse = {
    x : 0,
    y : 0,
    xv: 0,
    yv: 0,
    last: {
        x_movement : 0,
        y_movement : 0,
    }
}

const _euler = new Euler( 0, 0, 0, 'YXZ' );
const _changeEvent = { type: 'change' };
const _lockEvent = { type: 'lock' };
const _unlockEvent = { type: 'unlock' };

const _PI_2 = Math.PI / 2;

class PointerLockControls extends EventDispatcher {

	constructor( camera, domElement ) {

		super();

		this.camera = camera;
		this.domElement = domElement;

		this.isLocked = false;

		// Set to constrain the pitch of the camera
		// Range is 0 to Math.PI radians
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		this.pointerSpeed = 1.0;

		this._onMouseMove = onMouseMove.bind( this );
		this._onPointerlockChange = onPointerlockChange.bind( this );
		this._onPointerlockError = onPointerlockError.bind( this );

		this.connect();

	}

	connect() {

		this.domElement.ownerDocument.addEventListener( 'mousemove', this._onMouseMove );
		this.domElement.ownerDocument.addEventListener( 'pointerlockchange', this._onPointerlockChange );
		this.domElement.ownerDocument.addEventListener( 'pointerlockerror', this._onPointerlockError );

	}

	disconnect() {

		this.domElement.ownerDocument.removeEventListener( 'mousemove', this._onMouseMove );
		this.domElement.ownerDocument.removeEventListener( 'pointerlockchange', this._onPointerlockChange );
		this.domElement.ownerDocument.removeEventListener( 'pointerlockerror', this._onPointerlockError );

	}

	dispose() {

		this.disconnect();

	}

	getObject() { // retaining this method for backward compatibility

		return this.camera;

	}

	getDirection( v ) {

		return v.set( 0, 0, - 1 ).applyQuaternion( this.camera.quaternion );

	}

	lock() {

		this.domElement.requestPointerLock();

	}

	unlock() {

		this.domElement.ownerDocument.exitPointerLock();

	}

    update() {

        mouse.x += mouse.xv;
        mouse.y += mouse.yv;

        mouse.xv *= 0.9;
        mouse.yv *= 0.9;

        const camera = this.camera;
        _euler.setFromQuaternion( camera.quaternion );

        _euler.y = -mouse.x * 0.0002 * this.pointerSpeed;
        _euler.x = -mouse.y * 0.0002 * this.pointerSpeed;

        _euler.x = Math.max( _PI_2 - this.maxPolarAngle, Math.min( _PI_2 - this.minPolarAngle, _euler.x ) );

        camera.quaternion.setFromEuler( _euler );

    }

}

// event listeners

function onMouseMove( event ) {

	if ( this.isLocked === false ) return;

	let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    if (Math.abs(movementX) > 200 || Math.abs(movementY) > 200) {

        movementX = mouse.last.x_movement;
        movementY = mouse.last.y_movement;

    }

    mouse.xv += movementX;
    mouse.yv += movementY;

    mouse.last.x_movement = movementX;
    mouse.last.y_movement = movementY;

	this.dispatchEvent( _changeEvent );

}

function onPointerlockChange() {

	if ( this.domElement.ownerDocument.pointerLockElement === this.domElement ) {

		this.dispatchEvent( _lockEvent );

		this.isLocked = true;

	} else {

		this.dispatchEvent( _unlockEvent );

		this.isLocked = false;

	}

}

function onPointerlockError() {

	console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );

}

export { PointerLockControls };