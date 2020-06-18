<script>
  import { goto } from "@sapper/app";
  import { errors } from "../store/";

  const auth = firebase.auth();
  const db = firebase.firestore();

  let cancelRedirection = false;
  auth.onAuthStateChanged(user => {
    if (user) {
      if (!cancelRedirection) goto("/"); // prevent immediate redirect after signing in
    }
  });

  const createNewUser = (Obj, uid) => {
    const docRef = db.collection("users").doc(uid);
    docRef
      .set({
        ...Obj,
        createdOn: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        goto("/profile/edit");
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
          if (result.additionalUserInfo.isNewUser) {
            const Obj = {
              name: result.user.displayName,
              email: result.additionalUserInfo.profile.email,
              photoURL: result.user.photoURL
            };
            createNewUser(Obj, result.user.uid);
            cancelRedirection = true;
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

  const signInGoogle = () => {
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
    await goto("/");
  };
</script>

<svelte:head>
  <title>Login In: Thuru Ruhuna</title>
</svelte:head>

<div class="flex flex-col m-0 text-center items-center relative">
  <div class="w-1/2">
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
  </div>
</div>
