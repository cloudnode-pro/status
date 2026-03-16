import { Component } from "../Component";

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
}
