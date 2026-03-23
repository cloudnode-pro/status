import { Component } from "../Component";
import { CONFIG } from "../../config";

export abstract class Page extends Component {
  public override connectedCallback() {
    super.connectedCallback();
    this.tabIndex = -1;
    this.classList.add("focus:outline-none");
  }

  public focus() {
    this.updateComplete.then(() => {
      super.focus();
    });
  }

  protected pageTitle(title: string | null) {
    document.title = title === null ? CONFIG.NAME : `${title} - ${CONFIG.NAME}`;
  }
}
