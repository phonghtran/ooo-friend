<script>
  import {
    monthGrid, fmt, parse, contains, addMonths, colorFor,
    MONTHS, WEEKDAYS, todayStr,
  } from "./dates.js";

  let { events, onEdit, onAdd } = $props();

  let cursor = $state(new Date());
  const today = todayStr();

  const cells = $derived(monthGrid(cursor));
  const monthIdx = $derived(cursor.getMonth());

  function eventsOn(dayStr) {
    return events.filter((e) => contains(dayStr, e.start, e.end));
  }
</script>

<div class="flex items-center justify-between px-1 pb-4">
  <h2 class="text-xl font-semibold text-slate-900">
    {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
  </h2>
  <div class="flex items-center gap-1">
    <button
      onclick={() => (cursor = addMonths(cursor, -1))}
      aria-label="Previous month"
      class="rounded-lg px-2.5 py-1.5 text-slate-500 hover:bg-slate-100"
    >‹</button>
    <button
      onclick={() => (cursor = new Date())}
      class="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
    >Today</button>
    <button
      onclick={() => (cursor = addMonths(cursor, 1))}
      aria-label="Next month"
      class="rounded-lg px-2.5 py-1.5 text-slate-500 hover:bg-slate-100"
    >›</button>
  </div>
</div>

<div class="grid grid-cols-7 border-b border-slate-200 pb-2">
  {#each WEEKDAYS as w}
    <div class="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">{w}</div>
  {/each}
</div>

<div class="grid grid-cols-7 grid-rows-6 gap-px overflow-hidden rounded-lg bg-slate-200">
  {#each cells as day}
    {@const dayStr = fmt(day)}
    {@const inMonth = day.getMonth() === monthIdx}
    {@const isToday = dayStr === today}
    {@const list = eventsOn(dayStr)}
    <button
      onclick={() => onAdd(dayStr)}
      class="min-h-[92px] bg-white p-1.5 text-left align-top transition-colors hover:bg-sky-50/60 {inMonth ? '' : 'bg-slate-50/70'}"
    >
      <div class="flex justify-end">
        <span
          class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium {isToday ? 'bg-sky-600 text-white' : inMonth ? 'text-slate-600' : 'text-slate-300'}"
        >{day.getDate()}</span>
      </div>
      <div class="mt-0.5 space-y-0.5">
        {#each list.slice(0, 3) as e (e.id)}
          {@const c = colorFor(e.person)}
          <div
            role="button"
            tabindex="0"
            onclick={(ev) => { ev.stopPropagation(); onEdit(e); }}
            onkeydown={(ev) => { if (ev.key === "Enter") { ev.stopPropagation(); onEdit(e); } }}
            class="truncate rounded px-1.5 py-0.5 text-xs font-medium {c.soft} hover:brightness-95"
          >{e.person}</div>
        {/each}
        {#if list.length > 3}
          <div class="px-1.5 text-xs font-medium text-slate-400">+{list.length - 3} more</div>
        {/if}
      </div>
    </button>
  {/each}
</div>
