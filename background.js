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

  if (userAgents[hostname]) {
    for (let header of details.requestHeaders) {
      if (header.name.toLowerCase() === 'user-agent') {
        header.value = userAgents[hostname];
        break;
      }
    }
    return {requestHeaders : details.requestHeaders};
  }
}, {urls : [ '<all_urls>' ]}, [ 'blocking', 'requestHeaders' ]);
