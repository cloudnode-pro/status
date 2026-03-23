import { customElement, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import markdownit from "markdown-it";
import { Component } from "./Component";
import { NoticeUpdate } from "../models/NoticeUpdate";
import { html } from "lit";
import { EnumMappings } from "../EnumMappings";
import { Time } from "../Time";

@customElement("updates-feed")
export class UpdatesFeed extends Component {
  private static MD = markdownit();

  @state()
  private updates: NoticeUpdate[];

  public constructor(updates: NoticeUpdate[]) {
    super();
    this.updates = updates.sort((a, b) =>
      b.started.getTime() - a.started.getTime()
    );
  }

  public override render() {
    return html`
      <ul>
        ${this.updates.map((u) =>
          html`
            <li class="group/update flex">
              <div class="relative group-only/update:hidden">
                <div class="absolute h-full w-px bg-white/10 group-last/update:h-4"></div>
                <div
                  class="relative mt-4 flex size-6 -translate-x-1/2 items-center justify-center bg-neutral-950 group-first/update:mt-0 sm:bg-neutral-900"
                >
                  <div class="size-1.5 rounded-full bg-white/10 ring-1 ring-white/15"></div>
                </div>
              </div>
              <div class="py-4 group-first/update:pt-0 group-last/update:pb-0">
                <div class="flex items-center gap-4">
                  <p class="font-medium text-white">${EnumMappings
                    .NOTICE_STATUS_NAMES[u.status]}</p>
                  <p class="text-sm text-neutral-400">
                    <time datetime="2026-03-11T12:00">
                      ${new Time.DateTime(u.started).toString()}
                    </time>
                  </p>
                </div>
                <div class="prose prose-sm mt-1 text-pretty prose-neutral prose-invert">
                  ${unsafeHTML(UpdatesFeed.MD.render(u.message))}
                </div>
              </div>
            </li>
          `
        )}
      </ul>
    `;
  }
}
