import { dialogFactory } from "WoltLabSuite/Core/Component/Dialog";
import * as EventHandler from "WoltLabSuite/Core/Event/Handler";
import * as UiNotification from "WoltLabSuite/Core/Ui/Notification";
import * as Language from "WoltLabSuite/Core/Language";

export class ChangeAuthor {
  readonly #endpoint: string;

  constructor(endpoint: string) {
    this.#endpoint = endpoint;

    EventHandler.add("com.woltlab.wcf.inlineEditor", "dropdownInit_wbbPost", (data) => {
      (data.items as any[]).push({
        item: "changeAuthor",
        label: "wcf.message.changeAuthor",
      });
    });

    EventHandler.add("com.woltlab.wcf.inlineEditor", "dropdownItemClick_wbbPost", (data) => {
      if (data.item != "changeAuthor") {
        return;
      }
      data.cancel = true;
      const postID = parseInt((data.element as HTMLElement).dataset.objectId ?? "0");

      void this.#changeAuthor(postID);
    });
  }

  async #changeAuthor(postID: number) {
    const url = new URL(this.#endpoint);
    url.searchParams.set("id", postID.toString());

    const { ok } = await dialogFactory().usingFormBuilder().fromEndpoint(url.toString());
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
