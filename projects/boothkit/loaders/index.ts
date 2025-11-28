import { browseLoader } from "./browse";

const loaders = [
  browseLoader
];

export function runLoaders() {
  const currentLoader = loaders.find(loader => loader.isThisPage());

  if (currentLoader) {
    const preparationNeeded = currentLoader.preparePage();
    if (!preparationNeeded) {
      currentLoader.load();
    }
  }
}