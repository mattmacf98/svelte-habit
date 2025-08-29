<script module>
	let habits = new Set<Habit>();

	export function completeAll() {
        for (const habit of habits) {
            if (!habit.completedToday) {
                habit.toggleCompletion();
            }
        }
	}
</script>

<script lang="ts">
	import type { Snippet } from "svelte";
    import { Habit } from "$lib/utils/habit.svelte";
    let isFocused = $state(false);

    interface Props {
        header?: Snippet,
        onHover?: () => void,
        onLeave?: () => void,
        name: string,
        description: string
    };

    let {header, name, description, onHover, onLeave}: Props = $props();
    const habit = new Habit(name, description);
    habits.add(habit);

    export function getHabit() {
        return habit;
    }

    export function handleFocus() {
        isFocused = true;
    }

    export function handleBlur() {
        isFocused = false;
    }
</script>

<div class={`habit-item ${isFocused ? 'focused' : ''}`} role="presentation" onmouseenter={() => onHover?.()} onmouseleave={() => onLeave?.()}>
    {#if header}
        {@render header()}
    {:else}
        <div class="habit-content">
            <h3 class="habit-name">{habit.name}</h3>
        </div>
    {/if}
    <div class="habit-streak">
        <span class="streak-text">Streak: {habit.streak}</span>
    </div>
    <div class="habit-difficulty">
        <span class={`difficulty-badge ${habit.difficultyString.toLowerCase()}`} onclick={() => habit.cycleDifficulty()}>
            {habit.difficultyString}
        </span>
    </div>
    <div class="habit-status">
        <input 
            type="checkbox" 
            checked={habit.completedToday}
            onchange={() => habit.toggleCompletion()}
            class="habit-checkbox"
        />
    </div>
</div>

<style>
    .habit-streak {
        margin-right: 1rem;
    }

    .streak-text {
        font-size: 0.875rem;
        color: #6b7280;
    }

    .streak-text:hover {
        color: #374151;
        cursor: pointer;
    }

    .difficulty-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #fff;
    }

    .difficulty-badge.easy {
        background-color: #10b981;
    }

    .difficulty-badge.medium {
        background-color: #f59e0b;
    }

    .difficulty-badge.hard {
        background-color: #ef4444;
    }

    .habit-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.25rem;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .habit-item:hover {
        background: #f3f4f6;
        border-color: #d1d5db;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
    }

    .habit-content {
        flex: 1;
    }

    .habit-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: #374151;
        margin: 0 0 0.25rem 0;
    }

    .habit-status {
        margin-left: 1rem;
    }

    .habit-checkbox {
        width: 1.25rem;
        height: 1.25rem;
        accent-color: #3b82f6;
        cursor: pointer;
    }

    .habit-checkbox:focus {
        outline: 2px solid #3b82f6;
    }

    .habit-item.focused {
        outline: 2px solid #3b82f6;
    }
</style>