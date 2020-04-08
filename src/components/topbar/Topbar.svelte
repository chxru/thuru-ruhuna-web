<script>
  import { onDestroy } from "svelte";
  import { goto } from "@sapper/app";
  import { userDetails } from "../../store";

  let name;
  let isLogged;
  let userImgURL;
  let isDropdown = false;

  const unsubscribe = userDetails.subscribe(value => {
    name = value.name || "Sign In";
    userImgURL = value.photoURL || "/defaultuser.webp";
    isLogged = value.name ? true : false;
  });

  onDestroy(unsubscribe);

  const navigateHome = async () => {
    await goto("/");
  };
  const navigateAuth = async () => {
    await goto("/auth");
  };

  const signout = () => {
    isDropdown = false;
    firebase
      .auth()
      .signOut()
      .then(() => {
        userDetails.set({});
      })
      .catch(e => {
        console.error(e);
      });
  };

  const dropdownClicked = () => {
    isDropdown = !isDropdown;
  };
</script>

<div class="flex justify-between h-24 w-full px-8 py-8 md:pl-12 bg-gray">
  <div class="flex flex-no-wrap font-sans text-xl text-black cursor-pointer">
    <img src="/leaves.svg" class="h-8 mr-4" alt="Thuru Ruhuna Logo" />
    <span class="w-full" on:click={navigateHome}>Thuru Ruhuna</span>
  </div>
  <div
    class="flex flex-no-wrap font-sans text-base text-gray-600 cursor-pointer">
    <span class="hidden md:inline" on:click={navigateAuth}>{name}</span>
    {#if isLogged}
      <img
        src={userImgURL}
        class="h-8 w-8 ml-4 rounded-full hidden md:inline object-cover"
        alt="user's image" />
      <img
        src="/down-arrow.svg"
        class="h-2 mt-2 ml-4"
        alt="down arrow"
        on:click={dropdownClicked} />
    {/if}
  </div>
</div>

{#if isDropdown}
  <span
    class="fixed text-right h-auto w-32 bg-gray shadow-lg rounded-lg z-20 p-4"
    style="top: 70px; right: 20px;">
    <div
      class="flex flex-no-wrap justify-center cursor-pointer"
      on:click={signout}>
      Signout
      <img src="/signout.svg" class="h-4 mt-2 ml-4" alt="signout" />
    </div>
  </span>
{/if}
