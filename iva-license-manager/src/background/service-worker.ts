// src/background.ts

chrome.action.onClicked.addListener(async () => {
  try {
    const displays = await chrome.system.display.getInfo();

    const display = displays.find((item) => item.isPrimary) ?? displays[0];

    if (!display) {
      console.error("No display found.");
      return;
    }

    const { workArea } = display;

    const window = await chrome.windows.create({
      url: chrome.runtime.getURL("index.html"),
      type: "popup",
      left: workArea.left,
      top: workArea.top,
      width: workArea.width,
      height: workArea.height,
      focused: true,
    });

    if (window.id) {
      await chrome.windows.update(window.id, {
        state: "maximized",
      });
    }
  } catch (error) {
    console.error("Failed to open IVA License Manager:", error);
  }
});
