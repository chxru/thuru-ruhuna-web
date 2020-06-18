<script>
  import { onMount } from "svelte";
  import { goto } from "@sapper/app";
  import Post from "../../components/grid/Post.svelte";

  const auth = firebase.auth();
  const db = firebase.firestore();
  const ppq = 9; // post-per-query
  $: posts = [];

  let USER = false;

  onMount(() => {
    auth.onAuthStateChanged(user => {
      if (!user) {
        goto("/auth");
        USER = false;
      }
      USER = user;
      db.collection("posts")
        .where("user", "==", user.uid)
        .orderBy("timestamp", "desc")
        .limit(ppq)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            posts = [...posts, doc.data()];
          });
        })
        .catch(e => console.error(e));
    });
  });
</script>

<svelte:head>
  <title>{USER.displayName + ' : Thuru Ruhuna' || 'Thuru Ruhuna'}</title>
</svelte:head>

{#if USER}
  <div class="flex flex-row items-center w-full px-8 mt-8 ">
    <img
      src={USER.photoURL || '/defaultuser.webp'}
      alt={USER.displayName}
      class="h-32 w-32 rounded-full object-cover" />
    <h1 class="text-2xl ml-12">{USER.displayName || 'Loading'}</h1>
  </div>

  <div
    id="postContainer"
    class="flex flex-wrap content-start justify-center box-border h-auto bg-gray
    px-8 mt-12">
    {#each posts as post}
      <Post data={post} />
    {/each}
  </div>
{/if}
