<script>
  import { onMount, onDestroy } from "svelte";
  import { userDetails, isLoggedIn } from "../store";

  import Alert from "../components/alert/Alert.svelte";
  import Sidebar from "../components/sidebar/Sidebar.svelte";
  import Splash from "../components/splashscreen/Splash.svelte";
  import Topbar from "../components/topbar/Topbar.svelte";

  let isLogged;
  let doneLoading = false;
  export let segment;

  const firebaseConfig = {
    apiKey: "AIzaSyBIlVA3dYbid9YvNytPllMirXO8GA1EZcQ",
    authDomain: "thuru-ruhuna-dev.firebaseapp.com",
    databaseURL: "https://thuru-ruhuna-dev.firebaseio.com",
    projectId: "thuru-ruhuna-dev",
    storageBucket: "thuru-ruhuna-dev.appspot.com",
    messagingSenderId: "47791534606",
    appId: "1:47791534606:web:60286c1455f2fd1334025f"
  };

  const unsubscribe = isLoggedIn.subscribe(value => {
    isLogged = value;
  });

  // check the user has signed in before
  onMount(() => {
    firebase.initializeApp(firebaseConfig);
    doneLoading = true;
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

{#if !segment || segment == 'profile' || 'auth'}
  <div class="h-screen bg-gray">
    {#if doneLoading}
      <Topbar />
      <Sidebar />
      <div class="h-screen pt-4 pl-0 md:pl-8">
        <slot />
      </div>
    {:else}
      <Splash />
    {/if}
    <Alert />
  </div>
{/if}
