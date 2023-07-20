<script lang="ts">
  import { auth } from "../firebase/auth";
  import type { PageData } from "./$types";

  export let data: PageData;

  let { userStore } = data.auth;
  let { usersArrayStore } = data.firestore;

  let loggingIn = false;

  async function handleLogin() {
    if ($userStore) {
      return;
    }

    loggingIn = true;

    await data.auth.signInWithGoogle();

    loggingIn = false;
  }
</script>

{#if $userStore}
  <nav>
    <div class="title">SvelteKit User Presense</div>
    <div class="greeting">Hello, {$userStore.displayName}</div>

    <button class="signout" on:click={data.auth.signOutAsync}>
      Sign out
    </button>
  </nav>

  <main class="page">
    {#each $usersArrayStore as user}
      <div class="user-tile">
        <div class="display-info">
          {#if user.photoURL}
            <img src={user.photoURL} alt={user.name} />
          {/if}

          <p>
            {user.name}
          </p>
        </div>

        <div class="presence {user.connected ? 'online' : 'offline'}">
          {user.connected ? "online" : "offline"}
        </div>
      </div>

      <hr />
    {/each}
  </main>
{:else}
  <main class="login">
    <button disabled={loggingIn} on:click={handleLogin}>Log in</button>
  </main>
{/if}

<style>
  main.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  nav {
    display: flex;
    padding: 8px;
    justify-content: space-between;
    align-items: center;
    box-shadow: black 0 0 4px;
    height: 40px;
    position: sticky;
    top: 0;
    background: white;
  }

  button {
    background-color: rgb(20, 149, 255);
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    padding: 8px;
    transition: all 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
  }

  button:active {
    background-color: rgb(0, 131, 238);
  }

  button:disabled {
    background-color: grey;
  }

  hr {
    margin: 0;
  }

  .user-tile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
  }

  .display-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .display-info img {
    height: 40px;
    border-radius: 100px;
  }

  .presence {
    font-size: 24px;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .presence::before {
    content: "";
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 100px;
  }

  .presence.online {
    color: greenyellow;
  }

  .presence.online::before {
    background-color: greenyellow;
  }

  .presence.offline {
    color: red;
  }

  .presence.offline::before {
    background-color: red;
  }
</style>
