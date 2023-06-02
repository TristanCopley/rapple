import * as THREE from 'three';
import { PointerLockControls } from './PointerLockControls';

export const Main = (canvas : HTMLCanvasElement) => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({canvas: canvas});

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    const spotlight = new THREE.PointLight( 0xffffff, 1, 100 );
    spotlight.position.set( 0, 10, 0 );
    scene.add( spotlight );

    const ambient_light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( ambient_light );

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry( 100, 100, 1, 1 ),
        new THREE.MeshStandardMaterial( { color: 0x808080, side: THREE.DoubleSide } )
    );
    ground.rotation.x = Math.PI / 2;
    scene.add( ground );

    
    const controls = new PointerLockControls(camera, canvas);

    controls.lock();

    camera.position.z = 5;
    camera.position.y = 2;

    function animate() {
        requestAnimationFrame( animate );

        controls.update();

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render( scene, camera );
    }

    animate();

}