import _ from "lodash";
import { patchParts } from "./parts/index.js";
import "./styles.scss";

setTimeout(() => {
  console.log("Loading rule34utils...");
  patchParts();
}, 0);
