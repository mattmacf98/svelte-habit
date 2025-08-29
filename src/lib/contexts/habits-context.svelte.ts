import { getContext, setContext } from "svelte";
import type HabitCard from "$lib/components/habit-card.svelte";

export interface HabitItem {
    name: string;
    description: string;
    card: HabitCard | undefined;
}

export class HabitsContext {
    habits = $state<HabitItem[]>([]);
    loading = $state<boolean>(false);
    error = $state<string>();

    constructor() {
        $effect(() => {
            this.#fetchHabits();
        });
    }

    async #fetchHabits() {
        try {
            this.loading = true;
            this.error = undefined;
            const response = await fetch('http://localhost:3000/habits');
            const data = await response.json();
            console.log('habitsContext constructor', data);
            this.habits = data;
            this.loading = false;
        } catch (error: any) {
            this.error = error.message;
            this.loading = false;
        }
    }

    async addHabit(habit: HabitItem) {
        try {
            this.loading = true;
            this.error = undefined;
            const res = await fetch('http://localhost:3000/habits', {
                method: 'POST',
                body: JSON.stringify(habit)
            });
            if (res.ok) {
                const data = await res.json();
                this.habits.push(data);
            } else {
                throw new Error('Failed to add habit');
            }
            this.loading = false;
        } catch (error: any) {
            this.error = error.message;
            this.loading = false;
        }
    }

    async deleteHabit(name: string) {
        try {
            this.loading = true;
            this.error = undefined;
            const res = await fetch(`http://localhost:3000/habits/${name}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                this.habits = this.habits.filter(habit => habit.name !== name);
            } else {
                throw new Error('Failed to delete habit');
            }
            this.loading = false;
        }
        catch (error: any) {
            this.error = error.message;
            this.loading = false;
        }
    }
}

const key = Symbol('habitsContext');

export function getHabitsContext(): HabitsContext {
    return getContext(key);
}

export function createHabitsContext() {
    const habitsContext = new HabitsContext();
    setContext(key, habitsContext);
}
