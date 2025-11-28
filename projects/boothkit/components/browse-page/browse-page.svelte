<script lang="ts">
  import type { BrowsePage } from "../../parsers/browse";
  import Button from "../lib/button.svelte";
  import Icon from "../lib/icon.svelte";
  import { onMount } from "svelte";

  let isDarkTheme = $state(false);

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

  onMount(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      isDarkTheme = true;
    }
  });

  let {
    parsedPage,
  }: {
    parsedPage: BrowsePage;
  } = $props();
</script>

<div class="w-full h-screen bg-background text-foreground">
  <Button variant="outline" size="icon" onclick={toggleTheme}>
    {#if isDarkTheme}
      <Icon icon="Moon" width="16" height="16" />
    {:else}
      <Icon icon="Sun" width="16" height="16" />
    {/if}
  </Button>
</div>
