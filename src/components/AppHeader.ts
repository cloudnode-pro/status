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
      <header
        role="banner"
        class="group/header flex items-center justify-between gap-2 border-white/5 p-4 transition-colors has-open:bg-neutral-900 sm:px-0 sm:py-16"
      >
        <a
          href="${logoHref}"
          class="z-20 outline-offset-2 outline-blue-400 focus-visible:outline-2"
        >
          <img
            src="https://wsrv.nl?url=${window.encodeURIComponent(this.logoUrl)}"
            alt="${this.logoAlt}"
            class="max-h-8"
          />
        </a>
        <nav
          aria-label="Desktop navigation"
          class="flex shrink-0 items-center gap-2"
        >
          ${this.links.map((link) =>
            html`
              <a
                class="hidden rounded-lg px-3 py-2 text-sm font-medium text-white outline-offset-2 outline-blue-400 select-none focus-visible:outline-2 sm:block"
                href="${link.type === "email"
                  ? `mailto:${link.value}`
                  : link.value}"
              >${link.label.default}</a>
            `
          )}
          <button
            type="button"
            class="rounded-lg bg-white/5 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/10 outline-offset-2 outline-blue-400 transition-colors select-none ring-inset hover:bg-white/15 focus-visible:outline-2"
          >
            Get updates
          </button>
          <button
            type="button"
            class="rounded-lg p-3 text-white outline-offset-2 outline-blue-400 transition select-none group-has-open/header:rotate-180 focus-visible:outline-2 sm:hidden"
            popovertarget="menu"
            popovertargetaction="toggle"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4 fill-current"
              viewBox="0 0 256 256"
              aria-hidden="true"
            >
              <path
                d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"
              >
              </path>
            </svg>
            <span class="sr-only">Menu</span>
          </button>
        </nav>
        <div
          class="absolute inset-x-0 top-18 z-50 grid w-full grid-rows-[0fr] border-b border-b-white/5 bg-neutral-900 shadow-md transition-all transition-discrete ease-out open:grid-rows-[1fr] sm:hidden starting:open:grid-rows-[0fr]"
          popover
          id="menu"
        >
          <nav aria-label="Mobile navigation" class="pb-2 overflow-hidden">
            ${this.links.map((link) =>
              html`
                <a
                  class="block px-4 py-3 text-start font-medium text-white -outline-offset-2 outline-blue-400 hover:bg-white/5 focus-visible:outline-2"
                  href="${link.type === "email"
                    ? `mailto:${link.value}`
                    : link.value}"
                >${link.label.default}</a>
              `
            )}
          </nav>
        </div>
      </header>
    `;
  }
}
