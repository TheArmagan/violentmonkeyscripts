<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props extends HTMLInputAttributes {
    value?: string;
  }

  let {
    class: className = "",
    value = $bindable(""),
    type = "text",
    ...restProps
  }: Props = $props();
</script>

<input class="input {className}" {type} bind:value {...restProps} />

<style>
  .input {
    display: flex;
    height: 2.25rem;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid var(--input);
    background-color: var(--background);
    color: var(--foreground);
    padding: 0.25rem 0.75rem;
    font-size: 1rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .input::file-selector-button {
    border: 0;
    background-color: transparent;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
  }

  .input::placeholder {
    color: var(--muted-foreground);
  }

  .input:focus-visible {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--ring);
    background-color: var(--card);
  }

  .input:hover:not(:focus-visible):not(:disabled) {
    border-color: var(--muted-foreground);
  }

  .input:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (min-width: 768px) {
    .input {
      font-size: 0.875rem;
    }
  }
</style>
