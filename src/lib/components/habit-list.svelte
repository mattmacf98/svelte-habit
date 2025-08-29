<script lang="ts">
	import HabitCard, {completeAll} from "./habit-card.svelte";
    import { getHabitsContext } from "$lib/contexts/habits-context.svelte";

    const habitsContext = getHabitsContext();

    let notification = $state<string>();
    let focusedHabit = $state<HabitCard>();
    let hoveredHabit = $state<HabitCard>();
    let hoveredHabitTimeout = $state.raw<number>();
    let completedPercentage = $derived(habitsContext.habits.filter(habit => habit.card?.getHabit().completedToday).length / habitsContext.habits.length * 100);

    $effect(() => {
        const timeNow = new Date();
        // TODO: we can send this into some backend servcie to track and display later
        console.log(`User completed ${completedPercentage.toFixed(2)}% of their habits at ${timeNow.toLocaleTimeString()}`);
    })

    $effect(() => {
        if (completedPercentage > 80) {
            notification = "You're doing great!";
        } else if (completedPercentage > 50) {
            notification = "Keep it up!";
        }

        const timeout = setTimeout(() => {
            notification = undefined;
        }, 3000);

        return () => {
            notification = undefined;
            clearTimeout(timeout);
        }
    });

    $effect(() => {
        for (const habit of habitsContext.habits) {
            habit.card?.handleBlur();
        }

        if (focusedHabit) {
            focusedHabit.handleFocus();
        }
    });

    function debounceUpdateHoveredHabit(habit: HabitCard | undefined) {
        if (hoveredHabitTimeout) {
            clearTimeout(hoveredHabitTimeout);
        }

        hoveredHabitTimeout = setTimeout(() => {
            hoveredHabit = habit;
        }, 100) as unknown as number;
    }

    function focusRandomHabit() {
        const uncompletedHabits = habitsContext.habits.filter(habit => !habit.card?.getHabit().completedToday);
        const randomIndex = Math.floor(Math.random() * uncompletedHabits.length);
        const habit = uncompletedHabits[randomIndex];
        if (habit) {
            focusedHabit = habit.card;
        }
    }

    function completeHabit() {
        if (focusedHabit) {
            focusedHabit.getHabit().toggleCompletion();
            focusedHabit = undefined;
        }
    }
</script>

{#snippet CompletedItemHeader()}
    <div class="completed-header">
        <div class="completed-badge">
            <svg class="completed-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="completed-text">Completed</span>
        </div>
    </div>
{/snippet}

<div class="habit-container">
    <div class="header-container">
        <h1 class="title">Habit List</h1>
        {#if !focusedHabit}
            <div class="button-group">
                <button class="focus-random-habit-button" onclick={focusRandomHabit}>Focus Random Habit</button>
                <button class="complete-all-button" onclick={completeAll}>Complete All</button>
            </div>
        {:else}
            <div class="button-group">
                <button class="unfocus-habit-button" onclick={() => focusedHabit = undefined}>Unfocus Habit</button>
                <button class="complete-habit-button" onclick={completeHabit}>Complete Habit</button>
            </div>
        {/if}
    </div>

    {#if hoveredHabit}
        <div class="hovered-habit">
            <h2 class="hovered-habit-title">{hoveredHabit.getHabit().name}</h2>
            <p class="hovered-habit-description">{hoveredHabit.getHabit().description}</p>
        </div>
    {:else}
        <div class="hovered-habit">
            <h2 class="hovered-habit-title">Hover over a habit to see more details</h2>
        </div>
    {/if}

    <p class="completed-percentage">Completed: {completedPercentage.toFixed(2)}%</p>

    {#if habitsContext.loading}
        <div class="loading">Loading...</div>
    {:else if habitsContext.error}
        {#if habitsContext.error}
            <div class="error">{habitsContext.error}</div>
        {/if}
    {:else}
        <ul class="habit-list">
            {#each habitsContext.habits as habit}
                <HabitCard bind:this={habit.card} {...habit} header={habit.card?.getHabit().completedToday ? CompletedItemHeader : undefined}
                    onHover={() => debounceUpdateHoveredHabit(habit.card)}
                    onLeave={() => debounceUpdateHoveredHabit(undefined)}
                />
            {/each}
        </ul>
    {/if}
    
    {#if notification}
        <div class="notification">{notification}</div>
    {/if}
</div>

<style>
    .button-group {
        display: flex;
        gap: 1rem;
    }

    .complete-all-button {
        background-color: #10b981;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 12px;
    }

    .complete-all-button:hover {
        background-color: #0e946f;
    }

    .complete-all-button:active {
        background-color: #07654b;
    }

    .unfocus-habit-button {
        background-color: #e6551b;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 12px;
    }

    .complete-habit-button {
        background-color: #10b981;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 12px;
    }

    .header-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
    }
    .focus-random-habit-button {
        background-color: #10b981;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 12px;
    }
    .focus-random-habit-button:hover {
        background-color: #0e946f;
    }
    .focus-random-habit-button:active {
        background-color: #07654b;
    }

    .hovered-habit {
        background-color: #e0f2fe;
        border: 1px solid #0288d1;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        color: #01579b;
        font-size: 0.875rem;
        font-weight: 500;
        height: 100px;
        text-align: center;
    }

    .hovered-habit-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #01579b;
    }

    .hovered-habit-description {
        font-size: 0.875rem;
        font-weight: 400;
        color: #01579b;
    }

    .completed-header {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
    }
    
    .completed-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #10b981;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 12px;
        font-weight: 600;
    }

    .completed-icon {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 0.5rem;
    }

    .completed-text {
        font-size: 1.25rem;
    }

    .habit-container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .title {
        font-size: 2rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .completed-percentage {
        font-size: 1.25rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .habit-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .notification {
        position: fixed;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
    }
</style>