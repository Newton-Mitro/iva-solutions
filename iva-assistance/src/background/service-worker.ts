chrome.action.onClicked.addListener(async () => {
  const displays = await chrome.system.display.getInfo();

  const display = displays.find((item) => item.isPrimary) ?? displays[0];

  const { workArea } = display;

  chrome.windows.create({
    url: chrome.runtime.getURL("index.html"),
    type: "popup",
    left: workArea.left,
    top: workArea.top,
    width: 420,
    height: workArea.height,
    focused: true,
  });
});
