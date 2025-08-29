<script lang="ts">
	import type { Snippet } from "svelte";
    import { createHabitsContext } from "./habits-context.svelte";

    interface Props {
        children: Snippet;
    }

    const { children }: Props = $props();

    createHabitsContext();
</script>

{@render children()}
