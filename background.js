chrome.runtime.onInstalled.addListener(async details => {
    switch (details.reason) {
        case chrome.runtime.OnInstalledReason.INSTALL:
            chrome.runtime.openOptionsPage();
            break;
        case chrome.runtime.OnInstalledReason.UPDATE:
            if (details.previousVersion.startsWith("2.")) {
                chrome.runtime.openOptionsPage();
            }
            break;
    }

    const manifest = chrome.runtime.getManifest();
    const permissions = { "origins": manifest.host_permissions };
    if (!await chrome.permissions.contains(permissions)) {
        chrome.runtime.openOptionsPage();
    }
});

// Page actions are disabled by default and enabled on select tabs
chrome.action.disable();

// Google Chrome の API ページでは、declarativeContent を使うように書かれている。
// https://developer.chrome.com/docs/extensions/reference/api/action?hl=ja#emulate_actions_with_declarativecontent
// しかし、Firefox は declarativeContent に対応していない。
// > Unsupported APIs - DeclarativeContent API
// > Chrome's declarativeContent API is not implemented.
// > https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities#unsupported_apis
// Bugzilla によれば、tabs API で代替できるとのことだったので、これを使って実装する。
// https://bugzilla.mozilla.org/show_bug.cgi?id=1435864
chrome.tabs.onUpdated.removeListener(onUpdated);
chrome.tabs.onUpdated.addListener(onUpdated);

function onUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status != "loading") {
        return;
    }

    if (/https?:\/\/atcoder.jp\/contests\/[^\/]+\/tasks\/[^\/]+/.test(changeInfo.url)) {
        chrome.action.enable(tabId);
    } else {
        chrome.action.disable();
    }
}
