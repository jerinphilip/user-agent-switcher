// background.js

const userAgents = {}; // Store site-specific user agents

// Load stored user agents on startup
browser.storage.sync.get('userAgents').then(result => {
  if (result.userAgents) {
    Object.assign(userAgents, result.userAgents);
  }
});

// Listen for changes to stored user agents
browser.storage.onChanged.addListener(changes => {
  if (changes.userAgents) {
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
