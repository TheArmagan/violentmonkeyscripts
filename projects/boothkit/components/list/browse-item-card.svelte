<script lang="ts">
  import type { BrowsePageItem } from "../../parsers/browse";
  import Icon from "../lib/icon.svelte";

  let {
    item,
  }: {
    item: BrowsePageItem;
  } = $props();

  let currentThumbnailIndex = $state(0);
  let isLightboxOpen = $state(false);
  let lightboxIndex = $state(0);
  let preloadedImages = $state(new Set<string>());
  let isLightboxImageLoading = $state(false);

  function nextThumbnail() {
    if (item.thumbnails.length > 1) {
      currentThumbnailIndex =
        (currentThumbnailIndex + 1) % item.thumbnails.length;
    }
  }

  function prevThumbnail() {
    if (item.thumbnails.length > 1) {
      currentThumbnailIndex =
        currentThumbnailIndex === 0
          ? item.thumbnails.length - 1
          : currentThumbnailIndex - 1;
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
    lightboxIndex = (lightboxIndex + 1) % item.thumbnails.length;
  }

  function lightboxPrev() {
    lightboxIndex =
      lightboxIndex === 0 ? item.thumbnails.length - 1 : lightboxIndex - 1;
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

  function handleCardKeydown(e: KeyboardEvent) {
    if (isLightboxOpen) return;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        nextThumbnail();
        break;
      case "ArrowLeft":
        e.preventDefault();
        prevThumbnail();
        break;
    }
  }

  // Preload all thumbnails
  function preloadAllThumbnails() {
    item.thumbnails.forEach((src) => {
      if (!preloadedImages.has(src)) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          preloadedImages = new Set([...preloadedImages, src]);
        };
      }
    });
  }

  // Handle lightbox image loading
  function handleLightboxImageLoad() {
    isLightboxImageLoading = false;
  }

  // When lightbox index changes, show loading if image not preloaded
  $effect(() => {
    if (isLightboxOpen && item.thumbnails[lightboxIndex]) {
      if (!preloadedImages.has(item.thumbnails[lightboxIndex])) {
        isLightboxImageLoading = true;
      }
    }
  });

  $effect(() => {
    if (isLightboxOpen) {
      window.addEventListener("keydown", handleLightboxKeydown);
      // Preload all images when lightbox opens
      preloadAllThumbnails();
      return () => window.removeEventListener("keydown", handleLightboxKeydown);
    }
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_redundant_roles -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<article
  class="item-card"
  tabindex="0"
  onkeydown={handleCardKeydown}
  onmouseenter={preloadAllThumbnails}
  role="article"
  aria-label={item.name}
>
  <!-- Thumbnail Section -->
  <div class="thumbnail-section">
    <div
      class="thumbnail-container"
      onclick={() => openLightbox(currentThumbnailIndex)}
      onkeydown={(e) =>
        e.key === "Enter" && openLightbox(currentThumbnailIndex)}
      tabindex="0"
      role="button"
      aria-label="View larger image"
    >
      {#if item.thumbnails.length > 0}
        <img
          src={item.thumbnails[currentThumbnailIndex]}
          alt={item.name}
          class="thumbnail-image"
          loading="lazy"
        />
      {:else}
        <div class="thumbnail-placeholder">
          <Icon icon="Image" width="48" height="48" />
        </div>
      {/if}

      <!-- Zoom indicator -->
      <div class="zoom-indicator">
        <Icon icon="ZoomIn" width="16" height="16" />
      </div>
    </div>

    <!-- Thumbnail Navigation -->
    {#if item.thumbnails.length > 1}
      <div class="thumbnail-nav">
        <button
          class="nav-btn nav-prev"
          onclick={prevThumbnail}
          aria-label="Previous image"
        >
          <Icon icon="ChevronLeft" width="16" height="16" />
        </button>
        <div class="thumbnail-dots">
          {#each item.thumbnails as _, index}
            <button
              class="dot"
              class:active={index === currentThumbnailIndex}
              onclick={() => (currentThumbnailIndex = index)}
              aria-label={`View image ${index + 1}`}
            ></button>
          {/each}
        </div>
        <button
          class="nav-btn nav-next"
          onclick={nextThumbnail}
          aria-label="Next image"
        >
          <Icon icon="ChevronRight" width="16" height="16" />
        </button>
      </div>
    {/if}

    <!-- Badges -->
    {#if item.badges.length > 0}
      <div class="badges">
        {#each item.badges as badge}
          <a href={badge.url} class="badge" title={badge.name}>
            <img src={badge.imageUrl} alt={badge.name} />
          </a>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Content Section -->
  <div class="content-section">
    <!-- Shop Info -->
    <a href={item.shop.url} class="shop-info">
      {#if item.shop.avatarUrl}
        <img
          src={item.shop.avatarUrl}
          alt={item.shop.name}
          class="shop-avatar"
        />
      {/if}
      <span class="shop-name">{item.shop.name}</span>
    </a>

    <!-- Item Title -->
    <a href={item.url} class="item-title" title={item.name}>
      {item.name}
    </a>

    <!-- Price Section -->
    <div class="price-section">
      <span class="price"
        >{item.priceText || `¥${item.price.toLocaleString()}`}</span
      >
    </div>

    <!-- Meta Info -->
    <div class="meta-section">
      <!-- Wishlist Count -->
      <div class="meta-item" title="Wishlisted">
        <Icon icon="Heart" width="14" height="14" />
        <span>{item.wishListCount.toLocaleString()}</span>
      </div>

      <!-- Category -->
      {#if item.brand}
        <div class="meta-item brand" title="Brand">
          <Icon icon="Tag" width="14" height="14" />
          <span>{item.brand}</span>
        </div>
      {/if}

      <!-- Event -->
      {#if item.event}
        <div class="meta-item event" title="Event">
          <Icon icon="Calendar" width="14" height="14" />
          <span>{item.event}</span>
        </div>
      {/if}
    </div>
  </div>
</article>

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
      <!-- Header Bar -->
      <div class="lightbox-header">
        <div class="lightbox-title">
          <span class="lightbox-item-name">{item.name}</span>
          {#if item.thumbnails.length > 1}
            <span class="lightbox-counter">
              {lightboxIndex + 1} / {item.thumbnails.length}
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

      <!-- Main Image Area -->
      <div class="lightbox-main">
        {#if item.thumbnails.length > 1}
          <button
            class="lightbox-nav lightbox-prev"
            onclick={lightboxPrev}
            aria-label="Previous image"
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
            <img
              src={item.thumbnails[lightboxIndex]}
              alt={`${item.name} - Image ${lightboxIndex + 1}`}
              class="lightbox-image"
              class:loading={isLightboxImageLoading}
              onload={handleLightboxImageLoad}
            />
          {/key}
        </div>

        {#if item.thumbnails.length > 1}
          <button
            class="lightbox-nav lightbox-next"
            onclick={lightboxNext}
            aria-label="Next image"
          >
            <Icon icon="ChevronRight" width="28" height="28" />
          </button>
        {/if}
      </div>

      <!-- Bottom Thumbnails Strip -->
      {#if item.thumbnails.length > 1}
        <div class="lightbox-thumbnails-strip">
          <div class="lightbox-thumbnails">
            {#each item.thumbnails as thumb, index}
              <button
                class="lightbox-thumb"
                class:active={index === lightboxIndex}
                onclick={() => (lightboxIndex = index)}
                aria-label={`View image ${index + 1}`}
              >
                <img src={thumb} alt="" />
                {#if !preloadedImages.has(thumb)}
                  <div class="thumb-loading"></div>
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
  .item-card {
    display: flex;
    flex-direction: column;
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    overflow: hidden;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }

  .item-card:hover {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }

  .item-card:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--ring);
  }

  /* Thumbnail Section */
  .thumbnail-section {
    position: relative;
    aspect-ratio: 1;
    background-color: var(--muted);
    overflow: hidden;
  }

  .thumbnail-container {
    width: 100%;
    height: 100%;
    cursor: zoom-in;
    position: relative;
  }

  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .thumbnail-container:hover .thumbnail-image {
    transform: scale(1.05);
  }

  .thumbnail-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted-foreground);
  }

  .zoom-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: var(--background);
    color: var(--foreground);
    padding: 0.375rem;
    border-radius: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    opacity: 0;
    transition: opacity 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thumbnail-container:hover .zoom-indicator {
    opacity: 1;
  }

  /* Thumbnail Navigation */
  .thumbnail-nav {
    position: absolute;
    bottom: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: var(--background);
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    background: transparent;
    color: var(--foreground);
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.15s ease;
  }

  .nav-btn:hover {
    background-color: var(--accent);
  }

  .thumbnail-dots {
    display: flex;
    gap: 0.25rem;
  }

  .dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    border: none;
    background-color: var(--muted-foreground);
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
    padding: 0;
  }

  .dot:hover {
    transform: scale(1.2);
  }

  .dot.active {
    background-color: var(--primary);
  }

  /* Badges */
  .badges {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    max-width: calc(100% - 3rem);
  }

  .badge {
    display: block;
    height: 1.5rem;
  }

  .badge img {
    height: 100%;
    width: auto;
    border-radius: 0.25rem;
  }

  /* Content Section */
  .content-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
  }

  /* Shop Info */
  .shop-info {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    text-decoration: none;
    color: var(--muted-foreground);
    font-size: 0.75rem;
    transition: color 0.15s ease;
  }

  .shop-info:hover {
    color: var(--primary);
  }

  .shop-avatar {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    object-fit: cover;
  }

  .shop-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Item Title */
  .item-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
    text-decoration: none;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    transition: color 0.15s ease;
  }

  .item-title:hover {
    color: var(--primary);
  }

  /* Price Section */
  .price-section {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }

  .price {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--primary);
  }

  /* Meta Section */
  .meta-section {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .meta-item.brand,
  .meta-item.event {
    max-width: 100%;
    overflow: hidden;
  }

  .meta-item.brand span,
  .meta-item.event span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Lightbox */
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

  /* Header */
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

  /* Main Image Area */
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

  .lightbox-nav:active {
    transform: translateY(-50%) scale(0.95);
  }

  .lightbox-prev {
    left: 1rem;
  }

  .lightbox-next {
    right: 1rem;
  }

  /* Bottom Thumbnails Strip */
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

  /* Responsive */
  @media (max-width: 768px) {
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
  }
</style>
