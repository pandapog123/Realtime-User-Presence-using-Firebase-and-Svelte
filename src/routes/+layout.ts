import * as auth from "./../firebase/auth";
import * as firestore from "./../firebase/firestore";
import * as database from "./../firebase/database";
import type { LayoutLoad } from "./$types";

export const ssr = false;

export const load = (async () => {
  return {
    firestore,
    auth,
    database,
  };
}) satisfies LayoutLoad;
