import * as THREE from 'three';
import { PointerLockControls } from './PointerLockControls';
import { Input_Controller } from './Input_Controller';
import { Player } from './Player';
import { addEntity, removeEntity, entities } from './objects';
import { text } from '@sveltejs/kit';

const gravity = -0.0001;

export const Main = (canvas) => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer({canvas: canvas});

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.y = 60;
    cube.position.x = 0.5;
    addEntity(scene, cube, 'cube');

    const geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
    const material2 = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
    const cube2 = new THREE.Mesh( geometry2, material2 );
    cube2.position.y = 40;
    cube2.position.x = -0.5;
    cube2.position.z = 0.5;
    addEntity(scene, cube2, 'cube2');

    const geometry3 = new THREE.BoxGeometry( 1, 1, 1 );
    const material3 = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
    const cube3 = new THREE.Mesh( geometry3, material3 );
    cube3.position.y = 20;
    addEntity(scene, cube3, 'cube3');

    const spotlight = new THREE.PointLight( 0xffffff, 1, 100 );
    spotlight.position.set( 0, 10, 0 );
    scene.add( spotlight );

    const ambient_light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( ambient_light );

    const ground = new THREE.Mesh(
        new THREE.BoxGeometry( 100, 100, 1),
        new THREE.MeshStandardMaterial( { color: 0x808080, side: THREE.DoubleSide } )
    );

    ground.rotation.x = Math.PI / 2;
    addEntity(scene, ground, 'ground', {static: true});

    const controls = new PointerLockControls(camera, canvas);
    const input_controller = new Input_Controller();
    const player = new Player(scene, camera, input_controller, controls);

    input_controller.set_keybinds({
        'forward': ['w'],
        'backward': ['s'],
        'left': ['a'],
        'right': ['d']
    });

    controls.lock();

    camera.position.z = 5;
    camera.position.y = 2;

    let dt = 0;
    let last_time = 0;

    function animate(time = 0) {
        requestAnimationFrame( animate );

        dt = time - last_time;
        last_time = time;
        
        if (dt > 50) return;

        player.update(dt);

        camera.position.set(player.player_entity.position.x, player.player_entity.position.y + 4, player.player_entity.position.z);
        

        let entries = Array.from(entities.keys());

        for (let i = 0; i < entries.length; i++) {

            let entity = entities.get(entries[i]);
            if (entity.physics === false || entity.static === true) continue;

            entity.velocity.x *= 0.96;
            entity.velocity.y *= 0.96;
            entity.velocity.z *= 0.96;

            entity.velocity.y += gravity * dt;

            entity.position.x += entity.velocity.x * dt;
            entity.position.y += entity.velocity.y * dt;
            entity.position.z += entity.velocity.z * dt;

            entity.mesh.position.set(entity.position.x, entity.position.y, entity.position.z);
            entity.bbox.setFromObject(entity.mesh);

        }

        for (let i = 0; i < entries.length; i++) {

            let entity1 = entities.get(entries[i]);
            if (entity1.physics === false) continue;

            for (let j = i + 1; j < entries.length; j++) {

                let entity2 = entities.get(entries[j]);
                if (entity2.physics === false || (entity1.static === true && entity2.static === true)) continue;

                if (entity1.bbox.intersectsBox(entity2.bbox)) {

                    // Collision response
                    let testbbox = new THREE.Box3().setFromObject(entity1.mesh);
                    let temp_position = new THREE.Vector3(entity1.position.x, entity1.position.y, entity1.position.z);
                    let temp_velocity = new THREE.Vector3(entity1.velocity.x, entity1.velocity.y, entity1.velocity.z);
                    let vec = new THREE.Vector3();

                    if (entity1.static === false) {

                        // Check x-axis
                        testbbox.setFromObject(entity1.mesh);
                        testbbox.translate(new THREE.Vector3(0, -entity1.velocity.y * dt, -entity1.velocity.z * dt));
                        entity1.bbox.getSize(vec);

                        if (testbbox.intersectsBox(entity2.bbox)) {

                            temp_position.x += entity1.velocity.x * dt * -1;
                            temp_velocity.x = entity1.velocity.x * -1;

                        }

                        // Check y-axis
                        testbbox.setFromObject(entity1.mesh);
                        testbbox.translate(new THREE.Vector3(-entity1.velocity.x * dt, 0, -entity1.velocity.z * dt));
                        
                        if (testbbox.intersectsBox(entity2.bbox)) {

                        
                            
                            temp_position.y += entity1.velocity.y * dt * -1;
                            temp_velocity.y = entity1.velocity.y * -1;

                        }

                        // Check z-axis
                        testbbox.setFromObject(entity1.mesh);
                        testbbox.translate(new THREE.Vector3(-entity1.velocity.x * dt, -entity1.velocity.y * dt, 0));
                        
                        if (testbbox.intersectsBox(entity2.bbox)) {
                            
                            temp_position.z += entity1.velocity.z * dt * -1;
                            temp_velocity.z = entity1.velocity.z * -1;

                        }
                        
                    }

                    if (entity2.static === false) {

                        testbbox.setFromObject(entity2.mesh);
                        testbbox.translate(new THREE.Vector3(0, -entity2.velocity.y * dt, -entity2.velocity.z * dt));

                        vec = new THREE.Vector3();
                        entity2.bbox.getSize(vec);

                        if (testbbox.intersectsBox(entity1.bbox)) {

                            entity2.position.x += entity2.velocity.x * dt * -1;
                            entity2.velocity.x *= -1;

                        }

                        // Check y-axis
                        testbbox.setFromObject(entity2.mesh);
                        testbbox.translate(new THREE.Vector3(-entity2.velocity.x * dt, 0, -entity2.velocity.z * dt));
                        
                        if (testbbox.intersectsBox(entity1.bbox)) {

                            
                            entity2.position.y += entity2.velocity.y * dt * -1;
                            entity2.velocity.y *= -1;

                        }

                        // Check z-axis
                        testbbox.setFromObject(entity2.mesh);
                        testbbox.translate(new THREE.Vector3(-entity2.velocity.x * dt, -entity2.velocity.y * dt, 0));
                        
                        if (testbbox.intersectsBox(entity1.bbox)) {

                            entity2.position.z += entity2.velocity.z * dt * -1;
                            entity2.velocity.z *= -1;

                        }

                    }

                    const normal = new THREE.Vector3();

                    normal.x = entity1.position.x - entity2.position.x;
                    normal.y = entity1.position.y - entity2.position.y;
                    normal.z = entity1.position.z - entity2.position.z;

                    normal.normalize();

                    entity1.position.x = temp_position.x;
                    entity1.position.y = temp_position.y;
                    entity1.position.z = temp_position.z;

                    entity1.velocity.x = temp_velocity.x;
                    entity1.velocity.y = temp_velocity.y;
                    entity1.velocity.z = temp_velocity.z;

                    if (entity1.static === false) {

                        let extra = entity2.static === true ? 2 : 1;

                        entity1.position.x += normal.x * 0.000001 * extra;
                        entity1.position.y += normal.y * 0.000001 * extra;
                        entity1.position.z += normal.z * 0.000001 * extra;

                    }

                    if (entity2.static === false) {

                        let extra = entity1.static === true ? 2 : 1;

                        entity2.position.x += normal.x * -0.000001 * extra;
                        entity2.position.y += normal.y * -0.000001 * extra;
                        entity2.position.z += normal.z * -0.000001 * extra;

                    }

                    entity1.mesh.position.set(entity1.position.x, entity1.position.y, entity1.position.z);
                    entity1.bbox.setFromObject(entity1.mesh);

                    entity2.mesh.position.set(entity2.position.x, entity2.position.y, entity2.position.z);
                    entity2.bbox.setFromObject(entity2.mesh);

                }

            }

        }

        renderer.render( scene, camera );
    }

    animate();

}