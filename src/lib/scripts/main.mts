import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export const Main = (canvas : HTMLCanvasElement) => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({canvas: canvas});

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    
    const controls = new PointerLockControls(camera, canvas);

    controls.lock();

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame( animate );

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render( scene, camera );
    }

    animate();

    console.log('loaded');

}