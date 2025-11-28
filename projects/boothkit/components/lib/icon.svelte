<script lang="ts">
  import * as Icons from "lucide-static";
  import type { SVGAttributes } from "svelte/elements";
  import { createElementFromHTML } from "../../utils/dom";
  const {
    icon,
    ...rest
  }: {
    icon: keyof typeof Icons;
  } & SVGAttributes<SVGSVGElement> = $props();

  const element = $derived.by(() => {
    const svg = createElementFromHTML(Icons[icon]);
    // apply rest props to svg
    for (const [key, value] of Object.entries(rest)) {
      svg.setAttribute(key, value as string);
    }
    return svg;
  });
</script>

{@html element.outerHTML}
