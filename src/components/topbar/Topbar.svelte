<script>
  import { goto } from "@sapper/app";

  let isDropdown = false;
  let user = false;

  // check user has loggedin
  const auth = firebase.auth();
  auth.onAuthStateChanged(u => {
    if (u) {
      user = u;
    } else {
      user = false;
    }
  });

  const signout = () => {
    isDropdown = false;
    firebase
      .auth()
      .signOut()
      .catch(e => {
        console.error(e);
      });
  };
</script>

<div class="flex justify-between h-24 w-full px-8 py-8 md:pl-12 bg-gray">
  <div class="flex flex-no-wrap font-sans text-xl text-black cursor-pointer">
    <img src="/leaves.svg" class="h-8 mr-4" alt="Thuru Ruhuna Logo" />
    <span
      class="w-full"
      on:click={() => {
        goto('/');
      }}>
      Thuru Ruhuna
    </span>
  </div>
  <div
    class="flex flex-no-wrap font-sans text-base text-gray-600 cursor-pointer">
    {#if !user}
      <span
        class="hidden md:inline"
        on:click={() => {
          goto('/auth');
        }}>
        Sign In
      </span>
      <img
        src="/login.svg"
        class="h-4 mt-2 ml-4 inline"
        alt="signin button"
        on:click={() => {
          goto('/auth');
        }} />
    {:else}
      <span
        class="hidden md:inline"
        on:click={() => {
          goto('/profile');
        }}>
        {user.displayName}
      </span>
      <img
        src={user.photoURL}
        class="h-8 w-8 ml-4 rounded-full hidden md:inline object-cover"
        alt="user's image" />
      <img
        src="/down-arrow.svg"
        class="h-2 mt-2 ml-4"
        alt="down arrow"
        on:click={() => {
          isDropdown = !isDropdown;
        }} />
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
