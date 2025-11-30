import { parseHTMLString } from "../../utils/dom";

// ============ Type Definitions ============

export interface SearchPageMeta {
  title: string;
  description: string;
  keywords: string[];
  themeColor: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  ogImageWidth: number;
  ogImageHeight: number;
  siteName: string;
}

export interface SearchPageConfig {
  relativePath: string;
  uploadUrl: string;
  siteTitle: string;
  browserTitle: string;
  description: string;
  loggedIn: boolean;
  uid: number;
  csrfToken: string;
  searchEnabled: boolean;
  postsPerPage: number;
  topicsPerPage: number;
  userLang: string;
  bootswatchSkin: string;
}

export interface SearchPageUser {
  uid: number;
  username: string;
  userslug: string;
  email: string;
  emailConfirmed: boolean;
  joindate: number;
  lastonline: number;
  picture: string | null;
  iconBgColor: string;
  iconText: string;
  displayname: string;
  status: string;
  reputation: number;
  postcount: number;
  topiccount: number;
  isAdmin: boolean;
  isGlobalMod: boolean;
  isMod: boolean;
  online: boolean;
}

export interface SearchQuery {
  term: string;
  in: SearchInType;
  matchWords: MatchWordsType;
  showAs: ShowAsType;
  by: string;
  categories: string;
  searchChildren: boolean;
  hasTags: string;
  replies: string;
  repliesFilter: RepliesFilterType;
  timeFilter: TimeFilterType;
  timeRange: string;
  sortBy: SortByType;
  sortDirection: SortDirectionType;
}

export type SearchInType = "titlesposts" | "titles" | "posts" | "bookmarks" | "categories" | "users" | "tags";
export type MatchWordsType = "all" | "any";
export type ShowAsType = "posts" | "topics";
export type RepliesFilterType = "atleast" | "atmost";
export type TimeFilterType = "newer" | "older";
export type SortByType = "relevance" | "timestamp" | "votes" | "topic.lastposttime" | "topic.title" | "topic.postcount" | "topic.viewcount" | "topic.votes" | "topic.timestamp" | "user.username" | "category.name";
export type SortDirectionType = "desc" | "asc";

export interface SearchPostTag {
  value: string;
  valueEscaped: string;
  valueEncoded: string;
  class: string;
}

export interface SearchPostUser {
  uid: number;
  username: string;
  userslug: string;
  picture: string | null;
  status: string;
  displayname: string;
  iconBgColor: string;
  iconText: string;
  isLocal: boolean;
}

export interface SearchPostTopic {
  uid: number;
  tid: number;
  title: string;
  titleRaw: string;
  cid: number;
  tags: SearchPostTag[];
  slug: string;
  deleted: number;
  scheduled: boolean;
  postcount: number;
  mainPid: number;
  teaserPid: string | number;
  timestamp: number;
  timestampISO: string;
  isQuestion: number | null;
  isSolved: number | null;
}

export interface SearchPostCategory {
  cid: number;
  name: string;
  icon: string;
  slug: string;
  parentCid: number;
  bgColor: string;
  color: string;
  backgroundImage: string;
  imageClass: string;
}

export interface SearchPost {
  pid: number;
  tid: number;
  toPid: number | null;
  url: string;
  content: string;
  sourceContent: string | null;
  uid: number;
  timestamp: number;
  timestampISO: string;
  deleted: boolean;
  upvotes: number;
  downvotes: number;
  votes: number;
  replies: number;
  attachments: any[];
  user: SearchPostUser;
  topic: SearchPostTopic;
  category: SearchPostCategory;
  isMainPost: boolean;
}

export interface SearchPagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pages: SearchPaginationPage[];
}

export interface SearchPaginationPage {
  page: number;
  url: string;
  isCurrent: boolean;
}

export interface SearchResults {
  totalResults: number;
  searchTime: number;
  searchTimeText: string;
  query: string;
  posts: SearchPost[];
}

export interface SearchFilterOptions {
  searchIn: SearchInOption[];
  matchWords: MatchWordsOption[];
  showAs: ShowAsOption[];
  repliesFilter: RepliesFilterOption[];
  timeFilter: TimeFilterOption[];
  timeRange: TimeRangeOption[];
  sortBy: SortByOption[];
  sortDirection: SortDirectionOption[];
}

export interface SearchInOption {
  value: SearchInType;
  label: string;
}

export interface MatchWordsOption {
  value: MatchWordsType;
  label: string;
}

export interface ShowAsOption {
  value: ShowAsType;
  label: string;
}

export interface RepliesFilterOption {
  value: RepliesFilterType;
  label: string;
}

export interface TimeFilterOption {
  value: TimeFilterType;
  label: string;
}

export interface TimeRangeOption {
  value: string;
  label: string;
  seconds: number;
}

export interface SortByOption {
  value: SortByType;
  label: string;
}

export interface SortDirectionOption {
  value: SortDirectionType;
  label: string;
}

export interface SearchPage {
  meta: SearchPageMeta;
  config: SearchPageConfig;
  user: SearchPageUser | null;
  query: SearchQuery;
  results: SearchResults;
  pagination: SearchPagination;
  filterOptions: SearchFilterOptions;
}

// ============ Transformed Result Types ============

export type SearchStrategy =
  | "itemId"           // Search by exact item ID
  | "productName"      // Search by product name
  | "shopAndProduct"   // Search by shop name + product name
  | "tags"             // Search by tags
  | "category"         // Search by category + product name
  | "keywords";        // Search by extracted keywords from name

export interface DownloadLink {
  url: string;
  name: string;
  domain: string;
  /** Contextual description extracted from surrounding text */
  context?: string;
  /** Type of content (e.g., "clothing", "avatar", "texture", etc.) */
  contentType?: string;
}

/** Patterns for extracting context around download links */
export const LINK_CONTEXT_PATTERNS = {
  // Item type patterns - what kind of content this is
  contentTypes: [
    // Clothing & Fashion
    { pattern: /casual\s*clothing/i, type: "Casual Clothing" },
    { pattern: /formal\s*(?:wear|clothing|outfit)/i, type: "Formal Wear" },
    { pattern: /(?:school|uniform)\s*(?:outfit|clothing)/i, type: "School Uniform" },
    { pattern: /swim(?:suit|wear)/i, type: "Swimwear" },
    { pattern: /underwear|lingerie/i, type: "Underwear" },
    { pattern: /(?:winter|summer|spring|fall)\s*(?:clothing|outfit|wear)/i, type: "Seasonal Clothing" },
    { pattern: /(?:hoodie|jacket|coat|sweater)/i, type: "Outerwear" },
    { pattern: /(?:dress|skirt|pants|shorts|jeans)/i, type: "Clothing" },
    { pattern: /(?:shirt|top|blouse|t-?shirt)/i, type: "Top" },
    { pattern: /(?:shoes?|boots?|sneakers?|heels?|sandals?)/i, type: "Footwear" },
    { pattern: /(?:hat|cap|headwear|helmet)/i, type: "Headwear" },
    { pattern: /(?:glasses|sunglasses|eyewear)/i, type: "Eyewear" },
    { pattern: /(?:accessory|accessories|jewelry|necklace|earring|bracelet|ring)/i, type: "Accessories" },
    { pattern: /(?:bag|backpack|purse|handbag)/i, type: "Bags" },
    { pattern: /(?:gloves?|mittens?)/i, type: "Gloves" },
    { pattern: /(?:socks?|stockings?|tights?)/i, type: "Legwear" },
    { pattern: /(?:mask|face\s*mask)/i, type: "Mask" },
    { pattern: /(?:costume|cosplay)/i, type: "Costume" },
    { pattern: /(?:outfit|set|coord|coordinate)/i, type: "Outfit Set" },

    // Avatar & Character
    { pattern: /(?:full\s*)?avatar/i, type: "Avatar" },
    { pattern: /(?:base|body)\s*(?:model|mesh)/i, type: "Base Model" },
    { pattern: /character\s*(?:model|asset)/i, type: "Character" },
    { pattern: /(?:vroid|vrm)/i, type: "VRoid/VRM" },
    { pattern: /(?:fbx|blend(?:er)?)\s*(?:file|model)/i, type: "3D Model" },

    // Body Parts & Features
    { pattern: /hair(?:style)?/i, type: "Hair" },
    { pattern: /(?:eye|eyes)\s*(?:texture)?/i, type: "Eyes" },
    { pattern: /(?:skin|body)\s*texture/i, type: "Skin Texture" },
    { pattern: /(?:face|facial)\s*(?:expression|blend)/i, type: "Face/Expressions" },
    { pattern: /(?:tail|ear|horn|wing)s?/i, type: "Appendages" },
    { pattern: /(?:fur|fluffy|furry)/i, type: "Fur" },

    // Props & Objects
    { pattern: /(?:weapon|sword|gun|bow)/i, type: "Weapon" },
    { pattern: /(?:prop|object|item)s?/i, type: "Props" },
    { pattern: /(?:furniture|chair|table|bed)/i, type: "Furniture" },
    { pattern: /(?:food|drink|beverage)/i, type: "Food/Drink" },
    { pattern: /(?:vehicle|car|bike|motorcycle)/i, type: "Vehicle" },
    { pattern: /(?:tool|equipment)/i, type: "Tools" },

    // Environment & World
    { pattern: /(?:world|map|environment|scene)/i, type: "World/Environment" },
    { pattern: /(?:skybox|sky\s*(?:dome|box))/i, type: "Skybox" },
    { pattern: /(?:particle|effect|fx|vfx)/i, type: "Particle Effects" },
    { pattern: /(?:shader|material)/i, type: "Shader/Material" },
    { pattern: /(?:light(?:ing)?|lamp)/i, type: "Lighting" },

    // Audio
    { pattern: /(?:audio|sound|music|sfx|bgm)/i, type: "Audio" },
    { pattern: /(?:voice|vocal)/i, type: "Voice" },

    // Animation
    { pattern: /(?:animation|anim|motion|dance)/i, type: "Animation" },
    { pattern: /(?:pose|gesture)/i, type: "Pose" },
    { pattern: /(?:emote|emoji)/i, type: "Emote" },

    // Textures & Materials
    { pattern: /(?:texture|textures)\s*(?:pack|set)?/i, type: "Textures" },
    { pattern: /(?:normal|bump|specular|roughness)\s*(?:map)?/i, type: "Material Map" },
    { pattern: /(?:psd|photoshop|gimp)/i, type: "PSD/Source" },
    { pattern: /(?:unity|unitypackage)/i, type: "Unity Package" },

    // Documentation
    { pattern: /(?:tutorial|guide|how\s*to)/i, type: "Tutorial" },
    { pattern: /(?:readme|documentation|docs)/i, type: "Documentation" },
    { pattern: /(?:license|terms)/i, type: "License" },
  ],

  // Descriptor patterns - additional info about the content
  descriptors: [
    // Quality/Version
    { pattern: /(?:hd|hq|high[\s-]*(?:quality|res(?:olution)?))/i, desc: "HD" },
    { pattern: /(?:4k|8k|2k)/i, desc: (m: string) => m.toUpperCase() },
    { pattern: /(?:original|source)/i, desc: "Original" },
    { pattern: /(?:updated?|new(?:est)?|latest)/i, desc: "Updated" },
    { pattern: /(?:fix(?:ed)?|patch(?:ed)?)/i, desc: "Fixed" },
    { pattern: /(?:reupload(?:ed)?|re[\s-]*upload)/i, desc: "Reupload" },
    { pattern: /(?:alt(?:ernative)?|variant)/i, desc: "Alternative" },

    // Compatibility
    { pattern: /(?:quest|android)\s*(?:compatible|version)?/i, desc: "Quest Compatible" },
    { pattern: /(?:pc[\s-]*only|pc\s*version)/i, desc: "PC Only" },
    { pattern: /(?:cross[\s-]*platform)/i, desc: "Cross-Platform" },

    // Version info
    { pattern: /v(?:er(?:sion)?)?[\s.]*(\d+(?:\.\d+)*)/i, desc: (m: string, v: string) => `v${v}` },
    { pattern: /(\d+(?:\.\d+)+)[\s-]*(?:release|update)/i, desc: (m: string, v: string) => `v${v}` },

    // Parts/Variants
    { pattern: /part\s*(\d+)/i, desc: (m: string, n: string) => `Part ${n}` },
    { pattern: /(?:vol(?:ume)?|chapter)\s*(\d+)/i, desc: (m: string, n: string) => `Vol. ${n}` },
    { pattern: /\[(\d+)\/(\d+)\]/i, desc: (m: string, a: string, b: string) => `[${a}/${b}]` },

    // Size/Count
    { pattern: /(\d+)\s*(?:items?|pieces?|assets?)/i, desc: (m: string, n: string) => `${n} items` },
    { pattern: /(\d+(?:\.\d+)?)\s*(?:gb|mb|kb)/i, desc: (m: string) => m.toUpperCase() },

    // Colors/Variants
    { pattern: /(\d+)\s*(?:colors?|variants?|options?)/i, desc: (m: string, n: string) => `${n} variants` },
    { pattern: /(?:all|every)\s*colors?/i, desc: "All Colors" },
  ],

  // Label patterns - text that often precedes a download link
  labels: [
    /(?:^|\n)\s*([^:\n]{3,50}):\s*$/m,                    // "Label:" on line before
    /([^:\n]{3,50}):\s*(?=https?:\/\/)/,                   // "Label: url"
    /(?:download|get|grab)\s+(?:the\s+)?([^:\n]{3,50})/i, // "download the X"
    /here(?:'?s| is)\s+(?:the\s+)?([^:\n]{3,50})/i,       // "here's the X"
    /([^:\n]{3,50})\s+(?:link|download|url)/i,            // "X link/download"
    /\[([^\]]{3,50})\]/,                                   // "[Label]"
    /【([^】]{3,50})】/,                                    // Japanese brackets
    /「([^」]{3,50})」/,                                    // Japanese quotes
  ],
};

/**
 * Extract contextual information for a download link from surrounding text
 */
export function extractLinkContext(
  content: string,
  url: string
): { context: string; contentType?: string } {
  const result: { context: string; contentType?: string } = { context: "" };
  const contextParts: string[] = [];

  // Escape URL for regex (only escape actual regex special chars)
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // First, try to find label in the RAW HTML before cleaning
  // Pattern: "Label: <a href="URL"" - very common in forum posts
  // Note: Don't require closing quote immediately - there may be other attributes
  const anchorPattern = new RegExp(
    `([^<>:\\n\\r]{2,60}):\\s*<a[^>]*href=["']${escapedUrl}`,
    "i"
  );
  const anchorMatch = content.match(anchorPattern);
  if (anchorMatch && anchorMatch[1]) {
    const label = anchorMatch[1].replace(/<[^>]*>/g, "").trim();
    if (label.length >= 2 && /[a-zA-Z]/.test(label) && !label.includes("http")) {
      contextParts.push(label);
    }
  }

  // Also try: "Label: URL" where URL is plain text (not in anchor)
  if (contextParts.length === 0) {
    const plainUrlPattern = new RegExp(
      `([^<>:\\n\\r]{2,60}):\\s*${escapedUrl}`,
      "i"
    );
    const plainMatch = content.match(plainUrlPattern);
    if (plainMatch && plainMatch[1]) {
      const label = plainMatch[1].replace(/<[^>]*>/g, "").trim();
      if (label.length >= 2 && /[a-zA-Z]/.test(label) && !label.includes("http")) {
        contextParts.push(label);
      }
    }
  }

  // Clean HTML for further processing
  const cleanContent = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, "/")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  // Find the URL position in cleaned content
  let urlIndex = cleanContent.indexOf(url);

  // Try partial URL match if full URL not found
  if (urlIndex === -1) {
    // Try finding by domain
    try {
      const urlObj = new URL(url);
      urlIndex = cleanContent.indexOf(urlObj.hostname);
    } catch {
      // If we already found a label from anchor pattern, return it
      if (contextParts.length > 0) {
        result.context = contextParts.join(" • ");
        return result;
      }
      return result;
    }
  }

  if (urlIndex === -1) {
    // If we already found a label from anchor pattern, return it
    if (contextParts.length > 0) {
      result.context = contextParts.join(" • ");
      return result;
    }
    return result;
  }

  // Get text before the URL (up to 200 chars)
  const textBeforeUrl = cleanContent.slice(Math.max(0, urlIndex - 200), urlIndex).trim();

  // Get surrounding text for content type detection
  const start = Math.max(0, urlIndex - 300);
  const end = Math.min(cleanContent.length, urlIndex + url.length + 100);
  const surroundingText = cleanContent.slice(start, end);

  // === Try to extract label if not already found from anchor ===
  if (contextParts.length === 0) {
    // Pattern: "Label: URL" or "Label : URL" (most common pattern)
    const labelColonMatch = textBeforeUrl.match(/([^:\n\r]{2,60}):\s*$/);
    if (labelColonMatch && labelColonMatch[1]) {
      const label = labelColonMatch[1].trim();
      // Validate: has letters, reasonable length, not just a URL or domain
      if (
        label.length >= 2 &&
        label.length <= 60 &&
        /[a-zA-Z]/.test(label) &&
        !label.includes("http") &&
        !label.includes("www.")
      ) {
        contextParts.push(label);
      }
    }
  }

  // Try other label patterns if no colon pattern matched
  if (contextParts.length === 0) {
    // Pattern: [Label] URL
    const bracketMatch = textBeforeUrl.match(/\[([^\]]{2,50})\]\s*$/);
    if (bracketMatch && bracketMatch[1]) {
      const label = bracketMatch[1].trim();
      if (label.length >= 2 && /[a-zA-Z]/.test(label)) {
        contextParts.push(label);
      }
    }

    // Pattern: 「Label」URL (Japanese)
    const jpMatch = textBeforeUrl.match(/[「【]([^」】]{2,50})[」】]\s*$/);
    if (jpMatch && jpMatch[1]) {
      const label = jpMatch[1].trim();
      if (label.length >= 2) {
        contextParts.push(label);
      }
    }

    // Pattern: Last line before URL (if it's short and looks like a label)
    if (contextParts.length === 0) {
      const lines = textBeforeUrl.split(/[\n\r]+/);
      const lastLine = lines[lines.length - 1]?.trim();
      if (
        lastLine &&
        lastLine.length >= 2 &&
        lastLine.length <= 50 &&
        /[a-zA-Z]/.test(lastLine) &&
        !lastLine.includes("http") &&
        !/^[\d\s.,;:!?]+$/.test(lastLine)
      ) {
        contextParts.push(lastLine);
      }
    }
  }

  // === Try to extract content type from surrounding text ===
  for (const { pattern, type } of LINK_CONTEXT_PATTERNS.contentTypes) {
    if (pattern.test(surroundingText)) {
      result.contentType = type;
      break;
    }
  }

  // === Try to extract descriptors ===
  for (const { pattern, desc } of LINK_CONTEXT_PATTERNS.descriptors) {
    const match = surroundingText.match(pattern);
    if (match) {
      const descriptor = typeof desc === "function"
        ? desc(match[0], match[1], match[2])
        : desc;
      if (descriptor && !contextParts.includes(descriptor)) {
        contextParts.push(descriptor);
      }
    }
  }

  // Build final context string
  if (contextParts.length > 0) {
    result.context = contextParts.join(" • ");
  } else if (result.contentType) {
    result.context = result.contentType;
  }

  return result;
}

/**
 * Format a download link with context for display
 */
export function formatDownloadLinkDisplay(link: DownloadLink): string {
  const parts: string[] = [];

  if (link.context) {
    parts.push(link.context);
  } else if (link.contentType) {
    parts.push(link.contentType);
  } else if (link.name && link.name !== link.domain) {
    parts.push(link.name);
  }

  // Add domain as fallback or suffix
  if (parts.length === 0) {
    parts.push(link.domain);
  }

  return parts.join(" • ");
}

export interface TransformedSearchResult {
  id: string;
  url: string;
  text: string;
  title: string;
  user: string;
  hasDownloads: boolean;
  linkCount: number;
  downloadCount: number;
  downloadLinks: DownloadLink[];
  hasReferences: boolean;
  referenceCount: number;
  topicId: string | undefined;
  topicTitle: string;
  postUrls: string[];
  timestamp: Date;
  votes: number;
  isMegathread: boolean;
  score?: number;
  /** Which search strategy found this result */
  foundVia?: SearchStrategy;
  /** The search query that found this result */
  foundQuery?: string;
}

// ============ Constants ============

export const MEGATHREAD_PATTERNS: RegExp[] = [
  /megathread/i,
  /mega[\s\w-]*thread/i,
  /collection[\s\w()&-]{0,50}(?:updating|found)/i,
  /\[\d{1,3}\/\d{1,3}\s*(?:found|updated)\]/i,
  /(?:updating|will\s+update)[\s()]{0,20}(?:weekly|daily)/i,
  /master[\s-]*list/i,
  /asset\s*collection/i,
  /complete\s*(?:pack|collection)/i,
  /will\s+update/i,
];

export const DOWNLOAD_DOMAINS: string[] = [
  "drive.google.com",
  "docs.google.com",
  "mega.nz",
  "mediafire.com",
  "dropbox.com",
  "pixeldrain.com",
  "workupload.com",
  "gofile.io",
  "1fichier.com",
  "krakenfiles.com",
  "anonfiles.com",
  "uploadhaven.com",
  "rapidgator.net",
  "uploaded.net",
  "sendspace.com",
  "zippyshare.com",
  "1drv.ms",
  "onedrive.live.com",
  "files.1drv.com",
  "storage.live.com",
];

// ============ Helper Functions ============

function getMetaContent(doc: Document, name: string): string | null {
  const meta = doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  return meta?.getAttribute("content") ?? null;
}

function parseJsonScript<T>(doc: Document, selector: string): T | null {
  const script = doc.querySelector(selector);
  if (!script?.textContent) return null;
  try {
    return JSON.parse(script.textContent) as T;
  } catch {
    return null;
  }
}

function parseConfigFromScript(doc: Document): any {
  const scripts = doc.querySelectorAll("script");
  for (const script of scripts) {
    const text = script.textContent ?? "";
    const configMatch = text.match(/var config = JSON\.parse\('(.+?)'\);/);
    if (configMatch) {
      try {
        return JSON.parse(configMatch[1].replace(/\\'/g, "'").replace(/\\x2F/g, "/").replace(/&#x2F;/g, "/"));
      } catch {
        continue;
      }
    }
  }
  return null;
}

function parseUserFromScript(doc: Document): any {
  const scripts = doc.querySelectorAll("script");
  for (const script of scripts) {
    const text = script.textContent ?? "";
    const userMatch = text.match(/user: JSON\.parse\('(.+?)'\)/);
    if (userMatch) {
      try {
        return JSON.parse(userMatch[1].replace(/\\'/g, "'").replace(/\\x2F/g, "/").replace(/&#x2F;/g, "/"));
      } catch {
        continue;
      }
    }
  }
  return null;
}

function parseCount(text: string): number {
  const match = text.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseSearchTime(text: string): number {
  const match = text.match(/\(([\d.]+)\s*seconds?\)/i);
  return match ? parseFloat(match[1]) : 0;
}

function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

// ============ Parser Functions ============

function parseMeta(doc: Document): SearchPageMeta {
  return {
    title: doc.title ?? "",
    description: getMetaContent(doc, "description") ?? "",
    keywords: (getMetaContent(doc, "keywords") ?? "").split(",").map(k => k.trim()).filter(Boolean),
    themeColor: getMetaContent(doc, "theme-color") ?? "",
    ogTitle: getMetaContent(doc, "og:title") ?? "",
    ogDescription: getMetaContent(doc, "og:description") ?? "",
    ogUrl: decodeHtmlEntities(getMetaContent(doc, "og:url") ?? ""),
    ogImage: getMetaContent(doc, "og:image") ?? "",
    ogImageWidth: parseInt(getMetaContent(doc, "og:image:width") ?? "0", 10),
    ogImageHeight: parseInt(getMetaContent(doc, "og:image:height") ?? "0", 10),
    siteName: getMetaContent(doc, "og:site_name") ?? "",
  };
}

function parseConfig(doc: Document): SearchPageConfig {
  const config = parseConfigFromScript(doc);

  return {
    relativePath: config?.relative_path ?? "",
    uploadUrl: config?.upload_url ?? "",
    siteTitle: config?.siteTitle ?? "",
    browserTitle: config?.browserTitle ?? "",
    description: config?.description ?? "",
    loggedIn: config?.loggedIn ?? false,
    uid: config?.uid ?? 0,
    csrfToken: config?.csrf_token ?? "",
    searchEnabled: config?.searchEnabled ?? true,
    postsPerPage: config?.postsPerPage ?? 20,
    topicsPerPage: config?.topicsPerPage ?? 20,
    userLang: config?.userLang ?? "en-GB",
    bootswatchSkin: config?.bootswatchSkin ?? "",
  };
}

function parseUser(doc: Document): SearchPageUser | null {
  const userData = parseUserFromScript(doc);
  if (!userData || !userData.uid) return null;

  return {
    uid: userData.uid,
    username: userData.username ?? "",
    userslug: userData.userslug ?? "",
    email: userData.email ?? "",
    emailConfirmed: userData["email:confirmed"] ?? false,
    joindate: userData.joindate ?? 0,
    lastonline: userData.lastonline ?? 0,
    picture: userData.picture ?? null,
    iconBgColor: userData["icon:bgColor"] ?? "",
    iconText: userData["icon:text"] ?? "",
    displayname: userData.displayname ?? "",
    status: userData.status ?? "offline",
    reputation: userData.reputation ?? 0,
    postcount: userData.postcount ?? 0,
    topiccount: userData.topiccount ?? 0,
    isAdmin: userData.isAdmin ?? false,
    isGlobalMod: userData.isGlobalMod ?? false,
    isMod: userData.isMod ?? false,
    online: userData.online ?? false,
  };
}

function parseQueryFromUrl(doc: Document): SearchQuery {
  const ogUrl = getMetaContent(doc, "og:url") ?? "";
  const decodedUrl = decodeHtmlEntities(ogUrl);

  let params: URLSearchParams;
  try {
    const url = new URL(decodedUrl);
    params = url.searchParams;
  } catch {
    params = new URLSearchParams();
  }

  return {
    term: params.get("term") ?? "",
    in: (params.get("in") as SearchInType) ?? "titlesposts",
    matchWords: (params.get("matchWords") as MatchWordsType) ?? "all",
    showAs: (params.get("showAs") as ShowAsType) ?? "posts",
    by: params.get("by") ?? "",
    categories: params.get("categories") ?? "",
    searchChildren: params.get("searchChildren") === "true",
    hasTags: params.get("hasTags") ?? "",
    replies: params.get("replies") ?? "",
    repliesFilter: (params.get("repliesFilter") as RepliesFilterType) ?? "atleast",
    timeFilter: (params.get("timeFilter") as TimeFilterType) ?? "newer",
    timeRange: params.get("timeRange") ?? "",
    sortBy: (params.get("sortBy") as SortByType) ?? "relevance",
    sortDirection: (params.get("sortDirection") as SortDirectionType) ?? "desc",
  };
}

function parseAjaxifyData(doc: Document): any {
  const ajaxifyScript = doc.querySelector("#ajaxify-data");
  if (!ajaxifyScript?.textContent) return null;

  try {
    return JSON.parse(ajaxifyScript.textContent);
  } catch {
    return null;
  }
}

function parsePostsFromAjaxifyData(ajaxifyData: any): SearchPost[] {
  if (!ajaxifyData?.posts || !Array.isArray(ajaxifyData.posts)) return [];

  return ajaxifyData.posts.map((post: any) => ({
    pid: post.pid ?? 0,
    tid: post.tid ?? 0,
    toPid: post.toPid ?? null,
    url: post.url ?? "",
    content: post.content ?? "",
    sourceContent: post.sourceContent ?? null,
    uid: post.uid ?? 0,
    timestamp: post.timestamp ?? 0,
    timestampISO: post.timestampISO ?? "",
    deleted: post.deleted ?? false,
    upvotes: post.upvotes ?? 0,
    downvotes: post.downvotes ?? 0,
    votes: post.votes ?? 0,
    replies: post.replies ?? 0,
    attachments: post.attachments ?? [],
    user: {
      uid: post.user?.uid ?? 0,
      username: post.user?.username ?? "",
      userslug: post.user?.userslug ?? "",
      picture: post.user?.picture ?? null,
      status: post.user?.status ?? "offline",
      displayname: post.user?.displayname ?? "",
      iconBgColor: post.user?.["icon:bgColor"] ?? "",
      iconText: post.user?.["icon:text"] ?? "",
      isLocal: post.user?.isLocal ?? true,
    },
    topic: {
      uid: post.topic?.uid ?? 0,
      tid: post.topic?.tid ?? 0,
      title: decodeHtmlEntities(post.topic?.title ?? ""),
      titleRaw: post.topic?.titleRaw ?? "",
      cid: post.topic?.cid ?? 0,
      tags: (post.topic?.tags ?? []).map((tag: any) => ({
        value: tag.value ?? "",
        valueEscaped: tag.valueEscaped ?? "",
        valueEncoded: tag.valueEncoded ?? "",
        class: tag.class ?? "",
      })),
      slug: post.topic?.slug ?? "",
      deleted: post.topic?.deleted ?? 0,
      scheduled: post.topic?.scheduled ?? false,
      postcount: post.topic?.postcount ?? 0,
      mainPid: post.topic?.mainPid ?? 0,
      teaserPid: post.topic?.teaserPid ?? 0,
      timestamp: post.topic?.timestamp ?? 0,
      timestampISO: post.topic?.timestampISO ?? "",
      isQuestion: post.topic?.isQuestion ?? null,
      isSolved: post.topic?.isSolved ?? null,
    },
    category: {
      cid: post.category?.cid ?? 0,
      name: decodeHtmlEntities(post.category?.name ?? ""),
      icon: post.category?.icon ?? "",
      slug: post.category?.slug ?? "",
      parentCid: post.category?.parentCid ?? 0,
      bgColor: post.category?.bgColor ?? "",
      color: post.category?.color ?? "",
      backgroundImage: post.category?.backgroundImage ?? "",
      imageClass: post.category?.imageClass ?? "",
    },
    isMainPost: post.isMainPost ?? false,
  }));
}

function parseResultsHeader(doc: Document): { totalResults: number; searchTime: number; searchTimeText: string; query: string } {
  const resultsContainer = doc.querySelector("#results");
  const query = resultsContainer?.getAttribute("data-search-query") ?? "";

  const headerEl = doc.querySelector(".card.card-header");
  const headerText = headerEl?.textContent?.trim() ?? "";

  // Parse "18 result(s) matching "6633647", (0.00 seconds)"
  const totalResults = parseCount(headerText);
  const searchTime = parseSearchTime(headerText);

  return {
    totalResults,
    searchTime,
    searchTimeText: headerText,
    query,
  };
}

function parseResults(doc: Document): SearchResults {
  const ajaxifyData = parseAjaxifyData(doc);
  const header = parseResultsHeader(doc);
  const posts = parsePostsFromAjaxifyData(ajaxifyData);

  return {
    totalResults: header.totalResults,
    searchTime: header.searchTime,
    searchTimeText: header.searchTimeText,
    query: header.query,
    posts,
  };
}

function parsePagination(doc: Document): SearchPagination {
  const paginationContainer = doc.querySelector("nav[component='pagination']");
  const pages: SearchPaginationPage[] = [];
  let currentPage = 1;
  let totalPages = 1;

  if (paginationContainer) {
    const pageItems = paginationContainer.querySelectorAll("ul.hidden-xs li.page-item.page");

    pageItems.forEach(item => {
      const anchor = item.querySelector("a");
      const isCurrent = item.classList.contains("active");
      const pageNum = parseInt(anchor?.getAttribute("data-page") ?? "0", 10);
      const url = anchor?.getAttribute("href") ?? "";

      if (pageNum > 0) {
        if (isCurrent) currentPage = pageNum;
        if (pageNum > totalPages) totalPages = pageNum;

        pages.push({
          page: pageNum,
          url,
          isCurrent,
        });
      }
    });

    // Try to get total pages from mobile pagination
    const selectPage = paginationContainer.querySelector("li.select-page a");
    if (selectPage) {
      const text = selectPage.textContent?.trim() ?? "";
      const match = text.match(/(\d+)\s*\/\s*(\d+)/);
      if (match) {
        currentPage = parseInt(match[1], 10);
        totalPages = parseInt(match[2], 10);
      }
    }
  }

  return {
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    pages,
  };
}

function getFilterOptions(): SearchFilterOptions {
  return {
    searchIn: [
      { value: "titlesposts", label: "In titles and posts" },
      { value: "titles", label: "In titles" },
      { value: "posts", label: "In posts" },
      { value: "bookmarks", label: "In bookmarks" },
      { value: "categories", label: "In categories" },
      { value: "users", label: "In users" },
      { value: "tags", label: "In tags" },
    ],
    matchWords: [
      { value: "all", label: "Match all words" },
      { value: "any", label: "Match any word" },
    ],
    showAs: [
      { value: "posts", label: "Show results as posts" },
      { value: "topics", label: "Show results as topics" },
    ],
    repliesFilter: [
      { value: "atleast", label: "At least" },
      { value: "atmost", label: "At most" },
    ],
    timeFilter: [
      { value: "newer", label: "Newer than" },
      { value: "older", label: "Older than" },
    ],
    timeRange: [
      { value: "", label: "Any date", seconds: 0 },
      { value: "86400", label: "Yesterday", seconds: 86400 },
      { value: "604800", label: "One week", seconds: 604800 },
      { value: "1209600", label: "Two weeks", seconds: 1209600 },
      { value: "2592000", label: "One month", seconds: 2592000 },
      { value: "7776000", label: "Three months", seconds: 7776000 },
      { value: "15552000", label: "Six months", seconds: 15552000 },
      { value: "31104000", label: "One year", seconds: 31104000 },
    ],
    sortBy: [
      { value: "relevance", label: "Relevance" },
      { value: "timestamp", label: "Post time" },
      { value: "votes", label: "Votes" },
      { value: "topic.lastposttime", label: "Last reply time" },
      { value: "topic.title", label: "Topic title" },
      { value: "topic.postcount", label: "Number of replies" },
      { value: "topic.viewcount", label: "Number of views" },
      { value: "topic.votes", label: "Topic votes" },
      { value: "topic.timestamp", label: "Topic start date" },
      { value: "user.username", label: "Username" },
      { value: "category.name", label: "Category" },
    ],
    sortDirection: [
      { value: "desc", label: "In descending order" },
      { value: "asc", label: "In ascending order" },
    ],
  };
}

// ============ Post Content Extractors ============

export interface ExtractedBoothLink {
  url: string;
  itemId: string;
  title: string | null;
  imageUrl: string | null;
  description: string | null;
}

export interface ExtractedDownloadLink {
  url: string;
  domain: string;
  text: string;
}

export interface ExtractedImage {
  src: string;
  alt: string;
}

export interface ExtractedMention {
  username: string;
  url: string;
}

export interface PostContentExtraction {
  boothLinks: ExtractedBoothLink[];
  downloadLinks: ExtractedDownloadLink[];
  images: ExtractedImage[];
  mentions: ExtractedMention[];
  plainText: string;
}

function extractBoothItemId(url: string): string | null {
  const match = url.match(/booth\.pm\/(?:en|ja|ko)?\/items\/(\d+)|booth\.pm\/items\/(\d+)/);
  return match?.[1] ?? match?.[2] ?? null;
}

export function extractPostContent(htmlContent: string): PostContentExtraction {
  const doc = parseHTMLString(`<div>${htmlContent}</div>`);
  const container = doc.body.firstElementChild;

  const boothLinks: ExtractedBoothLink[] = [];
  const downloadLinks: ExtractedDownloadLink[] = [];
  const images: ExtractedImage[] = [];
  const mentions: ExtractedMention[] = [];

  // Extract Booth links (link previews)
  const linkPreviews = container?.querySelectorAll(".link-preview") ?? [];
  linkPreviews.forEach(preview => {
    const anchor = preview.querySelector("a[href*='booth.pm']");
    const url = anchor?.getAttribute("href") ?? "";
    const itemId = extractBoothItemId(url);

    if (itemId) {
      const titleEl = preview.querySelector(".card-title a");
      const descEl = preview.querySelector(".card-text");
      const imgEl = preview.querySelector(".card-img-top");

      boothLinks.push({
        url,
        itemId,
        title: titleEl?.textContent?.trim() ?? null,
        imageUrl: imgEl?.getAttribute("src") ?? null,
        description: descEl?.textContent?.trim() ?? null,
      });
    }
  });

  // Extract standalone booth links from anchors
  const anchors = container?.querySelectorAll("a[href*='booth.pm']") ?? [];
  anchors.forEach(anchor => {
    const url = anchor.getAttribute("href") ?? "";
    const itemId = extractBoothItemId(url);

    if (itemId && !boothLinks.some(bl => bl.itemId === itemId)) {
      boothLinks.push({
        url,
        itemId,
        title: anchor.textContent?.trim() ?? null,
        imageUrl: null,
        description: null,
      });
    }
  });

  // Extract download links (common file hosting services)
  const downloadDomains = [
    "drive.google.com",
    "docs.google.com",
    "mega.nz",
    "mediafire.com",
    "dropbox.com",
    "pixeldrain.com",
    "workupload.com",
    "gofile.io",
    "1fichier.com",
    "krakenfiles.com",
    "anonfiles.com",
    "uploadhaven.com",
    "rapidgator.net",
    "uploaded.net",
    "sendspace.com",
    "zippyshare.com",
    "1drv.ms",
    "onedrive.live.com",
    "files.1drv.com",
    "storage.live.com",
  ];

  const allAnchors = container?.querySelectorAll("a") ?? [];
  allAnchors.forEach(anchor => {
    const url = anchor.getAttribute("href") ?? "";
    const text = anchor.textContent?.trim() ?? "";

    for (const domain of downloadDomains) {
      if (url.includes(domain)) {
        downloadLinks.push({
          url,
          domain,
          text,
        });
        break;
      }
    }
  });

  // Extract images
  const imageElements = container?.querySelectorAll("img:not(.emoji)") ?? [];
  imageElements.forEach(img => {
    const src = img.getAttribute("src") ?? "";
    const alt = img.getAttribute("alt") ?? "";

    if (src && !src.includes("favicon")) {
      images.push({ src, alt });
    }
  });

  // Extract mentions
  const mentionElements = container?.querySelectorAll(".plugin-mentions-user") ?? [];
  mentionElements.forEach(mention => {
    const username = mention.querySelector("bdi")?.textContent?.trim() ?? "";
    const url = mention.getAttribute("href") ?? "";

    if (username) {
      mentions.push({ username, url });
    }
  });

  // Extract plain text
  const plainText = container?.textContent?.trim() ?? "";

  return {
    boothLinks,
    downloadLinks,
    images,
    mentions,
    plainText,
  };
}

// ============ Search URL Builder ============

export interface SearchUrlParams {
  term: string;
  in?: SearchInType;
  matchWords?: MatchWordsType;
  showAs?: ShowAsType;
  by?: string;
  categories?: string;
  searchChildren?: boolean;
  hasTags?: string;
  replies?: string;
  repliesFilter?: RepliesFilterType;
  timeFilter?: TimeFilterType;
  timeRange?: string;
  sortBy?: SortByType;
  sortDirection?: SortDirectionType;
  page?: number;
}

export function buildSearchUrl(baseUrl: string, params: SearchUrlParams): string {
  const url = new URL("/search", baseUrl);

  url.searchParams.set("term", params.term);
  url.searchParams.set("in", params.in ?? "titlesposts");
  url.searchParams.set("matchWords", params.matchWords ?? "all");
  url.searchParams.set("showAs", params.showAs ?? "posts");

  if (params.by) url.searchParams.set("by", params.by);
  if (params.categories) url.searchParams.set("categories", params.categories);
  url.searchParams.set("searchChildren", String(params.searchChildren ?? false));
  if (params.hasTags) url.searchParams.set("hasTags", params.hasTags);
  if (params.replies) url.searchParams.set("replies", params.replies);

  url.searchParams.set("repliesFilter", params.repliesFilter ?? "atleast");
  url.searchParams.set("timeFilter", params.timeFilter ?? "newer");
  if (params.timeRange) url.searchParams.set("timeRange", params.timeRange);

  url.searchParams.set("sortBy", params.sortBy ?? "relevance");
  url.searchParams.set("sortDirection", params.sortDirection ?? "desc");

  if (params.page && params.page > 1) {
    url.searchParams.set("page", String(params.page));
  }

  return url.toString();
}

export const RIPPERSTORE_BASE_URL = "https://forum.ripper.store";

export function buildRipperstoreSearchUrl(params: SearchUrlParams): string {
  return buildSearchUrl(RIPPERSTORE_BASE_URL, params);
}

// ============ Main Parser ============

export function parseSearchPage(htmlString: string): SearchPage {
  const doc = parseHTMLString(htmlString);

  return {
    meta: parseMeta(doc),
    config: parseConfig(doc),
    user: parseUser(doc),
    query: parseQueryFromUrl(doc),
    results: parseResults(doc),
    pagination: parsePagination(doc),
    filterOptions: getFilterOptions(),
  };
}

export async function fetchAndParseSearchPage(url: string): Promise<SearchPage> {
  return new Promise<SearchPage>(async (resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      headers: {
        "User-Agent": navigator.userAgent,
        "Accept": "text/html",
      },
      onload: (response) => {
        if (response.status >= 200 && response.status < 300 && response.responseText) {
          try {
            const searchPage = parseSearchPage(response.responseText);
            resolve(searchPage);
          } catch (err) {
            reject(new Error(`Failed to parse search page: ${(err as Error).message}`));
          }
        } else {
          reject(new Error(`Failed to fetch search page. Status: ${response.status}`));
        }
      },
      onerror: (err) => {
        reject(new Error(`Network error while fetching search page: ${err}`));
      },
    });
  });
}

export async function searchRipperstore(params: SearchUrlParams): Promise<SearchPage> {
  const url = buildRipperstoreSearchUrl(params);
  return fetchAndParseSearchPage(url);
}

// ============ RipperStore API Types ============

export interface TopicPost {
  pid: number;
  tid: number;
  toPid: number | null;
  content: string;
  uid: number;
  timestamp: number;
  timestampISO: string;
  deleted: boolean;
  upvotes: number;
  downvotes: number;
  votes: number;
  replies: number;
  user: {
    uid: number;
    username: string;
    userslug: string;
    displayname: string;
    picture: string | null;
    status: string;
    "icon:bgColor": string;
    "icon:text": string;
  };
  index: number;
  isMainPost?: boolean;
}

export interface TopicTag {
  value: string;
  valueEscaped: string;
  valueEncoded: string;
  class: string;
}

export interface TopicData {
  tid: number;
  title: string;
  titleRaw: string;
  slug: string;
  cid: number;
  uid: number;
  postcount: number;
  viewcount: number;
  votes: number;
  upvotes: number;
  downvotes: number;
  timestamp: number;
  timestampISO: string;
  lastposttime: number;
  lastposttimeISO: string;
  deleted: number;
  locked: number;
  pinned: number;
  tags: TopicTag[];
  posts: TopicPost[];
  category: {
    cid: number;
    name: string;
    slug: string;
    icon: string;
    bgColor: string;
    color: string;
  };
  pagination: {
    currentPage: number;
    pageCount: number;
  };
}

export interface DeepScanOptions {
  /** Maximum depth to scan replies (default: 3) */
  maxDepth?: number;
  /** Maximum posts to scan per topic (default: 100) */
  maxPostsPerTopic?: number;
  /** Whether to include the original post content (default: true) */
  includeOriginalPost?: boolean;
  /** Callback for progress updates */
  onProgress?: (progress: DeepScanProgress) => void;
}

export interface DeepScanProgress {
  phase: "resolving" | "fetching" | "scanning" | "complete";
  currentTopic?: number;
  totalTopics?: number;
  currentPost?: number;
  totalPosts?: number;
  foundDownloads?: number;
}

export interface DeepScanResult {
  /** Original search result that was scanned */
  originalResult: TransformedSearchResult;
  /** Topic data if fetched */
  topicData?: TopicData;
  /** All download links found from deep scan */
  downloadLinks: DownloadLink[];
  /** All Booth references found */
  boothReferences: ExtractedBoothLink[];
  /** Posts that contained downloads */
  postsWithDownloads: {
    pid: number;
    user: string;
    timestamp: Date;
    downloads: DownloadLink[];
    depth: number;
  }[];
  /** Scan statistics */
  stats: {
    postsScanned: number;
    maxDepthReached: number;
    totalDownloadsFound: number;
  };
}

// ============ RipperStore API Functions ============

/**
 * Fetch JSON from RipperStore API
 */
async function fetchRipperstoreApi<T>(endpoint: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: `${RIPPERSTORE_BASE_URL}/api${endpoint}`,
      headers: {
        "User-Agent": navigator.userAgent,
        "Accept": "application/json",
      },
      onload: (response) => {
        if (response.status >= 200 && response.status < 300 && response.responseText) {
          try {
            resolve(JSON.parse(response.responseText) as T);
          } catch (err) {
            reject(new Error(`Failed to parse API response: ${(err as Error).message}`));
          }
        } else {
          reject(new Error(`API request failed. Status: ${response.status}`));
        }
      },
      onerror: (err) => {
        reject(new Error(`Network error: ${err}`));
      },
    });
  });
}

/**
 * Get the topic URL for a post ID
 * GET /api/post/{pid} returns the topic URL
 */
export async function getPostTopicUrl(postId: number): Promise<string> {
  const url = await fetchRipperstoreApi<string>(`/post/${postId}`);
  return url;
}

/**
 * Parse topic slug and ID from URL
 * e.g., "/topic/4454/lf-darjelling-outfits" -> { tid: 4454, slug: "lf-darjelling-outfits" }
 */
function parseTopicUrl(url: string): { tid: number; slug: string } | null {
  const match = url.match(/\/topic\/(\d+)\/([^\/\?#]+)/);
  if (!match) return null;
  return {
    tid: parseInt(match[1], 10),
    slug: match[2],
  };
}

/**
 * Fetch topic data with posts starting from offset
 * GET /api/topic/{tid}/{slug}/{offset}
 */
export async function fetchTopicPosts(
  tid: number,
  slug: string,
  offset: number = 0
): Promise<TopicData> {
  return fetchRipperstoreApi<TopicData>(`/topic/${tid}/${slug}/${offset}`);
}

/**
 * Fetch all posts from a topic (paginated)
 */
export async function fetchAllTopicPosts(
  tid: number,
  slug: string,
  maxPosts: number = 1000,
  onProgress?: (fetched: number, total: number) => void
): Promise<TopicPost[]> {
  const allPosts: TopicPost[] = [];
  let offset = 0;
  let totalPosts = 0;

  // Fetch first page to get total count
  const firstPage = await fetchTopicPosts(tid, slug, 0);
  totalPosts = Math.min(firstPage.postcount, maxPosts);
  allPosts.push(...firstPage.posts);
  onProgress?.(allPosts.length, totalPosts);

  // Fetch remaining pages
  while (allPosts.length < totalPosts) {
    offset = allPosts.length;
    try {
      const page = await fetchTopicPosts(tid, slug, offset);
      if (!page.posts || page.posts.length === 0) break;
      allPosts.push(...page.posts);
      onProgress?.(allPosts.length, totalPosts);
    } catch (err) {
      console.warn(`[BoothKit] Failed to fetch posts at offset ${offset}:`, err);
      break;
    }
  }

  return allPosts.slice(0, maxPosts);
}

/**
 * Extract download links from post content HTML
 */
function extractDownloadsFromContent(htmlContent: string): DownloadLink[] {
  const downloads: DownloadLink[] = [];
  const doc = parseHTMLString(`<div>${htmlContent}</div>`);
  const container = doc.body.firstElementChild;

  const allAnchors = container?.querySelectorAll("a") ?? [];
  allAnchors.forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href) return;

    try {
      const url = new URL(href);
      const domain = url.hostname.replace(/^www\./, "").toLowerCase();

      if (DOWNLOAD_DOMAINS.some((d) => domain.includes(d) || d.includes(domain))) {
        // Try to extract context from the HTML content
        const contextInfo = extractLinkContext(htmlContent, href);

        // Use context as name if found
        let name = contextInfo.context || "";

        // Fallback: try anchor text if it's not just the URL
        if (!name) {
          const anchorText = anchor.textContent?.trim() || "";
          if (anchorText && anchorText !== href && !anchorText.startsWith("http")) {
            name = anchorText;
          }
        }

        // Final fallback: use domain
        if (!name || name.length < 2) {
          name = domain;
        }

        downloads.push({
          url: href,
          name,
          domain,
          context: contextInfo.context || undefined,
          contentType: contextInfo.contentType || undefined,
        });
      }
    } catch {
      // Invalid URL, skip
    }
  });

  return downloads;
}

/**
 * Extract Booth links from post content HTML
 */
function extractBoothLinksFromContent(htmlContent: string): ExtractedBoothLink[] {
  const boothLinks: ExtractedBoothLink[] = [];
  const doc = parseHTMLString(`<div>${htmlContent}</div>`);
  const container = doc.body.firstElementChild;

  // Extract from link previews
  const linkPreviews = container?.querySelectorAll(".link-preview") ?? [];
  linkPreviews.forEach((preview) => {
    const url = preview.getAttribute("data-url") ?? "";
    const itemId = extractBoothItemId(url);
    if (itemId) {
      boothLinks.push({
        url,
        itemId,
        title: preview.querySelector(".link-preview-title")?.textContent ?? null,
        imageUrl: preview.querySelector("img")?.getAttribute("src") ?? null,
        description: preview.querySelector(".link-preview-description")?.textContent ?? null,
      });
    }
  });

  // Extract standalone booth links
  const anchors = container?.querySelectorAll("a[href*='booth.pm']") ?? [];
  anchors.forEach((anchor) => {
    const href = anchor.getAttribute("href") ?? "";
    const itemId = extractBoothItemId(href);
    if (itemId && !boothLinks.some((bl) => bl.itemId === itemId)) {
      boothLinks.push({
        url: href,
        itemId,
        title: anchor.textContent ?? null,
        imageUrl: null,
        description: null,
      });
    }
  });

  return boothLinks;
}

/**
 * Build a reply tree from flat posts array
 * Returns posts organized by their parent (toPid)
 */
function buildReplyTree(posts: TopicPost[]): Map<number | null, TopicPost[]> {
  const tree = new Map<number | null, TopicPost[]>();

  for (const post of posts) {
    const parentId = post.toPid;
    if (!tree.has(parentId)) {
      tree.set(parentId, []);
    }
    tree.get(parentId)!.push(post);
  }

  return tree;
}

/**
 * Scan all posts in topic for downloads
 * Also tracks reply depth for posts that are direct replies
 */
function scanAllPostsForDownloads(
  posts: TopicPost[],
  replyTree: Map<number | null, TopicPost[]>,
  originalPostPid: number | null,
  maxDepth: number,
  results: DeepScanResult["postsWithDownloads"],
  seenPids: Set<number>
): void {
  // First, scan all posts regardless of reply structure
  for (const post of posts) {
    if (seenPids.has(post.pid)) continue;
    seenPids.add(post.pid);

    // Extract downloads from this post
    const downloads = extractDownloadsFromContent(post.content);

    if (downloads.length > 0) {
      // Calculate depth - direct replies to original are depth 1, etc.
      let depth = 1;
      if (post.toPid !== null && post.toPid !== originalPostPid) {
        // Try to find depth by walking up the reply chain
        let currentPid = post.toPid;
        let walkDepth = 1;
        const visited = new Set<number>();
        while (currentPid !== null && walkDepth < maxDepth) {
          if (visited.has(currentPid)) break;
          visited.add(currentPid);
          const parent = posts.find((p) => p.pid === currentPid);
          if (!parent) break;
          if (parent.pid === originalPostPid || parent.toPid === null) {
            depth = walkDepth + 1;
            break;
          }
          currentPid = parent.toPid;
          walkDepth++;
        }
      }

      results.push({
        pid: post.pid,
        user: post.user?.displayname ?? post.user?.username ?? "Unknown",
        timestamp: new Date(post.timestamp),
        downloads,
        depth: Math.min(depth, maxDepth),
      });
    }
  }
}

/**
 * Recursively scan posts for downloads up to maxDepth (legacy - kept for specific reply scanning)
 */
function scanPostsRecursively(
  posts: TopicPost[],
  replyTree: Map<number | null, TopicPost[]>,
  targetPid: number | null,
  currentDepth: number,
  maxDepth: number,
  results: DeepScanResult["postsWithDownloads"],
  seenPids: Set<number>
): void {
  // Get direct replies to target post
  const replies = replyTree.get(targetPid) ?? [];

  for (const post of replies) {
    if (seenPids.has(post.pid)) continue;
    seenPids.add(post.pid);

    // Extract downloads from this post
    const downloads = extractDownloadsFromContent(post.content);

    if (downloads.length > 0) {
      results.push({
        pid: post.pid,
        user: post.user?.displayname ?? post.user?.username ?? "Unknown",
        timestamp: new Date(post.timestamp),
        downloads,
        depth: currentDepth,
      });
    }

    // Recurse into replies if not at max depth
    if (currentDepth < maxDepth) {
      scanPostsRecursively(
        posts,
        replyTree,
        post.pid,
        currentDepth + 1,
        maxDepth,
        results,
        seenPids
      );
    }
  }
}

/**
 * Deep scan a search result to find all downloads
 * This fetches the full topic and scans replies recursively
 */
export async function deepScanSearchResult(
  result: TransformedSearchResult,
  options: DeepScanOptions = {}
): Promise<DeepScanResult> {
  const {
    maxDepth = 3,
    maxPostsPerTopic = 100,
    includeOriginalPost = true,
    onProgress,
  } = options;

  const scanResult: DeepScanResult = {
    originalResult: result,
    downloadLinks: [...result.downloadLinks],
    boothReferences: [],
    postsWithDownloads: [],
    stats: {
      postsScanned: 0,
      maxDepthReached: 0,
      totalDownloadsFound: result.downloadLinks.length,
    },
  };

  // Extract topic ID from result
  const topicId = result.topicId ? parseInt(result.topicId, 10) : null;
  if (!topicId) {
    // Try to get topic URL from post ID
    const postId = parseInt(result.id, 10);
    if (isNaN(postId)) {
      return scanResult;
    }

    onProgress?.({ phase: "resolving" });

    try {
      const topicUrl = await getPostTopicUrl(postId);
      const parsed = parseTopicUrl(topicUrl);
      if (!parsed) {
        return scanResult;
      }

      onProgress?.({ phase: "fetching" });

      // Fetch all posts from topic
      const posts = await fetchAllTopicPosts(
        parsed.tid,
        parsed.slug,
        maxPostsPerTopic,
        (fetched, total) => {
          onProgress?.({
            phase: "fetching",
            currentPost: fetched,
            totalPosts: total,
          });
        }
      );

      // Build reply tree and scan
      const replyTree = buildReplyTree(posts);
      const seenPids = new Set<number>();

      onProgress?.({ phase: "scanning" });

      // Find the original post
      const originalPost = posts.find((p) => p.pid === postId);

      if (includeOriginalPost && originalPost) {
        // Extract from original post
        const origDownloads = extractDownloadsFromContent(originalPost.content);
        const origBoothLinks = extractBoothLinksFromContent(originalPost.content);

        scanResult.boothReferences.push(...origBoothLinks);

        // Add downloads not already in list
        for (const dl of origDownloads) {
          if (!scanResult.downloadLinks.some((d) => d.url === dl.url)) {
            scanResult.downloadLinks.push(dl);
          }
        }

        // Mark original post as seen so we don't count it again
        seenPids.add(postId);
      }

      // Scan ALL posts in the topic for downloads (not just replies)
      scanAllPostsForDownloads(
        posts,
        replyTree,
        postId,
        maxDepth,
        scanResult.postsWithDownloads,
        seenPids
      );

      // Aggregate results
      scanResult.stats.postsScanned = seenPids.size;
      scanResult.stats.maxDepthReached = Math.max(
        0,
        ...scanResult.postsWithDownloads.map((p) => p.depth)
      );

      // Add all found downloads to main list
      for (const postResult of scanResult.postsWithDownloads) {
        for (const dl of postResult.downloads) {
          if (!scanResult.downloadLinks.some((d) => d.url === dl.url)) {
            scanResult.downloadLinks.push(dl);
          }
        }
      }

      scanResult.stats.totalDownloadsFound = scanResult.downloadLinks.length;

      onProgress?.({
        phase: "complete",
        foundDownloads: scanResult.stats.totalDownloadsFound,
      });

    } catch (err) {
      console.warn(`[BoothKit] Deep scan failed for result ${result.id}:`, err);
    }
  } else {
    // We have topic ID, construct slug from title
    const slug = result.topicTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    onProgress?.({ phase: "fetching" });

    try {
      const posts = await fetchAllTopicPosts(
        topicId,
        slug,
        maxPostsPerTopic,
        (fetched, total) => {
          onProgress?.({
            phase: "fetching",
            currentPost: fetched,
            totalPosts: total,
          });
        }
      );

      const replyTree = buildReplyTree(posts);
      const seenPids = new Set<number>();
      const postId = parseInt(result.id, 10);

      onProgress?.({ phase: "scanning" });

      // Scan from main post or all top-level posts
      if (!isNaN(postId)) {
        const originalPost = posts.find((p) => p.pid === postId);

        if (includeOriginalPost && originalPost) {
          const origDownloads = extractDownloadsFromContent(originalPost.content);
          const origBoothLinks = extractBoothLinksFromContent(originalPost.content);

          scanResult.boothReferences.push(...origBoothLinks);

          for (const dl of origDownloads) {
            if (!scanResult.downloadLinks.some((d) => d.url === dl.url)) {
              scanResult.downloadLinks.push(dl);
            }
          }

          // Mark original post as seen
          seenPids.add(postId);
        }
      }

      // Scan ALL posts in the topic for downloads
      scanAllPostsForDownloads(
        posts,
        replyTree,
        isNaN(postId) ? null : postId,
        maxDepth,
        scanResult.postsWithDownloads,
        seenPids
      );

      scanResult.stats.postsScanned = seenPids.size;
      scanResult.stats.maxDepthReached = Math.max(
        0,
        ...scanResult.postsWithDownloads.map((p) => p.depth)
      );

      for (const postResult of scanResult.postsWithDownloads) {
        for (const dl of postResult.downloads) {
          if (!scanResult.downloadLinks.some((d) => d.url === dl.url)) {
            scanResult.downloadLinks.push(dl);
          }
        }
      }

      scanResult.stats.totalDownloadsFound = scanResult.downloadLinks.length;

      onProgress?.({
        phase: "complete",
        foundDownloads: scanResult.stats.totalDownloadsFound,
      });

    } catch (err) {
      console.warn(`[BoothKit] Deep scan failed for topic ${topicId}:`, err);
    }
  }

  return scanResult;
}

/**
 * Deep scan multiple search results
 */
export async function deepScanSearchResults(
  results: TransformedSearchResult[],
  options: DeepScanOptions & {
    /** Maximum results to deep scan (default: 5) */
    maxResultsToScan?: number;
    /** Only scan results with downloads already detected (default: false) */
    onlyWithDownloads?: boolean;
  } = {}
): Promise<DeepScanResult[]> {
  const {
    maxResultsToScan = 5,
    onlyWithDownloads = false,
    onProgress,
    ...scanOptions
  } = options;

  // Filter and limit results to scan
  let toScan = results;
  if (onlyWithDownloads) {
    toScan = results.filter((r) => r.hasDownloads);
  }
  toScan = toScan.slice(0, maxResultsToScan);

  const scanResults: DeepScanResult[] = [];

  for (let i = 0; i < toScan.length; i++) {
    const result = toScan[i];

    onProgress?.({
      phase: "scanning",
      currentTopic: i + 1,
      totalTopics: toScan.length,
    });

    try {
      const scanResult = await deepScanSearchResult(result, {
        ...scanOptions,
        onProgress: (progress) => {
          onProgress?.({
            ...progress,
            currentTopic: i + 1,
            totalTopics: toScan.length,
          });
        },
      });
      scanResults.push(scanResult);
    } catch (err) {
      console.warn(`[BoothKit] Failed to deep scan result ${i}:`, err);
    }
  }

  onProgress?.({
    phase: "complete",
    currentTopic: toScan.length,
    totalTopics: toScan.length,
    foundDownloads: scanResults.reduce(
      (sum, r) => sum + r.stats.totalDownloadsFound,
      0
    ),
  });

  return scanResults;
}

/**
 * Enhanced search that includes deep scanning
 */
export async function searchBoothItemWithDeepScan(
  query: ItemSearchQuery,
  searchOptions: ItemSearchOptions = {},
  deepScanOptions: DeepScanOptions & { maxResultsToScan?: number } = {}
): Promise<{
  searchResult: ItemSearchResult;
  deepScanResults: DeepScanResult[];
  allDownloadLinks: DownloadLink[];
}> {
  // First, perform the regular search
  const searchResult = await searchBoothItemComprehensive(query, searchOptions);

  // Then deep scan the top results
  const deepScanResults = await deepScanSearchResults(
    searchResult.results,
    deepScanOptions
  );

  // Aggregate all download links
  const allDownloadLinks: DownloadLink[] = [];
  const seenUrls = new Set<string>();

  // Add from search results
  for (const result of searchResult.results) {
    for (const dl of result.downloadLinks) {
      if (!seenUrls.has(dl.url)) {
        seenUrls.add(dl.url);
        allDownloadLinks.push(dl);
      }
    }
  }

  // Add from deep scan
  for (const scanResult of deepScanResults) {
    for (const dl of scanResult.downloadLinks) {
      if (!seenUrls.has(dl.url)) {
        seenUrls.add(dl.url);
        allDownloadLinks.push(dl);
      }
    }
  }

  return {
    searchResult,
    deepScanResults,
    allDownloadLinks,
  };
}

// ============ Item-Based Search Types ============

export interface ItemSearchQuery {
  /** The Booth item ID */
  itemId?: string;
  /** The product name/title */
  productName?: string;
  /** The shop/brand name */
  shopName?: string;
  /** Tags associated with the item */
  tags?: string[];
  /** Category name */
  category?: string;
}

export interface ItemSearchOptions {
  /** Which search strategies to use (default: all applicable) */
  strategies?: SearchStrategy[];
  /** Maximum number of searches to perform (default: 3) */
  maxSearches?: number;
  /** Whether to deduplicate results across searches (default: true) */
  deduplicateResults?: boolean;
  /** Sort final results by score (default: true) */
  sortByScore?: boolean;
}

export interface ItemSearchResult {
  /** Combined and deduplicated results from all searches */
  results: TransformedSearchResult[];
  /** Individual search results for each strategy used */
  searchResults: {
    strategy: SearchStrategy;
    query: string;
    results: TransformedSearchResult[];
    totalResults: number;
    searchTime: number;
  }[];
  /** Total unique results found */
  totalUniqueResults: number;
  /** Strategies that were executed */
  strategiesUsed: SearchStrategy[];
}

// ============ Search Strategy Helpers ============

/**
 * Extract meaningful keywords from a product name
 */
function extractKeywordsFromName(name: string): string[] {
  if (!name) return [];

  // Remove common noise words and special characters
  const noiseWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "can", "need",
    "ver", "version", "v", "vol", "avatar", "model", "3d", "vrc", "vrchat",
    // Japanese particles
    "の", "は", "が", "を", "に", "で", "と", "も", "や", "か",
  ]);

  // Split by various delimiters
  const words = name
    .toLowerCase()
    .replace(/[【】「」『』（）()[\]{}""'']/g, " ") // Remove brackets
    .replace(/[_\-\/\\|:;,.<>!?@#$%^&*+=~`]/g, " ") // Remove special chars
    .split(/\s+/)
    .filter(word => {
      if (word.length < 2) return false;
      if (noiseWords.has(word)) return false;
      if (/^\d+$/.test(word)) return false; // Skip pure numbers
      return true;
    });

  // Return unique keywords, prioritizing longer words
  const unique = [...new Set(words)];
  return unique.sort((a, b) => b.length - a.length).slice(0, 5);
}

/**
 * Clean and normalize a search term
 */
function normalizeSearchTerm(term: string): string {
  return term
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 100); // Limit length
}

/**
 * Build search queries based on item data and selected strategies
 */
function buildSearchQueries(
  query: ItemSearchQuery,
  strategies: SearchStrategy[]
): { strategy: SearchStrategy; searchTerm: string }[] {
  const queries: { strategy: SearchStrategy; searchTerm: string }[] = [];

  for (const strategy of strategies) {
    switch (strategy) {
      case "itemId":
        if (query.itemId) {
          queries.push({ strategy, searchTerm: query.itemId });
        }
        break;

      case "productName":
        if (query.productName) {
          // Use the full product name
          const cleanName = normalizeSearchTerm(query.productName);
          if (cleanName.length >= 3) {
            queries.push({ strategy, searchTerm: cleanName });
          }
        }
        break;

      case "shopAndProduct":
        if (query.shopName && query.productName) {
          // Combine shop name with a shortened product name
          const keywords = extractKeywordsFromName(query.productName);
          const mainKeyword = keywords[0] || "";
          if (mainKeyword) {
            const term = normalizeSearchTerm(`${query.shopName} ${mainKeyword}`);
            queries.push({ strategy, searchTerm: term });
          }
        }
        break;

      case "tags":
        if (query.tags && query.tags.length > 0) {
          // Use first 2-3 most relevant tags
          const relevantTags = query.tags
            .filter(tag => tag.length >= 2 && !/^\d+$/.test(tag))
            .slice(0, 3);
          if (relevantTags.length > 0) {
            queries.push({ strategy, searchTerm: relevantTags.join(" ") });
          }
        }
        break;

      case "category":
        if (query.category && query.productName) {
          const keywords = extractKeywordsFromName(query.productName);
          const mainKeyword = keywords[0] || "";
          if (mainKeyword) {
            const term = normalizeSearchTerm(`${query.category} ${mainKeyword}`);
            queries.push({ strategy, searchTerm: term });
          }
        }
        break;

      case "keywords":
        if (query.productName) {
          const keywords = extractKeywordsFromName(query.productName);
          if (keywords.length >= 2) {
            // Use top 2-3 keywords
            queries.push({ strategy, searchTerm: keywords.slice(0, 3).join(" ") });
          }
        }
        break;
    }
  }

  // Remove duplicate search terms
  const seen = new Set<string>();
  return queries.filter(q => {
    const key = q.searchTerm.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ============ Convenience Functions ============

/**
 * Search for a Booth item ID on Ripperstore
 */
export async function searchBoothItemOnRipperstore(boothItemId: string): Promise<SearchPage> {
  return searchRipperstore({
    term: boothItemId,
    in: "titlesposts",
    matchWords: "all",
    showAs: "posts",
    sortBy: "relevance",
    sortDirection: "desc",
  });
}

/**
 * Search for a Booth item using multiple strategies based on item data
 * This provides more comprehensive results by trying different search approaches
 */
export async function searchBoothItemComprehensive(
  query: ItemSearchQuery,
  options: ItemSearchOptions = {}
): Promise<ItemSearchResult> {
  const {
    strategies = determineStrategies(query),
    maxSearches = 3,
    deduplicateResults = true,
    sortByScore = true,
  } = options;

  const searchQueries = buildSearchQueries(query, strategies).slice(0, maxSearches);

  const searchResults: ItemSearchResult["searchResults"] = [];
  const allResults: TransformedSearchResult[] = [];
  const seenPostIds = new Set<string>();

  // Execute searches sequentially to avoid rate limiting
  for (const { strategy, searchTerm } of searchQueries) {
    try {
      const searchPage = await searchRipperstore({
        term: searchTerm,
        in: "titlesposts",
        matchWords: strategy === "itemId" ? "all" : "any",
        showAs: "posts",
        sortBy: "relevance",
        sortDirection: "desc",
      });

      const transformed = SearchResultTransformer.transformAndScore(searchPage);

      // Add source strategy info to each result
      const transformedWithSource = transformed.map(result => ({
        ...result,
        foundVia: strategy,
        foundQuery: searchTerm,
      }));

      searchResults.push({
        strategy,
        query: searchTerm,
        results: transformedWithSource,
        totalResults: searchPage.results.totalResults,
        searchTime: searchPage.results.searchTime,
      });

      // Add to combined results
      for (const result of transformedWithSource) {
        if (deduplicateResults) {
          if (!seenPostIds.has(result.id)) {
            seenPostIds.add(result.id);
            allResults.push(result);
          }
        } else {
          allResults.push(result);
        }
      }
    } catch (error) {
      console.warn(`[BoothKit] Search strategy "${strategy}" failed:`, error);
    }
  }

  // Sort combined results by score
  if (sortByScore) {
    allResults.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  return {
    results: allResults,
    searchResults,
    totalUniqueResults: allResults.length,
    strategiesUsed: searchQueries.map(q => q.strategy),
  };
}

/**
 * Determine which search strategies to use based on available data
 */
function determineStrategies(query: ItemSearchQuery): SearchStrategy[] {
  const strategies: SearchStrategy[] = [];

  // Item ID is always the most reliable
  if (query.itemId) {
    strategies.push("itemId");
  }

  // Product name searches
  if (query.productName) {
    strategies.push("productName");
    strategies.push("keywords");
  }

  // Shop + product combination
  if (query.shopName && query.productName) {
    strategies.push("shopAndProduct");
  }

  // Tag-based search
  if (query.tags && query.tags.length > 0) {
    strategies.push("tags");
  }

  // Category-based search
  if (query.category && query.productName) {
    strategies.push("category");
  }

  return strategies;
}

/**
 * Create an ItemSearchQuery from an ItemPage product
 * Import ItemPage from booth/item.ts to use this
 */
export function createSearchQueryFromItem(item: {
  product: { id: string; name: string; categoryName?: string };
  shop: { name: string };
  tags?: { name: string }[];
}): ItemSearchQuery {
  return {
    itemId: item.product.id,
    productName: item.product.name,
    shopName: item.shop.name,
    category: item.product.categoryName,
    tags: item.tags?.map(t => t.name) ?? [],
  };
}

/**
 * Quick search helper that tries item ID first, then falls back to name-based search
 */
export async function searchBoothItemSmart(
  itemId: string,
  productName?: string,
  shopName?: string
): Promise<ItemSearchResult> {
  const query: ItemSearchQuery = {
    itemId,
    productName,
    shopName,
  };

  // Start with item ID, add fallback strategies if we have more data
  const strategies: SearchStrategy[] = ["itemId"];

  if (productName) {
    strategies.push("keywords");
  }

  if (shopName && productName) {
    strategies.push("shopAndProduct");
  }

  return searchBoothItemComprehensive(query, {
    strategies,
    maxSearches: 3,
    deduplicateResults: true,
  });
}

/**
 * Extract all Booth item IDs and download links from search results
 */
export function extractAllContentFromResults(searchPage: SearchPage): {
  allBoothLinks: ExtractedBoothLink[];
  allDownloadLinks: ExtractedDownloadLink[];
  allImages: ExtractedImage[];
} {
  const allBoothLinks: ExtractedBoothLink[] = [];
  const allDownloadLinks: ExtractedDownloadLink[] = [];
  const allImages: ExtractedImage[] = [];

  const seenBoothIds = new Set<string>();
  const seenDownloadUrls = new Set<string>();
  const seenImageSrcs = new Set<string>();

  for (const post of searchPage.results.posts) {
    const extraction = extractPostContent(post.content);

    for (const bl of extraction.boothLinks) {
      if (!seenBoothIds.has(bl.itemId)) {
        seenBoothIds.add(bl.itemId);
        allBoothLinks.push(bl);
      }
    }

    for (const dl of extraction.downloadLinks) {
      if (!seenDownloadUrls.has(dl.url)) {
        seenDownloadUrls.add(dl.url);
        allDownloadLinks.push(dl);
      }
    }

    for (const img of extraction.images) {
      if (!seenImageSrcs.has(img.src)) {
        seenImageSrcs.add(img.src);
        allImages.push(img);
      }
    }
  }

  return {
    allBoothLinks,
    allDownloadLinks,
    allImages,
  };
}

// ============ Search Result Transformer ============

export class SearchResultTransformer {
  /**
   * Validate if a string is a valid item ID
   */
  static validateItemId(itemId: string | null | undefined): boolean {
    if (!itemId || typeof itemId !== "string") return false;

    const trimmed = itemId.trim();
    const numericPattern = /^\d{1,20}$/;
    const shortAlphanumeric = /^[a-zA-Z0-9]{3,10}$/;
    const generalAlphanumeric = /^[a-zA-Z0-9\-_]{1,50}$/;
    const spacedPattern = /^[a-zA-Z0-9\-_]{1,50}\s+[a-zA-Z0-9\-_]{1,50}$/;

    if (numericPattern.test(trimmed) || spacedPattern.test(trimmed) || shortAlphanumeric.test(trimmed)) {
      return true;
    }

    if (generalAlphanumeric.test(trimmed)) {
      return !shortAlphanumeric.test(trimmed);
    }

    return false;
  }

  /**
   * Count download links in HTML content
   */
  static countDownloadLinks(content: string | null | undefined): number {
    if (!content || typeof content !== "string") return 0;

    const domainPatterns = DOWNLOAD_DOMAINS.map(domain =>
      domain === "files.1drv.com"
        ? "(?:[a-z0-9-]+\\.)?files.1drv.com"
        : domain.replace(/\./g, "\\.")
    );

    const pattern = new RegExp(
      `(?:href=["']|\\[([^\\]]+)\\]\\(|^|\\s)(https?:\\/\\/(?:www\\.)?(?:${domainPatterns.join("|")})\\/)(?:[^"'\\s<>\\)]*(?:[^"'\\s<>\\)\\.,;:!?]|\\.[a-zA-Z0-9]))(?=["'\\s<>\\),]|$)`,
      "gi"
    );

    const matches = content.match(pattern);
    return matches ? matches.length : 0;
  }

  /**
   * Extract download links from HTML content with their names
   */
  static extractDownloadLinks(content: string | null | undefined): DownloadLink[] {
    if (!content || typeof content !== "string") return [];

    const uniqueLinks = new Map<string, DownloadLink>();

    const domainPattern = DOWNLOAD_DOMAINS.map(domain =>
      domain === "files.1drv.com"
        ? "(?:[a-z0-9-]+\\.)?files.1drv.com"
        : domain.replace(/\./g, "\\.")
    ).join("|");

    // Helper to get domain from URL
    const getDomain = (url: string): string => {
      try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace(/^www\./, "");
      } catch {
        return "unknown";
      }
    };

    // Helper to clean link text
    const cleanLinkText = (text: string): string => {
      return text
        .trim()
        .replace(/&quot;/g, '"')
        .replace(/&#x2F;/g, "/")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/<[^>]*>/g, "")
        .trim();
    };

    // Extract from anchor tags with text content: <a href="url">text</a>
    const anchorPattern = new RegExp(
      `<a[^>]*href=["'](https?:\\/\\/(?:www\\.)?(?:${domainPattern})[^"']*)["'][^>]*>([^<]*)<\\/a>`,
      "gi"
    );
    let match: RegExpExecArray | null;
    while ((match = anchorPattern.exec(content)) !== null) {
      const url = match[1];
      const text = match[2];
      if (url && !uniqueLinks.has(url)) {
        const cleanText = cleanLinkText(text);
        uniqueLinks.set(url, {
          url,
          name: cleanText || getDomain(url),
          domain: getDomain(url),
        });
      }
    }

    // Extract from href attributes without text (fallback)
    const hrefPattern = new RegExp(
      `href=["'](https?:\\/\\/(?:www\\.)?(?:${domainPattern})\\S*?)["']`,
      "gi"
    );
    while ((match = hrefPattern.exec(content)) !== null) {
      const url = match[1];
      if (url && !uniqueLinks.has(url)) {
        uniqueLinks.set(url, {
          url,
          name: getDomain(url),
          domain: getDomain(url),
        });
      }
    }

    // Extract from markdown links: [text](url)
    const markdownPattern = new RegExp(
      `\\[([^\\]]+)\\]\\((https?:\\/\\/(?:www\\.)?(?:${domainPattern})\\S*?)\\)`,
      "gi"
    );
    while ((match = markdownPattern.exec(content)) !== null) {
      const text = match[1];
      const url = match[2];
      if (url && !uniqueLinks.has(url)) {
        const cleanText = cleanLinkText(text);
        uniqueLinks.set(url, {
          url,
          name: cleanText || getDomain(url),
          domain: getDomain(url),
        });
      }
    }

    // Extract standalone URLs
    const standalonePattern = new RegExp(
      `(?:^|\\s)(https?:\\/\\/(?:www\\.)?(?:${domainPattern})\\S*)`,
      "gi"
    );
    while ((match = standalonePattern.exec(content)) !== null) {
      const url = match[1];
      if (!url) continue;

      let isDuplicate = false;
      for (const existing of uniqueLinks.keys()) {
        if (url.includes(existing) || existing.includes(url)) {
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) {
        uniqueLinks.set(url, {
          url,
          name: getDomain(url),
          domain: getDomain(url),
        });
      }
    }

    // Enrich links with context from surrounding text
    const enrichedLinks = Array.from(uniqueLinks.values()).map(link => {
      const contextInfo = extractLinkContext(content, link.url);

      // Determine the best display name
      let displayName = link.name;

      // If we found context, use it as the name
      if (contextInfo.context) {
        displayName = contextInfo.context;
      }
      // If name is a URL or matches domain, use domain as fallback
      else if (link.name.startsWith("http") || link.name === link.domain) {
        displayName = link.domain;
      }

      return {
        ...link,
        context: contextInfo.context || undefined,
        contentType: contextInfo.contentType || undefined,
        name: displayName,
      };
    });

    return enrichedLinks;
  }

  /**
   * Count post/topic references in HTML content
   */
  static countPostReferences(content: string | null | undefined): number {
    if (!content || typeof content !== "string") return 0;

    const uniqueRefs = new Set<string>();

    // Extract from href attributes
    const hrefPattern = /href=["'](https?:\/\/forum\.ripper\.store\/(?:post|topic)\/\d+[^"']*)/gi;
    let match: RegExpExecArray | null;
    while ((match = hrefPattern.exec(content)) !== null) {
      const url = match[1];
      if (url) {
        const normalized = url.toLowerCase().replace(/[?&#].*$/, "");
        uniqueRefs.add(normalized);
      }
    }

    // Extract from markdown links
    const markdownPattern = /\[([^\]]+)\]\((https?:\/\/forum\.ripper\.store\/(?:post|topic)\/\d+[^)]*)\)/gi;
    while ((match = markdownPattern.exec(content)) !== null) {
      const url = match[2];
      if (url) {
        const normalized = url.toLowerCase().replace(/[?&#].*$/, "");
        uniqueRefs.add(normalized);
      }
    }

    // Extract standalone URLs
    const standalonePattern = /\s(https?:\/\/forum\.ripper\.store\/(?:post|topic)\/\d+[^\s<>"']*)/gi;
    while ((match = standalonePattern.exec(content)) !== null) {
      const url = match[1];
      if (!url) continue;

      const normalized = url.toLowerCase().replace(/[?&#].*$/, "");
      let isDuplicate = false;
      for (const existing of uniqueRefs) {
        if (normalized === existing || normalized.includes(existing) || existing.includes(normalized)) {
          isDuplicate = true;
          break;
        }
      }
      if (!isDuplicate) uniqueRefs.add(normalized);
    }

    return uniqueRefs.size;
  }

  /**
   * Sanitize a title string by removing HTML entities and tags
   */
  static sanitizeTitle(title: string | null | undefined): string {
    if (!title || typeof title !== "string") return "";

    return title
      .trim()
      .replace(/&quot;/g, '"')
      .replace(/&#x2F;/g, "/")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/<[^>]*>/g, "")
      .trim();
  }

  /**
   * Check if a title indicates a megathread
   */
  static isMegathread(title: string | null | undefined): boolean {
    if (!title || typeof title !== "string" || title.length > 500) return false;
    return MEGATHREAD_PATTERNS.some(pattern => pattern.test(title));
  }

  /**
   * Transform a SearchPost to a TransformedSearchResult
   */
  static transformPost(post: SearchPost): TransformedSearchResult {
    const downloadCount = this.countDownloadLinks(post.content);
    const referenceCount = this.countPostReferences(post.content);
    const downloadLinks = this.extractDownloadLinks(post.content);

    const title = this.sanitizeTitle(
      post.topic?.titleRaw || post.topic?.title || "Unknown Title"
    );
    const user = post.user?.displayname || post.user?.username || "Unknown User";
    const text = `${title} by ${user}`;
    const isMegathread = this.isMegathread(title);

    return {
      id: post.pid?.toString() || "0",
      url: post.url || "",
      text,
      title,
      user,
      hasDownloads: downloadCount > 0 && !isMegathread,
      linkCount: downloadCount,
      downloadCount,
      downloadLinks,
      hasReferences: referenceCount > 0,
      referenceCount,
      topicId: post.tid?.toString(),
      topicTitle: post.topic?.titleRaw || post.topic?.title || "",
      postUrls: downloadLinks.map(link => link.url),
      timestamp: post.timestampISO ? new Date(post.timestampISO) : new Date(),
      votes: parseInt(post.votes?.toString() || "0", 10),
      isMegathread,
    };
  }

  /**
   * Transform SearchPage results to TransformedSearchResult array
   */
  static transformApiResponse(searchPage: SearchPage): TransformedSearchResult[] {
    if (!searchPage || !Array.isArray(searchPage.results?.posts)) return [];

    return searchPage.results.posts
      .filter(post => post && typeof post === "object")
      .map(post => this.transformPost(post))
      .filter(result => result.text && result.url);
  }

  /**
   * Calculate a relevance score for a search result
   */
  static calculateResultScore(result: TransformedSearchResult): number {
    let score = 0;

    // Boost for having downloads
    if (result.hasDownloads) {
      score += 100;
      score += (result.linkCount || 0) * 10;
    }

    // Boost for having references
    if (result.hasReferences) {
      score += 50;
      score += Math.min((result.referenceCount || 0) * 2, 20);
    }

    // Link count bonus
    score += Math.min((result.linkCount || 0) * 5, 30);

    // Recency bonus
    if (result.timestamp) {
      const daysSincePost = (Date.now() - result.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      const recencyBonus = Math.max(0, 20 - daysSincePost * 0.1);
      score += recencyBonus;
    }

    // Vote bonus
    if (result.votes > 0) {
      score += Math.min(result.votes * 2, 40);
    }

    return score;
  }

  /**
   * Score and sort results by relevance
   */
  static scoreAndSortResults(results: TransformedSearchResult[]): TransformedSearchResult[] {
    if (!Array.isArray(results)) return [];

    return results
      .map(result => ({
        ...result,
        score: this.calculateResultScore(result),
      }))
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  /**
   * Transform and score search results in one step
   */
  static transformAndScore(searchPage: SearchPage): TransformedSearchResult[] {
    const transformed = this.transformApiResponse(searchPage);
    return this.scoreAndSortResults(transformed);
  }
}

// ============ Utility Exports ============

export {
  getMetaContent,
  parseCount,
  parseSearchTime,
  decodeHtmlEntities,
  extractBoothItemId,
};
