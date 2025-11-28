<script lang="ts">
  import type { BrowsePage, BrowsePageItem } from "../../parsers/browse";
  import BrowseItemCard from "./browse-item-card.svelte";
  import Button from "../lib/button.svelte";
  import Icon from "../lib/icon.svelte";
  import { navigate, fetchNextPage } from "../../loaders";

  let {
    parsedPage = $bindable<any>({}),
    pageType = $bindable<string>(""),
    loadPage,
    isSidebarOpen = true,
    onSidebarToggle,
  }: {
    parsedPage: BrowsePage;
    pageType: string;
    loadPage: (parsed: any, type: string) => void;
    isSidebarOpen?: boolean;
    onSidebarToggle?: (open: boolean) => void;
  } = $props();

  // Infinite scroll state
  let allItems = $state<BrowsePageItem[]>([]);
  let isLoadingMore = $state(false);
  let hasMorePages = $state(true);
  let currentInfiniteScrollPage = $state(1);
  let loadMoreTriggerEl: HTMLDivElement | null = $state(null);
  let observer: IntersectionObserver | null = null;

  // Initialize allItems when parsedPage changes (new navigation)
  $effect(() => {
    if (parsedPage?.items) {
      allItems = [...parsedPage.items];
      currentInfiniteScrollPage = parsedPage.pagination?.currentPage || 1;
      hasMorePages = parsedPage.pagination?.hasNextPage ?? false;
    }
  });

  // Setup IntersectionObserver for infinite scroll
  $effect(() => {
    if (loadMoreTriggerEl && hasMorePages && !isLoadingMore) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && hasMorePages && !isLoadingMore) {
            loadMoreItems();
          }
        },
        {
          rootMargin: "400px", // Start loading 400px before reaching the bottom
          threshold: 0,
        }
      );

      observer.observe(loadMoreTriggerEl);

      return () => {
        observer?.disconnect();
        observer = null;
      };
    }
  });

  async function loadMoreItems() {
    if (isLoadingMore || !hasMorePages) return;

    isLoadingMore = true;

    try {
      // Build next page URL
      const url = new URL(window.location.href);
      const nextPage = currentInfiniteScrollPage + 1;
      url.searchParams.set("page", nextPage.toString());

      const nextPageData = await fetchNextPage(url.toString());

      if (nextPageData?.items?.length > 0) {
        // Merge items, avoiding duplicates by id
        const existingIds = new Set(allItems.map((item) => item.id));
        const newItems = nextPageData.items.filter(
          (item: BrowsePageItem) => !existingIds.has(item.id)
        );

        allItems = [...allItems, ...newItems];
        currentInfiniteScrollPage = nextPage;
        hasMorePages = nextPageData.pagination?.hasNextPage ?? false;
      } else {
        hasMorePages = false;
      }
    } catch (error) {
      console.error("[BoothKit] Failed to load more items:", error);
      hasMorePages = false;
    } finally {
      isLoadingMore = false;
    }
  }

  // Sort options
  const sortOptions = [
    { label: "New Arrivals", value: "new" },
    { label: "Popular", value: "wish_count" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
  ];

  // Dropdown states
  let isSortDropdownOpen = $state(false);
  let isFilterDropdownOpen = $state(false);

  // Current filter values (parsed from URL)
  let currentSort = $state("");
  let currentType = $state("");
  let currentAdult = $state("");
  let currentEvent = $state("");

  // Parse current URL params when parsedPage changes (after navigation)
  $effect(() => {
    // parsedPage değiştiğinde URL'yi yeniden parse et
    // Bu sayede navigate() sonrası değerler güncellenecek
    if (parsedPage) {
      const url = new URL(window.location.href);
      currentSort = url.searchParams.get("sort") || "new";
      currentType = url.searchParams.get("type") || "";
      currentAdult = url.searchParams.get("adult") || "include";
      currentEvent = url.searchParams.get("event") || "";
    }
  });

  function getCurrentSortLabel() {
    const option = sortOptions.find((o) => o.value === currentSort);
    return option?.label || "Sort";
  }

  function getCurrentTypeLabel() {
    if (!currentType) return "All Types";
    const option = parsedPage.filterOptions?.itemTypes?.find(
      (o: any) => o.value === currentType
    );
    return option?.label || "All Types";
  }

  async function applySort(sortValue: string) {
    const url = new URL(window.location.href);
    if (sortValue && sortValue !== "new") {
      url.searchParams.set("sort", sortValue);
    } else {
      url.searchParams.delete("sort");
    }
    // Reset to page 1 when sorting changes
    url.searchParams.delete("page");

    isSortDropdownOpen = false;
    await navigate(url.toString());
  }

  async function applyFilter(type: string, value: string) {
    const url = new URL(window.location.href);

    if (type === "type") {
      if (value && value !== "default") {
        url.searchParams.set("type", value);
      } else {
        url.searchParams.delete("type");
      }
    } else if (type === "adult") {
      if (value && value !== "include") {
        url.searchParams.set("adult", value);
      } else {
        url.searchParams.set("adult", "include");
      }
    } else if (type === "event") {
      if (value) {
        url.searchParams.set("event", value);
      } else {
        url.searchParams.delete("event");
      }
    }

    // Reset to page 1 when filter changes
    url.searchParams.delete("page");

    await navigate(url.toString());
  }

  async function clearAllFilters() {
    const url = new URL(window.location.href);
    url.searchParams.delete("sort");
    url.searchParams.delete("type");
    url.searchParams.delete("event");
    url.searchParams.set("adult", "include");
    url.searchParams.delete("page");

    isFilterDropdownOpen = false;
    await navigate(url.toString());
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".dropdown-container")) {
      isSortDropdownOpen = false;
      isFilterDropdownOpen = false;
    }
  }

  $effect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  });

  // Check if any filters are active
  function hasActiveFilters() {
    return currentType || currentEvent || currentSort !== "new";
  }
</script>

<div class="browse-page">
  <div class="main-container">
    <!-- Sidebar -->
    <aside class="sidebar" class:collapsed={!isSidebarOpen}>
      {#if isSidebarOpen}
        <!-- Breadcrumbs -->
        {#if parsedPage.breadcrumbs?.length > 0}
          <nav class="breadcrumbs" aria-label="Breadcrumb">
            {#each parsedPage.breadcrumbs as crumb, index}
              {#if index > 0}
                <Icon icon="ChevronRight" width="12" height="12" />
              {/if}
              <a href={crumb.url} class="breadcrumb-link">{crumb.label}</a>
            {/each}
          </nav>
        {/if}

        <!-- Categories -->
        {#if parsedPage.otherCategories?.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="Grid3x3" width="16" height="16" />
              Categories
            </h3>
            <ul class="category-list">
              {#each parsedPage.otherCategories as category}
                <li>
                  <a href={category.url} class="category-link">
                    <span class="category-name">{category.name}</span>
                    <span class="category-count"
                      >{category.count.toLocaleString()}</span
                    >
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Filter Options -->
        {#if parsedPage.filterOptions}
          <!-- Item Types -->
          {#if parsedPage.filterOptions.itemTypes?.length > 0}
            <div class="sidebar-section">
              <h3 class="sidebar-title">
                <Icon icon="Package" width="16" height="16" />
                Item Type
              </h3>
              <ul class="filter-list">
                {#each parsedPage.filterOptions.itemTypes as type}
                  <li>
                    <label class="filter-option">
                      <input type="radio" name="itemType" value={type.value} />
                      <span>{type.label}</span>
                    </label>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          <!-- Age Restrictions -->
          {#if parsedPage.filterOptions.ageRestrictions?.length > 0}
            <div class="sidebar-section">
              <h3 class="sidebar-title">
                <Icon icon="Shield" width="16" height="16" />
                Age Rating
              </h3>
              <ul class="filter-list">
                {#each parsedPage.filterOptions.ageRestrictions as restriction}
                  <li>
                    <label class="filter-option">
                      <input
                        type="radio"
                        name="ageRestriction"
                        value={restriction.value}
                      />
                      <span>{restriction.label}</span>
                    </label>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          <!-- Events -->
          {#if parsedPage.filterOptions.events?.length > 0}
            <div class="sidebar-section">
              <h3 class="sidebar-title">
                <Icon icon="Calendar" width="16" height="16" />
                Events
              </h3>
              <ul class="filter-list scrollable">
                {#each parsedPage.filterOptions.events as event}
                  <li>
                    <label class="filter-option">
                      <input type="checkbox" value={event.value} />
                      <span>{event.label}</span>
                    </label>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        {/if}

        <!-- Recent Viewed -->
        {#if parsedPage.recentViewedItems?.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="Clock" width="16" height="16" />
              Recently Viewed
            </h3>
            <div class="recent-items">
              {#each parsedPage.recentViewedItems.slice(0, 6) as item}
                <a href={item.url} class="recent-item" title="View item">
                  <img src={item.thumbnailUrl} alt="" loading="lazy" />
                </a>
              {/each}
            </div>
          </div>
        {/if}
      {/if}
    </aside>

    <!-- Main Content -->
    <main class="content">
      <!-- Page Header -->
      <div class="content-header">
        <div class="content-header-left">
          {#if parsedPage.categoryName}
            <h2 class="category-title">{parsedPage.categoryName}</h2>
          {/if}
          {#if parsedPage.totalResults > 0}
            <span class="results-count"
              >{parsedPage.totalResults.toLocaleString()} items</span
            >
          {/if}
        </div>

        <div class="content-header-right">
          <!-- Sort Dropdown -->
          <div class="dropdown-container">
            <Button
              variant="outline"
              size="sm"
              onclick={(e: MouseEvent) => {
                e.stopPropagation();
                isSortDropdownOpen = !isSortDropdownOpen;
                isFilterDropdownOpen = false;
              }}
              class={currentSort && currentSort !== "new"
                ? "active-filter"
                : ""}
            >
              <Icon icon="ArrowUpDown" width="14" height="14" />
              {getCurrentSortLabel()}
              <Icon icon="ChevronDown" width="12" height="12" />
            </Button>

            {#if isSortDropdownOpen}
              <div class="dropdown-menu">
                {#each sortOptions as option}
                  <button
                    class="dropdown-item"
                    class:active={currentSort === option.value}
                    onclick={() => applySort(option.value)}
                  >
                    {option.label}
                    {#if currentSort === option.value}
                      <Icon icon="Check" width="14" height="14" />
                    {/if}
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Filter Dropdown -->
          <div class="dropdown-container">
            <Button
              variant="outline"
              size="sm"
              onclick={(e: MouseEvent) => {
                e.stopPropagation();
                isFilterDropdownOpen = !isFilterDropdownOpen;
                isSortDropdownOpen = false;
              }}
              class={hasActiveFilters() ? "active-filter" : ""}
            >
              <Icon icon="SlidersHorizontal" width="14" height="14" />
              Filter
              {#if hasActiveFilters()}
                <span class="filter-badge"></span>
              {/if}
              <Icon icon="ChevronDown" width="12" height="12" />
            </Button>

            {#if isFilterDropdownOpen}
              <div class="dropdown-menu filter-menu">
                <!-- Item Type Filter -->
                {#if parsedPage.filterOptions?.itemTypes?.length > 0}
                  <div class="filter-section">
                    <div class="filter-section-title">Item Type</div>
                    {#each parsedPage.filterOptions.itemTypes as type}
                      <button
                        class="dropdown-item"
                        class:active={currentType === type.value ||
                          (!currentType && type.value === "default")}
                        onclick={() => applyFilter("type", type.value)}
                      >
                        {type.label}
                        {#if currentType === type.value || (!currentType && type.value === "default")}
                          <Icon icon="Check" width="14" height="14" />
                        {/if}
                      </button>
                    {/each}
                  </div>
                {/if}

                <!-- Age Restriction Filter -->
                {#if parsedPage.filterOptions?.ageRestrictions?.length > 0}
                  <div class="filter-section">
                    <div class="filter-section-title">Age Rating</div>
                    {#each parsedPage.filterOptions.ageRestrictions as restriction}
                      <button
                        class="dropdown-item"
                        class:active={currentAdult === restriction.value}
                        onclick={() => applyFilter("adult", restriction.value)}
                      >
                        {restriction.label}
                        {#if currentAdult === restriction.value}
                          <Icon icon="Check" width="14" height="14" />
                        {/if}
                      </button>
                    {/each}
                  </div>
                {/if}

                <!-- Events Filter -->
                {#if parsedPage.filterOptions?.events?.length > 0}
                  <div class="filter-section">
                    <div class="filter-section-title">Event</div>
                    <button
                      class="dropdown-item"
                      class:active={!currentEvent}
                      onclick={() => applyFilter("event", "")}
                    >
                      All Events
                      {#if !currentEvent}
                        <Icon icon="Check" width="14" height="14" />
                      {/if}
                    </button>
                    <div class="filter-events-list">
                      {#each parsedPage.filterOptions.events.slice(0, 10) as event}
                        <button
                          class="dropdown-item"
                          class:active={currentEvent === event.value}
                          onclick={() => applyFilter("event", event.value)}
                        >
                          {event.label}
                          {#if currentEvent === event.value}
                            <Icon icon="Check" width="14" height="14" />
                          {/if}
                        </button>
                      {/each}
                    </div>
                  </div>
                {/if}

                <!-- Clear All -->
                <div class="filter-section filter-actions">
                  <button
                    class="dropdown-item clear-btn"
                    onclick={clearAllFilters}
                  >
                    <Icon icon="X" width="14" height="14" />
                    Clear All Filters
                  </button>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Category Tags -->
      {#if parsedPage.categoryTags?.length > 0}
        <div class="category-tags">
          {#each parsedPage.categoryTags as tag}
            <a href={tag.url} class="category-tag">
              {#if tag.imageUrl}
                <img src={tag.imageUrl} alt="" class="tag-image" />
              {/if}
              <span>{tag.label}</span>
            </a>
          {/each}
        </div>
      {/if}

      <!-- Items Grid -->
      {#if allItems.length > 0}
        <div class="items-grid">
          {#each allItems as item (item.id)}
            <BrowseItemCard {item} />
          {/each}
        </div>

        <!-- Infinite Scroll Trigger -->
        <div class="load-more-trigger" bind:this={loadMoreTriggerEl}>
          {#if isLoadingMore}
            <div class="loading-more">
              <div class="loading-spinner"></div>
              <span>Loading more items...</span>
            </div>
          {:else if !hasMorePages}
            <div class="end-of-results">
              <Icon icon="CheckCircle" width="20" height="20" />
              <span
                >You've seen all {allItems.length.toLocaleString()} items</span
              >
            </div>
          {/if}
        </div>
      {:else}
        <div class="empty-state">
          <Icon icon="PackageX" width="64" height="64" />
          <h3>No items found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      {/if}
    </main>
  </div>
</div>

<style>
  .browse-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
    color: var(--foreground);
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  /* Main Container */
  .main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* Sidebar */
  .sidebar {
    width: 16rem;
    background-color: var(--card);
    border-right: 1px solid var(--border);
    padding: 1rem;
    overflow-y: auto;
    transition:
      width 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease;
    flex-shrink: 0;
  }

  .sidebar.collapsed {
    width: 0;
    padding: 0;
    overflow: hidden;
  }

  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .breadcrumb-link {
    color: var(--muted-foreground);
    text-decoration: none;
    transition: color 0.15s ease;
  }

  .breadcrumb-link:hover {
    color: var(--primary);
  }

  .sidebar-section {
    margin-bottom: 1.5rem;
  }

  .sidebar-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--foreground);
    margin-bottom: 0.75rem;
  }

  .category-list,
  .filter-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .filter-list.scrollable {
    max-height: 10rem;
    overflow-y: auto;
  }

  .category-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.375rem 0.5rem;
    border-radius: 0.25rem;
    text-decoration: none;
    color: var(--foreground);
    font-size: 0.875rem;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }

  .category-link:hover {
    background-color: var(--accent);
    color: var(--primary);
  }

  .category-count {
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .filter-option:hover {
    background-color: var(--accent);
  }

  .filter-option input {
    accent-color: var(--primary);
  }

  .recent-items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .recent-item {
    aspect-ratio: 1;
    border-radius: 0.375rem;
    overflow: hidden;
    border: 1px solid var(--border);
    transition:
      border-color 0.15s ease,
      transform 0.15s ease;
  }

  .recent-item:hover {
    border-color: var(--primary);
    transform: scale(1.05);
  }

  .recent-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Content */
  .content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .content-header-left {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .category-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--foreground);
    margin: 0;
  }

  .results-count {
    font-size: 0.875rem;
    color: var(--muted-foreground);
  }

  .content-header-right {
    display: flex;
    gap: 0.5rem;
  }

  /* Dropdown Styles */
  .dropdown-container {
    position: relative;
  }

  .dropdown-container :global(.active-filter) {
    border-color: var(--primary);
    background-color: var(--accent);
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 0.25rem);
    right: 0;
    min-width: 12rem;
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    z-index: 50;
    padding: 0.25rem;
    animation: dropdownSlide 0.15s ease-out;
  }

  @keyframes dropdownSlide {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dropdown-menu.filter-menu {
    min-width: 16rem;
    max-height: 24rem;
    overflow-y: auto;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: none;
    background: transparent;
    color: var(--foreground);
    font-size: 0.875rem;
    text-align: left;
    cursor: pointer;
    border-radius: 0.25rem;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }

  .dropdown-item:hover {
    background-color: var(--accent);
  }

  .dropdown-item.active {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  .dropdown-item.clear-btn {
    color: var(--destructive);
    gap: 0.5rem;
    justify-content: flex-start;
  }

  .dropdown-item.clear-btn:hover {
    background-color: var(--destructive);
    color: var(--destructive-foreground);
  }

  .filter-section {
    padding: 0.25rem 0;
    border-bottom: 1px solid var(--border);
  }

  .filter-section:last-child {
    border-bottom: none;
  }

  .filter-section-title {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .filter-events-list {
    max-height: 8rem;
    overflow-y: auto;
  }

  .filter-actions {
    padding-top: 0.5rem;
  }

  .filter-badge {
    width: 0.5rem;
    height: 0.5rem;
    background-color: var(--primary);
    border-radius: 50%;
    margin-left: 0.25rem;
  }

  /* Category Tags */
  .category-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .category-tag {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    border-radius: 2rem;
    font-size: 0.75rem;
    text-decoration: none;
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
  }

  .category-tag:hover {
    background-color: var(--primary);
    color: var(--primary-foreground);
    transform: translateY(-1px);
  }

  .tag-image {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    object-fit: cover;
  }

  /* Items Grid */
  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  /* Empty State */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: var(--muted-foreground);
    text-align: center;
  }

  .empty-state h3 {
    margin: 1rem 0 0.5rem;
    font-size: 1.25rem;
    color: var(--foreground);
  }

  .empty-state p {
    font-size: 0.875rem;
  }

  /* Infinite Scroll / Load More */
  .load-more-trigger {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem 1rem;
    min-height: 4rem;
  }

  .loading-more {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--muted-foreground);
    font-size: 0.875rem;
  }

  .loading-spinner {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .end-of-results {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 1.5rem;
    background-color: var(--secondary);
    color: var(--muted-foreground);
    border-radius: 2rem;
    font-size: 0.875rem;
  }

  .end-of-results :global(svg) {
    color: var(--primary);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 50;
      box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
    }

    .sidebar.collapsed {
      transform: translateX(-100%);
    }
  }

  @media (max-width: 768px) {
    .items-grid {
      grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
      gap: 0.75rem;
    }

    .content {
      padding: 1rem;
    }

    .category-title {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    .items-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
