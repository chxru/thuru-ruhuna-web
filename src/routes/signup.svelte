<script>
  import { onMount } from "svelte";

  let src = "/defaultuser.webp";
  let file;
  let hasImage = false;
  $: progress = 0;

  let fname = "",
    lname = "",
    username = "",
    email = "",
    password = "",
    regno = "",
    batch = "",
    tpNum = "";

  function submitUser() {
    const auth = firebase.auth();

    if (auth.currentUser) {
      createUser();
    } else {
      console.error("User already logged in");
    }
  }

  function createUser() {
    const auth = firebase.auth();
    const db = firebase.firestore();

    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      return auth.createUserWithEmailAndPassword(email, password).then(() => {
        const Obj = {
          fname,
          lname,
          username,
          email,
          password,
          regno,
          batch,
          tpNum,
          createdOn: firebase.firestore.FieldValue.serverTimestamp()
        };
        const docRef = db.collection("users").doc(auth.currentUser.uid);
        docRef.set(Obj).then(() => {
          console.log("doc created");
          if (hasImage) uploadImage();
        });
      });
    });
  }

  function uploadImage() {
    const storageRef = firebase.storage().ref();
    const ref = storageRef.child("userImages/test");

    let uploadTask = ref.put(file);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      function(snapshot) {
        progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload is running");
            break;
        }
      },
      function(error) {
        console.log(error.code);
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;

          case "storage/canceled":
            // User canceled the upload
            break;

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log("File available at", downloadURL);
        });
      }
    );
  }

  function handleDP() {
    file = this.files[0];
    hasImage = false;

    if (file && file.type.startsWith("image/")) {
      const img = document.getElementById("dp-img");
      const reader = new FileReader();
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result;
        };
      })(img);
      reader.readAsDataURL(file);
      hasImage = true;
    }
  }

  onMount(() => {
    const dpselect = document.getElementById("signup-dp");
    dpselect.addEventListener("change", handleDP);
  });
</script>

<div class="flex justify-center items-center h-auto py-32 bg-gray">
  <form class="w-full max-w-lg">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold
          mb-2"
          for="signup-first-name">
          First Name
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border
          border-gray-200 rounded py-3 px-4 mb-3 leading-tight
          focus:outline-none focus:bg-white"
          id="signup-first-name"
          type="text"
          placeholder="Jane"
          bind:value={fname} />
      </div>
      <div class="w-full md:w-1/2 px-3">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold
          mb-2"
          for="signup-last-name">
          Last Name
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border
          border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none
          focus:bg-white focus:border-gray-500"
          id="signup-last-name"
          type="text"
          placeholder="Doe"
          bind:value={lname} />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold
          mb-2"
          for="signup-first-name">
          Username
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border
          border-gray-200 rounded py-3 px-4 mb-3 leading-tight
          focus:outline-none focus:bg-white"
          id="signup-username"
          type="text"
          placeholder="JaneDoe"
          bind:value={username} />
      </div>
      <div class="w-full md:w-1/2 px-3">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold
          mb-2"
          for="signup-last-name">
          Email
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border
          border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none
          focus:bg-white focus:border-gray-500"
          id="signup-email"
          type="email"
          placeholder="doe@jane.com"
          bind:value={email} />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold
          mb-2"
          for="signup-password">
          Password
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border
          border-gray-200 rounded py-3 px-4 mb-3 leading-tight
          focus:outline-none focus:bg-white focus:border-gray-500"
          id="signup-password"
          type="password"
          placeholder="******************"
          bind:value={password} />
        <p class="text-gray-600 text-xs italic">
          Make it as long and as crazy as you'd like
        </p>
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold
          mb-2"
          for="signup-regno">
          Registration Number
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border
          border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none
          focus:bg-white focus:border-gray-500"
          id="signup-regno"
          type="text"
          placeholder="EG/201X/XXXX"
          bind:value={regno} />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold
          mb-2"
          for="signup-batch">
          Batch
        </label>
        <div class="relative">
          <select
            class="block appearance-none w-full bg-gray-200 border
            border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight
            focus:outline-none focus:bg-white focus:border-gray-500"
            id="signup-batch"
            bind:value={batch}>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>Other</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex
            items-center px-2 text-gray-700">
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20">
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757
                6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold
          mb-2"
          for="signup-tp">
          Mobile Number
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border
          border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none
          focus:bg-white focus:border-gray-500"
          id="signup-tp"
          type="text"
          placeholder="07XXXXXXXX"
          bind:value={tpNum} />
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold
          mb-2"
          for="signup-dp">
          Profile Picture
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border
          border-gray-200 rounded py-3 px-4 mb-3 leading-tight
          focus:outline-none focus:bg-white focus:border-gray-500"
          id="signup-dp"
          type="file"
          accept="image/*" />
      </div>
      <div class="w-full h-48 flex items-center justify-center">
        <img
          {src}
          class="h-32 w-32 object-cover object-center rounded-full"
          id="dp-img"
          alt="test" />
      </div>
      {#if progress}
        <div class="w-full">
          <div class="shadow w-full bg-grey-light mt-2">
            <div
              class="bg-purple-500 text-xs leading-none py-1 text-center
              text-white"
              style="width: {progress}%">
              {progress}%
            </div>
          </div>
        </div>
      {/if}
    </div>
    <div class="flex items-center justify-center">
      <button
        class="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline
        focus:outline-none text-white font-bold py-2 px-4 rounded"
        type="button"
        on:click|preventDefault={submitUser}
        }>
        Sign Up
      </button>
    </div>
  </form>
</div>
