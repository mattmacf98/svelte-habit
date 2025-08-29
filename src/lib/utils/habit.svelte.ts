import { SvelteDate } from "svelte/reactivity";

export enum Difficulty {
    EASY,
    MEDIUM,
    HARD
}

export class Habit {
    name = $state<string>();
    description = $state<string>();
    difficulty = $state<Difficulty>();
    completedToday = $state<boolean>(false);
    datesCompleted = $state<SvelteDate[]>();
    streak = $derived.by(() => {
        if (!this.datesCompleted || this.datesCompleted.length === 0) {
            return 0;
        }
        
        let streak = 0;
        const today = new SvelteDate();
        
        // Check if today is completed
        const todayCompleted = this.datesCompleted.some(date => 
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
        
        // Start from today or yesterday depending on if today is completed
        const currentDate = new SvelteDate();
        if (!todayCompleted) {
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        // Count consecutive days backwards from the starting date
        while (true) {
            const dateCompleted = this.datesCompleted.some(date => 
                date.getFullYear() === currentDate.getFullYear() &&
                date.getMonth() === currentDate.getMonth() &&
                date.getDate() === currentDate.getDate()
            );
            
            if (dateCompleted) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    })

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;

        
        const savedHabit = localStorage.getItem(`svelte-habit-${name}`);
        if (savedHabit) {
            const jsonHabit = JSON.parse(savedHabit);
            const dates: SvelteDate[] = [];
            for (const jsonDate of jsonHabit.completedDates) {
                dates.push(new SvelteDate(jsonDate))
            }
            const today = new SvelteDate();
            this.completedToday = dates.some(date => 
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
            );
            this.datesCompleted = dates;
            this.difficulty = jsonHabit.difficulty ?? Difficulty.EASY;
        } else {
            this.datesCompleted = [];
            this.difficulty = Difficulty.EASY;
        }

        $effect(() => {
            if (this.datesCompleted) {
                localStorage.setItem(`svelte-habit-${this.name}`, JSON.stringify({completedDates: this.datesCompleted, difficulty: this.difficulty}));
            }
        })
    }

    get completed() {
        const today = new SvelteDate();
        return this.datesCompleted?.some(date => 
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        ) ?? false;
    }

    toggleCompletion() {
        if (this.completedToday) {
            this.datesCompleted?.pop();
            this.completedToday = false;
        } else {
            const today = new SvelteDate();
            this.datesCompleted?.push(today);
            this.completedToday = true;
        }
    }

    get difficultyString() {
        return this.difficulty === Difficulty.EASY ? 'Easy' : this.difficulty === Difficulty.MEDIUM ? 'Medium' : 'Hard';
    }

    cycleDifficulty() {
        this.difficulty = this.difficulty === Difficulty.EASY ? Difficulty.MEDIUM : this.difficulty === Difficulty.MEDIUM ? Difficulty.HARD : Difficulty.EASY;
    }
}