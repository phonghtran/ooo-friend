<script>
  import { signIn, signUp, authErrorMessage } from "./auth.js";

  let mode = $state("signin"); // "signin" | "signup"
  let email = $state("");
  let password = $state("");
  let busy = $state(false);
  let err = $state("");

  const isSignup = $derived(mode === "signup");

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    busy = true;
    err = "";
    try {
      if (isSignup) await signUp(email.trim(), password);
      else await signIn(email.trim(), password);
      // On success, onAuthStateChanged swaps this screen out for the app.
    } catch (e2) {
      err = authErrorMessage(e2);
      busy = false;
    }
  }

  function toggle() {
    mode = isSignup ? "signin" : "signup";
    err = "";
  }
</script>

<div class="flex min-h-screen items-center justify-center bg-slate-50 px-4">
  <div class="w-full max-w-sm">
    <div class="mb-6 flex flex-col items-center gap-2 text-center">
      <span class="text-3xl">✈️</span>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">OOO Friend</h1>
      <p class="text-sm text-slate-500">Track when your friends are out of town.</p>
    </div>

    <form onsubmit={submit} class="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 class="text-lg font-semibold text-slate-900">
        {isSignup ? "Create your account" : "Welcome back"}
      </h2>

      <div>
        <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          autocomplete="email"
          required
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          autocomplete={isSignup ? "new-password" : "current-password"}
          required
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      {#if err}
        <p class="text-sm text-rose-600">{err}</p>
      {/if}

      <button
        type="submit"
        disabled={busy}
        class="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      >
        {busy ? "…" : isSignup ? "Create account" : "Sign in"}
      </button>

      <p class="text-center text-sm text-slate-500">
        {isSignup ? "Already have an account?" : "No account yet?"}
        <button type="button" onclick={toggle} class="font-medium text-sky-600 hover:text-sky-700">
          {isSignup ? "Sign in" : "Create one"}
        </button>
      </p>
    </form>
  </div>
</div>
