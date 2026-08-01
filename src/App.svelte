<script>
  import { events, loading, error } from "./lib/store.js";
  import { user, authReady, logout } from "./lib/auth.js";
  import MonthView from "./lib/MonthView.svelte";
  import TimelineView from "./lib/TimelineView.svelte";
  import EventModal from "./lib/EventModal.svelte";
  import Login from "./lib/Login.svelte";

  let view = $state("month"); // "month" | "timeline"
  let modal = $state(null); // null | { event?, defaultDate? }
  let menuOpen = $state(false);

  function openAdd(defaultDate = null) {
    modal = { defaultDate };
  }
  function openEdit(event) {
    modal = { event };
  }
</script>

{#if !$authReady}
  <div class="flex min-h-screen items-center justify-center bg-slate-50 text-slate-400">
    Loading…
  </div>
{:else if !$user}
  <Login />
{:else}
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div class="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">✈️</span>
          <h1 class="text-lg font-bold tracking-tight">OOO Friend</h1>
        </div>

        <div class="ml-auto flex rounded-lg bg-slate-100 p-0.5">
          <button
            onclick={() => (view = "month")}
            class="rounded-md px-3 py-1.5 text-sm font-medium transition {view === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}"
          >Month</button>
          <button
            onclick={() => (view = "timeline")}
            class="rounded-md px-3 py-1.5 text-sm font-medium transition {view === 'timeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}"
          >Timeline</button>
        </div>

        <button
          onclick={() => openAdd()}
          class="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
        >
          <span class="text-base leading-none">+</span>
          <span class="hidden sm:inline">Add trip</span>
        </button>

        <div class="relative">
          <button
            onclick={() => (menuOpen = !menuOpen)}
            class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-300"
            aria-label="Account menu"
            title={$user.email}
          >{($user.email ?? "?").charAt(0).toUpperCase()}</button>
          {#if menuOpen}
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
            <div class="fixed inset-0 z-10" onclick={() => (menuOpen = false)}></div>
            <div class="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
              <p class="truncate px-3 py-2 text-xs text-slate-400">{$user.email}</p>
              <button
                onclick={() => { menuOpen = false; logout(); }}
                class="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >Sign out</button>
            </div>
          {/if}
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-4 py-6">
      {#if $error}
        <div class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Couldn't reach the database: {$error}
        </div>
      {/if}

      {#if $loading}
        <div class="py-24 text-center text-slate-400">Loading trips…</div>
      {:else if view === "month"}
        <MonthView events={$events} onEdit={openEdit} onAdd={openAdd} />
      {:else}
        <TimelineView events={$events} onEdit={openEdit} />
      {/if}

      <p class="mt-8 text-center text-xs text-slate-400">
        Tracking {$events.length} trip{$events.length === 1 ? "" : "s"} · keeping your main calendar clutter-free
      </p>
    </main>

    {#if modal}
      <EventModal
        event={modal.event ?? null}
        defaultDate={modal.defaultDate ?? null}
        onClose={() => (modal = null)}
      />
    {/if}
  </div>
{/if}
