import _ from "lodash";
import { patchParts } from "./parts/index.js";
import "./styles.scss";
import { patchOther } from "./other/index.js";

setTimeout(() => {
  console.log("Loading rule34utils...");
  patchOther();
  patchParts();
}, 0);
