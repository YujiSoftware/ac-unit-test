chrome.contextMenus.create({
    "title": chrome.i18n.getMessage("generate"),
    "type": "normal",
    "id": "createUnitTest",
    "contexts": ["page"],
    "documentUrlPatterns": [
        "*://*.contest.atcoder.jp/tasks/*",
        "*://atcoder.jp/contests/*/tasks/*"
    ]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "functiontoInvoke": "onClick"
        });
    });
});

chrome.runtime.onInstalled.addListener(details => {
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
});
