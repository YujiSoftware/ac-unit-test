function saveOptions() {
  chrome.storage.sync.set({
    language: document.getElementById("language").value,
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    language: 'Java',
  }, function(items) {
    document.getElementById("language").value = items.language;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById("language").addEventListener("change", saveOptions);

document.getElementById("language_label").textContent = chrome.i18n.getMessage("language_label");
