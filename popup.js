document.addEventListener("DOMContentLoaded", async function (e) {
    document.querySelectorAll('[data-i18n]').forEach(e => {
        e.innerHTML = chrome.i18n.getMessage(e.dataset.i18n);
    });

    document.getElementById("option").addEventListener("click", function (e) {
        chrome.runtime.openOptionsPage();
    });

    try {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const code = await chrome.tabs.sendMessage(tab.id, {
            "functiontoInvoke": "onClick"
        });
        await navigator.clipboard.writeText(code);
        document.getElementById("message").textContent = chrome.i18n.getMessage("copied");
    } catch (e) {
        document.getElementById("message").textContent = e;
        console.error(e);
    }
});
