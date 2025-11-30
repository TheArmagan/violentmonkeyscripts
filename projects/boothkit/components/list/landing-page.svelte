<script lang="ts">
  import type {
    LandingPage,
    LandingPageItem,
    HotItemsSection,
    Category,
    PopularTag,
    FeaturedLink,
    RecentlyViewedItem,
  } from "../../parsers/booth/landing";
  import BrowseItemCard from "./browse-item-card.svelte";
  import Button from "../lib/button.svelte";
  import Icon from "../lib/icon.svelte";
  import { navigate } from "../../loaders";

  let {
    parsedPage = $bindable<any>({}),
    pageType = $bindable<string>(""),
    loadPage,
    isSidebarOpen = true,
    onSidebarToggle,
  }: {
    parsedPage: LandingPage;
    pageType: string;
    loadPage: (parsed: any, type: string) => void;
    isSidebarOpen?: boolean;
    onSidebarToggle?: (open: boolean) => void;
  } = $props();

  // Active section for hot items
  let activeHotSection = $state(0);

  // Convert LandingPageItem to a compatible format for BrowseItemCard
  function convertToCardItem(item: LandingPageItem) {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      priceText: item.priceText,
      url: item.url,
      brand: item.brand,
      categoryId: item.categoryId,
      event: item.event,
      thumbnails: item.thumbnails,
      badges: item.badges,
      shop: {
        name: item.shop.name,
        url: item.shop.url,
        avatarUrl: item.shop.avatarUrl,
      },
      wishListCount: 0,
    };
  }

  // Navigate to category
  async function goToCategory(url: string) {
    await navigate(url);
  }

  // Navigate to tag
  async function goToTag(url: string) {
    await navigate(url);
  }
</script>

<div class="landing-page">
  <div class="main-container">
    <!-- Sidebar -->
    <aside class="sidebar" class:collapsed={!isSidebarOpen}>
      {#if isSidebarOpen}
        <!-- User Welcome -->
        {#if parsedPage.user?.signedIn}
          <div class="sidebar-section user-welcome">
            <div class="user-info">
              {#if parsedPage.user.thumbnailUrl}
                <img
                  src={parsedPage.user.thumbnailUrl}
                  alt={parsedPage.user.nickname || "User"}
                  class="user-avatar"
                />
              {/if}
              <div class="user-details">
                <span class="user-greeting">Welcome back,</span>
                <span class="user-name"
                  >{parsedPage.user.nickname || "User"}</span
                >
              </div>
            </div>
          </div>
        {/if}

        <!-- Categories -->
        {#if parsedPage.categories?.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="Grid3x3" width="16" height="16" />
              Categories
            </h3>
            <ul class="category-list">
              {#each parsedPage.categories as category}
                <li>
                  <a
                    href={category.url}
                    class="category-link"
                    onclick={(e) => {
                      e.preventDefault();
                      goToCategory(category.url);
                    }}
                  >
                    {#if category.iconUrl}
                      <img
                        src={category.iconUrl}
                        alt=""
                        class="category-icon"
                      />
                    {/if}
                    <span class="category-name">{category.name}</span>
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Popular Tags -->
        {#if parsedPage.popularTags?.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="Tag" width="16" height="16" />
              Popular Tags
            </h3>
            <div class="tags-cloud">
              {#each parsedPage.popularTags.slice(0, 15) as tag}
                <a
                  href={tag.url}
                  class="tag-chip"
                  onclick={(e) => {
                    e.preventDefault();
                    goToTag(tag.url);
                  }}
                >
                  {tag.name}
                </a>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Filter Options (Events) -->
        {#if parsedPage.filterOptions?.events?.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="Calendar" width="16" height="16" />
              Events
            </h3>
            <ul class="filter-list scrollable">
              {#each parsedPage.filterOptions.events.slice(0, 8) as event}
                <li>
                  <a
                    href={`https://booth.pm/en/events/${event.value}`}
                    class="filter-option-link"
                  >
                    <Icon icon="Flag" width="14" height="14" />
                    <span>{event.label}</span>
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Recently Viewed -->
        {#if parsedPage.recentlyViewedItems?.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="Clock" width="16" height="16" />
              Recently Viewed
            </h3>
            <div class="recent-items">
              {#each parsedPage.recentlyViewedItems.slice(0, 9) as item}
                <a href={item.url} class="recent-item" title="View item">
                  <img src={item.thumbnailUrl} alt="" loading="lazy" />
                </a>
              {/each}
            </div>
            {#if parsedPage.historyUrl}
              <a href={parsedPage.historyUrl} class="view-all-link">
                View all history
                <Icon icon="ArrowRight" width="14" height="14" />
              </a>
            {/if}
          </div>
        {/if}
      {/if}
    </aside>

    <!-- Main Content -->
    <main class="content">
      <!-- Page Header -->
      <div class="content-header">
        <div class="content-header-left">
          <h1 class="page-title">
            <Icon icon="Sparkles" width="24" height="24" />
            Discover
          </h1>
          <span class="page-subtitle"
            >Explore creative works from BOOTH marketplace</span
          >
        </div>
      </div>

      <!-- Featured Links / Banners -->
      {#if parsedPage.featuredLinks?.length > 0}
        <section class="featured-section">
          <h2 class="section-title">
            <Icon icon="Star" width="18" height="18" />
            Featured
          </h2>
          <div class="featured-links">
            {#each parsedPage.featuredLinks as link}
              <a
                href={link.url}
                class="featured-link"
                style={link.backgroundColor
                  ? `background-color: ${link.backgroundColor}`
                  : ""}
              >
                <span class="featured-label">{link.label}</span>
                <span class="featured-type-badge">{link.type}</span>
              </a>
            {/each}
          </div>
        </section>
      {/if}

      <!-- Recommended Items -->
      {#if parsedPage.recommendedItems?.length > 0}
        <section class="items-section">
          <div class="section-header">
            <h2 class="section-title">
              <Icon icon="ThumbsUp" width="18" height="18" />
              Recommended for You
            </h2>
          </div>
          <div class="items-grid">
            {#each parsedPage.recommendedItems as item (item.id)}
              <BrowseItemCard item={convertToCardItem(item)} />
            {/each}
          </div>
        </section>
      {/if}

      <!-- Hot Items Sections (Per Category) -->
      {#if parsedPage.hotItemsSections?.length > 0}
        <!-- Section Tabs -->
        <div class="hot-sections-tabs">
          {#each parsedPage.hotItemsSections as section, index}
            <button
              class="section-tab"
              class:active={activeHotSection === index}
              onclick={() => (activeHotSection = index)}
            >
              {section.categoryName}
            </button>
          {/each}
        </div>

        <!-- Active Section Content -->
        {#each parsedPage.hotItemsSections as section, index}
          {#if activeHotSection === index}
            <section class="items-section hot-items-section">
              <div class="section-header">
                <h2 class="section-title">
                  <Icon icon="TrendingUp" width="18" height="18" />
                  {section.categoryTitle ||
                    `Popular in ${section.categoryName}`}
                </h2>
                {#if section.showMoreUrl}
                  <a href={section.showMoreUrl} class="show-more-link">
                    Show more
                    <Icon icon="ArrowRight" width="14" height="14" />
                  </a>
                {/if}
              </div>

              <!-- Subcategories -->
              {#if section.subcategories?.length > 0}
                <div class="subcategories">
                  {#each section.subcategories as sub}
                    <a
                      href={sub.url}
                      class="subcategory-chip"
                      onclick={(e) => {
                        e.preventDefault();
                        goToCategory(sub.url);
                      }}
                    >
                      {sub.name}
                    </a>
                  {/each}
                </div>
              {/if}

              <!-- Items Grid -->
              {#if section.items?.length > 0}
                <div class="items-grid">
                  {#each section.items as item (item.id)}
                    <BrowseItemCard item={convertToCardItem(item)} />
                  {/each}
                </div>
              {:else}
                <div class="empty-section">
                  <Icon icon="Package" width="32" height="32" />
                  <p>No items available in this category</p>
                </div>
              {/if}
            </section>
          {/if}
        {/each}
      {/if}

      <!-- All Categories Grid -->
      {#if parsedPage.categories?.length > 0}
        <section class="categories-section">
          <h2 class="section-title">
            <Icon icon="LayoutGrid" width="18" height="18" />
            Browse by Category
          </h2>
          <div class="categories-grid">
            {#each parsedPage.categories as category}
              <a
                href={category.url}
                class="category-card"
                onclick={(e) => {
                  e.preventDefault();
                  goToCategory(category.url);
                }}
              >
                {#if category.iconUrl}
                  <img
                    src={category.iconUrl}
                    alt={category.name}
                    class="category-card-icon"
                  />
                {/if}
                <span class="category-card-name">{category.name}</span>
              </a>
            {/each}
          </div>
        </section>
      {/if}

      <!-- Popular Tags Section -->
      {#if parsedPage.popularTags?.length > 0}
        <section class="tags-section">
          <h2 class="section-title">
            <Icon icon="Hash" width="18" height="18" />
            Trending Tags
          </h2>
          <div class="tags-grid">
            {#each parsedPage.popularTags as tag}
              <a
                href={tag.url}
                class="tag-pill"
                onclick={(e) => {
                  e.preventDefault();
                  goToTag(tag.url);
                }}
              >
                <Icon icon="Hash" width="12" height="12" />
                {tag.name}
              </a>
            {/each}
          </div>
        </section>
      {/if}
    </main>
  </div>
</div>

<style>
  .landing-page {
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

  /* User Welcome */
  .user-welcome {
    padding: 1rem;
    background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .user-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid var(--primary-foreground);
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .user-greeting {
    font-size: 0.75rem;
    color: var(--primary-foreground);
    opacity: 0.8;
  }

  .user-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--primary-foreground);
  }

  /* Category List */
  .category-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .category-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

  .category-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  /* Tags Cloud */
  .tags-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
  }

  .tag-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    border-radius: 1rem;
    font-size: 0.75rem;
    text-decoration: none;
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
  }

  .tag-chip:hover {
    background-color: var(--primary);
    color: var(--primary-foreground);
    transform: translateY(-1px);
  }

  /* Filter List */
  .filter-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .filter-list.scrollable {
    max-height: 12rem;
    overflow-y: auto;
  }

  .filter-option-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.5rem;
    border-radius: 0.25rem;
    text-decoration: none;
    color: var(--foreground);
    font-size: 0.8125rem;
    transition: background-color 0.15s ease;
  }

  .filter-option-link:hover {
    background-color: var(--accent);
  }

  /* Recent Items */
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

  .view-all-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    margin-top: 0.75rem;
    padding: 0.5rem;
    font-size: 0.8125rem;
    color: var(--primary);
    text-decoration: none;
    border-radius: 0.25rem;
    transition: background-color 0.15s ease;
  }

  .view-all-link:hover {
    background-color: var(--accent);
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
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .content-header-left {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .page-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--foreground);
    margin: 0;
  }

  .page-subtitle {
    font-size: 0.875rem;
    color: var(--muted-foreground);
  }

  /* Section Styles */
  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--foreground);
    margin: 0;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .show-more-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: var(--primary);
    text-decoration: none;
    transition: opacity 0.15s ease;
  }

  .show-more-link:hover {
    opacity: 0.8;
  }

  /* Featured Section */
  .featured-section {
    margin-bottom: 2rem;
  }

  .featured-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .featured-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-radius: 0.5rem;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
    min-width: 10rem;
  }

  .featured-link:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .featured-label {
    flex: 1;
  }

  .featured-type-badge {
    font-size: 0.625rem;
    text-transform: uppercase;
    padding: 0.125rem 0.375rem;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 0.25rem;
    letter-spacing: 0.05em;
  }

  /* Items Section */
  .items-section {
    margin-bottom: 2.5rem;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 1.25rem;
  }

  /* Hot Sections Tabs */
  .hot-sections-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .section-tab {
    padding: 0.5rem 1rem;
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    border: none;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      transform 0.15s ease;
  }

  .section-tab:hover {
    background-color: var(--accent);
  }

  .section-tab.active {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  /* Subcategories */
  .subcategories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .subcategory-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    border-radius: 1rem;
    font-size: 0.8125rem;
    text-decoration: none;
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
  }

  .subcategory-chip:hover {
    background-color: var(--primary);
    color: var(--primary-foreground);
    transform: translateY(-1px);
  }

  /* Categories Section */
  .categories-section {
    margin-bottom: 2.5rem;
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    text-decoration: none;
    color: var(--foreground);
    transition:
      border-color 0.15s ease,
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .category-card:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .category-card-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .category-card-name {
    font-size: 0.8125rem;
    font-weight: 500;
    text-align: center;
  }

  /* Tags Section */
  .tags-section {
    margin-bottom: 2.5rem;
  }

  .tags-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    border-radius: 2rem;
    font-size: 0.8125rem;
    text-decoration: none;
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
  }

  .tag-pill:hover {
    background-color: var(--primary);
    color: var(--primary-foreground);
    transform: translateY(-1px);
  }

  /* Empty State */
  .empty-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    color: var(--muted-foreground);
    text-align: center;
    background-color: var(--secondary);
    border-radius: 0.5rem;
  }

  .empty-section p {
    margin-top: 0.5rem;
    font-size: 0.875rem;
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

    .page-title {
      font-size: 1.25rem;
    }

    .categories-grid {
      grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    }

    .featured-links {
      flex-direction: column;
    }

    .featured-link {
      width: 100%;
    }

    .hot-sections-tabs {
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-bottom: 0.75rem;
      -webkit-overflow-scrolling: touch;
    }

    .section-tab {
      white-space: nowrap;
      flex-shrink: 0;
    }
  }

  @media (max-width: 480px) {
    .items-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .categories-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .category-card {
      padding: 0.75rem;
    }

    .category-card-icon {
      width: 2rem;
      height: 2rem;
    }

    .category-card-name {
      font-size: 0.75rem;
    }
  }
</style>
