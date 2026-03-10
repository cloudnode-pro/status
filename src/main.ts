import "./style.css";
import { CONFIG } from "./config";
import { AppRoot } from "./components/AppRoot";
import { InstatusApi } from "./api/InstatusApi";

document.title = CONFIG.NAME;

const api = new InstatusApi(CONFIG.ID);

document.body.append(new AppRoot(api));
