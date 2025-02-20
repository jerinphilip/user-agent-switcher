// background.js (Manifest V2)

const userAgents = {};

browser.storage.sync.get('userAgents', (result) => {
  if (result.userAgents) {
    Object.assign(userAgents, result.userAgents);
  }
});

browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.userAgents) {
    Object.assign(userAgents, changes.userAgents.newValue);
  }
});

browser.webRequest.onBeforeSendHeaders.addListener((details) => {
  const url = new URL(details.url);
  const hostname = url.hostname;
  console.log("onBeforeSendHeaders");

  console.log("onBeforeSendHeaders - URL:", details.url);
  console.log("Original Headers:", details.requestHeaders);

  if (userAgents[hostname]) {
    for (let header of details.requestHeaders) {
      if (header.name.toLowerCase() === 'user-agent') {
        const before = header.value;
        header.value = userAgents[hostname];
        console.log("User-Agent: ", before, " -> ", header.value);
        break;
      }
    }
    return {requestHeaders : details.requestHeaders};
  }
}, {urls : [ '<all_urls>' ]}, [ 'blocking', 'requestHeaders' ]);
