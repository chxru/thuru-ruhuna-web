<script>
  import { onDestroy } from "svelte";
  import { errors } from "../../store";
  import ErrorAlert from "./ErrorAlert.svelte";

  let alerts = [];

  const unsubscribe = errors.subscribe(value => {
    alerts = value;
  });

  onDestroy(unsubscribe)
</script>

<div class="flex flex-col-reverse fixed right-0 bottom-0 z-30 mb-8">
  {#each alerts as alert}
    <ErrorAlert data={alert} />
  {/each}
</div>
