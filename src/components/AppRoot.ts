import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import Navigo from "navigo";
import { Component } from "./Component";
import { CONFIG } from "../config";
import { InstatusApi } from "../api/InstatusApi";
import { Site } from "../api/Site";
import "./AppHeader";
import "./AppFooter";
import { HomePage } from "./pages/HomePage";

@customElement("app-root")
export class AppRoot extends Component {
  private readonly api: InstatusApi;
  private readonly router: Navigo;

  @state()
  private site: Site | null = null;

  @state()
  private page: Component | null = null;

  @state()
  private home: boolean = false;

  public constructor(api: InstatusApi) {
    super();
    this.api = api;
    this.router = new Navigo("/");
  }

  public override async connectedCallback() {
    super.connectedCallback();

    document.addEventListener("click", (e) => {
      if (!(e.target instanceof Element)) {
        return;
      }
      const target = e.target.closest("a");
      if (target === null) {
        return;
      }

      const url = new URL(target.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      e.preventDefault();
      this.router.navigate(url.pathname);
    });

    this.site = await this.api.getSite();

    this.setupRouter();
  }

  private setupRouter() {
    this.router
      .on("/", () => {
        this.home = true;
        const page = new HomePage();
        page.site = this.site!;
        this.page = page;
      })
      .resolve();
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
          .home="${this.home}"
        ></app-header>
        <main
          class="flex-1 ring-white/5 ring-inset sm:rounded-2xl sm:bg-neutral-900 sm:ring-1"
        >
          <div class="flex items-center justify-center gap-4 p-6 md:px-8 md:py-10">
          </div>
          <div class="p-6 pt-0! md:p-8">
            ${this.page}
          </div>
        </main>
        <app-footer></app-footer>
      </div>
    `;
  }
}
