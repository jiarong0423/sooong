(function () {
  const blockedKeys = new Set(["F12"]);

  function isBlockedShortcut(event) {
    const key = String(event.key || "");
    if (blockedKeys.has(key)) {
      return true;
    }

    const normalized = key.toLowerCase();
    if (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(normalized)) {
      return true;
    }
    if ((event.metaKey || event.ctrlKey) && normalized === "u") {
      return true;
    }
    return false;
  }

  window.addEventListener("keydown", function (event) {
    if (!isBlockedShortcut(event)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  }, true);

  window.addEventListener("contextmenu", function (event) {
    event.preventDefault();
  });
})();
