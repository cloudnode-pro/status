import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Component } from "./Component";
import { CONFIG } from "../config";
import { InstatusApi } from "../api/InstatusApi";
import { Site } from "../api/Site";
import "./AppHeader";
import "./AppFooter";

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
        <main
          class="flex-1 ring-white/5 ring-inset sm:rounded-2xl sm:bg-neutral-900 sm:ring-1"
        >
          <div class="flex items-center justify-center gap-4 p-6 md:px-8 md:py-10">
          </div>
        </main>
        <app-footer></app-footer>
      </div>
    `;
  }
}
