<script lang='ts'>

    import { onMount } from 'svelte';
    import { Main } from '$scripts/main';

    onMount(()=>{
        const canvas = document.querySelector('.game_canvas') as HTMLCanvasElement;
        Main(canvas);
    })

</script>

<canvas class='game_canvas w-screen h-screen' width={window.innerWidth} height={window.innerHeight}>
    Your browser does not support the HTML5 canvas tag.
</canvas>