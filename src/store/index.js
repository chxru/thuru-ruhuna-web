import { writable, derived } from "svelte/store";

export const postsArr = writable([]);
export const userDetails = writable({});

export const username = derived(
  userDetails,
  $userDetails => ($userDetails.fname) ? `${$userDetails.fname} ${$userDetails.lname}` : 'Sign In'
);

export const isLoggedIn = derived(
  userDetails,
  $userDetails => ($userDetails.fname) ? true : false
)
