document.addEventListener("DOMContentLoaded", async function (e) {
    document.getElementById("option").addEventListener("click", function (e) {
        chrome.runtime.openOptionsPage();
    });

    try {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        const code = await chrome.tabs.sendMessage(tab.id, {
            "functiontoInvoke": "onClick"
        });
        await navigator.clipboard.writeText(code);
        document.getElementById("message").textContent = "コピーしました。";
    } catch (e) {
        document.getElementById("message").textContent = e;
        console.error(e);
    }
});
