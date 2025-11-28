const domParser = new DOMParser();

export function parseHTMLString(htmlString: string): Document {
  return domParser.parseFromString(htmlString, 'text/html');
}

export function createElementFromHTML<T extends HTMLElement = HTMLElement>(
  htmlString: string
): T {
  const template = document.createElement('template');
  template.innerHTML = htmlString.trim();
  return template.content.firstElementChild as T;
}