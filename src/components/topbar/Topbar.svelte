<script>
  import { onDestroy } from "svelte";
  import { goto } from "@sapper/app";
  import { username } from "../../store";

  let name;

  const unsubscribe = username.subscribe(value => {
    name = value
  })

  onDestroy(unsubscribe)

  const navigateHome = async () => {
    await goto("/");
  };
  const navigateAuth = async () => {
    await goto("/auth");
  };
</script>

<div
  class="flex fixed justify-between items-center h-16 z-20 w-full px-8 md:pl-12">
  <span
    class="font-sans text-xl text-black cursor-pointer"
    on:click={navigateHome}>
    Thuru Ruhuna
  </span>
  <span
    class="font-sans text-xl text-black cursor-pointer"
    on:click={navigateAuth}>
    {name}
  </span>
</div>
