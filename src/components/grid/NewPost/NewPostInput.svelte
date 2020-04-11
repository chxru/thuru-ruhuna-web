<script>
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  onMount(() => {
    document.getElementById("newPostImageInput").onchange = evt => {
      let file = evt.target.files[0];
      dispatch("fileInputChanged", { data: file });
    };
  });
</script>

<div class="w-full h-40">
  <textarea id="newPostTextArea" class="w-full h-32" />
  <input type="file" class="w-full" name="Image" id="newPostImageInput" />
</div>
