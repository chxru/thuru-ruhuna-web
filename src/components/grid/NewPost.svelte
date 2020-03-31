<script>
  import NewPostButton from "./NewPost/NewPostButton.svelte";
  import NewPostCustomBtn from "./NewPost/NewPostCustomBtn.svelte";
  import NewPostInput from "./NewPost/NewPostInput.svelte";

  let showInput = false;

  function toggleShowInput() {
    showInput = !showInput;
  }

  function customBtnClicked(event) {
    switch (event.detail.btn) {
      case "Publish":
        newPost(document.getElementById("newPostTextArea").value);
        break;
    }
  }

  function newPost(data) {
    const db = firebase.firestore();
    const auth = firebase.auth();

    let newPostRef = db.collection("posts").doc();

    const obj = {
      context: data,
      user: auth.currentUser.uid,
      postID: newPostRef.id,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    newPostRef
      .set(obj)
      .then(() => {
        console.log("new post created");
      })
      .catch(e => {
        console.error(e);
      });
  }
</script>

{#if showInput}
  <span
    class="fixed text-right w-4/5 md:w-1/2 lg:w-1/3 z-20 right-0 bottom-0 mr-8
    my-8 pb-16 border-solid border-4 border-gray-600">
    <NewPostInput />
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
