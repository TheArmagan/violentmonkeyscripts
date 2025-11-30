import "./styles.css";
import { runLoaders } from "./loaders";

if (window.location.hostname.endsWith("booth.pm")) {
  console.log("Boothkit project initialized.");
  runLoaders();
}

