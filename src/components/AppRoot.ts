import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Component } from "./Component";
import { CONFIG } from "../config";
import { InstatusApi } from "../api/InstatusApi";
import { Site } from "../api/Site";
import "./AppHeader";

@customElement("app-root")
export class AppRoot extends Component {
  private readonly api: InstatusApi;

  @state()
  private site: Site | null = null;

  public constructor(api: InstatusApi) {
    super();
    this.api = api;
  }

  public override async connectedCallback() {
    super.connectedCallback();
    this.site = await this.api.getSite();
  }

  public override render() {
    if (!this.site) {
      return html`

      `;
    }

    return html`
      <h1 class="sr-only">${CONFIG.SR_TITLE}</h1>
      <div class="mx-auto flex w-full max-w-4xl flex-1 flex-col sm:px-6">
        <app-header
          .logoUrl="${this.site.logoUrlDark}"
          .logoAlt="${this.site.name.default}"
          .websiteUrl="${this.site.websiteUrl}"
          .links="${this.site.links.header}"
          .home="${true}"
        ></app-header>
      </div>
    `;
  }
}
