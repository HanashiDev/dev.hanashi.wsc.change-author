import { dialogFactory } from "WoltLabSuite/Core/Component/Dialog";
import * as UiNotification from "WoltLabSuite/Core/Ui/Notification";
import * as Language from "WoltLabSuite/Core/Language";

export class ChangeAuthor {
  constructor() {
    for (const button of document.querySelectorAll(".jsChangeAuthor")) {
      button.addEventListener("click", (event: MouseEvent) => {
        void this.#changeAuthorClicked(event.target as HTMLButtonElement);
      });
    }
  }

  async #changeAuthorClicked(button: HTMLButtonElement) {
    const { ok } = await dialogFactory()
      .usingFormBuilder()
      .fromEndpoint(button.dataset.endpoint!);
    if (ok) {
      UiNotification.show(
        Language.getPhrase("wcf.message.changeAuthor.success"),
        function () {
          window.location.reload();
        },
        "success",
      );
    }
  }
}

export default ChangeAuthor;
