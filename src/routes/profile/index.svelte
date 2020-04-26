<script>
  import { onMount, onDestroy } from "svelte";
  import { goto } from "@sapper/app";
  import { userDetails } from "../../store";
  import Post from "../../components/grid/Post.svelte";

  let name, userImgURL;
  const unsubscribe = userDetails.subscribe(value => {
    name = value.name || "Sign In";
    userImgURL = value.photoURL || "/defaultuser.webp";
  });

  const db = firebase.firestore();
  const ppq = 9; // post-per-query
  $: posts = [];

  onMount(() => {
    firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        await goto("/auth");
      }
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

  onDestroy(unsubscribe);
</script>

<div class="flex flex-row items-center w-full px-8 mt-8 ">
  <img
    src={userImgURL}
    alt={name}
    class="h-32 w-32 rounded-full object-cover" />
  <h1 class="text-2xl ml-12">{name}</h1>
</div>

<div
  id="postContainer"
  class="flex flex-wrap content-start justify-center box-border h-auto bg-gray
  px-8 mt-12">
  {#each posts as post}
    <Post data={post} />
  {/each}
</div>
