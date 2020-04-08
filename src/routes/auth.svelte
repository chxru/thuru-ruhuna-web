<script>
  import { goto } from "@sapper/app";
  import { userDetails } from "../store/";

  const auth = firebase.auth();
  const db = firebase.firestore();

  const createNewUser = user => {
    const docRef = db.collection("users").doc(user.uid);
    const Obj = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdOn: firebase.firestore.FieldValue.serverTimestamp()
    };
    docRef.set(Obj).then(async () => {
      await goto("/profile/edit");
    });
  };

  const signInGoogle = async () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");

    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      return auth.signInWithPopup(provider).then(result => {
        const ref = db.collection("users").doc(result.user.uid);
        ref.get().then(snapshot => {
          if (snapshot.exists) {
            // returning user
            ref.onSnapshot(doc => {
              userDetails.set(doc.data());
              goto("/");
            });
          } else {
            // new user
            createNewUser(result.user);
          }
        });
      });
    });
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
        hover:text-white shadow-md py-2 px-6 mx-2 inline-flex items-center">
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
