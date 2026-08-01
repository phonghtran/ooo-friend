<script>
  import {
    parse, fmt, addDays, colorFor, formatRange, tripLength, todayStr, MONTHS,
  } from "./dates.js";

  let { events, onEdit } = $props();

  const DAYS = 35;
  // Anchor the window to the start of the current week (Sunday).
  const initial = (() => {
    const t = new Date();
    return addDays(t, -t.getDay());
  })();
  let winStart = $state(initial);
  const today = todayStr();

  const days = $derived(
    Array.from({ length: DAYS }, (_, i) => addDays(winStart, i))
  );
  const winStartStr = $derived(fmt(winStart));
  const winEndStr = $derived(fmt(addDays(winStart, DAYS - 1)));

  function offset(dateStr) {
    return Math.round((parse(dateStr) - winStart) / 86400000);
  }

  // Trips overlapping the window, sorted by start.
  const visible = $derived(
    events
      .filter((e) => e.end >= winStartStr && e.start <= winEndStr)
      .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0))
  );

  // Month labels spanning the header.
  const monthSpans = $derived(
    (() => {
      const spans = [];
      for (const d of days) {
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const last = spans[spans.length - 1];
        if (last && last.key === key) last.span++;
        else spans.push({ key, label: MONTHS[d.getMonth()], span: 1 });
      }
      return spans;
    })()
  );

  const cols = `repeat(${DAYS}, minmax(2rem, 1fr))`;
</script>

<div class="flex items-center justify-between px-1 pb-4">
  <h2 class="text-xl font-semibold text-slate-900">Timeline</h2>
  <div class="flex items-center gap-1">
    <button
      onclick={() => (winStart = addDays(winStart, -7))}
      aria-label="Earlier"
      class="rounded-lg px-2.5 py-1.5 text-slate-500 hover:bg-slate-100"
    >‹</button>
    <button
      onclick={() => (winStart = initial)}
      class="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
    >Today</button>
    <button
      onclick={() => (winStart = addDays(winStart, 7))}
      aria-label="Later"
      class="rounded-lg px-2.5 py-1.5 text-slate-500 hover:bg-slate-100"
    >›</button>
  </div>
</div>

{#if visible.length === 0}
  <div class="rounded-lg border border-dashed border-slate-300 py-16 text-center text-slate-400">
    No trips in this stretch. Use ‹ › to look around, or add one.
  </div>
{:else}
  <div class="overflow-x-auto rounded-lg border border-slate-200">
    <div class="min-w-[720px]">
      <!-- Month header -->
      <div class="grid border-b border-slate-100 bg-slate-50" style="grid-template-columns: {cols};">
        {#each monthSpans as m}
          <div class="border-r border-slate-100 px-2 py-1 text-xs font-semibold text-slate-500" style="grid-column: span {m.span};">
            {m.label}
          </div>
        {/each}
      </div>
      <!-- Day header -->
      <div class="grid border-b border-slate-200 bg-slate-50" style="grid-template-columns: {cols};">
        {#each days as d}
          {@const isToday = fmt(d) === today}
          <div class="py-1 text-center text-[11px] {isToday ? 'font-bold text-sky-600' : 'text-slate-400'}">
            {d.getDate()}
          </div>
        {/each}
      </div>

      <!-- Trip rows -->
      {#each visible as e (e.id)}
        {@const c = colorFor(e.person)}
        {@const s = Math.max(0, offset(e.start))}
        {@const en = Math.min(DAYS - 1, offset(e.end))}
        {@const clipL = offset(e.start) < 0}
        {@const clipR = offset(e.end) > DAYS - 1}
        <div class="relative grid items-center border-b border-slate-50 last:border-0" style="grid-template-columns: {cols}; height: 3rem;">
          <button
            onclick={() => onEdit(e)}
            class="group relative z-10 mx-0.5 flex h-8 items-center gap-2 overflow-hidden px-2.5 text-left text-white shadow-sm transition hover:brightness-105 {c.bg} {clipL ? 'rounded-l-none' : 'rounded-l-full'} {clipR ? 'rounded-r-none' : 'rounded-r-full'}"
            style="grid-column: {s + 1} / span {en - s + 1};"
          >
            <span class="truncate text-sm font-semibold">{e.person}</span>
            <span class="hidden shrink-0 text-xs text-white/80 sm:inline">{tripLength(e.start, e.end)}d</span>
          </button>
        </div>
      {/each}
    </div>
  </div>

  <!-- Legend list -->
  <div class="mt-5 space-y-1.5">
    {#each visible as e (e.id)}
      {@const c = colorFor(e.person)}
      <button
        onclick={() => onEdit(e)}
        class="flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50"
      >
        <span class="h-2.5 w-2.5 shrink-0 rounded-full {c.dot}"></span>
        <span class="font-medium text-slate-800">{e.person}</span>
        <span class="text-sm text-slate-400">{formatRange(e.start, e.end)}</span>
      </button>
    {/each}
  </div>
{/if}
