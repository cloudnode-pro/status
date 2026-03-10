import "./style.css";
import { CONFIG } from "./config";
import { AppRoot } from "./components/AppRoot";

document.title = CONFIG.NAME;
document.body.replaceChildren(new AppRoot());
