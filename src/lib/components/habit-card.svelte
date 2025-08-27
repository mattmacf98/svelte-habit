<script lang="ts">
	import type { Snippet } from "svelte";

    let checkbox = $state<HTMLInputElement>();
    let isFocused = $state(false);

    interface Props {
        header?: Snippet,
        onHover?: () => void,
        onLeave?: () => void,
        name: string,
        completed: boolean
    };

    let {header, name, completed = $bindable(), onHover, onLeave}: Props = $props();

    export function getCheckbox() {
        return checkbox;
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
            <h3 class="habit-name">{name}</h3>
        </div>
    {/if}
    <div class="habit-status">
        <input 
            type="checkbox" 
            bind:checked={completed}
            class="habit-checkbox"
            bind:this={checkbox}
        />
    </div>
</div>

<style>
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