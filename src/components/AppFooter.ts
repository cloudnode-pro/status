import { html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Component } from "./Component";
import { CONFIG } from "../config";

@customElement("app-footer")
export class AppFooter extends Component {
  private isExternal(href: string): boolean {
    return new URL(href, window.location.href).origin !==
      window.location.origin;
  }

  private renderLink(label: string, href: string) {
    const external = this.isExternal(href);
    return html`
      <a
        href="${href}"
        target="${external ? "_blank" : nothing}"
        rel="${external ? "noopener noreferrer" : nothing}"
        class="text-neutral-400"
      >${label}</a>
    `;
  }

  public override render() {
    return html`
      <footer class="mt-16 flex justify-between p-6 md:p-8">
        ${CONFIG.FOOTER_LINKS.map((link) =>
          this.renderLink(link.label, link.href)
        )}
      </footer>
    `;
  }
}
