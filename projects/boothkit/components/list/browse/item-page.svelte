<script lang="ts">
  import type { ItemPage } from "../../../parsers/booth/item";
  import Button from "../../lib/button.svelte";
  import Icon from "../../lib/icon.svelte";

  let {
    parsedPage = $bindable<any>({}),
    pageType = $bindable<string>(""),
    loadPage,
    isSidebarOpen = true,
    onSidebarToggle,
  }: {
    parsedPage: ItemPage;
    pageType: string;
    loadPage: (parsed: any, type: string) => void;
    isSidebarOpen?: boolean;
    onSidebarToggle?: (open: boolean) => void;
  } = $props();

  // Media Gallery State
  let currentMediaIndex = $state(0);
  let isLightboxOpen = $state(false);
  let lightboxIndex = $state(0);
  let preloadedImages = $state(new Set<string>());
  let isLightboxImageLoading = $state(false);

  // Variation Selection
  let selectedVariationId = $state<string | null>(null);

  // Description Tabs
  let activeDescriptionTab = $state(0);

  // Computed
  let allMedia = $derived([
    ...(parsedPage?.media?.images ?? []).map((img: any) => ({
      type: "image" as const,
      thumbnail: img.thumbnailUrl,
      original: img.originalUrl,
    })),
    ...(parsedPage?.media?.videos ?? []).map((video: any) => ({
      type: "video" as const,
      thumbnail: "",
      embedUrl: video.embedUrl,
      videoType: video.type,
    })),
  ]);

  let selectedVariation = $derived(
    parsedPage?.variations?.find((v: any) => v.id === selectedVariationId) ??
      parsedPage?.variations?.[0]
  );

  // Initialize first variation
  $effect(() => {
    if (parsedPage?.variations?.length > 0 && !selectedVariationId) {
      selectedVariationId = parsedPage.variations[0].id;
    }
  });

  // Media Navigation
  function nextMedia() {
    if (allMedia.length > 1) {
      currentMediaIndex = (currentMediaIndex + 1) % allMedia.length;
    }
  }

  function prevMedia() {
    if (allMedia.length > 1) {
      currentMediaIndex =
        currentMediaIndex === 0 ? allMedia.length - 1 : currentMediaIndex - 1;
    }
  }

  function openLightbox(index: number) {
    if (allMedia[index]?.type === "image") {
      lightboxIndex = index;
      isLightboxOpen = true;
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    isLightboxOpen = false;
    document.body.style.overflow = "";
  }

  function lightboxNext() {
    // Skip videos in lightbox
    let nextIdx = (lightboxIndex + 1) % allMedia.length;
    while (allMedia[nextIdx]?.type !== "image" && nextIdx !== lightboxIndex) {
      nextIdx = (nextIdx + 1) % allMedia.length;
    }
    lightboxIndex = nextIdx;
  }

  function lightboxPrev() {
    let prevIdx = lightboxIndex === 0 ? allMedia.length - 1 : lightboxIndex - 1;
    while (allMedia[prevIdx]?.type !== "image" && prevIdx !== lightboxIndex) {
      prevIdx = prevIdx === 0 ? allMedia.length - 1 : prevIdx - 1;
    }
    lightboxIndex = prevIdx;
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
    allMedia.forEach((media) => {
      if (media.type === "image" && !preloadedImages.has(media.original)) {
        const img = new Image();
        img.src = media.original;
        img.onload = () => {
          preloadedImages = new Set([...preloadedImages, media.original]);
        };
      }
    });
  }

  function handleLightboxImageLoad() {
    isLightboxImageLoading = false;
  }

  $effect(() => {
    if (isLightboxOpen && allMedia[lightboxIndex]?.type === "image") {
      const media = allMedia[lightboxIndex];
      if (media.type === "image" && !preloadedImages.has(media.original)) {
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

  // Price formatting
  function formatPrice(price: number): string {
    return `¥${price.toLocaleString()}`;
  }

  function getPriceDisplay(): string {
    if (parsedPage?.product?.priceRange) {
      const { lowPrice, highPrice } = parsedPage.product.priceRange;
      if (lowPrice !== highPrice) {
        return `${formatPrice(lowPrice)} ~ ${formatPrice(highPrice)}`;
      }
    }
    return formatPrice(parsedPage?.product?.price ?? 0);
  }
</script>

<div class="item-page">
  <div class="main-container">
    <!-- Sidebar -->
    <aside class="sidebar" class:collapsed={!isSidebarOpen}>
      {#if isSidebarOpen}
        <!-- Shop Info -->
        <div class="sidebar-section shop-card">
          <a href={parsedPage?.shop?.url} class="shop-link">
            {#if parsedPage?.shop?.avatarUrl}
              <img
                src={parsedPage.shop.avatarUrl}
                alt={parsedPage.shop.name}
                class="shop-avatar"
              />
            {/if}
            <div class="shop-info">
              <span class="shop-name">{parsedPage?.shop?.name}</span>
              <span class="shop-url">@{parsedPage?.shop?.subdomain}</span>
            </div>
          </a>
          <div class="shop-actions">
            {#if parsedPage?.shop?.contactUrl}
              <a
                href={parsedPage.shop.contactUrl}
                class="shop-action-btn"
                title="Contact"
              >
                <Icon icon="MessageCircle" width="16" height="16" />
              </a>
            {/if}
            <a
              href={parsedPage?.shop?.cartUrl}
              class="shop-action-btn"
              title="Cart"
            >
              <Icon icon="ShoppingCart" width="16" height="16" />
            </a>
          </div>
        </div>

        <!-- Breadcrumbs -->
        {#if parsedPage?.breadcrumbs?.length > 0}
          <nav class="breadcrumbs" aria-label="Breadcrumb">
            {#each parsedPage.breadcrumbs as crumb, index}
              {#if index > 0}
                <Icon icon="ChevronRight" width="12" height="12" />
              {/if}
              <a href={crumb.url} class="breadcrumb-link">{crumb.label}</a>
            {/each}
          </nav>
        {/if}

        <!-- Tags -->
        {#if parsedPage?.tags?.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="Tags" width="16" height="16" />
              Tags
            </h3>
            <div class="tags-list">
              {#each parsedPage.tags as tag}
                <a href={tag.url} class="tag-item">
                  {#if tag.imageUrl}
                    <img src={tag.imageUrl} alt="" class="tag-image" />
                  {/if}
                  <span>{tag.name}</span>
                </a>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Recent Viewed -->
        {#if parsedPage?.recentViewedItems?.length > 0}
          <div class="sidebar-section">
            <h3 class="sidebar-title">
              <Icon icon="Clock" width="16" height="16" />
              Recently Viewed
            </h3>
            <div class="recent-items">
              {#each parsedPage.recentViewedItems as item}
                <a href={item.url} class="recent-item">
                  <img src={item.thumbnailUrl} alt="" />
                </a>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Shop Links -->
        <div class="sidebar-section shop-links">
          {#if parsedPage?.shop?.termsUrl}
            <a href={parsedPage.shop.termsUrl} class="shop-link-item">
              <Icon icon="FileText" width="14" height="14" />
              Terms of Service
            </a>
          {/if}
          {#if parsedPage?.shop?.privacyPolicyUrl}
            <a href={parsedPage.shop.privacyPolicyUrl} class="shop-link-item">
              <Icon icon="Shield" width="14" height="14" />
              Privacy Policy
            </a>
          {/if}
        </div>
      {/if}
    </aside>

    <!-- Main Content -->
    <main class="content">
      <!-- Product Header -->
      <div class="product-header">
        <!-- Badges -->
        {#if parsedPage?.badges?.length > 0}
          <div class="badges">
            {#each parsedPage.badges as badge}
              <a href={badge.url} class="badge" title={badge.name}>
                <img src={badge.imageUrl} alt={badge.name} />
              </a>
            {/each}
          </div>
        {/if}

        <h1 class="product-title">{parsedPage?.product?.name}</h1>

        <div class="product-meta">
          <div class="meta-item">
            <Icon icon="Heart" width="16" height="16" />
            <span
              >{parsedPage?.wishListCount?.toLocaleString() ?? 0} wishlisted</span
            >
          </div>
          {#if parsedPage?.publishedDate}
            <div class="meta-item">
              <Icon icon="Calendar" width="16" height="16" />
              <span>{parsedPage.publishedDate}</span>
            </div>
          {/if}
          {#if parsedPage?.product?.categoryName}
            <!-- svelte-ignore a11y_invalid_attribute -->
            <a href="#" class="meta-item category">
              <Icon icon="Folder" width="16" height="16" />
              <span>{parsedPage.product.categoryName}</span>
            </a>
          {/if}
          {#if parsedPage?.product?.event}
            <div class="meta-item event">
              <Icon icon="Star" width="16" height="16" />
              <span>{parsedPage.product.event}</span>
            </div>
          {/if}
        </div>
      </div>

      <!-- Product Layout -->
      <div class="product-layout">
        <!-- Media Gallery -->
        <div class="media-section">
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div class="media-main" onmouseenter={preloadAllImages}>
            {#if allMedia.length > 0}
              {@const currentMedia = allMedia[currentMediaIndex]}
              {#if currentMedia?.type === "image"}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div
                  class="media-image-wrapper"
                  onclick={() => openLightbox(currentMediaIndex)}
                >
                  <img
                    src={currentMedia.original}
                    alt={parsedPage?.product?.name}
                    class="media-image"
                  />
                  <div class="zoom-indicator">
                    <Icon icon="ZoomIn" width="20" height="20" />
                  </div>
                </div>
              {:else if currentMedia?.type === "video"}
                <div class="media-video-wrapper">
                  <iframe
                    src={currentMedia.embedUrl}
                    title="Video"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              {/if}
            {:else}
              <div class="media-placeholder">
                <Icon icon="Image" width="64" height="64" />
                <span>No images available</span>
              </div>
            {/if}

            <!-- Navigation Arrows -->
            {#if allMedia.length > 1}
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

          <!-- Thumbnails -->
          {#if allMedia.length > 1}
            <div class="media-thumbnails">
              {#each allMedia as media, index}
                <button
                  class="thumbnail-btn"
                  class:active={index === currentMediaIndex}
                  onclick={() => (currentMediaIndex = index)}
                >
                  {#if media.type === "image"}
                    <img src={media.thumbnail || media.original} alt="" />
                  {:else}
                    <div class="video-thumbnail">
                      <Icon icon="Play" width="20" height="20" />
                    </div>
                  {/if}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Purchase Section -->
        <div class="purchase-section">
          <!-- Price -->
          <div class="price-display">
            <span class="price">{getPriceDisplay()}</span>
          </div>

          <!-- Variations -->
          {#if parsedPage?.variations?.length > 0}
            <div class="variations-section">
              <h3 class="section-title">
                <Icon icon="Package" width="16" height="16" />
                Variations
              </h3>
              <div class="variations-list">
                {#each parsedPage.variations as variation}
                  <button
                    class="variation-item"
                    class:selected={variation.id === selectedVariationId}
                    class:unavailable={!variation.isAvailable}
                    onclick={() => (selectedVariationId = variation.id)}
                    disabled={!variation.isAvailable}
                  >
                    <div class="variation-info">
                      <span class="variation-name">{variation.name}</span>
                      <span class="variation-type">{variation.type}</span>
                    </div>
                    <div class="variation-price-stock">
                      <span class="variation-price"
                        >{variation.priceText ||
                          formatPrice(variation.price)}</span
                      >
                      {#if !variation.isAvailable}
                        <span class="sold-out-badge">Sold Out</span>
                      {:else if variation.stock !== null}
                        <span class="stock-badge">{variation.stock} left</span>
                      {/if}
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Add to Cart -->
          <div class="cart-actions">
            {#if selectedVariation?.isAvailable}
              <form
                action={selectedVariation.cartUrl}
                method="post"
                class="cart-form"
              >
                <input
                  type="hidden"
                  name="cart_item[variation_id]"
                  value={selectedVariation.id}
                />
                <Button variant="default" class="add-to-cart-btn">
                  <Icon icon="ShoppingCart" width="18" height="18" />
                  Add to Cart
                </Button>
              </form>
            {:else}
              <Button variant="secondary" disabled class="add-to-cart-btn">
                <Icon icon="XCircle" width="18" height="18" />
                Sold Out
              </Button>
            {/if}
            <Button variant="outline" class="wishlist-btn">
              <Icon icon="Heart" width="18" height="18" />
            </Button>
          </div>

          <!-- Shop Quick Info -->
          <div class="shop-quick-info">
            <a href={parsedPage?.shop?.url} class="shop-quick-link">
              {#if parsedPage?.shop?.avatarUrl}
                <img
                  src={parsedPage.shop.avatarUrl}
                  alt={parsedPage.shop.name}
                  class="shop-quick-avatar"
                />
              {/if}
              <div class="shop-quick-details">
                <span class="shop-quick-name">{parsedPage?.shop?.name}</span>
                <span class="shop-quick-text">View Shop</span>
              </div>
              <Icon icon="ChevronRight" width="16" height="16" />
            </a>
          </div>
        </div>
      </div>

      <!-- Description Section -->
      <div class="description-section">
        <!-- Main Description -->
        {#if parsedPage?.description}
          <div class="description-block">
            <h3 class="section-title">
              <Icon icon="FileText" width="16" height="16" />
              Description
            </h3>
            <div class="description-content">
              <p>{parsedPage.description}</p>
            </div>
          </div>
        {/if}

        <!-- Additional Description Sections -->
        {#if parsedPage?.descriptionSections?.length > 0}
          <div class="description-tabs">
            <div class="tabs-header">
              {#each parsedPage.descriptionSections as section, index}
                <button
                  class="tab-btn"
                  class:active={activeDescriptionTab === index}
                  onclick={() => (activeDescriptionTab = index)}
                >
                  {section.title}
                </button>
              {/each}
            </div>
            <div class="tab-content">
              <p>
                {parsedPage.descriptionSections[activeDescriptionTab]?.content}
              </p>
            </div>
          </div>
        {/if}
      </div>
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
    aria-label="Image viewer"
  >
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="lightbox-content" onclick={(e) => e.stopPropagation()}>
      <!-- Header -->
      <div class="lightbox-header">
        <div class="lightbox-title">
          <span class="lightbox-item-name">{parsedPage?.product?.name}</span>
          {#if allMedia.filter((m) => m.type === "image").length > 1}
            <span class="lightbox-counter">
              {lightboxIndex + 1} / {allMedia.filter((m) => m.type === "image")
                .length}
            </span>
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

      <!-- Main Image -->
      <div class="lightbox-main">
        {#if allMedia.filter((m) => m.type === "image").length > 1}
          <button
            class="lightbox-nav lightbox-prev"
            onclick={lightboxPrev}
            aria-label="Previous"
          >
            <Icon icon="ChevronLeft" width="28" height="28" />
          </button>
        {/if}

        <div class="lightbox-image-wrapper">
          {#if isLightboxImageLoading}
            <div class="lightbox-loader">
              <div class="loader-spinner"></div>
            </div>
          {/if}
          {#key lightboxIndex}
            {@const lightboxMedia = allMedia[lightboxIndex]}
            {#if lightboxMedia?.type === "image"}
              <img
                src={lightboxMedia.original}
                alt={`${parsedPage?.product?.name} - Image ${lightboxIndex + 1}`}
                class="lightbox-image"
                class:loading={isLightboxImageLoading}
                onload={handleLightboxImageLoad}
              />
            {/if}
          {/key}
        </div>

        {#if allMedia.filter((m) => m.type === "image").length > 1}
          <button
            class="lightbox-nav lightbox-next"
            onclick={lightboxNext}
            aria-label="Next"
          >
            <Icon icon="ChevronRight" width="28" height="28" />
          </button>
        {/if}
      </div>

      <!-- Thumbnails -->
      {#if allMedia.filter((m) => m.type === "image").length > 1}
        <div class="lightbox-thumbnails-strip">
          <div class="lightbox-thumbnails">
            {#each allMedia as media, index}
              {#if media.type === "image"}
                <button
                  class="lightbox-thumb"
                  class:active={index === lightboxIndex}
                  onclick={() => (lightboxIndex = index)}
                >
                  <img src={media.thumbnail || media.original} alt="" />
                </button>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .item-page {
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

  /* ============ Sidebar ============ */
  .sidebar {
    width: 18rem;
    background-color: var(--card);
    border-right: 1px solid var(--border);
    padding: 1rem;
    overflow-y: auto;
    transition:
      width 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar.collapsed {
    width: 0;
    padding: 0;
    overflow: hidden;
  }

  .sidebar-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .sidebar-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--foreground);
  }

  /* Shop Card */
  .shop-card {
    background-color: var(--accent);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .shop-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--foreground);
  }

  .shop-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--border);
  }

  .shop-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .shop-name {
    font-weight: 600;
    font-size: 0.875rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .shop-url {
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  .shop-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .shop-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    background-color: var(--background);
    color: var(--foreground);
    text-decoration: none;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }

  .shop-action-btn:hover {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  /* Breadcrumbs */
  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
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

  /* Tags */
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    background-color: var(--secondary);
    border-radius: 2rem;
    font-size: 0.75rem;
    text-decoration: none;
    color: var(--secondary-foreground);
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
  }

  .tag-item:hover {
    background-color: var(--primary);
    color: var(--primary-foreground);
    transform: translateY(-1px);
  }

  .tag-image {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    object-fit: cover;
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

  /* Shop Links */
  .shop-links {
    border-top: 1px solid var(--border);
    padding-top: 1rem;
    margin-top: auto;
  }

  .shop-link-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
    text-decoration: none;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }

  .shop-link-item:hover {
    background-color: var(--accent);
    color: var(--foreground);
  }

  /* ============ Main Content ============ */
  .content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  /* Product Header */
  .product-header {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .badge {
    height: 1.75rem;
  }

  .badge img {
    height: 100%;
    width: auto;
    border-radius: 0.25rem;
  }

  .product-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--foreground);
    margin: 0;
    line-height: 1.3;
  }

  .product-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    color: var(--muted-foreground);
    font-size: 0.875rem;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .meta-item.category,
  .meta-item.event {
    color: var(--primary);
    text-decoration: none;
  }

  .meta-item.category:hover {
    text-decoration: underline;
  }

  /* Product Layout */
  .product-layout {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
  }

  /* ============ Media Section ============ */
  .media-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .media-main {
    position: relative;
    aspect-ratio: 1;
    background-color: var(--muted);
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .media-image-wrapper {
    width: 100%;
    height: 100%;
    cursor: zoom-in;
    position: relative;
  }

  .media-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  .media-image-wrapper:hover .media-image {
    transform: scale(1.02);
  }

  .zoom-indicator {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background-color: var(--background);
    color: var(--foreground);
    padding: 0.5rem;
    border-radius: 0.375rem;
    opacity: 0;
    transition: opacity 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .media-image-wrapper:hover .zoom-indicator {
    opacity: 1;
  }

  .media-video-wrapper {
    width: 100%;
    height: 100%;
  }

  .media-video-wrapper iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  .media-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: var(--muted-foreground);
  }

  .media-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background-color: var(--background);
    color: var(--foreground);
    border: 1px solid var(--border);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
  }

  .media-nav:hover {
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
  }

  .media-prev {
    left: 1rem;
  }

  .media-next {
    right: 1rem;
  }

  /* Thumbnails */
  .media-thumbnails {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.25rem;
  }

  .thumbnail-btn {
    width: 4.5rem;
    height: 4.5rem;
    border: 2px solid var(--border);
    border-radius: 0.5rem;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    background: var(--background);
    flex-shrink: 0;
    transition: all 0.2s ease;
    opacity: 0.6;
  }

  .thumbnail-btn:hover {
    opacity: 0.9;
    border-color: var(--primary);
  }

  .thumbnail-btn.active {
    border-color: var(--primary);
    opacity: 1;
    box-shadow: 0 0 0 2px var(--primary);
  }

  .thumbnail-btn img {
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
    color: var(--muted-foreground);
  }

  /* ============ Purchase Section ============ */
  .purchase-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 1.5rem;
    height: fit-content;
    position: sticky;
    top: 1.5rem;
  }

  .price-display {
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }

  .price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary);
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--foreground);
    margin: 0 0 0.75rem 0;
  }

  /* Variations */
  .variations-section {
    display: flex;
    flex-direction: column;
  }

  .variations-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 300px;
    overflow-y: auto;
  }

  .variation-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background-color: var(--background);
    border: 2px solid var(--border);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .variation-item:hover:not(:disabled) {
    border-color: var(--primary);
  }

  .variation-item.selected {
    border-color: var(--primary);
    background-color: var(--accent);
  }

  .variation-item.unavailable {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .variation-info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .variation-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
  }

  .variation-type {
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  .variation-price-stock {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .variation-price {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--primary);
  }

  .sold-out-badge {
    font-size: 0.625rem;
    padding: 0.125rem 0.5rem;
    background-color: var(--destructive);
    color: var(--destructive-foreground);
    border-radius: 2rem;
    text-transform: uppercase;
    font-weight: 600;
  }

  .stock-badge {
    font-size: 0.625rem;
    padding: 0.125rem 0.5rem;
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    border-radius: 2rem;
  }

  /* Cart Actions */
  .cart-actions {
    display: flex;
    gap: 0.75rem;
  }

  .cart-form {
    flex: 1;
  }

  .cart-actions :global(.add-to-cart-btn) {
    width: 100%;
    height: 3rem;
    font-size: 1rem;
    gap: 0.5rem;
  }

  .cart-actions :global(.wishlist-btn) {
    width: 3rem;
    height: 3rem;
    flex-shrink: 0;
  }

  /* Shop Quick Info */
  .shop-quick-info {
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  .shop-quick-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background-color: var(--background);
    border-radius: 0.5rem;
    text-decoration: none;
    color: var(--foreground);
    transition: background-color 0.15s ease;
  }

  .shop-quick-link:hover {
    background-color: var(--accent);
  }

  .shop-quick-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    object-fit: cover;
  }

  .shop-quick-details {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .shop-quick-name {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .shop-quick-text {
    font-size: 0.75rem;
    color: var(--primary);
  }

  /* ============ Description Section ============ */
  .description-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .description-block {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 1.5rem;
  }

  .description-content {
    font-size: 0.9375rem;
    line-height: 1.7;
    color: var(--foreground);
    white-space: pre-wrap;
  }

  .description-content p {
    margin: 0;
  }

  /* Description Tabs */
  .description-tabs {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .tabs-header {
    display: flex;
    border-bottom: 1px solid var(--border);
    background-color: var(--accent);
    overflow-x: auto;
  }

  .tab-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--muted-foreground);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
  }

  .tab-btn:hover {
    color: var(--foreground);
  }

  .tab-btn.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
    background-color: var(--card);
  }

  .tab-content {
    padding: 1.5rem;
    font-size: 0.9375rem;
    line-height: 1.7;
    white-space: pre-wrap;
  }

  .tab-content p {
    margin: 0;
  }

  /* ============ Lightbox ============ */
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
    max-width: 50vw;
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

  .lightbox-image-wrapper {
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

  .lightbox-thumb {
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

  /* ============ Responsive ============ */
  @media (max-width: 1200px) {
    .product-layout {
      grid-template-columns: 1fr 350px;
    }
  }

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

    .product-layout {
      grid-template-columns: 1fr;
    }

    .purchase-section {
      position: static;
    }
  }

  @media (max-width: 768px) {
    .content {
      padding: 1rem;
    }

    .product-title {
      font-size: 1.375rem;
    }

    .product-meta {
      font-size: 0.8125rem;
    }

    .price {
      font-size: 1.5rem;
    }

    .media-main {
      aspect-ratio: 4/3;
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
      max-width: 40vw;
      font-size: 0.8rem;
    }

    .lightbox-thumb {
      width: 3rem;
      height: 3rem;
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

    .thumbnail-btn {
      width: 3.5rem;
      height: 3.5rem;
    }

    .cart-actions {
      flex-direction: column;
    }

    .cart-actions :global(.wishlist-btn) {
      width: 100%;
    }
  }
</style>
