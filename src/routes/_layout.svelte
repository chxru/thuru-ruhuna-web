<script>
  import { username } from "../store";

  import Topbar from "../components/topbar/Topbar.svelte";
  import Sidebar from "../components/sidebar/Sidebar.svelte";
</script>

<div class="h-screen bg-gray">
  <Topbar name={$username} />
  <Sidebar />
  <div class="h-screen pt-20">
    <slot />
  </div>
</div>
