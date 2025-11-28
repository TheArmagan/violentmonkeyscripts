<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Variant =
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  type Size = "default" | "sm" | "lg" | "icon";

  interface Props extends HTMLButtonAttributes {
    variant?: Variant;
    size?: Size;
    children?: Snippet;
  }

  let {
    variant = "default",
    size = "default",
    class: className = "",
    children,
    ...restProps
  }: Props = $props();
</script>

<button class="btn btn-{variant} btn-{size} {className}" {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.15s ease;
    cursor: pointer;
    border: none;
  }

  .btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring, #3b82f6);
  }

  .btn:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  /* Variants */
  .btn-default {
    background-color: var(--primary);
    color: var(--primary-foreground);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  .btn-default:hover {
    background-color: var(--primary-hover);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
  .btn-default:active {
    transform: scale(0.98);
  }

  .btn-destructive {
    background-color: var(--destructive);
    color: var(--destructive-foreground);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  .btn-destructive:hover {
    background-color: var(--destructive-hover);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
  .btn-destructive:active {
    transform: scale(0.98);
  }

  .btn-outline {
    border: 1px solid var(--input);
    background-color: var(--background);
    color: var(--foreground);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  .btn-outline:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
    border-color: var(--primary);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  .btn-outline:active {
    transform: scale(0.98);
  }

  .btn-secondary {
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  .btn-secondary:hover {
    background-color: var(--secondary-hover);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  .btn-secondary:active {
    transform: scale(0.98);
  }

  .btn-ghost {
    background-color: transparent;
  }
  .btn-ghost:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
  .btn-ghost:active {
    transform: scale(0.98);
  }

  .btn-link {
    background-color: transparent;
    color: var(--primary);
    text-underline-offset: 4px;
  }
  .btn-link:hover {
    text-decoration: underline;
    color: var(--primary-hover);
  }

  /* Sizes */
  .btn-default-size,
  .btn-default {
    height: 2.25rem;
    padding: 0.5rem 1rem;
  }

  .btn-sm {
    height: 2rem;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 0.375rem;
  }

  .btn-lg {
    height: 2.5rem;
    padding: 0.5rem 2rem;
    border-radius: 0.375rem;
  }

  .btn-icon {
    height: 2.25rem;
    width: 2.25rem;
    min-width: 2.25rem;
    padding: 0;
  }
</style>
