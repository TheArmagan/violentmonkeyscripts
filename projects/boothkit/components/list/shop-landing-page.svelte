<script lang="ts">
  import type {
    ShopLandingPage,
    ShopLandingItem,
    ShopInfo,
    ShopTheme,
    ShopSocialLink,
    ShopItemList,
    ShopPagination,
  } from "../../parsers/booth/shop-landing";
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
    parsedPage: ShopLandingPage;
    pageType: string;
    loadPage: (parsed: any, type: string) => void;
    isSidebarOpen?: boolean;
    onSidebarToggle?: (open: boolean) => void;
  } = $props();

  // Convert ShopLandingItem to BrowseItemCard format
  function convertToCardItem(item: ShopLandingItem) {
    // Use badges from parsed HTML, or create from boolean flags as fallback
    let badges = item.badges || [];

    // Add status badges if not already present
    if (item.isAdult && !badges.some((b) => b.name.toLowerCase() === "adult")) {
      badges.push({ name: "adult", imageUrl: "", url: "" });
    }
    if (
      item.isSoldOut &&
      !badges.some((b) => b.name.toLowerCase().includes("sold"))
    ) {
      badges.push({ name: "sold-out", imageUrl: "", url: "" });
    }

    return {
      id: String(item.id),
      name: item.name,
      price: item.price,
      priceText: item.priceText,
      url: item.shopItemUrl || item.url,
      brand: item.shop?.name || "",
      categoryId: String(item.trackingData?.productCategory || 0),
      event: item.event,
      thumbnails: item.thumbnailUrls.slice(0, 8),
      badges,
      shop: {
        name: item.shop?.name || "",
        url: item.shop?.url || "",
        avatarUrl: item.shop?.thumbnailUrl || "",
      },
      wishListCount: item.wishlistCount || 0,
    };
  }

  // Get social icon name
  function getSocialIcon(platform: string): any {
    const icons: Record<string, string> = {
      pixiv: "Palette",
      twitter: "Twitter",
      email: "Mail",
      youtube: "Youtube",
      discord: "MessageCircle",
      instagram: "Instagram",
      twitch: "Twitch",
      website: "Globe",
    };
    return icons[platform] || "Link";
  }

  // Navigate to page
  async function goToPage(url: string) {
    await navigate(url);
  }

  // Navigate to pagination
  async function goToPageNum(pageUrl: string | null) {
    if (pageUrl) {
      // Convert relative URL to absolute if needed
      const absoluteUrl = pageUrl.startsWith("http")
        ? pageUrl
        : new URL(pageUrl, window.location.origin).toString();
      await navigate(absoluteUrl);
    }
  }
</script>

<div
  class="shop-landing-page"
  style="
    --shop-bg: {parsedPage.theme?.backgroundColor || '#FAFAFA'};
    --shop-base: {parsedPage.theme?.baseColor || '#000000'};
    --shop-border: {parsedPage.theme?.borderColor || '#F3F3F3'};
    --shop-contents: {parsedPage.theme?.contentsColor || '#FFFFFF'};
    --shop-link: {parsedPage.theme?.linkColor || '#000000'};
    --shop-price: {parsedPage.theme?.priceColor || '#BF2932'};
    --shop-text: {parsedPage.theme?.textColor || '#5A5A60'};
  "
>
  <div class="main-container">
    <!-- Sidebar -->
    <aside class="sidebar" class:collapsed={!isSidebarOpen}>
      {#if isSidebarOpen}
        <!-- Shop Profile Card -->
        <div class="sidebar-section shop-profile-card">
          {#if parsedPage.shop?.avatarUrl}
            <img
              src={parsedPage.shop.avatarUrl}
              alt={parsedPage.shop.name}
              class="shop-avatar"
            />
          {/if}
          <div class="shop-profile-info">
            <h3 class="shop-nickname">
              {parsedPage.shop?.nickname || parsedPage.shop?.name}
            </h3>
            {#if parsedPage.shop?.isVerified}
              <span class="verified-badge">
                <Icon icon="BadgeCheck" width="14" height="14" />
                Verified
              </span>
            {/if}
          </div>
        </div>

        <!-- Social Links -->
        {#if parsedPage.socialLinks?.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="Share2" width="16" height="16" />
              Connect
            </h3>
            <div class="social-links">
              {#each parsedPage.socialLinks as link}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-link"
                  title={link.title || link.platform}
                >
                  <Icon
                    icon={getSocialIcon(link.platform)}
                    width="18"
                    height="18"
                  />
                </a>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Item Lists / Categories -->
        {#if parsedPage.itemLists?.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="FolderOpen" width="16" height="16" />
              Collections
            </h3>
            <ul class="collection-list">
              {#each parsedPage.itemLists as itemList}
                <li>
                  <a
                    href={itemList.url}
                    class="collection-link"
                    onclick={(e) => {
                      e.preventDefault();
                      goToPage(itemList.url);
                    }}
                  >
                    <Icon icon="Folder" width="16" height="16" />
                    <span>{itemList.label}</span>
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Shop Stats -->
        <div class="sidebar-section">
          <h3 class="sidebar-title">
            <Icon icon="BarChart3" width="16" height="16" />
            Shop Info
          </h3>
          <div class="shop-stats">
            <div class="stat-item">
              <span class="stat-value">{parsedPage.items?.length || 0}</span>
              <span class="stat-label">Items on page</span>
            </div>
            {#if parsedPage.pagination}
              <div class="stat-item">
                <span class="stat-value"
                  >{parsedPage.pagination.totalPages}</span
                >
                <span class="stat-label">Pages</span>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </aside>

    <!-- Main Content -->
    <main class="content">
      <!-- Shop Header Banner -->
      <div class="shop-header">
        {#if parsedPage.shop?.headerImageUrl}
          <div class="shop-banner">
            <img
              src={parsedPage.shop.headerImageUrl}
              alt={parsedPage.shop.name}
              class="banner-image"
            />
          </div>
        {/if}

        <div class="shop-header-info">
          <div class="shop-header-left">
            {#if parsedPage.shop?.avatarUrl}
              <img
                src={parsedPage.shop.avatarUrl}
                alt={parsedPage.shop.name}
                class="shop-header-avatar"
              />
            {/if}
            <div class="shop-header-text">
              <h1 class="shop-name">
                {parsedPage.shop?.name || "Shop"}
                {#if parsedPage.shop?.isVerified}
                  <Icon icon="BadgeCheck" width="20" height="20" />
                {/if}
              </h1>
              {#if parsedPage.shop?.nickname && parsedPage.shop.nickname !== parsedPage.shop.name}
                <span class="shop-owner">by {parsedPage.shop.nickname}</span>
              {/if}
            </div>
          </div>

          <div class="shop-header-actions">
            {#if parsedPage.socialLinks?.length > 0}
              <div class="header-social-links">
                {#each parsedPage.socialLinks.slice(0, 3) as link}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="header-social-link"
                    title={link.title || link.platform}
                  >
                    <Icon
                      icon={getSocialIcon(link.platform)}
                      width="16"
                      height="16"
                    />
                  </a>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Shop Description -->
      {#if parsedPage.shop?.description}
        <div class="shop-description">
          <p>{parsedPage.shop.description}</p>
        </div>
      {/if}

      <!-- Item Lists Tabs -->
      {#if parsedPage.itemLists?.length > 0}
        <div class="item-lists-tabs">
          <a href={parsedPage.shop?.url || "#"} class="list-tab active">
            <Icon icon="Grid3x3" width="16" height="16" />
            All Items
          </a>
          {#each parsedPage.itemLists.slice(0, 6) as itemList}
            <a
              href={itemList.url}
              class="list-tab"
              onclick={(e) => {
                e.preventDefault();
                goToPage(itemList.url);
              }}
            >
              {itemList.label}
            </a>
          {/each}
        </div>
      {/if}

      <!-- Items Section -->
      <section class="items-section">
        <div class="section-header">
          <h2 class="section-title">
            <Icon icon="Package" width="18" height="18" />
            Products
            {#if parsedPage.pagination}
              <span class="page-indicator">
                Page {parsedPage.pagination.currentPage} of {parsedPage
                  .pagination.totalPages}
              </span>
            {/if}
          </h2>
        </div>

        {#if parsedPage.items?.length > 0}
          <div class="items-grid">
            {#each parsedPage.items as item (item.id)}
              <BrowseItemCard item={convertToCardItem(item)} />
            {/each}
          </div>
        {:else}
          <div class="empty-section">
            <Icon icon="Package" width="48" height="48" />
            <p>No items found in this shop.</p>
          </div>
        {/if}
      </section>

      <!-- Pagination -->
      {#if parsedPage.pagination && parsedPage.pagination.totalPages > 1}
        <nav class="pagination">
          <button
            class="page-btn"
            disabled={!parsedPage.pagination.prevPageUrl}
            onclick={(e) => {
              e.preventDefault();
              goToPageNum(parsedPage.pagination?.prevPageUrl || null);
            }}
          >
            <Icon icon="ChevronLeft" width="16" height="16" />
            Previous
          </button>

          <div class="page-numbers">
            {#each parsedPage.pagination.pages as page}
              <button
                class="page-num"
                class:active={page.isCurrent}
                disabled={page.isCurrent || !page.url}
                onclick={(e) => {
                  e.preventDefault();
                  if (!page.isCurrent && page.url) {
                    goToPageNum(page.url);
                  }
                }}
              >
                {page.page}
              </button>
            {/each}
          </div>

          <button
            class="page-btn"
            disabled={!parsedPage.pagination.nextPageUrl}
            onclick={(e) => {
              e.preventDefault();
              goToPageNum(parsedPage.pagination?.nextPageUrl || null);
            }}
          >
            Next
            <Icon icon="ChevronRight" width="16" height="16" />
          </button>
        </nav>
      {/if}
    </main>
  </div>
</div>

<style>
  .shop-landing-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
    color: var(--foreground);
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  .main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* Sidebar Styles */
  .sidebar {
    width: 16rem;
    background-color: var(--card);
    border-right: 1px solid var(--border);
    padding: 1rem;
    overflow-y: auto;
    transition:
      width 0.3s ease,
      background-color 0.3s ease;
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

  /* Shop Profile Card */
  .shop-profile-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: linear-gradient(135deg, var(--shop-link), var(--shop-base));
    border-radius: 0.5rem;
    text-align: center;
  }

  .shop-avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    border: 3px solid var(--shop-contents);
    margin-bottom: 0.75rem;
    object-fit: cover;
  }

  .shop-profile-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .shop-nickname {
    font-size: 1rem;
    font-weight: 600;
    color: var(--shop-contents);
    margin: 0;
  }

  .verified-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--shop-contents);
    opacity: 0.9;
  }

  /* Social Links */
  .social-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    background-color: var(--secondary);
    border-radius: 50%;
    color: var(--foreground);
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
  }

  .social-link:hover {
    background-color: var(--primary);
    color: var(--primary-foreground);
    transform: translateY(-2px);
  }

  /* Collection List */
  .collection-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0;
    margin: 0;
  }

  .collection-link {
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

  .collection-link:hover {
    background-color: var(--accent);
    color: var(--primary);
  }

  /* Shop Stats */
  .shop-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    background-color: var(--secondary);
    border-radius: 0.375rem;
  }

  .stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary);
  }

  .stat-label {
    font-size: 0.6875rem;
    color: var(--muted-foreground);
    text-align: center;
  }

  /* Main Content */
  .content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  /* Shop Header */
  .shop-header {
    margin-bottom: 1.5rem;
  }

  .shop-banner {
    width: 100%;
    height: 12rem;
    border-radius: 0.75rem;
    overflow: hidden;
    margin-bottom: 1rem;
    background-color: var(--secondary);
  }

  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .shop-header-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .shop-header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .shop-header-avatar {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    border: 3px solid var(--border);
    object-fit: cover;
  }

  .shop-header-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .shop-name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--foreground);
    margin: 0;
  }

  .shop-owner {
    font-size: 0.875rem;
    color: var(--muted-foreground);
  }

  .shop-header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header-social-links {
    display: flex;
    gap: 0.5rem;
  }

  .header-social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background-color: var(--secondary);
    border-radius: 50%;
    color: var(--muted-foreground);
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }

  .header-social-link:hover {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  /* Shop Description */
  .shop-description {
    padding: 1rem;
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .shop-description p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--muted-foreground);
    white-space: pre-wrap;
    line-height: 1.6;
  }

  /* Item Lists Tabs */
  .item-lists-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .list-tab {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    border: none;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
  }

  .list-tab:hover {
    background-color: var(--accent);
  }

  .list-tab.active {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  /* Items Section */
  .items-section {
    margin-bottom: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--foreground);
    margin: 0;
  }

  .page-indicator {
    font-size: 0.875rem;
    font-weight: 400;
    color: var(--muted-foreground);
    margin-left: 0.5rem;
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 1.25rem;
  }

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

  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .page-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      opacity 0.15s ease;
  }

  .page-btn:hover:not(:disabled) {
    background-color: var(--accent);
  }

  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-numbers {
    display: flex;
    gap: 0.25rem;
  }

  .page-num {
    min-width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: var(--foreground);
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease;
  }

  .page-num:hover {
    background-color: var(--accent);
    border-color: var(--primary);
  }

  .page-num.active {
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
  }

  /* Responsive Styles */
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

    .shop-banner {
      height: 10rem;
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

    .shop-name {
      font-size: 1.25rem;
    }

    .shop-header-avatar {
      width: 3rem;
      height: 3rem;
    }

    .shop-header-info {
      flex-direction: column;
      align-items: flex-start;
    }

    .shop-banner {
      height: 8rem;
    }

    .item-lists-tabs {
      overflow-x: auto;
      flex-wrap: nowrap;
      padding-bottom: 0.75rem;
      -webkit-overflow-scrolling: touch;
    }

    .list-tab {
      white-space: nowrap;
      flex-shrink: 0;
    }

    .pagination {
      flex-wrap: wrap;
    }

    .page-numbers {
      order: -1;
      width: 100%;
      justify-content: center;
      margin-bottom: 0.5rem;
    }
  }

  @media (max-width: 480px) {
    .items-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .shop-header-left {
      flex-direction: column;
      align-items: flex-start;
    }

    .shop-profile-card {
      padding: 0.75rem;
    }

    .shop-avatar {
      width: 3rem;
      height: 3rem;
    }

    .shop-nickname {
      font-size: 0.875rem;
    }

    .page-btn {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
    }
  }
</style>
