import { html } from "lit";
import { customElement, state } from "lit/decorators.js";
import Navigo from "navigo";
import { Component } from "./Component";
import { CONFIG } from "../config";
import { InstatusApi } from "../api/InstatusApi";
import { Site } from "../api/Site";
import { SiteComponent } from "../api/SiteComponent";
import "./AppHeader";
import "./AppFooter";
import { Metric } from "../models/Metric";
import { StatusOverview } from "./StatusOverview";
import { Page } from "./pages/Page";
import { HomePage } from "./pages/HomePage";
import { Services } from "../models/Services";
import { Service } from "../models/Service";
import { ServiceGroup } from "../models/ServiceGroup";

@customElement("app-root")
export class AppRoot extends Component {
  private readonly api: InstatusApi;
  private readonly router: Navigo;

  @state()
  private site!: Site;

  @state()
  private page!: Page;

  @state()
  private home!: boolean;

  private services!: Promise<Services>;

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
    this.services = this.buildServices();

    this.setupRouter();
  }

  private setupRouter() {
    let initial = true;
    this.router
      .on("/", () => {
        this.home = true;
        this.page = new HomePage(this.api, this.services);
      })
      .on("*", () => {
        this.router.navigate("/");
      })
      .hooks({
        after: () => {
          if (!initial) {
            this.page.focus();
          }
          initial = false;
        },
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
        <div class="flex-1">
          <main
            class="ring-white/5 ring-inset sm:rounded-2xl sm:bg-neutral-900 sm:ring-1"
          >
            ${new StatusOverview(this.site.mainStatus, this.services)}
            <div class="p-4 pt-0! sm:p-6 md:p-8">
              ${this.page}
            </div>
          </main>
        </div>
        <app-footer></app-footer>
      </div>
    `;
  }

  private async buildServices(): Promise<Services> {
    return new Services(
      await Promise.all(
        this.site!.components
          .sort(Services.sort)
          .map(async (c) => {
            if (c.isParent) {
              return new ServiceGroup(
                c.id,
                c.name.default,
                c.description.default === "" ? null : c.description.default,
                await Promise.all(
                  c.children
                    .sort(Services.sort)
                    .map(this.buildService),
                ),
                c.showUptime,
                c.isCollapsed,
              );
            }
            return this.buildService(c);
          }),
      ),
    );
  }

  private async buildService(c: SiteComponent): Promise<Service> {
    return new Service(
      c.id,
      c.name.default,
      c.description.default === "" ? null : c.description.default,
      Service.parseStatus(c.status),
      await Promise.all(
        c.metrics.map(async (m) => {
          const data = await this.api.getMetricData(m.id, 90);
          return new Metric(m.id, m.name.default, m.suffix, data);
        }),
      ),
      c.startDate === null ? null : new Date(c.startDate),
      c.showUptime,
    );
  }
}
