define(["require", "exports", "tslib", "WoltLabSuite/Core/Component/Dialog", "WoltLabSuite/Core/Ui/Notification", "WoltLabSuite/Core/Language"], function (require, exports, tslib_1, Dialog_1, UiNotification, Language) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChangeAuthor = void 0;
    UiNotification = tslib_1.__importStar(UiNotification);
    Language = tslib_1.__importStar(Language);
    class ChangeAuthor {
        constructor() {
            for (const button of document.querySelectorAll(".jsChangeAuthor")) {
                button.addEventListener("click", (event) => {
                    void this.#changeAuthorClicked(event.target);
                });
            }
        }
        async #changeAuthorClicked(button) {
            const { ok } = await (0, Dialog_1.dialogFactory)()
                .usingFormBuilder()
                .fromEndpoint(button.dataset.endpoint);
            if (ok) {
                UiNotification.show(Language.getPhrase("wcf.message.changeAuthor.success"), function () {
                    window.location.reload();
                }, "success");
            }
        }
    }
    exports.ChangeAuthor = ChangeAuthor;
    exports.default = ChangeAuthor;
});
