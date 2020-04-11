<script>
  import { errors } from "../../store/";

  export let data;

  let imgURL;
  $: user = {
    name: "loading",
    photoURL: "/defaultuser.webp"
  };

  const db = firebase.firestore();
  db.collection("users")
    .doc(data.user)
    .get()
    .then(doc => {
      if (doc.exists) {
        let temp = doc.data();
        user.name = temp.name;
        user.photoURL = temp.photoURL;
      }
    })
    .catch(e => {
      $errors = [
        ...$errors,
        { title: "Error in creating post", msg: e.message }
      ];
    });

  if (data.haveImg) {
    var storage = firebase.storage();
    var pathReference = storage.ref(`postImages/opt/opt_${data.postID}.webp`);

    pathReference
      .getDownloadURL()
      .then(url => {
        imgURL = url;
      })
      .catch(e => {
        $errors = [
          ...$errors,
          { title: "Error in creating post", msg: e.message }
        ];
      });
  }
</script>

<div class="w-full max-w-sm md:w-1/2 lg:w-1/3 p-2 h-auto">
  <div class="h-full bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="flex flex-no-wrap py-4 px-1 ">
      <img
        src={user.photoURL}
        class="h-8 ml-4 rounded-full hidden md:inline object-cover"
        alt="user's image" />
      <span class="pl-2">
        <h2 class="text-lg text-gray-800 leading-tight">{user.name}</h2>
      </span>
    </div>
    {#if data.haveImg}
      <img
        class="w-full h-56 object-cover object-center"
        src={imgURL}
        alt={data.postID} />
    {/if}
    <div class="py-4 px-6">
      <p class="py-2 text-lg text-gray-700">{data.context}</p>
    </div>
  </div>
</div>
