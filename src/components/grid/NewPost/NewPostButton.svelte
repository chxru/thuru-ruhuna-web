<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  $: isShowing = false;

  function newPost() {
    dispatch("newpostclicked");
    isShowing = !isShowing;
  }
</script>

<button
  on:click|preventDefault={newPost}
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4
  rounded-full">
  {(isShowing) ? "Discard" : "New Post"}
</button>
