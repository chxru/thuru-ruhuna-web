<script>
  import { onDestroy } from "svelte";
  import { goto } from "@sapper/app";
  import { username, userDetails } from "../../store";

  let name;
  let isLogged;

  const unsubscribe = username.subscribe(value => {
    name = value;
    isLogged = name == "Sign In" ? false : true;
  });

  onDestroy(unsubscribe);

  const navigateHome = async () => {
    await goto("/");
  };
  const navigateAuth = async () => {
    await goto("/auth");
  };

  const signout = () => {
    firebase.auth().signOut().then(() => {
      userDetails.set({})
    }).catch(e => {
      console.error(e)
    })
  }
</script>

<div
  class="flex fixed justify-between h-24 z-20 w-full px-8 py-8 md:pl-12 bg-gray">
  <div class="flex flex-no-wrap font-sans text-xl text-black cursor-pointer">
    <img src="/leaves.svg" class="h-8 mr-4" alt="Thuru Ruhuna Logo" />
    <span class="w-full" on:click={navigateHome}>Thuru Ruhuna</span>
  </div>
  <div
    class="flex flex-no-wrap font-sans text-base text-gray-600 cursor-pointer">
    <span class="hidden md:inline" on:click={navigateAuth}>{name}</span>
    {#if isLogged}
      <img
        src="/defaultuser.webp"
        class="h-8 ml-4 rounded-full hidden md:inline object-cover"
        alt="user's image" />
    {/if}
    <img src="/down-arrow.svg" class="h-2 mt-2 ml-4" alt="down arrow" />
    {#if isLogged}
      <img src="/signout.svg" class="h-4 mt-2 ml-4" alt="signout" on:click={signout} />
    {/if}
  </div>
</div>
