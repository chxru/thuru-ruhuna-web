<script>
  import { onDestroy } from "svelte";
  import { postsArr, isLoggedIn } from "../store/";

  import Post from "../components/grid/Post.svelte";
  import NewPost from "../components/grid/NewPost.svelte";

  const db = firebase.firestore();
  const ppq = 9; // post-per-query

  let posts;
  $: posts;
  let isLogged;

  const unsubscribe_isLoggedIn = isLoggedIn.subscribe(value => {
    isLogged = value;
  });

  const unsubscribe_postArr = postsArr.subscribe(value => {
    posts = value;

    if (posts.length == 0) {
      db.collection("posts")
        .orderBy("timestamp", "desc")
        .limit(ppq)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            posts = [...posts, doc.data()];
          });
          postsArr.set(posts);
        })
        .catch(e => console.error(e));
    }
  });

  onDestroy(() => {
    unsubscribe_isLoggedIn();
    unsubscribe_postArr();
  });
</script>

<svelte:head>
  <title>Thuru Ruhuna</title>
</svelte:head>

<div
  id="postContainer"
  class="flex flex-wrap content-start justify-center box-border h-auto bg-gray
  px-8">
  {#each posts as post}
    <Post data={post} />
  {/each}
</div>

{#if isLogged}
  <NewPost />
{/if}
