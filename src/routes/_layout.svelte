<script>
  import { onMount, onDestroy } from "svelte";
  import { username, userDetails, isLoggedIn } from "../store";

  import Topbar from "../components/topbar/Topbar.svelte";
  import Sidebar from "../components/sidebar/Sidebar.svelte";

  let isLogged;

  const unsubscribe = isLoggedIn.subscribe(value => {
    isLogged = value;
  });

  // check the user has signed in before
  onMount(() => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    auth.onAuthStateChanged(user => {
      if (user && !isLogged) {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .get()
          .then(doc => {
            userDetails.set(doc.data());
          });
      }
    });
  });

  onDestroy(unsubscribe);
</script>

<div class="h-screen bg-gray">
  <Topbar />
  <Sidebar />
  <div class="h-screen pt-20">
    <slot />
  </div>
</div>
