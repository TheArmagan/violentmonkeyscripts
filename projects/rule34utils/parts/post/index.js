import { patchPostListPage } from "./list/index.js";
import { patchPostViewPage } from "./view/index.js";


export function patchPostPage() {
  patchPostListPage();
  patchPostViewPage();
}