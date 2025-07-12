define(["require", "exports", "tslib", "WoltLabSuite/Core/Component/Dialog", "WoltLabSuite/Core/Event/Handler", "WoltLabSuite/Core/Ui/Notification", "WoltLabSuite/Core/Language"], function (require, exports, tslib_1, Dialog_1, EventHandler, UiNotification, Language) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChangeAuthor = void 0;
    EventHandler = tslib_1.__importStar(EventHandler);
    UiNotification = tslib_1.__importStar(UiNotification);
    Language = tslib_1.__importStar(Language);
    class ChangeAuthor {
        #endpoint;
        constructor(endpoint) {
            this.#endpoint = endpoint;
            EventHandler.add("com.woltlab.wcf.inlineEditor", "dropdownInit_wbbPost", (data) => {
                data.items.push({
                    item: "changeAuthor",
                    label: "wcf.message.changeAuthor",
                });
            });
            EventHandler.add("com.woltlab.wcf.inlineEditor", "dropdownItemClick_wbbPost", (data) => {
                if (data.item != "changeAuthor") {
                    return;
                }
                data.cancel = true;
                const postID = parseInt(data.element.dataset.objectId ?? "0");
                void this.#changeAuthor(postID);
            });
        }
        async #changeAuthor(postID) {
            const url = new URL(this.#endpoint);
            url.searchParams.set("id", postID.toString());
            const { ok } = await (0, Dialog_1.dialogFactory)().usingFormBuilder().fromEndpoint(url.toString());
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
