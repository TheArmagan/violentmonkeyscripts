<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props extends HTMLInputAttributes {
    value?: string;
    onSearch: (query: string) => Promise<string[]>;
    onSelect?: (value: string) => void;
    debounceMs?: number;
    minChars?: number;
  }

  let {
    class: className = "",
    value = $bindable(""),
    onSearch,
    onSelect,
    debounceMs = 300,
    minChars = 1,
    placeholder = "Search...",
    ...restProps
  }: Props = $props();

  let results = $state<string[]>([]);
  let isOpen = $state(false);
  let isLoading = $state(false);
  let selectedIndex = $state(-1);
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let inputRef: HTMLInputElement;
  let listRef: HTMLUListElement | null = $state(null);

  async function handleSearch(query: string) {
    if (query.length < minChars) {
      results = [];
      isOpen = false;
      return;
    }

    isLoading = true;
    try {
      results = await onSearch(query);
      isOpen = results.length > 0;
      selectedIndex = -1;
    } catch (e) {
      results = [];
      isOpen = false;
    } finally {
      isLoading = false;
    }
  }

  function debouncedSearch(query: string) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => handleSearch(query), debounceMs);
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    value = target.value;
    debouncedSearch(value);
  }

  function selectItem(item: string) {
    value = item;
    isOpen = false;
    results = [];
    selectedIndex = -1;
    onSelect?.(item);
    inputRef?.focus();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isOpen || results.length === 0) {
      if (e.key === "ArrowDown" && value.length >= minChars) {
        handleSearch(value);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % results.length;
        scrollToSelected();
        break;
      case "ArrowUp":
        e.preventDefault();
        selectedIndex =
          selectedIndex <= 0 ? results.length - 1 : selectedIndex - 1;
        scrollToSelected();
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          selectItem(results[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        isOpen = false;
        selectedIndex = -1;
        break;
      case "Tab":
        isOpen = false;
        selectedIndex = -1;
        break;
    }
  }

  function scrollToSelected() {
    if (listRef && selectedIndex >= 0) {
      const items = listRef.querySelectorAll("li");
      items[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }

  function handleBlur(e: FocusEvent) {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget?.closest(".autocomplete-dropdown")) {
      setTimeout(() => {
        isOpen = false;
        selectedIndex = -1;
      }, 150);
    }
  }

  function handleFocus() {
    if (results.length > 0 && value.length >= minChars) {
      isOpen = true;
    }
  }
</script>

<div class="autocomplete-container {className}">
  <div class="input-wrapper">
    <input
      bind:this={inputRef}
      class="input"
      type="text"
      {placeholder}
      {value}
      oninput={handleInput}
      onkeydown={handleKeydown}
      onblur={handleBlur}
      onfocus={handleFocus}
      autocomplete="off"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-autocomplete="list"
      {...restProps}
    />
    {#if isLoading}
      <div class="loading-indicator">
        <span class="spinner"></span>
      </div>
    {/if}
  </div>

  {#if isOpen && results.length > 0}
    <ul bind:this={listRef} class="autocomplete-dropdown" role="listbox">
      {#each results as item, index}
        <li
          role="option"
          aria-selected={index === selectedIndex}
          class="autocomplete-item"
          class:selected={index === selectedIndex}
          onmousedown={() => selectItem(item)}
          onmouseenter={() => (selectedIndex = index)}
        >
          {item}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .autocomplete-container {
    position: relative;
    width: 100%;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input {
    display: flex;
    height: 2.25rem;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid var(--input);
    background-color: var(--background);
    color: var(--foreground);
    padding: 0.25rem 0.75rem;
    padding-right: 2rem;
    font-size: 1rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    transition:
      color 0.2s ease,
      background-color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
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

  .loading-indicator {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid var(--muted);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .autocomplete-dropdown {
    position: absolute;
    top: calc(100% + 0.25rem);
    left: 0;
    right: 0;
    max-height: 15rem;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 50;
    list-style: none;
    margin: 0;
    padding: 0.25rem;
    animation: slideDown 0.15s ease-out;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .autocomplete-item {
    width: 100%;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: var(--foreground);
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }

  .autocomplete-item:hover,
  .autocomplete-item.selected {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }

  .autocomplete-item.selected {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }
</style>
