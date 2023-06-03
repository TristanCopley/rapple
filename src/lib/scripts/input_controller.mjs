

export class Input_Controller {

    constructor() {

        // Maps key codes to pressed actions
        this.key_map = {};

        // Object containing the state of all pressed keys
        this.pressed = {};

        // Listen for key presses
        document.addEventListener('keydown', (event) => { this.key_down(event) }, false);
        document.addEventListener('keyup', (event) => { this.key_up(event) }, false);

        // Listen for mouse 
        document.addEventListener('mousedown', (event) => { this.mouse_down(event) }, false);
        document.addEventListener('mouseup', (event) => { this.mouse_up(event) }, false);

    }

    set_keybinds(key_binds) {

        // Set the keybinds in key_map
        for (let action in key_binds) {

            for (let key of key_binds[action]) {

                this.key_map[key] = action;

            }

        }

        // Set the pressed keys to false
        for (let action in key_binds) this.pressed[action] = false;

    }

    key_down(event) {

        const key = event.key.toLowerCase();
        if (this.key_map[key]) this.pressed[this.key_map[key]] = true;

    }

    key_up(event) {

        const key = event.key.toLowerCase();
        if (this.key_map[key]) this.pressed[this.key_map[key]] = false;

    }

    mouse_down(event) {

        if (document.pointerLockElement !== document.querySelector('.game_canvas')) document.querySelector('.game_canvas').requestPointerLock(); // Move to a better place later

        const key = `mouse${event.button}`;
        if (this.key_map[key]) this.pressed[this.key_map[key]] = true;

    }

    mouse_up(event) {

        const key = `mouse${event.button}`;
        if (this.key_map[key]) this.pressed[this.key_map[key]] = false;

    }

}