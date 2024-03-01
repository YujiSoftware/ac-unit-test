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

    // Page actions are disabled by default and enabled on select tabs
    chrome.action.disable();
});
