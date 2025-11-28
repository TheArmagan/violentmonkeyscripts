<script lang="ts">
  import Button from "./lib/button.svelte";
  import Icon from "./lib/icon.svelte";
  import { onMount } from "svelte";
  import AsyncAutocompleteInput from "./lib/async-autocomplete-input.svelte";
  import { fetchAutocompleteTags } from "../api/autocomplete";
  import BrowsePage from "./list/browse-page.svelte";
  import ItemPage from "./list/item-page.svelte";
  import { navigate } from "../loaders";

  let isDarkTheme = $state(false);
  let isSidebarOpen = $state(true);
  let isLoading = $state(false);

  function toggleTheme() {
    if (isDarkTheme) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    isDarkTheme = !isDarkTheme;
  }

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }

  onMount(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      isDarkTheme = true;
    }

    // Register callbacks for hot-reload navigation
    onLoadPage?.(loadPage);
    onSetLoading?.((loading: boolean) => {
      isLoading = loading;
    });
  });

  let searchQuery = $state("");
  async function doSearch() {
    const url = new URL(window.location.href);
    url.pathname = `/en/search/${encodeURIComponent(searchQuery)}`;

    // Try hot navigation first
    const handled = await navigate(url.toString());
    if (!handled) {
      window.location.href = url.toString();
    }
  }

  let {
    parsedPage = $bindable<any>({}),
    pageType = $bindable<string>(""),
    onLoadPage,
    onSetLoading,
  }: {
    parsedPage: any;
    pageType: string;
    onLoadPage?: (callback: (parsed: any, type: string) => void) => void;
    onSetLoading?: (callback: (loading: boolean) => void) => void;
  } = $props();

  function loadPage(parsed: any, type: string) {
    parsedPage = parsed;
    pageType = type;
  }
</script>

<div class="container">
  <!-- Loading Overlay -->
  {#if isLoading}
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  {/if}

  <nav class="navbar">
    <div class="nav-left">
      {#if pageType === "browse"}
        <Button
          variant="ghost"
          size="icon"
          onclick={toggleSidebar}
          aria-label="Toggle sidebar"
          class="sidebar-toggle"
        >
          <Icon icon="Menu" width="20" height="20" />
        </Button>
      {/if}
      <a href="/" class="nav-title">BoothKit</a>
    </div>
    <div class="nav-center">
      <div class="nav-search-container">
        <AsyncAutocompleteInput
          placeholder="Search items..."
          bind:value={searchQuery}
          onSearch={async (query) => {
            return await fetchAutocompleteTags(query);
          }}
          onSelect={(value) => {
            searchQuery = value;
            doSearch();
          }}
        />
        <Button
          variant="default"
          size="icon"
          onclick={doSearch}
          aria-label="Search"
        >
          <Icon icon="Search" width="16" height="16" />
        </Button>
      </div>
    </div>
    <div class="nav-right">
      <Button
        variant="ghost"
        size="icon"
        onclick={toggleTheme}
        aria-label="Toggle theme"
      >
        {#if isDarkTheme}
          <Icon icon="Moon" width="18" height="18" />
        {:else}
          <Icon icon="Sun" width="18" height="18" />
        {/if}
      </Button>
      {#if parsedPage?.meta?.userSignedIn}
        <Button variant="ghost" size="icon" aria-label="User menu">
          <Icon icon="User" width="18" height="18" />
        </Button>
      {/if}
    </div>
  </nav>
  <div class="content">
    {#if pageType === "browse"}
      <BrowsePage
        {parsedPage}
        {pageType}
        {loadPage}
        {isSidebarOpen}
        onSidebarToggle={(open) => (isSidebarOpen = open)}
      />
    {:else if pageType === "item"}
      <ItemPage
        {parsedPage}
        {pageType}
        {loadPage}
        {isSidebarOpen}
        onSidebarToggle={(open) => (isSidebarOpen = open)}
      />
    {:else}
      <div class="unsupported-page">
        <Icon icon="AlertCircle" width="48" height="48" />
        <h2>Unsupported page type</h2>
        <p>{pageType || "Unknown"}</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100vh;
    background-color: var(--background);
    color: var(--foreground);
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background-color: var(--card);
    border-bottom: 1px solid var(--border);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease,
      box-shadow 0.3s ease;
    flex-shrink: 0;
    z-index: 100;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--primary);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .nav-title:hover {
    color: var(--primary-hover);
  }

  .nav-center {
    flex: 1;
    display: flex;
    justify-content: center;
    max-width: 36rem;
    margin: 0 1rem;
  }

  .nav-search-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .content {
    flex: 1;
    overflow: hidden;
  }

  .unsupported-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--muted-foreground);
    text-align: center;
    gap: 0.5rem;
  }

  .unsupported-page h2 {
    margin: 0;
    color: var(--foreground);
  }

  .unsupported-page p {
    margin: 0;
    font-size: 0.875rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .nav-center {
      display: none;
    }

    .nav-left {
      gap: 0.5rem;
    }
  }

  /* Loading Overlay */
  .loading-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid var(--muted);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
