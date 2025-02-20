// background.js (Manifest V2)

const config = {};
const CONFIG_KEY = 'ua_switcher_config';

browser.storage.sync.get(CONFIG_KEY, (result) => {
  const retrieved = result[CONFIG_KEY];
  if (retrieved) {
    console.log("retrieved", config);
    Object.assign(config, retrieved);
  }
});

browser.runtime.onInstalled.addListener(() => { console.log("Installed"); });

browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes[CONFIG_KEY]) {
    console.log("update", config);
    Object.assign(config, changes[CONFIG_KEY].newValue);
  }
});

const changeUserAgent = function(details) {
  const url = new URL(details.url);
  const hostname = url.hostname;
  console.log("onBeforeSendHeaders");

  console.log("onBeforeSendHeaders - URL:", details.url);
  console.log("Original Headers:", details.requestHeaders);
  const intercepts = config.intercepts;
  const deref = config.deref;

  const label = intercepts[hostname];
  if (label) {
    const userAgent = deref[label];
    for (let header of details.requestHeaders) {
      if (header.name.toLowerCase() === 'user-agent') {
        const before = header.value;
        header.value = userAgent;
        console.log("User-Agent: ", before, " -> ", header.value);
        break;
      }
    }
    return {requestHeaders : details.requestHeaders};
  }
};

browser.webRequest.onBeforeSendHeaders.addListener(
    changeUserAgent,                 //
    {urls : [ '<all_urls>' ]},       //
    [ 'blocking', 'requestHeaders' ] //
);

const listening =
    browser.webRequest.onBeforeSendHeaders.hasListener(changeUserAgent);
console.log("listening:", listening);
