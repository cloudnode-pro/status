import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { Component } from "./Component";
import { CONFIG } from "../config";

@customElement("app-root")
export class AppRoot extends Component {
  render() {
    return html`
      <h1 class="sr-only">${CONFIG.SR_TITLE}</h1>
    `;
  }
}
