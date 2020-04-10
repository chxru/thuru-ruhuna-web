import { writable, derived } from "svelte/store";

export const postsArr = writable([]);
export const userDetails = writable({});
export const errors = writable([]);

export const isLoggedIn = derived(
  userDetails,
  $userDetails => ($userDetails.name) ? true : false
)
