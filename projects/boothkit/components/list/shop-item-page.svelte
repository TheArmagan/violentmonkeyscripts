<script lang="ts">
  import type {
    ShopItemPage,
    ShopItemPageImage,
    ShopItemPageVideo,
  } from "../../parsers/booth/shop-item";
  import type {
    SearchPage,
    ItemSearchResult,
  } from "../../parsers/ripperstore/search";
  import { searchBoothItemSmart } from "../../parsers/ripperstore/search";
  import Icon from "../lib/icon.svelte";
  import ItemDownloadCard from "./item-download-card.svelte";

  let {
    parsedPage = $bindable<any>({}),
    pageType = $bindable<string>(""),
    loadPage,
    isSidebarOpen = true,
    onSidebarToggle,
  }: {
    parsedPage: ShopItemPage;
    pageType: string;
    loadPage: (parsed: any, type: string) => void;
    isSidebarOpen?: boolean;
    onSidebarToggle?: (open: boolean) => void;
  } = $props();

  // Media gallery state
  let currentMediaIndex = $state(0);
  let isLightboxOpen = $state(false);
  let lightboxIndex = $state(0);
  let preloadedImages = $state(new Set<string>());
  let isLightboxImageLoading = $state(false);

  // Download search state
  let downloadSearchResult = $state<ItemSearchResult | null>(null);
  let downloadSearchPage = $state<SearchPage | null>(null);
  let isDownloadSearching = $state(false);
  let downloadSearchError = $state<string | null>(null);
  let isDownloadSectionExpanded = $state(false);

  // Get item data from parsed page
  let itemId = $derived(parsedPage.product?.id || "");
  let productName = $derived(parsedPage.product?.name || "");
  let shopName = $derived(parsedPage.shop?.name || "");

  // Search for downloads
  async function searchForDownloads() {
    if (!itemId) {
      downloadSearchError = "No item ID available";
      return;
    }
    isDownloadSearching = true;
    downloadSearchError = null;
    isDownloadSectionExpanded = true;

    try {
      downloadSearchResult = await searchBoothItemSmart(
        itemId,
        productName,
        shopName
      );
      if (downloadSearchResult.searchResults.length > 0) {
        const primarySearch = downloadSearchResult.searchResults[0];
        downloadSearchPage = {
          results: {
            totalResults: downloadSearchResult.totalUniqueResults,
            searchTime: downloadSearchResult.searchResults.reduce(
              (sum, s) => sum + s.searchTime,
              0
            ),
            searchTimeText: `${downloadSearchResult.strategiesUsed.length} search strategies used`,
            query: itemId,
            posts: [],
          },
          meta: {} as any,
          config: {} as any,
          user: null,
          query: {} as any,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
            pages: [],
          },
          filterOptions: {} as any,
        };
      }
    } catch (err) {
      downloadSearchError =
        (err as Error).message || "Failed to search for downloads";
    } finally {
      isDownloadSearching = false;
    }
  }

  function refreshDownloads() {
    downloadSearchResult = null;
    downloadSearchPage = null;
    searchForDownloads();
  }

  let lastSearchedItemId = $state<string | null>(null);

  $effect(() => {
    if (itemId && itemId !== lastSearchedItemId) {
      downloadSearchResult = null;
      downloadSearchPage = null;
      downloadSearchError = null;
      isDownloadSectionExpanded = false;
      lastSearchedItemId = itemId;
      searchForDownloads();
    }
  });

  // Combine images and videos into a unified media list
  type MediaItem =
    | { type: "image"; data: ShopItemPageImage }
    | { type: "video"; data: ShopItemPageVideo };

  function getMediaList(): MediaItem[] {
    const media: MediaItem[] = [];
    parsedPage.media?.images?.forEach((img) => {
      media.push({ type: "image", data: img });
    });
    parsedPage.media?.videos?.forEach((vid) => {
      media.push({ type: "video", data: vid });
    });
    return media;
  }

  let mediaList = $derived(getMediaList());

  function nextMedia() {
    if (mediaList.length > 1) {
      currentMediaIndex = (currentMediaIndex + 1) % mediaList.length;
    }
  }

  function prevMedia() {
    if (mediaList.length > 1) {
      currentMediaIndex =
        currentMediaIndex === 0 ? mediaList.length - 1 : currentMediaIndex - 1;
    }
  }

  function openLightbox(index: number) {
    lightboxIndex = index;
    isLightboxOpen = true;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    isLightboxOpen = false;
    document.body.style.overflow = "";
  }

  function lightboxNext() {
    lightboxIndex = (lightboxIndex + 1) % mediaList.length;
  }

  function lightboxPrev() {
    lightboxIndex =
      lightboxIndex === 0 ? mediaList.length - 1 : lightboxIndex - 1;
  }

  function handleLightboxKeydown(e: KeyboardEvent) {
    if (!isLightboxOpen) return;
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        lightboxNext();
        break;
      case "ArrowLeft":
        e.preventDefault();
        lightboxPrev();
        break;
      case "Escape":
        e.preventDefault();
        closeLightbox();
        break;
    }
  }

  function preloadAllImages() {
    mediaList.forEach((media) => {
      if (
        media.type === "image" &&
        !preloadedImages.has(media.data.originalUrl)
      ) {
        const img = new Image();
        img.src = media.data.originalUrl;
        img.onload = () => {
          preloadedImages = new Set([
            ...preloadedImages,
            media.data.originalUrl,
          ]);
        };
      }
    });
  }

  function handleLightboxImageLoad() {
    isLightboxImageLoading = false;
  }

  // Tab state for description sections
  let activeDescriptionTab = $state(0);

  function getDescriptionTabs() {
    const tabs: { title: string; content: string }[] = [];
    if (parsedPage.description) {
      tabs.push({ title: "Description", content: parsedPage.description });
    }
    parsedPage.descriptionSections?.forEach((section) => {
      tabs.push({ title: section.title, content: section.content });
    });
    return tabs;
  }

  let descriptionTabs = $derived(getDescriptionTabs());

  function toggleSidebar() {
    const newState = !isSidebarOpen;
    onSidebarToggle?.(newState);
  }

  $effect(() => {
    if (isLightboxOpen) {
      const media = mediaList[lightboxIndex];
      if (
        media?.type === "image" &&
        !preloadedImages.has(media.data.originalUrl)
      ) {
        isLightboxImageLoading = true;
      }
    }
  });

  $effect(() => {
    if (isLightboxOpen) {
      window.addEventListener("keydown", handleLightboxKeydown);
      preloadAllImages();
      return () => window.removeEventListener("keydown", handleLightboxKeydown);
    }
  });

  function formatPriceRange(): string {
    if (parsedPage.priceRange) {
      const { lowPrice, highPrice, currency } = parsedPage.priceRange;
      if (lowPrice === highPrice) return `¥${lowPrice.toLocaleString()}`;
      return `¥${lowPrice.toLocaleString()} ~ ¥${highPrice.toLocaleString()}`;
    }
    return (
      parsedPage.product?.priceFormatted ||
      `¥${(parsedPage.product?.price || 0).toLocaleString()}`
    );
  }
</script>

<div class="shop-item-page">
  <div class="main-container">
    <!-- Sidebar -->
    <aside class="sidebar" class:collapsed={!isSidebarOpen}>
      {#if isSidebarOpen}
        <!-- Shop Info Card -->
        <div class="sidebar-section shop-card">
          <a href={parsedPage.shop?.url} class="shop-link">
            {#if parsedPage.shop?.avatarUrl}
              <img
                src={parsedPage.shop.avatarUrl}
                alt={parsedPage.shop.name}
                class="shop-avatar-large"
              />
            {/if}
            <div class="shop-info">
              <span class="shop-name-large">{parsedPage.shop?.name}</span>
              {#if parsedPage.shop?.nickname && parsedPage.shop?.nickname !== parsedPage.shop?.name}
                <span class="shop-nickname">@{parsedPage.shop.nickname}</span>
              {/if}
            </div>
          </a>
          <div class="shop-actions">
            <a href={parsedPage.shop?.url} class="shop-action-btn">
              <Icon icon="Store" width="16" height="16" />
              Visit Shop
            </a>
          </div>
        </div>

        <!-- Social Links -->
        {#if parsedPage.socialLinks?.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="Share2" width="16" height="16" />
              Social Links
            </h3>
            <div class="social-links">
              {#each parsedPage.socialLinks as link}
                <a
                  href={link.url}
                  class="social-link-item"
                  target="_blank"
                  rel="noopener"
                >
                  {#if link.type === "pixiv"}
                    <Icon icon="Image" width="14" height="14" />
                    <span>Pixiv</span>
                  {:else if link.type === "twitter"}
                    <Icon icon="Twitter" width="14" height="14" />
                    <span>{link.label || "Twitter"}</span>
                  {:else if link.type === "contact"}
                    <Icon icon="MessageCircle" width="14" height="14" />
                    <span>Contact</span>
                  {:else}
                    <Icon icon="ExternalLink" width="14" height="14" />
                    <span>Link</span>
                  {/if}
                </a>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Shop Theme Preview -->
        {#if parsedPage.theme}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="Palette" width="16" height="16" />
              Shop Theme
            </h3>
            <div class="theme-preview">
              <div
                class="theme-color"
                style="background-color: {parsedPage.theme.backgroundColor}"
                title="Background"
              ></div>
              <div
                class="theme-color"
                style="background-color: {parsedPage.theme.baseColor}"
                title="Base"
              ></div>
              <div
                class="theme-color"
                style="background-color: {parsedPage.theme.priceColor}"
                title="Price"
              ></div>
              <div
                class="theme-color"
                style="background-color: {parsedPage.theme.linkColor}"
                title="Link"
              ></div>
              <div
                class="theme-color"
                style="background-color: {parsedPage.theme.textColor}"
                title="Text"
              ></div>
            </div>
          </div>
        {/if}

        <!-- Shop Quick Links -->
        <div class="sidebar-section">
          <h3 class="sidebar-title">
            <Icon icon="Info" width="16" height="16" />
            Quick Links
          </h3>
          <div class="shop-links">
            {#if parsedPage.shop?.pixivUrl}
              <a
                href={parsedPage.shop.pixivUrl}
                class="shop-link-item"
                target="_blank"
              >
                <Icon icon="Image" width="14" height="14" />
                Pixiv Profile
              </a>
            {/if}
            {#if parsedPage.shop?.twitterUrl}
              <a
                href={parsedPage.shop.twitterUrl}
                class="shop-link-item"
                target="_blank"
              >
                <Icon icon="Twitter" width="14" height="14" />
                Twitter
              </a>
            {/if}
            {#if parsedPage.shop?.contactUrl}
              <a href={parsedPage.shop.contactUrl} class="shop-link-item">
                <Icon icon="Mail" width="14" height="14" />
                Contact Shop
              </a>
            {/if}
          </div>
        </div>
      {/if}
    </aside>

    <!-- Main Content -->
    <main class="content">
      <div class="item-layout">
        <!-- Media Gallery Section -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <section class="media-section" onmouseenter={preloadAllImages}>
          <div class="media-main">
            {#if mediaList.length > 0}
              {@const currentMedia = mediaList[currentMediaIndex]}
              {#if currentMedia?.type === "image"}
                <div
                  class="media-container"
                  onclick={() => openLightbox(currentMediaIndex)}
                  onkeydown={(e) =>
                    e.key === "Enter" && openLightbox(currentMediaIndex)}
                  tabindex="0"
                  role="button"
                  aria-label="View larger image"
                >
                  <img
                    src={currentMedia.data.originalUrl}
                    alt={currentMedia.data.alt || parsedPage.product?.name}
                    class="media-image"
                  />
                  <div class="zoom-indicator">
                    <Icon icon="ZoomIn" width="20" height="20" />
                  </div>
                </div>
              {:else if currentMedia?.type === "video"}
                <div class="media-container video-container">
                  <iframe
                    src={currentMedia.data.embedUrl}
                    title="Video"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    class="media-video"
                  ></iframe>
                </div>
              {/if}
            {:else}
              <div class="media-placeholder">
                <Icon icon="Image" width="64" height="64" />
                <span>No media available</span>
              </div>
            {/if}

            {#if mediaList.length > 1}
              <button
                class="media-nav media-prev"
                onclick={prevMedia}
                aria-label="Previous"
              >
                <Icon icon="ChevronLeft" width="24" height="24" />
              </button>
              <button
                class="media-nav media-next"
                onclick={nextMedia}
                aria-label="Next"
              >
                <Icon icon="ChevronRight" width="24" height="24" />
              </button>
            {/if}
          </div>

          {#if mediaList.length > 1}
            <div class="thumbnail-strip">
              {#each mediaList as media, index}
                <button
                  class="thumbnail-item"
                  class:active={index === currentMediaIndex}
                  onclick={() => (currentMediaIndex = index)}
                  aria-label={`View ${media.type === "image" ? "image" : "video"} ${index + 1}`}
                >
                  {#if media.type === "image"}
                    <img src={media.data.thumbnailUrl} alt="" />
                  {:else}
                    <div class="video-thumbnail">
                      <Icon icon="Play" width="24" height="24" />
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          {/if}

          {#if parsedPage.badges?.length > 0}
            <div class="badges-row">
              {#each parsedPage.badges as badge}
                <a href={badge.url} class="badge-item" title={badge.name}>
                  <img src={badge.imageUrl} alt={badge.name} />
                </a>
              {/each}
            </div>
          {/if}
        </section>

        <!-- Product Info Section -->
        <section class="info-section">
          <h1 class="product-title">{parsedPage.product?.name}</h1>

          <div class="price-block">
            <span class="price-main">{formatPriceRange()}</span>
            {#if parsedPage.product?.availability}
              <span
                class="availability-badge"
                class:in-stock={parsedPage.product.availability === "InStock"}
              >
                {parsedPage.product.availability === "InStock"
                  ? "In Stock"
                  : parsedPage.product.availability}
              </span>
            {/if}
          </div>

          <div class="quick-meta">
            {#if itemId}
              <button
                class="download-status-badge"
                class:loading={isDownloadSearching}
                class:has-results={downloadSearchPage &&
                  downloadSearchPage.results.totalResults > 0}
                class:no-results={downloadSearchPage &&
                  downloadSearchPage.results.totalResults === 0}
                onclick={() => {
                  if (downloadSearchPage) {
                    isDownloadSectionExpanded = !isDownloadSectionExpanded;
                    if (isDownloadSectionExpanded) {
                      setTimeout(() => {
                        document
                          .getElementById("downloads-section")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }, 50);
                    }
                  } else {
                    searchForDownloads().then(() => {
                      setTimeout(() => {
                        document
                          .getElementById("downloads-section")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }, 50);
                    });
                  }
                }}
                title={isDownloadSearching
                  ? "Searching..."
                  : downloadSearchPage
                    ? `${downloadSearchPage.results.totalResults} downloads found`
                    : "Search for downloads"}
              >
                {#if isDownloadSearching}
                  <Icon icon="Loader2" width="16" height="16" class="spin" />
                  <span>Searching...</span>
                {:else if downloadSearchPage}
                  <Icon icon="Download" width="16" height="16" />
                  <span
                    >{downloadSearchPage.results.totalResults} Download{downloadSearchPage
                      .results.totalResults !== 1
                      ? "s"
                      : ""}</span
                  >
                  <Icon
                    icon={isDownloadSectionExpanded
                      ? "ChevronUp"
                      : "ChevronDown"}
                    width="14"
                    height="14"
                  />
                {:else}
                  <Icon icon="Download" width="16" height="16" />
                  <span>Find Downloads</span>
                {/if}
              </button>
            {/if}

            {#if parsedPage.product?.categoryName}
              <div class="meta-badge" title="Category">
                <Icon icon="Folder" width="16" height="16" />
                <span>{parsedPage.product.categoryName}</span>
              </div>
            {/if}

            {#if parsedPage.product?.event}
              <div class="meta-badge" title="Event">
                <Icon icon="Calendar" width="16" height="16" />
                <span>{parsedPage.product.event}</span>
              </div>
            {/if}

            {#if parsedPage.shop?.subdomain}
              <div class="meta-badge" title="Shop">
                <Icon icon="Store" width="16" height="16" />
                <span>{parsedPage.shop.subdomain}</span>
              </div>
            {/if}
          </div>

          <!-- Variations -->
          {#if parsedPage.variations?.length > 0}
            <div class="variations-section">
              <h3 class="section-title">
                <Icon icon="Package" width="18" height="18" />
                Variations
              </h3>
              <div class="variations-list">
                {#each parsedPage.variations as variation}
                  <div
                    class="variation-card"
                    class:sold-out={!variation.isAvailable}
                  >
                    <div class="variation-info">
                      <span class="variation-name"
                        >{variation.name || "Default"}</span
                      >
                      <span class="variation-type">{variation.type}</span>
                    </div>
                    <div class="variation-price-action">
                      <span class="variation-price"
                        >{variation.priceFormatted ||
                          `¥${variation.price.toLocaleString()}`}</span
                      >
                      {#if !variation.isAvailable}
                        <span class="variation-stock sold-out">Sold Out</span>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </section>
      </div>

      <!-- Downloads Section -->
      {#if isDownloadSectionExpanded || downloadSearchPage}
        <div class="downloads-section" id="downloads-section">
          <div class="downloads-header">
            <h2 class="downloads-title">
              <Icon icon="Download" width="20" height="20" />
              Downloads for Item #{itemId}
            </h2>
            <button
              class="collapse-btn"
              onclick={() =>
                (isDownloadSectionExpanded = !isDownloadSectionExpanded)}
              aria-label={isDownloadSectionExpanded ? "Collapse" : "Expand"}
            >
              <Icon
                icon={isDownloadSectionExpanded ? "ChevronUp" : "ChevronDown"}
                width="20"
                height="20"
              />
            </button>
          </div>
          {#if isDownloadSectionExpanded}
            <ItemDownloadCard
              bind:searchPage={downloadSearchPage}
              searchResult={downloadSearchResult}
              {itemId}
              isLoading={isDownloadSearching}
              error={downloadSearchError}
              onRefresh={refreshDownloads}
            />
          {/if}
        </div>
      {/if}

      <!-- Description Tabs Section -->
      {#if descriptionTabs.length > 0}
        <div class="description-tabs-section">
          <div class="description-tabs-header">
            {#each descriptionTabs as tab, index}
              <button
                class="description-tab"
                class:active={activeDescriptionTab === index}
                onclick={() => (activeDescriptionTab = index)}
              >
                {#if index === 0 && parsedPage.description}
                  <Icon icon="FileText" width="16" height="16" />
                {/if}
                {tab.title}
              </button>
            {/each}
          </div>
          <div class="description-tab-content">
            {#if descriptionTabs[activeDescriptionTab]}
              <div class="description-content-inner">
                <p>{descriptionTabs[activeDescriptionTab].content}</p>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </main>
  </div>
</div>

<!-- Lightbox -->
{#if isLightboxOpen}
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    class="lightbox-overlay"
    onclick={closeLightbox}
    onkeydown={(e) => e.key === "Escape" && closeLightbox()}
    role="dialog"
    aria-modal="true"
    aria-label="Media viewer"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="lightbox-content" onclick={(e) => e.stopPropagation()}>
      <div class="lightbox-header">
        <div class="lightbox-title">
          <span class="lightbox-item-name">{parsedPage.product?.name}</span>
          {#if mediaList.length > 1}
            <span class="lightbox-counter"
              >{lightboxIndex + 1} / {mediaList.length}</span
            >
          {/if}
        </div>
        <button
          class="lightbox-close"
          onclick={closeLightbox}
          aria-label="Close"
        >
          <Icon icon="X" width="20" height="20" />
        </button>
      </div>

      <div class="lightbox-main">
        {#if mediaList.length > 1}
          <button
            class="lightbox-nav lightbox-prev"
            onclick={lightboxPrev}
            aria-label="Previous"
          >
            <Icon icon="ChevronLeft" width="28" height="28" />
          </button>
        {/if}

        <div class="lightbox-media-wrapper">
          {#if mediaList.length > 0}
            {@const lightboxMedia = mediaList[lightboxIndex]}
            {#if lightboxMedia?.type === "image"}
              {#if isLightboxImageLoading}
                <div class="lightbox-loader">
                  <div class="loader-spinner"></div>
                </div>
              {/if}
              {#key lightboxIndex}
                <img
                  src={lightboxMedia.data.originalUrl}
                  alt={`${parsedPage.product?.name} - Image ${lightboxIndex + 1}`}
                  class="lightbox-image"
                  class:loading={isLightboxImageLoading}
                  onload={handleLightboxImageLoad}
                />
              {/key}
            {:else if lightboxMedia?.type === "video"}
              <div class="lightbox-video-container">
                <iframe
                  src={lightboxMedia.data.embedUrl}
                  title="Video"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="lightbox-video"
                ></iframe>
              </div>
            {/if}
          {/if}
        </div>

        {#if mediaList.length > 1}
          <button
            class="lightbox-nav lightbox-next"
            onclick={lightboxNext}
            aria-label="Next"
          >
            <Icon icon="ChevronRight" width="28" height="28" />
          </button>
        {/if}
      </div>

      {#if mediaList.length > 1}
        <div class="lightbox-thumbnails-strip">
          <div class="lightbox-thumbnails">
            {#each mediaList as media, index}
              <button
                class="lightbox-thumb"
                class:active={index === lightboxIndex}
                onclick={() => (lightboxIndex = index)}
                aria-label={`View ${media.type === "image" ? "image" : "video"} ${index + 1}`}
              >
                {#if media.type === "image"}
                  <img src={media.data.thumbnailUrl} alt="" />
                  {#if !preloadedImages.has(media.data.originalUrl)}
                    <div class="thumb-loading"></div>
                  {/if}
                {:else}
                  <div class="video-thumb-icon">
                    <Icon icon="Play" width="16" height="16" />
                  </div>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .shop-item-page {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--background);
    color: var(--foreground);
  }

  .main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* Sidebar */
  .sidebar {
    width: 18rem;
    background-color: var(--card);
    border-right: 1px solid var(--border);
    padding: 1rem;
    overflow-y: auto;
    flex-shrink: 0;
    transition: width 0.3s ease;
  }

  .sidebar.collapsed {
    width: 0;
    padding: 0;
    overflow: hidden;
  }

  .shop-card {
    background-color: var(--secondary);
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .shop-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--foreground);
    margin-bottom: 0.75rem;
  }

  .shop-avatar-large {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--border);
  }

  .shop-info {
    display: flex;
    flex-direction: column;
  }

  .shop-name-large {
    font-weight: 600;
    font-size: 1rem;
  }

  .shop-nickname {
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  .shop-actions {
    display: flex;
    gap: 0.5rem;
  }

  .shop-action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.5rem;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    font-size: 0.75rem;
    color: var(--foreground);
    text-decoration: none;
    transition: all 0.15s ease;
  }

  .shop-action-btn:hover {
    background-color: var(--accent);
    border-color: var(--primary);
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

  .social-links,
  .shop-links {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .social-link-item,
  .shop-link-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    color: var(--muted-foreground);
    text-decoration: none;
    transition: all 0.15s ease;
  }

  .social-link-item:hover,
  .shop-link-item:hover {
    background-color: var(--accent);
    color: var(--primary);
  }

  .theme-preview {
    display: flex;
    gap: 0.5rem;
  }

  .theme-color {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    border: 1px solid var(--border);
  }

  /* Content */
  .content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .item-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Media Section */
  .media-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: calc(50vw - 2rem);
  }

  .media-main {
    position: relative;
    aspect-ratio: 1;
    background-color: var(--muted);
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .media-container {
    width: 100%;
    height: 100%;
    cursor: zoom-in;
    position: relative;
  }

  .media-container.video-container {
    cursor: default;
  }

  .media-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  .media-container:hover .media-image {
    transform: scale(1.02);
  }

  .media-video {
    width: 100%;
    height: 100%;
  }

  .media-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--muted-foreground);
  }

  .zoom-indicator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: var(--background);
    color: var(--foreground);
    padding: 0.5rem;
    border-radius: 0.375rem;
    opacity: 0;
    transition: opacity 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .media-container:hover .zoom-indicator {
    opacity: 1;
  }

  .media-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background-color: var(--background);
    border: 1px solid var(--border);
    color: var(--foreground);
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s ease;
    z-index: 5;
  }

  .media-nav:hover {
    background-color: var(--accent);
    border-color: var(--primary);
    color: var(--primary);
  }

  .media-prev {
    left: 0.75rem;
  }
  .media-next {
    right: 0.75rem;
  }

  .thumbnail-strip {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.25rem;
  }

  .thumbnail-item {
    flex-shrink: 0;
    width: 4rem;
    height: 4rem;
    border: 2px solid transparent;
    border-radius: 0.375rem;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    background: var(--muted);
    transition: all 0.2s ease;
  }

  .thumbnail-item:hover {
    border-color: var(--border);
  }

  .thumbnail-item.active {
    border-color: var(--primary);
  }

  .thumbnail-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-thumbnail {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--muted);
    color: var(--foreground);
  }

  .badges-row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .badge-item {
    height: 1.5rem;
  }

  .badge-item img {
    height: 100%;
    width: auto;
  }

  /* Info Section */
  .info-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .product-title {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
  }

  .price-block {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .price-main {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary);
  }

  .availability-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    background-color: var(--muted);
    color: var(--muted-foreground);
  }

  .availability-badge.in-stock {
    background-color: var(--success);
    color: var(--success-foreground);
  }

  .quick-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  .meta-badge {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background-color: var(--secondary);
    border-radius: 1rem;
    font-size: 0.8rem;
    color: var(--secondary-foreground);
  }

  /* Download Status Badge */
  .download-status-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(
      135deg,
      var(--primary) 0%,
      color-mix(in srgb, var(--primary) 80%, black) 100%
    );
    color: var(--primary-foreground);
    border: none;
    border-radius: 2rem;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .download-status-badge:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .download-status-badge:active {
    transform: translateY(0);
  }

  .download-status-badge.loading {
    background: var(--secondary);
    color: var(--secondary-foreground);
    cursor: wait;
  }

  .download-status-badge.has-results {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
  }

  .download-status-badge.no-results {
    background: var(--secondary);
    color: var(--muted-foreground);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .variations-section {
    margin-top: 1rem;
  }

  .variations-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 600px;
    overflow-y: auto;
  }

  .variation-card {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .variation-card.sold-out {
    opacity: 0.6;
  }

  .variation-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .variation-name {
    font-weight: 600;
  }

  .variation-type {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
    background-color: var(--secondary);
    border-radius: 0.25rem;
    color: var(--secondary-foreground);
  }

  .variation-price-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .variation-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary);
  }

  .variation-stock.sold-out {
    color: var(--destructive);
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Downloads Section */
  .downloads-section {
    margin-top: 2rem;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }

  .downloads-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .downloads-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--foreground);
    margin: 0;
  }

  .collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background-color: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    color: var(--foreground);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .collapse-btn:hover {
    background-color: var(--accent);
    border-color: var(--primary);
  }

  /* Description Tabs Section */
  .description-tabs-section {
    margin-top: 2rem;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }

  .description-tabs-header {
    display: flex;
    gap: 0.25rem;
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 0;
  }

  .description-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--muted-foreground);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    margin-bottom: -1px;
  }

  .description-tab:hover {
    color: var(--foreground);
    background-color: var(--accent);
  }

  .description-tab.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
    background-color: transparent;
  }

  .description-tab-content {
    padding: 1.5rem 0;
  }

  .description-content-inner {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 1.5rem;
  }

  .description-content-inner p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.8;
    color: var(--foreground);
    white-space: pre-wrap;
  }

  /* Lightbox Styles - Matching browse-item-card */
  .lightbox-overlay {
    position: fixed;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.95) 0%,
      rgba(20, 10, 15, 0.98) 100%
    );
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: lightboxFadeIn 0.3s ease;
  }

  @keyframes lightboxFadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(8px);
    }
  }

  .lightbox-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-width: 100vw;
    max-height: 100vh;
  }

  .lightbox-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.6) 0%,
      transparent 100%
    );
  }

  .lightbox-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    min-width: 0;
  }

  .lightbox-item-name {
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0.9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 40vw;
  }

  .lightbox-counter {
    font-size: 0.8rem;
    opacity: 0.7;
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    white-space: nowrap;
  }

  .lightbox-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }

  .lightbox-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0 4rem;
    min-height: 0;
  }

  .lightbox-media-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    max-height: 100%;
  }

  .lightbox-loader {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
  }

  .loader-spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .lightbox-image {
    max-width: calc(100vw - 10rem);
    max-height: calc(100vh - 12rem);
    object-fit: contain;
    border-radius: 0.75rem;
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.05);
    animation: imageSlideIn 0.3s ease;
    transition: opacity 0.2s ease;
  }

  .lightbox-image.loading {
    opacity: 0.3;
  }

  @keyframes imageSlideIn {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .lightbox-video-container {
    width: 80vw;
    max-width: 1200px;
    aspect-ratio: 16 / 9;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  .lightbox-video {
    width: 100%;
    height: 100%;
  }

  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s ease;
    z-index: 10;
  }

  .lightbox-nav:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.08);
  }

  .lightbox-nav:active {
    transform: translateY(-50%) scale(0.95);
  }

  .lightbox-prev {
    left: 1rem;
  }

  .lightbox-next {
    right: 1rem;
  }

  .lightbox-thumbnails-strip {
    padding: 1rem 1.5rem 1.5rem;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
    display: flex;
    justify-content: center;
  }

  .lightbox-thumbnails {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    max-width: 90vw;
    padding: 0.5rem;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .lightbox-thumbnails::-webkit-scrollbar {
    height: 4px;
  }

  .lightbox-thumbnails::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }

  .lightbox-thumbnails::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }

  .lightbox-thumb {
    position: relative;
    width: 4rem;
    height: 4rem;
    border: 2px solid transparent;
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    background: rgba(255, 255, 255, 0.05);
    flex-shrink: 0;
    transition: all 0.2s ease;
    opacity: 0.5;
  }

  .lightbox-thumb:hover {
    opacity: 0.85;
    transform: translateY(-2px);
  }

  .lightbox-thumb.active {
    border-color: var(--primary);
    opacity: 1;
    box-shadow: 0 0 12px rgba(var(--primary-rgb, 220, 80, 100), 0.4);
  }

  .lightbox-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-thumb-icon {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    color: white;
  }

  .thumb-loading {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thumb-loading::after {
    content: "";
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  :global(.spin) {
    animation: spin 1s linear infinite;
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

    .item-layout {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .content {
      padding: 1rem;
    }

    .product-title {
      font-size: 1.5rem;
    }

    .price-main {
      font-size: 1.5rem;
    }

    .lightbox-main {
      padding: 0 1rem;
    }

    .lightbox-nav {
      width: 2.5rem;
      height: 2.5rem;
    }

    .lightbox-prev {
      left: 0.5rem;
    }

    .lightbox-next {
      right: 0.5rem;
    }

    .lightbox-image {
      max-width: calc(100vw - 4rem);
      max-height: calc(100vh - 14rem);
    }

    .lightbox-item-name {
      max-width: 50vw;
      font-size: 0.8rem;
    }

    .lightbox-thumb {
      width: 3rem;
      height: 3rem;
    }

    .variation-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .variation-price-action {
      width: 100%;
      justify-content: space-between;
    }
  }

  @media (max-width: 480px) {
    .lightbox-header {
      padding: 0.75rem 1rem;
    }

    .lightbox-thumbnails-strip {
      padding: 0.75rem 1rem 1rem;
    }

    .lightbox-item-name {
      display: none;
    }

    .lightbox-counter {
      font-size: 0.75rem;
    }

    .quick-meta {
      flex-direction: column;
    }

    .meta-badge {
      width: fit-content;
    }
  }
</style>
