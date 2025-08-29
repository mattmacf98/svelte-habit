<script>
	import HabitList from "$lib/components/habit-list.svelte";
	import HabitsProvider from "$lib/contexts/habits-provider.svelte";
</script>

<HabitsProvider>
	<HabitList />
</HabitsProvider>
