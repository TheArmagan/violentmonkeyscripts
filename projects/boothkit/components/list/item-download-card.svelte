<script lang="ts">
  import type {
    SearchPage,
    TransformedSearchResult,
    ItemSearchResult,
    DeepScanResult,
    DownloadLink,
  } from "../../parsers/ripperstore/search";
  import {
    SearchResultTransformer,
    DOWNLOAD_DOMAINS,
    deepScanSearchResult,
  } from "../../parsers/ripperstore/search";
  import Icon from "../lib/icon.svelte";

  let {
    searchPage = $bindable<SearchPage | null>(null),
    searchResult = null as ItemSearchResult | null,
    itemId = "",
    isLoading = false,
    error = null as string | null,
    onRefresh,
  }: {
    searchPage: SearchPage | null;
    searchResult?: ItemSearchResult | null;
    itemId?: string;
    isLoading?: boolean;
    error?: string | null;
    onRefresh?: () => void;
  } = $props();

  // Deep scan state
  let deepScanResults = $state<Map<string, DeepScanResult>>(new Map());
  let deepScanningIds = $state<Set<string>>(new Set());

  // Transform and sort search results
  // Use pre-transformed results from searchResult if available, otherwise transform searchPage
  let transformedResults = $derived.by(() => {
    // If we have a comprehensive search result with results, use those
    if (
      searchResult &&
      searchResult.results &&
      searchResult.results.length > 0
    ) {
      return searchResult.results;
    }
    // Fall back to transforming searchPage
    if (!searchPage) {
      return [];
    }
    return SearchResultTransformer.transformAndScore(searchPage);
  });

  // Search strategies info (for display)
  let searchStrategiesInfo = $derived.by(() => {
    if (!searchResult) return null;
    return {
      strategiesUsed: searchResult.strategiesUsed,
      totalUniqueResults: searchResult.totalUniqueResults,
      searches: searchResult.searchResults.map((s) => ({
        strategy: s.strategy,
        query: s.query,
        resultCount: s.totalResults,
      })),
    };
  });

  // Get combined download links for a result (original + deep scan)
  function getResultDownloads(result: TransformedSearchResult): DownloadLink[] {
    const deepScan = deepScanResults.get(result.id);
    if (deepScan) {
      return deepScan.downloadLinks;
    }
    return result.downloadLinks;
  }

  // Check if result has downloads (considering deep scan)
  function resultHasDownloads(result: TransformedSearchResult): boolean {
    const deepScan = deepScanResults.get(result.id);
    if (deepScan) {
      return deepScan.downloadLinks.length > 0;
    }
    return result.hasDownloads;
  }

  // Get download count for a result (considering deep scan)
  function getResultDownloadCount(result: TransformedSearchResult): number {
    const deepScan = deepScanResults.get(result.id);
    if (deepScan) {
      return deepScan.downloadLinks.length;
    }
    return result.downloadCount;
  }

  // Get deep scan stats for a result
  function getDeepScanStats(resultId: string): DeepScanResult["stats"] | null {
    return deepScanResults.get(resultId)?.stats ?? null;
  }

  // Deep scan a single result
  async function performDeepScan(result: TransformedSearchResult) {
    if (deepScanningIds.has(result.id)) return;

    deepScanningIds = new Set([...deepScanningIds, result.id]);

    try {
      const scanResult = await deepScanSearchResult(result, {
        maxDepth: 3,
        maxPostsPerTopic: 100,
      });

      deepScanResults = new Map([...deepScanResults, [result.id, scanResult]]);
    } catch (err) {
      console.error("[BoothKit] Deep scan failed:", err);
    } finally {
      const newSet = new Set(deepScanningIds);
      newSet.delete(result.id);
      deepScanningIds = newSet;
    }
  }

  // Deep scan all visible results
  let isDeepScanningAll = $state(false);

  async function performDeepScanAll() {
    if (isDeepScanningAll) return;
    isDeepScanningAll = true;

    // Scan top results (limit to 20 for performance)
    const toScan = activeResults.slice(0, 20);

    for (const result of toScan) {
      if (!deepScanResults.has(result.id)) {
        await performDeepScan(result);
      }
    }

    isDeepScanningAll = false;
  }

  // Count of deep scanned results
  let deepScannedCount = $derived(deepScanResults.size);
  let totalDeepDownloads = $derived(
    Array.from(deepScanResults.values()).reduce(
      (sum, r) => sum + r.stats.totalDownloadsFound,
      0
    )
  );

  // Filter to only results with downloads (excluding megathreads)
  // Re-evaluate when deepScanResults changes
  let resultsWithDownloads = $derived.by(() => {
    // Spread deepScanResults to trigger reactivity when map changes
    const deepScansArray = [...deepScanResults.entries()];
    return transformedResults.filter((r) => {
      const deepScan = deepScansArray.find(([id]) => id === r.id)?.[1];
      if (deepScan) {
        return deepScan.downloadLinks.length > 0 && !r.isMegathread;
      }
      return r.hasDownloads && !r.isMegathread;
    });
  });

  // Megathreads (separate section)
  let megathreads = $derived(transformedResults.filter((r) => r.isMegathread));

  // Results with references only (no downloads even after deep scan)
  let resultsWithReferences = $derived.by(() => {
    const deepScansArray = [...deepScanResults.entries()];
    return transformedResults.filter((r) => {
      const deepScan = deepScansArray.find(([id]) => id === r.id)?.[1];
      const hasDownloads = deepScan
        ? deepScan.downloadLinks.length > 0
        : r.hasDownloads;
      return r.hasReferences && !hasDownloads && !r.isMegathread;
    });
  });

  // All other results (not in any other category)
  let otherResults = $derived.by(() => {
    const deepScansArray = [...deepScanResults.entries()];
    return transformedResults.filter((r) => {
      const deepScan = deepScansArray.find(([id]) => id === r.id)?.[1];
      const hasDownloads = deepScan
        ? deepScan.downloadLinks.length > 0
        : r.hasDownloads;
      return !hasDownloads && !r.hasReferences && !r.isMegathread;
    });
  });

  // Active tab
  let activeTab = $state<"downloads" | "megathreads" | "references" | "other">(
    "downloads"
  );

  // Track if initial tab selection has been done
  let initialTabSet = $state(false);

  // Auto-switch to first tab with results ONLY on initial load
  $effect(() => {
    // Only run once when results first load
    if (initialTabSet) return;
    if (transformedResults.length === 0) return;

    initialTabSet = true;

    // Switch to first tab with results
    if (resultsWithDownloads.length > 0) {
      activeTab = "downloads";
    } else if (megathreads.length > 0) {
      activeTab = "megathreads";
    } else if (resultsWithReferences.length > 0) {
      activeTab = "references";
    } else if (otherResults.length > 0) {
      activeTab = "other";
    }
  });

  // Expanded post state
  let expandedPosts = $state(new Set<string>());

  function togglePostExpansion(postId: string) {
    if (expandedPosts.has(postId)) {
      expandedPosts.delete(postId);
      expandedPosts = new Set(expandedPosts);
    } else {
      expandedPosts.add(postId);
      expandedPosts = new Set(expandedPosts);
    }
  }

  // Get domain from URL
  function getDomainFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, "");
    } catch {
      return "unknown";
    }
  }

  // Get icon for domain
  function getDomainIcon(domain: string): string {
    const domainLower = domain.toLowerCase();
    if (
      domainLower.includes("drive.google") ||
      domainLower.includes("docs.google")
    )
      return "HardDrive";
    if (domainLower.includes("mega")) return "Cloud";
    if (domainLower.includes("mediafire")) return "Flame";
    if (domainLower.includes("dropbox")) return "Box";
    if (domainLower.includes("pixeldrain")) return "Image";
    if (domainLower.includes("gofile")) return "FileArchive";
    if (domainLower.includes("onedrive") || domainLower.includes("1drv"))
      return "Cloud";
    return "Download";
  }

  // Format strategy name for display
  function formatStrategyName(strategy: string | undefined): string {
    if (!strategy) return "";
    switch (strategy) {
      case "itemId":
        return "ID";
      case "productName":
        return "Name";
      case "shopAndProduct":
        return "Shop+Name";
      case "keywords":
        return "Keywords";
      case "tags":
        return "Tags";
      case "category":
        return "Category";
      default:
        return strategy;
    }
  }

  // Format date
  function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }

  // Get active results based on tab
  let activeResults = $derived.by(() => {
    switch (activeTab) {
      case "downloads":
        return resultsWithDownloads;
      case "megathreads":
        return megathreads;
      case "references":
        return resultsWithReferences;
      case "other":
        return otherResults;
      default:
        return [];
    }
  });
</script>

<div class="download-card">
  <!-- Header -->
  <div class="card-header">
    <div class="header-title">
      <Icon icon="Download" width="20" height="20" />
      <h2>Available Downloads</h2>
      {#if searchResult}
        <span class="result-count">
          {searchResult.totalUniqueResults} result{searchResult.totalUniqueResults !==
          1
            ? "s"
            : ""}
        </span>
      {:else if searchPage}
        <span class="result-count">
          {searchPage.results.totalResults} result{searchPage.results
            .totalResults !== 1
            ? "s"
            : ""}
        </span>
      {/if}
      {#if deepScannedCount > 0}
        <span class="deep-scan-summary">
          <Icon icon="Layers" width="14" height="14" />
          {totalDeepDownloads} from {deepScannedCount} deep scans
        </span>
      {/if}
    </div>
    <div class="header-actions">
      {#if transformedResults.length > 0}
        <button
          class="deep-scan-all-btn"
          class:scanning={isDeepScanningAll}
          onclick={performDeepScanAll}
          disabled={isDeepScanningAll || deepScanningIds.size > 0}
          title="Deep scan top results to find more downloads"
        >
          {#if isDeepScanningAll || deepScanningIds.size > 0}
            <Icon icon="Loader2" width="14" height="14" class="spinning" />
            Scanning...
          {:else}
            <Icon icon="Layers" width="14" height="14" />
            Deep Scan All
          {/if}
        </button>
      {/if}
      {#if onRefresh}
        <button
          class="refresh-btn"
          onclick={onRefresh}
          disabled={isLoading}
          title="Refresh search results"
        >
          <Icon
            icon="RefreshCw"
            width="16"
            height="16"
            class={isLoading ? "spinning" : ""}
          />
        </button>
      {/if}
    </div>
  </div>

  <!-- Loading State -->
  {#if isLoading}
    <div class="loading-state">
      <div class="loader-spinner"></div>
      <span>Searching for downloads...</span>
    </div>
  {:else if error}
    <!-- Error State -->
    <div class="error-state">
      <Icon icon="AlertCircle" width="32" height="32" />
      <span>{error}</span>
      {#if onRefresh}
        <button class="retry-btn" onclick={onRefresh}>
          <Icon icon="RefreshCw" width="16" height="16" />
          Try Again
        </button>
      {/if}
    </div>
  {:else if !searchPage && !searchResult}
    <!-- Empty State -->
    <div class="empty-state">
      <Icon icon="Search" width="48" height="48" />
      <span>No search performed yet</span>
    </div>
  {:else if transformedResults.length === 0}
    <!-- No Results -->
    <div class="empty-state">
      <Icon icon="FileX" width="48" height="48" />
      <span>No downloads found for this item</span>
      {#if searchStrategiesInfo}
        <div class="search-strategies-info">
          <span
            >Searched using: {searchStrategiesInfo.strategiesUsed
              .map((s) => formatStrategyName(s))
              .join(", ")}</span
          >
        </div>
      {/if}
    </div>
  {:else}
    <!-- Tabs -->
    <div class="tabs-header">
      <button
        class="tab-button"
        class:active={activeTab === "downloads"}
        onclick={() => (activeTab = "downloads")}
      >
        <Icon icon="Download" width="16" height="16" />
        Downloads
        {#if resultsWithDownloads.length > 0}
          <span class="tab-count">{resultsWithDownloads.length}</span>
        {/if}
      </button>
      <button
        class="tab-button"
        class:active={activeTab === "megathreads"}
        onclick={() => (activeTab = "megathreads")}
      >
        <Icon icon="Library" width="16" height="16" />
        Megathreads
        {#if megathreads.length > 0}
          <span class="tab-count">{megathreads.length}</span>
        {/if}
      </button>
      <button
        class="tab-button"
        class:active={activeTab === "references"}
        onclick={() => (activeTab = "references")}
      >
        <Icon icon="Link" width="16" height="16" />
        References
        {#if resultsWithReferences.length > 0}
          <span class="tab-count">{resultsWithReferences.length}</span>
        {/if}
      </button>
      {#if otherResults.length > 0}
        <button
          class="tab-button"
          class:active={activeTab === "other"}
          onclick={() => (activeTab = "other")}
        >
          <Icon icon="FileText" width="16" height="16" />
          Other
          <span class="tab-count">{otherResults.length}</span>
        </button>
      {/if}
    </div>

    <!-- Results List -->
    <div class="results-list">
      {#if activeResults.length === 0}
        <div class="empty-tab">
          <Icon icon="Inbox" width="32" height="32" />
          <span>No {activeTab} found</span>
        </div>
      {:else}
        {#each activeResults as result (result.id)}
          <div
            class="result-card"
            class:expanded={expandedPosts.has(result.id)}
          >
            <!-- Result Header -->
            <button
              class="result-header"
              onclick={() => togglePostExpansion(result.id)}
            >
              <div class="result-info">
                <h3 class="result-title">{result.title}</h3>
                <div class="result-meta">
                  <span class="meta-item">
                    <Icon icon="User" width="12" height="12" />
                    {result.user}
                  </span>
                  <span class="meta-item">
                    <Icon icon="Calendar" width="12" height="12" />
                    {formatDate(result.timestamp)}
                  </span>
                  {#if result.votes > 0}
                    <span class="meta-item votes">
                      <Icon icon="ThumbsUp" width="12" height="12" />
                      {result.votes}
                    </span>
                  {/if}
                  {#if result.score}
                    <span class="meta-item score">
                      <Icon icon="Zap" width="12" height="12" />
                      {Math.round(result.score)}
                    </span>
                  {/if}
                </div>
              </div>
              <div class="result-badges">
                {#if result.foundVia}
                  <span
                    class="badge found-via-badge"
                    title={result.foundQuery
                      ? `Query: "${result.foundQuery}"`
                      : ""}
                  >
                    <Icon icon="Search" width="12" height="12" />
                    {formatStrategyName(result.foundVia)}
                  </span>
                {/if}
                {#if getResultDownloadCount(result) > 0}
                  {@const combinedCount = getResultDownloadCount(result)}
                  {@const deepScanResult = deepScanResults.get(result.id)}
                  {@const hasDeepScanBonus =
                    deepScanResult && deepScanResult.downloadLinks.length > 0}
                  <span
                    class="badge download-badge"
                    class:deep-scan-enhanced={hasDeepScanBonus}
                    title={hasDeepScanBonus
                      ? `${result.downloadCount} original + ${deepScanResult.downloadLinks.length} from deep scan`
                      : ""}
                  >
                    <Icon icon="Download" width="12" height="12" />
                    {combinedCount}
                    {#if hasDeepScanBonus}
                      <span class="deep-scan-indicator"
                        >+{deepScanResult.downloadLinks.length}</span
                      >
                    {/if}
                  </span>
                {/if}
                {#if result.referenceCount > 0}
                  <span class="badge reference-badge">
                    <Icon icon="Link" width="12" height="12" />
                    {result.referenceCount}
                  </span>
                {/if}
                {#if result.isMegathread}
                  <span class="badge megathread-badge">
                    <Icon icon="Library" width="12" height="12" />
                    Megathread
                  </span>
                {/if}
              </div>
              <Icon
                icon="ChevronDown"
                width="20"
                height="20"
                class="expand-icon"
              />
            </button>

            <!-- Expanded Content -->
            {#if expandedPosts.has(result.id)}
              <div class="result-content">
                <!-- Download Links Section Header -->
                <div class="links-section-header">
                  <h4 class="section-label">
                    <Icon icon="Download" width="14" height="14" />
                    Download Links
                    {#if getDeepScanStats(result.id)}
                      <span class="deep-scan-badge">
                        <Icon icon="Layers" width="12" height="12" />
                        Deep Scanned
                      </span>
                    {/if}
                  </h4>
                  <button
                    class="deep-scan-btn"
                    class:scanning={deepScanningIds.has(result.id)}
                    onclick={() => performDeepScan(result)}
                    disabled={deepScanningIds.has(result.id)}
                    title="Deep scan to find more downloads from replies"
                  >
                    {#if deepScanningIds.has(result.id)}
                      <Icon
                        icon="Loader2"
                        width="14"
                        height="14"
                        class="spinning"
                      />
                      Scanning...
                    {:else if deepScanResults.has(result.id)}
                      <Icon icon="RefreshCw" width="14" height="14" />
                      Rescan
                    {:else}
                      <Icon icon="Layers" width="14" height="14" />
                      Deep Scan
                    {/if}
                  </button>
                </div>

                <!-- Deep Scan Stats -->
                {#if getDeepScanStats(result.id)}
                  {@const stats = getDeepScanStats(result.id)}
                  <div class="deep-scan-stats">
                    <span class="stat-item">
                      <Icon icon="FileText" width="12" height="12" />
                      {stats?.postsScanned} posts scanned
                    </span>
                    <span class="stat-item">
                      <Icon icon="GitBranch" width="12" height="12" />
                      Depth: {stats?.maxDepthReached}
                    </span>
                    <span class="stat-item">
                      <Icon icon="Download" width="12" height="12" />
                      {stats?.totalDownloadsFound} downloads
                    </span>
                  </div>
                {/if}

                <!-- Download Links -->
                {#if getResultDownloads(result).length > 0}
                  <div class="links-section">
                    <div class="links-list">
                      {#each getResultDownloads(result) as link}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="download-link"
                        >
                          <Icon
                            icon={getDomainIcon(link.domain) as any}
                            width="16"
                            height="16"
                          />
                          <div class="link-text">
                            {#if link.context}
                              <span class="link-context">
                                {#if link.contentType}
                                  <span class="content-type-badge"
                                    >{link.contentType}</span
                                  >
                                {/if}
                                <span class="link-description"
                                  >{link.context}</span
                                >
                              </span>
                            {:else if link.contentType}
                              <span class="link-context">
                                <span class="content-type-badge"
                                  >{link.contentType}</span
                                >
                              </span>
                            {:else}
                              <span class="link-name">{link.name}</span>
                            {/if}
                            <span class="link-domain-badge">{link.domain}</span>
                          </div>
                          <Icon icon="ExternalLink" width="14" height="14" />
                        </a>
                      {/each}
                    </div>
                  </div>
                {:else}
                  <div class="no-downloads">
                    <Icon icon="FileX" width="16" height="16" />
                    <span
                      >No download links found. Try deep scanning to search
                      replies.</span
                    >
                  </div>
                {/if}

                <!-- Deep Scan Posts with Downloads -->
                {#if deepScanResults.has(result.id)}
                  {@const deepResult = deepScanResults.get(result.id)}
                  {#if deepResult && deepResult.postsWithDownloads.length > 0}
                    <div class="deep-scan-posts">
                      <h4 class="section-label">
                        <Icon icon="MessageSquare" width="14" height="14" />
                        Found in Replies
                      </h4>
                      {#each deepResult.postsWithDownloads as post}
                        <div class="reply-post">
                          <div class="reply-meta">
                            <Icon icon="User" width="12" height="12" />
                            <span class="reply-user">{post.user}</span>
                            <span class="reply-depth">Depth {post.depth}</span>
                          </div>
                          <div class="reply-downloads">
                            {#each post.downloads as dl}
                              <a
                                href={dl.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="reply-download-link"
                              >
                                <Icon
                                  icon={getDomainIcon(dl.domain) as any}
                                  width="14"
                                  height="14"
                                />
                                <span>{dl.name}</span>
                              </a>
                            {/each}
                          </div>
                        </div>
                      {/each}
                    </div>
                  {/if}
                {/if}

                <!-- View Post Button -->
                <div class="actions-section">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="view-post-button"
                  >
                    <Icon icon="ExternalLink" width="16" height="16" />
                    View Original Post
                  </a>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    </div>

    <!-- Footer Stats -->
    <div class="card-footer">
      {#if searchStrategiesInfo}
        <div class="search-strategies">
          <span class="strategies-label">
            <Icon icon="Search" width="12" height="12" />
            Searched via:
          </span>
          <div class="strategies-list">
            {#each searchStrategiesInfo.searches as search}
              <span
                class="strategy-badge"
                title={`Query: "${search.query}" - ${search.resultCount} results`}
              >
                {search.strategy === "itemId"
                  ? "ID"
                  : search.strategy === "productName"
                    ? "Name"
                    : search.strategy === "shopAndProduct"
                      ? "Shop+Name"
                      : search.strategy === "keywords"
                        ? "Keywords"
                        : search.strategy === "tags"
                          ? "Tags"
                          : search.strategy === "category"
                            ? "Category"
                            : search.strategy}
                <span class="strategy-count">{search.resultCount}</span>
              </span>
            {/each}
          </div>
        </div>
      {:else if searchPage && searchPage.results.searchTime > 0}
        <span class="search-time">
          Search completed in {searchPage.results.searchTime.toFixed(2)}s
        </span>
      {/if}
    </div>
  {/if}
</div>

<style>
  .download-card {
    display: flex;
    flex-direction: column;
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    overflow: hidden;
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease;
  }

  /* Header */
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border);
    background-color: var(--secondary);
    gap: 1rem;
    flex-wrap: wrap;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .header-title h2 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .result-count {
    font-size: 0.75rem;
    color: var(--muted-foreground);
    padding: 0.125rem 0.5rem;
    background-color: var(--background);
    border-radius: 1rem;
  }

  .deep-scan-summary {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.7rem;
    color: var(--primary);
    padding: 0.125rem 0.5rem;
    background-color: color-mix(in srgb, var(--primary) 15%, transparent);
    border-radius: 1rem;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .deep-scan-all-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    color: var(--foreground);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .deep-scan-all-btn:hover:not(:disabled) {
    background-color: var(--primary);
    border-color: var(--primary);
    color: var(--primary-foreground);
  }

  .deep-scan-all-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .deep-scan-all-btn.scanning {
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
  }

  /* Refresh Button */
  .refresh-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    color: var(--foreground);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .refresh-btn:hover {
    background-color: var(--accent);
    border-color: var(--primary);
    color: var(--primary);
  }

  .refresh-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Loading State */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem;
    color: var(--muted-foreground);
  }

  .loader-spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  :global(.spinning) {
    animation: spin 1s linear infinite;
  }

  /* Error State */
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem;
    color: var(--destructive);
  }

  .retry-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--primary);
    color: var(--primary-foreground);
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .retry-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  /* Empty State */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem;
    color: var(--muted-foreground);
  }

  .empty-state .search-strategies-info {
    font-size: 0.75rem;
    color: var(--muted-foreground);
    margin-top: 0.5rem;
  }

  /* Tabs */
  .tabs-header {
    display: flex;
    gap: 0.25rem;
    padding: 0 1rem;
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
    overflow-y: hidden;
  }

  .tab-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--muted-foreground);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    margin-bottom: -1px;
  }

  .tab-button:hover {
    color: var(--foreground);
    background-color: var(--accent);
  }

  .tab-button.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
  }

  .tab-count {
    font-size: 0.7rem;
    padding: 0.125rem 0.375rem;
    background-color: var(--secondary);
    border-radius: 1rem;
    color: var(--secondary-foreground);
  }

  .tab-button.active .tab-count {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }

  /* Results List */
  .results-list {
    display: flex;
    flex-direction: column;
    max-height: 600px;
    overflow-y: auto;
  }

  .empty-tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 2rem;
    color: var(--muted-foreground);
  }

  /* Result Card */
  .result-card {
    border-bottom: 1px solid var(--border);
    transition: all 0.2s ease;
  }

  .result-card:last-child {
    border-bottom: none;
  }

  .result-card:hover {
    background-color: var(--accent);
  }

  .result-card.expanded {
    background-color: var(--secondary);
  }

  .result-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem 1.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    color: var(--foreground);
  }

  .result-info {
    flex: 1;
    min-width: 0;
  }

  .result-title {
    margin: 0 0 0.375rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .result-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .meta-item.votes {
    color: var(--primary);
  }

  .meta-item.score {
    color: #f59e0b;
  }

  .result-badges {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.7rem;
    font-weight: 500;
  }

  .download-badge {
    background-color: rgba(34, 197, 94, 0.15);
    color: #22c55e;
  }

  .download-badge.deep-scan-enhanced {
    background-color: rgba(34, 197, 94, 0.25);
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.3);
  }

  .deep-scan-indicator {
    font-size: 0.65rem;
    background-color: rgba(34, 197, 94, 0.3);
    padding: 1px 4px;
    border-radius: 3px;
    margin-left: 3px;
  }

  .reference-badge {
    background-color: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
  }

  .megathread-badge {
    background-color: rgba(168, 85, 247, 0.15);
    color: #a855f7;
  }

  .found-via-badge {
    background-color: rgba(251, 146, 60, 0.15);
    color: #fb923c;
    cursor: help;
  }

  :global(.expand-icon) {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .result-card.expanded :global(.expand-icon) {
    transform: rotate(180deg);
  }

  /* Result Content */
  .result-content {
    padding: 0 1.25rem 1rem;
    animation: slideDown 0.2s ease;
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

  .links-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
  }

  .links-section-header .section-label {
    margin: 0;
  }

  .deep-scan-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-radius: 1rem;
    font-size: 0.65rem;
    font-weight: 500;
    margin-left: 0.5rem;
  }

  .deep-scan-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background-color: var(--secondary);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    color: var(--foreground);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .deep-scan-btn:hover:not(:disabled) {
    background-color: var(--accent);
    border-color: var(--primary);
  }

  .deep-scan-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .deep-scan-btn.scanning {
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
  }

  .deep-scan-stats {
    display: flex;
    gap: 1rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--secondary);
    border-radius: 0.375rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }

  .deep-scan-stats .stat-item {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.7rem;
    color: var(--muted-foreground);
  }

  .no-downloads {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background-color: var(--secondary);
    border-radius: 0.375rem;
    color: var(--muted-foreground);
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  .deep-scan-posts {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  .deep-scan-posts .section-label {
    margin-bottom: 0.75rem;
  }

  .reply-post {
    padding: 0.75rem;
    background-color: var(--secondary);
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
  }

  .reply-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  .reply-user {
    font-weight: 500;
    color: var(--foreground);
  }

  .reply-depth {
    padding: 0.125rem 0.375rem;
    background-color: var(--accent);
    border-radius: 0.25rem;
    font-size: 0.65rem;
  }

  .reply-downloads {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .reply-download-link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.625rem;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    color: var(--foreground);
    text-decoration: none;
    font-size: 0.75rem;
    transition: all 0.15s ease;
  }

  .reply-download-link:hover {
    border-color: var(--primary);
    background-color: var(--accent);
  }

  .links-section {
    margin-bottom: 1rem;
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin: 0 0 0.75rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .links-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .download-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.875rem;
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    color: var(--foreground);
    text-decoration: none;
    font-size: 0.8rem;
    transition: all 0.15s ease;
  }

  .download-link:hover {
    border-color: var(--primary);
    background-color: var(--accent);
  }

  .link-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    gap: 0.125rem;
  }

  .link-name {
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .link-context {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .content-type-badge {
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    background-color: rgba(139, 92, 246, 0.15);
    color: #a78bfa;
    white-space: nowrap;
  }

  .link-description {
    font-weight: 500;
    color: var(--foreground);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .link-domain-badge {
    font-size: 0.7rem;
    color: var(--muted-foreground);
  }

  .actions-section {
    display: flex;
    gap: 0.5rem;
  }

  .view-post-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: var(--primary);
    color: var(--primary-foreground);
    border: none;
    border-radius: 0.375rem;
    font-size: 0.8rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .view-post-button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  /* Footer */
  .card-footer {
    padding: 0.75rem 1.25rem;
    border-top: 1px solid var(--border);
    background-color: var(--secondary);
  }

  .search-time {
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  /* Search Strategies */
  .search-strategies {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .strategies-label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--muted-foreground);
  }

  .strategies-list {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .strategy-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    background-color: var(--accent);
    border: 1px solid var(--border);
    border-radius: 9999px;
    font-size: 0.7rem;
    color: var(--foreground);
    cursor: help;
  }

  .strategy-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1rem;
    height: 1rem;
    padding: 0 0.25rem;
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-radius: 9999px;
    font-size: 0.6rem;
    font-weight: 600;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .card-header {
      flex-direction: column;
      gap: 0.75rem;
      align-items: flex-start;
    }

    .result-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .result-badges {
      align-self: flex-start;
    }

    .tabs-header {
      padding: 0 0.75rem;
    }

    .tab-button {
      padding: 0.625rem 0.75rem;
      font-size: 0.8rem;
    }
  }
</style>
