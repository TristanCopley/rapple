<script defer lang='ts'>

    import Game from './Game.svelte';
    import Menu from './Menu.svelte';

    let in_game = false;

</script>

{#if in_game }

    <Game />

{:else}

    <Menu bind:in_game />

{/if}

