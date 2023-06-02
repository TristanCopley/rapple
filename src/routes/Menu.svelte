<script lang='ts'>

    export let in_game;

</script>

<div class='w-screen h-screen flex justify-center'>
    <button class='btn btn-neutral self-center' on:click={() => {in_game = true}}>
        Enter game
    </button>
</div>
