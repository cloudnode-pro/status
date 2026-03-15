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
        class="flex items-center justify-between px-4 py-4 sm:px-0 sm:py-16"
      >
        <a
          href="${logoHref}"
          class="z-20 outline-offset-2 outline-blue-400 focus-visible:outline-2"
        >
          <img src="https://wsrv.nl?url=${window.encodeURIComponent(
            this.logoUrl,
          )}" alt="${this.logoAlt}" class="h-8" />
        </a>
        <nav
          aria-label="Desktop navigation"
          class="hidden items-center gap-2 sm:flex"
        >
          ${this.links.map((link) =>
            html`
              <a
                class="rounded-lg px-3 py-2 text-sm font-medium text-white outline-offset-2 outline-blue-400 select-none focus-visible:outline-2"
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
        </nav>
        <button
          type="button"
          class="block rounded-lg bg-white/5 p-2 text-sm font-medium text-white ring-1 ring-white/10 outline-offset-2 outline-blue-400 transition-colors select-none ring-inset hover:bg-white/15 focus-visible:outline-2 sm:hidden"
          popovertarget="menu"
          popovertargetaction="show"
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
          <span class="sr-only">Open menu</span>
        </button>
        <div
          class="absolute inset-x-0 w-full bg-neutral-800 sm:hidden backdrop:bg-neutral-950/80 backdrop:backdrop-blur rounded-b-2xl shadow-lg"
          popover
          id="menu"
        >
          <div class="flex items-center justify-between px-4 py-4 sm:px-0 sm:py-16">
            <a
              class="z-20 outline-offset-2 outline-blue-400 focus-visible:outline-2"
              href="https://cloudnode.pro"
            >
              <img
                class="h-8"
                src="https://wsrv.nl?url=https%3A%2F%2Finstatus.com%2Fuser-content%2Fv1688824424%2Fk4zb7ei2gwwbnlezquio.svg"
                alt="Cloudnode"
              />
            </a>
            <button
              type="button"
              class="block rounded-lg bg-white/5 p-2 text-sm font-medium text-white ring-1 ring-white/10 outline-offset-2 outline-blue-400 transition-colors select-none ring-inset hover:bg-white/15 focus-visible:outline-2 sm:hidden"
              popovertarget="menu"
              popovertargetaction="hide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-6 fill-current"
                viewBox="0 0 256 256"
                aria-hidden="true"
              >
                <path
                  d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"
                >
                </path>
              </svg><span class="sr-only">Close menu</span>
            </button>
          </div>
          <nav aria-label="Mobile navigation" class="py-2">
            ${this.links.map((link) =>
              html`
                <a
                  class="block px-4 py-3 text-start font-medium text-white hover:bg-white/5"
                  href="${link.type === "email"
                    ? `mailto:${link.value}`
                    : link.value}"
                >${link.label.default}</a>
              `
            )}<button
              type="button"
              class="block w-full px-4 py-3 text-start font-medium text-white hover:bg-white/5"
            >
              Get updates
            </button>
          </nav>
        </div>
      </header>
    `;
  }
}
