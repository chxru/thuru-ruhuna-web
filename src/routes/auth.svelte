<script>
  import { userDetails } from "../store/";

  const auth = firebase.auth();
  const db = firebase.firestore();

  let email = "test@email.com";
  let password = "password";

  function signIn() {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log(auth.currentUser.uid);
        db.collection("users")
          .doc(auth.currentUser.uid)
          .get()
          .then(doc => {
            userDetails.set(doc.data());
          });
      })
      .catch(e => console.error(e.code, e.message));
  }
</script>

<svelte:head>
  <title>Login In: Thuru Ruhuna</title>
</svelte:head>

<div class="flex justify-center items-center h-full">
  <form class="w-full max-w-sm">
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-full-name">
          email
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          id="inline-full-name"
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded
          w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none
          focus:bg-white focus:border-purple-500"
          type="text"
          placeholder="yaboizynt"
          bind:value={email} />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="inline-username">
          password
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          id="inline-username"
          class="bg-gray-200 appearance-none border-2 border-gray-200 rounded
          w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none
          focus:bg-white focus:border-purple-500"
          type="password"
          placeholder="******************"
          bind:value={password} />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3" />
      <label class="md:w-2/3 block text-gray-500 font-bold">
        <input class="mr-2 leading-tight" type="checkbox" />
        <span class="text-sm">Remember me</span>
      </label>
    </div>
    <div class="md:flex md:items-center">
      <div class="md:w-1/3" />
      <div class="md:w-2/3">
        <button
          class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline
          focus:outline-none text-white font-bold py-2 px-4 rounded"
          type="button"
          on:click|preventDefault={signIn}>
          Sign In
        </button>
      </div>
    </div>
  </form>
</div>
