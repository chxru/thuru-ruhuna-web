<script>
  import { goto } from "@sapper/app";
  import { userDetails, errors } from "../store/";

  const auth = firebase.auth();
  const db = firebase.firestore();

  let isLogged;
  auth.onAuthStateChanged(user => {
    if (user) {
      isLogged = true;
    } else {
      isLogged = false;
    }
  });

  const createNewUser = (Obj, uid) => {
    const docRef = db.collection("users").doc(uid);
    docRef
      .set({
        ...Obj,
        createdOn: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(async () => {
        await goto("/profile/edit");
      })
      .catch(e => {
        $errors = [
          ...$errors,
          { title: "Error on user-create firestore", msg: e }
        ];
      });
  };

  const firebaseAuth = provider => {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      return auth
        .signInWithRedirect(provider)
        .then(result => {
          const Obj = {
            name: result.user.displayName,
            email: result.additionalUserInfo.profile.email,
            photoURL: result.user.photoURL
          };
          userDetails.set(Obj);
          if (result.additionalUserInfo.isNewUser) {
            createNewUser(Obj, result.user.uid);
          } else {
            goto("/");
          }
        })
        .catch(e => {
          $errors = [
            ...$errors,
            { title: "Error in authentication", msg: e.message }
          ];
        });
    });
  };

  const signInGoogle = async () => {
    try {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      firebaseAuth(provider);
    } catch (err) {
      $errors = [...$errors, { title: "Authentication Failed", msg: err }];
    }
  };

  const signInFacebook = () => {
    try {
      let provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("email");

      firebaseAuth(provider);
    } catch (err) {
      $errors = [...$errors, { title: "Authentication Failed", msg: err }];
    }
  };

  const navigateHome = async () => {
    await goto("/")
  }
</script>

<svelte:head>
  <title>Login In: Thuru Ruhuna</title>
</svelte:head>

<div class="flex flex-col m-0 text-center items-center relative">
  <div class="w-1/2">
    {#if !isLogged}
      <div class="text-lg py-16">
        <h1>Login</h1>
      </div>
      <div class="flex flex-col md:flex-row justify-between">
        <button
          class="w-1/2 bg-white tracking-wide text-gray-800 font-bold rounded
          border-b-2 border-blue-500 hover:border-blue-600 hover:bg-blue-500
          hover:text-white shadow-md py-2 px-6 mx-2 inline-flex items-center"
          on:click={signInFacebook}>
          <span class="mx-auto">Facebook</span>
        </button>
        <button
          class="w-1/2 bg-white tracking-wide text-gray-800 font-bold rounded
          border-b-2 border-red-500 hover:border-red-600 hover:bg-red-500
          hover:text-white shadow-md py-2 px-6 mx-2 inline-flex items-center"
          on:click={signInGoogle}>
          <span class="mx-auto">Google</span>
        </button>
      </div>
    {:else}
      <div class="text-lg py-16">
        <h1>Login Complete</h1>
      </div>
      <div class="flex flex-col md:flex-row justify-between">
        <button
          class="w-full bg-white tracking-wide text-gray-800 font-bold rounded
          border-b-2 border-red-500 hover:border-red-600 hover:bg-red-500
          hover:text-white shadow-md py-2 px-6 mx-2 inline-flex items-center"
          on:click={navigateHome}>
          <span class="mx-auto">Cool</span>
        </button>
      </div>
    {/if}
  </div>
</div>
