<script>
  import NewPostButton from "./NewPost/NewPostButton.svelte";
  import NewPostCustomBtn from "./NewPost/NewPostCustomBtn.svelte";
  import NewPostInput from "./NewPost/NewPostInput.svelte";
  import { postsArr, errors } from "../../store/";

  let showInput = false;
  let progress;
  let hasImage = false;
  let imageFile;

  const handlePostImage = file => {
    file = file.detail.data;
    hasImage = false;
    if (file && file.type.startsWith("image/")) {
      imageFile = file;
      hasImage = true;
    }
  };

  const toggleShowInput = () => {
    showInput = !showInput;
  };

  const customBtnClicked = event => {
    switch (event.detail.btn) {
      case "Publish":
        if (!document.getElementById("newPostTextArea").value) return; // return if textbox is empty
        newPost(document.getElementById("newPostTextArea").value);
        break;
    }
  };

  const newPost = data => {
    const db = firebase.firestore();
    const auth = firebase.auth();

    progress = 1;

    let newPostRef = db.collection("posts").doc();
    const obj = {
      context: data,
      user: auth.currentUser.uid,
      postID: newPostRef.id,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      haveImg: hasImage
    };

    newPostRef
      .set(obj)
      .then(() => {
        if (hasImage) {
          uploadImage(newPostRef.id);
        } else {
          progress = 100;
          postsArr.set([]);
          progress = 0;
        }
      })
      .catch(e => {
        $errors = [
          ...$errors,
          { title: "Error in creating post", msg: e.message }
        ];
      });
  };

  const uploadImage = id => {
    const storageRef = firebase.storage().ref();
    const ref = storageRef.child(
      `postImages/${id}.${imageFile.type.split("/").pop()}`
    );
    let uploadTask = ref.put(imageFile);
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      function(snapshot) {
        progress =
          Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 100) ||
          1;
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log("Upload is running");
            break;
        }
      },
      error => {
        switch (error.code) {
          case "storage/unauthorized":
            $errors = [
              ...$errors,
              {
                title: "Error in uploading image",
                msg: "User doesn't have permission to access the object"
              }
            ];
            break;
          case "storage/canceled":
            $errors = [
              ...$errors,
              {
                title: "Error in uploading image",
                msg: "User canceled the upload"
              }
            ];
            break;
          case "storage/unknown":
            $errors = [
              ...$errors,
              {
                title: "Error in uploading image",
                msg: "Unknown error occurred"
              }
            ];
            break;
        }
      },
      () => {
        progress = 0;
        postsArr.set([]);
      }
    );
  };
</script>

{#if showInput}
  <span
    class="fixed text-right w-4/5 md:w-1/2 lg:w-1/3 z-20 right-0 bottom-0 mr-8
    my-8 pb-16 border-solid border-4 border-gray-600 bg-gray">
    <NewPostInput on:fileInputChanged={handlePostImage} />
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
  </span>
{/if}

<span class="fixed text-right z-20 right-0 bottom-0 p-10">
  {#if showInput}
    <NewPostCustomBtn
      btnname={'Publish'}
      on:oncustombtnclick={customBtnClicked} />
  {/if}
  <NewPostButton on:newpostclicked={toggleShowInput} />
</span>
