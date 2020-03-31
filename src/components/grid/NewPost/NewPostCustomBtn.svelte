<script>
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

export let btnname

function btnClick() {
  dispatch('oncustombtnclick', {btn: btnname})
}
</script>

<button on:click|preventDefault={btnClick}
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4
  rounded-full">
  {btnname}
</button>
