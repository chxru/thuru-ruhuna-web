<script>
  export let data;
</script>

<div class="w-full max-w-sm md:w-1/2 lg:w-1/3 p-2 h-auto">
  <div class="h-full bg-white shadow-lg rounded-lg overflow-hidden">
    <div class="flex flex-no-wrap py-4 px-1 ">
      <img
        src="/defaultuser.webp"
        class="h-8 ml-4 rounded-full hidden md:inline object-cover"
        alt="user's image" />
      <span class="pl-2">
        <h2 class="text-lg text-gray-800 leading-tight">{data.user}</h2>
      </span>
    </div>
    <img
      class="w-full h-56 object-cover object-center"
      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
      alt="avatar" />
    <div class="py-4 px-6">
      <p class="py-2 text-lg text-gray-700">{data.context}</p>
    </div>
  </div>
</div>
