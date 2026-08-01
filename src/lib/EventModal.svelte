<script>
  import { addEvent, updateEvent, deleteEvent } from "./store.js";
  import { todayStr } from "./dates.js";

  let { event = null, defaultDate = null, onClose } = $props();

  const editing = $derived(!!event);

  let person = $state(event?.person ?? "");
  let start = $state(event?.start ?? defaultDate ?? todayStr());
  let end = $state(event?.end ?? defaultDate ?? todayStr());
  let saving = $state(false);
  let err = $state("");

  // Keep end >= start automatically.
  $effect(() => {
    if (end < start) end = start;
  });

  async function save() {
    if (!person.trim()) {
      err = "Who's out of town?";
      return;
    }
    saving = true;
    err = "";
    const payload = { person: person.trim(), start, end };
    try {
      if (editing) await updateEvent(event.id, payload);
      else await addEvent(payload);
      onClose();
    } catch (e) {
      err = e.message;
      saving = false;
    }
  }

  async function remove() {
    if (!confirm(`Delete ${event.person}'s trip?`)) return;
    saving = true;
    try {
      await deleteEvent(event.id);
      onClose();
    } catch (e) {
      err = e.message;
      saving = false;
    }
  }

  function onKey(e) {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
  }
</script>

<svelte:window onkeydown={onKey} />

<div
  class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
  onclick={onClose}
  role="presentation"
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
    onclick={(e) => e.stopPropagation()}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <h2 class="text-lg font-semibold text-slate-900">
      {editing ? "Edit trip" : "Add a trip"}
    </h2>

    <div class="mt-5 space-y-4">
      <div>
        <label for="person" class="block text-sm font-medium text-slate-700">Friend</label>
        <input
          id="person"
          bind:value={person}
          placeholder="e.g. Alex"
          autocomplete="off"
          class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="start" class="block text-sm font-medium text-slate-700">Leaves</label>
          <input
            id="start"
            type="date"
            bind:value={start}
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label for="end" class="block text-sm font-medium text-slate-700">Back</label>
          <input
            id="end"
            type="date"
            min={start}
            bind:value={end}
            class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      {#if err}
        <p class="text-sm text-rose-600">{err}</p>
      {/if}
    </div>

    <div class="mt-6 flex items-center gap-3">
      {#if editing}
        <button
          onclick={remove}
          disabled={saving}
          class="mr-auto rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50"
        >
          Delete
        </button>
      {/if}
      <button
        onclick={onClose}
        disabled={saving}
        class="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 {editing ? '' : 'ml-auto'}"
      >
        Cancel
      </button>
      <button
        onclick={save}
        disabled={saving}
        class="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : editing ? "Save" : "Add trip"}
      </button>
    </div>
  </div>
</div>
