chrome.action.onClicked.addListener(async () => {
  const displays = await chrome.system.display.getInfo();
  const display = displays.find((item) => item.isPrimary) ?? displays[0];
  const { workArea } = display;
  const width = 450;
  const left = workArea.left + workArea.width - width;

  chrome.windows.create({
    url: chrome.runtime.getURL("index.html"),
    type: "popup",
    // left: workArea.left,
    left,
    top: workArea.top,
    width,
    height: workArea.height,
    focused: true,
  });
});
