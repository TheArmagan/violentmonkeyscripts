import { mount, unmount, type Component } from "svelte";

export type MountedComponent = {
  destroy: () => void;
  target: HTMLElement;
};

/**
 * Svelte component'ini DOM'a mount eder
 * @param component - Mount edilecek Svelte component'i
 * @param target - Mount edilecek DOM elementi veya selector
 * @param props - Component'e geçirilecek props
 * @returns MountedComponent objesi
 */
export function mountComponent<T extends Record<string, any>>(
  component: Component<T>,
  target: HTMLElement | string,
  props?: T
): MountedComponent {
  const targetEl = typeof target === "string"
    ? document.querySelector<HTMLElement>(target)
    : target;

  if (!targetEl) {
    throw new Error(`Target element not found: ${target}`);
  }

  const instance = mount(component, {
    target: targetEl,
    props: props as any
  });

  return {
    destroy: () => unmount(instance),
    target: targetEl
  };
}

/**
 * Yeni bir container element oluşturup component'i mount eder
 * @param component - Mount edilecek Svelte component'i
 * @param props - Component'e geçirilecek props
 * @param containerOptions - Container element için options
 * @returns MountedComponent objesi
 */
export function injectComponent<T extends Record<string, any>>(
  component: Component<T>,
  props?: T,
  containerOptions?: {
    id?: string;
    className?: string;
    insertBefore?: HTMLElement | string;
    insertAfter?: HTMLElement | string;
    appendTo?: HTMLElement | string;
    prependTo?: HTMLElement | string;
  }
): MountedComponent {
  const container = document.createElement("div");

  if (containerOptions?.id) {
    container.id = containerOptions.id;
  }
  if (containerOptions?.className) {
    container.className = containerOptions.className;
  }

  const getElement = (el: HTMLElement | string | undefined): HTMLElement | null => {
    if (!el) return null;
    return typeof el === "string" ? document.querySelector<HTMLElement>(el) : el;
  };

  if (containerOptions?.insertBefore) {
    const beforeEl = getElement(containerOptions.insertBefore);
    beforeEl?.parentNode?.insertBefore(container, beforeEl);
  } else if (containerOptions?.insertAfter) {
    const afterEl = getElement(containerOptions.insertAfter);
    afterEl?.parentNode?.insertBefore(container, afterEl.nextSibling);
  } else if (containerOptions?.prependTo) {
    const parentEl = getElement(containerOptions.prependTo);
    parentEl?.insertBefore(container, parentEl.firstChild);
  } else if (containerOptions?.appendTo) {
    const parentEl = getElement(containerOptions.appendTo);
    parentEl?.appendChild(container);
  } else {
    document.body.appendChild(container);
  }

  const mounted = mountComponent(component, container, props);

  return {
    destroy: () => {
      mounted.destroy();
      container.remove();
    },
    target: container
  };
}
