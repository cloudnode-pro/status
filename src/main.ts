import "./style.css";
import { CONFIG } from "./config";
import { AppRoot } from "./components/AppRoot";
import { InstatusApi } from "./api/InstatusApi";

document.title = CONFIG.NAME;

const api = new InstatusApi(CONFIG.ID);
const root = new AppRoot(api);

root.classList.add("flex", "flex-col", "flex-1");

document.body.append(root);
