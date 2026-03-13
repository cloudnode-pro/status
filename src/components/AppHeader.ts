import { html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "./Component";
import { SiteLink } from "../api/SiteLink";

@customElement("app-header")
export class AppHeader extends Component {
  @property({ type: String })
  public logoUrl: string = "";

  @property({ type: String })
  public logoAlt: string = "";

  @property({ type: String })
  public websiteUrl: string = "";

  @property({ type: Boolean })
  public home: boolean = false;

  @property({ type: Array })
  public links: SiteLink[] = [];

  public override render() {
    const logoHref = this.home ? this.websiteUrl : "/";

    return html`
      <header class="flex items-center justify-between px-4 py-4 sm:px-0 sm:py-16">
        <a
          href="${logoHref}"
          class="z-20 outline-offset-2 outline-blue-400 focus-visible:outline-2"
        >
          <img src="${this.logoUrl}" alt="${this.logoAlt}" class="h-8" />
        </a>
        <div class="hidden items-center gap-2 sm:flex">
          ${this.links.map((link) =>
            html`
              <a
                class="rounded-lg px-3 py-2 text-sm font-medium text-white outline-offset-2 outline-blue-400 select-none focus-visible:outline-2"
                href="${link.type === "email"
                  ? `mailto:${link.value}`
                  : link.value}"
              >
                ${link.label.default}
              </a>
            `
          )}
          <button
            class="rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10 outline-offset-2 outline-blue-400 transition-colors select-none ring-inset hover:bg-white/15 focus-visible:outline-2"
          >
            Get updates
          </button>
        </div>
        <details class="sm:hidden">
          <summary
            class="relative z-20 block rounded-lg bg-white/5 p-2 text-sm font-medium text-white ring-1 ring-white/10 outline-offset-2 outline-blue-400 transition-colors select-none ring-inset hover:bg-white/15 focus-visible:outline-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-6 fill-current"
              viewBox="0 0 256 256"
              aria-hidden="true"
            >
              <path
                d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"
              >
              </path>
            </svg>
            <span class="sr-only">Menu</span>
          </summary>
          <div
            class="absolute inset-x-0 top-0 z-10 bg-neutral-900/80 pt-16 shadow-lg backdrop-blur-lg"
          >
            <ul class="z-10 mx-auto flex flex-col py-2">
              ${this.links.map((link) =>
                html`
                  <a
                    class="px-4 py-3 text-start font-medium text-white hover:bg-white/5"
                    href="${link.type === "email"
                      ? `mailto:${link.value}`
                      : link.value}"
                  >
                    ${link.label.default}
                  </a>
                `
              )}
              <button
                class="px-4 py-3 text-start font-medium text-white hover:bg-white/5"
              >
                Get updates
              </button>
            </ul>
          </div>
        </details>
      </header>
    `;
  }
}
