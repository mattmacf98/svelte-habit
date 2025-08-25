<script lang="ts">
    //TODO these will come in from API
    interface Habit {
        name: string;
        description: string;
        completed: boolean;
    }

    const initialHabits: Habit[] = [
        { name: "Read", description: "Read for 10 minutes", completed: false },
        { name: "Exercise", description: "Exercise for 30 minutes", completed: false },
        { name: "Meditate", description: "Meditate for 10 minutes", completed: false },
    ];


    let notification = $state<string>();
    let habits = $state<Habit[]>([]);
    let completedPercentage = $derived(habits.filter(habit => habit.completed).length / habits.length * 100);

    $effect.pre(() => {
        habits = initialHabits;
    });

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
            clearTimeout(timeout);
        }
    });
</script>

<div class="habit-container">
    <h1 class="title">Habit List</h1>
    <p class="completed-percentage">Completed: {completedPercentage.toFixed(2)}%</p>
    <ul class="habit-list">
        {#each habits as habit}
            <li class="habit-item">
                <div class="habit-content">
                    <h3 class="habit-name">{habit.name}</h3>
                    <p class="habit-description">{habit.description}</p>
                </div>
                <div class="habit-status">
                    <input 
                        type="checkbox" 
                        bind:checked={habit.completed}
                        class="habit-checkbox"
                    />
                </div>
            </li>
        {/each}
    </ul>
    {#if notification}
        <div class="notification">{notification}</div>
    {/if}
</div>

<style>
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

    .habit-description {
        font-size: 0.875rem;
        color: #6b7280;
        margin: 0;
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